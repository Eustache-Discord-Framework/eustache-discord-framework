'use strict';

const Argument = require("./Argument");
const ArgumentCollector = require("./ArgumentCollector");

/** Represent a command */
class Command {
    /**
     * Represent the command infos to set up, fetch and execute the command
     * @typedef {Object} CommandInfo
     * @property {string} name The command name : used as key to store and fetch the command
     * @property {string} description The command description
     * @property {string[]} alias The command aliases : used as secondary key to fetch the command
     * @property {ArgumentInfo[]} args The command arguments
     * @property {Boolean} hidden Wether to hide this command
     * @property {Boolean} unknown Wether to execute this command when an unknown one is typed
     */
    /**
     * @param {MaestroClient} client
     * @param {CommandInfo} data
     */
    constructor(client, data) {
        this.constructor.validateData(data);
        if (!client) throw new Error(`Command client must be specified.`)

        /**
         * Client that this command is for
         * @name Command#client
         * @type {MaestroClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * This command name
         * @type {string}
         */
        this.name = data.name;

        /**
         * This command aliases
         * @type {?string[]}
         */
        this.aliases = data.alias ?? [];

        /**
         * This command description
         * @type {string}
         */
        this.description = 'description' in data ? data.description : null;

        /**
         * Command arguments
         * @type {?Array<Argument>}
         */
        this.argsCollector = (data.args && data.args.length)
            ?
            new ArgumentCollector(this.client, data.args ?? [])
            :
            null;

        /**
         * Wether to hide this command
         * @type {Boolean}
         */
        this.hidden = 'hidden' in data ? data.hidden : false;

        /**
         * Wether to execute this command when an unknown one is typed
         * @type {Boolean}
         */
        this.unknown = 'unknown' in data ? data.unknown : false;
    }

    /**
     * Wether this command has an argument collectors
     * @returns {?ArgumentCollector}
     */
    hasArguments() {
        return this.argsCollector ?? null;
    }

    /**
     * Validate command data before loading
     * @param {CommandInfo} data
     */
    static validateData(data) {
        if (!data.name) throw new Error('Command name cannot be empty.');
        if (typeof data.name !== 'string') throw new TypeError('Command name must be a string.');
        if (data.name !== data.name.toLowerCase()) throw new Error('Command name must be in lower case.');

        if (data.alias && (!Array.isArray(data.alias) || data.alias.some(alias => typeof alias !== 'string'))) {
            throw new TypeError('Command aliases must be an Array of strings.');
        }

        if (data.description && typeof data.description !== 'string') throw new Error(`Command description must be a string.`);

        if (data.hidden && typeof data.hidden != 'boolean') throw new Error(`Command hidden state must be a boolean`);
    }
}

module.exports = Command;
