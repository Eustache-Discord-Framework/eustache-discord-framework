'use strict';

const Argument = require("./Argument");

/** Collects, validates and parses the arguments */
class ArgumentCollector {
    constructor(client, args) {
        if (!client) throw new TypeError('Collector client must be specified.');
        if (!args || !Array.isArray(args)) throw new TypeError('Collector args must be an Array.');

        /**
         * Client this collector is for
         * @name ArgumentCollector#client
         * @type {CommandoClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * Arguments to handle
         * @type {Argument[]}
         */
        this.args = new Array(args.length);

        let hasInfinite = false;
        let hasOptional = false;
        for (let i = 0; i < args.length; i++) {
            if (hasInfinite) throw new Error('Arguments are not accepted after an infinite argument.');
            if (args[i].default !== null) hasOptional = true;
            else if (hasOptional) throw new Error('Required arguments are not accepted after optional arguments.');
            if (this.args.some(arg => arg.key === args[i].key)) throw new Error(`Argument key "${args[i].key}" is already registered for the same command.`)
            this.args[i] = new Argument(this.client, args[i]);
            if (this.args[i].infinite) hasInfinite = true;
        }
    }

    /**
     * Collect, verify and parse arguments
     * @param {Discord.Message} msg Trigger message
     * @param {?Command} command Triggered command
     * @param {string[]} given Given arguments
     */
    collect(msg, command, given = []) {
        given = this.args.map(arg => {
            // Set infinite or single value ; defaults if undefined ;
            if (arg.infinite) arg.value = given.join(' ');
            else arg.value = given.shift() ?? null;
            if (!arg.value && arg.default) arg.value = arg.default;
            return arg
        });

        // Searching for missing arguments
        let missingArgs = given.filter(arg => !arg.value);
        if (missingArgs.length > 0) {
            missingArgs = missingArgs.map(arg => `\`${arg.label}\``);
            return {
                failed: true,
                message: `la commande \`${command.name}\` est invalide car il manque un ou plusieurs arguments : ${missingArgs.join(', ')}.`
            };
        }

        // Searching for wrong arguments
        let wrongArgs = given.filter(arg => !arg.validate(arg.value));
        if (wrongArgs.length > 0) {
            wrongArgs = wrongArgs.map(arg => `\`${arg.label}\``);
            return {
                failed: true,
                message: `la commande \`${command.name}\` est invalide car un ou plusieurs arguments sont invalides : ${wrongArgs.join(', ')}.`
            };
        }

        const entries = given.map(arg => [arg.key, arg.parse(msg, arg.value)]);
        const args = Object.fromEntries(entries)
        return {
            success: true,
            values: args
        };
    }
}

module.exports = ArgumentCollector;
