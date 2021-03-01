'use strict';

/** Represent a base type */
class ArgumentType {
    /**
     * @param {MaestroClient} client
     * @param {?string} id
     */
    constructor(client, id) {
        if (!client) throw new Error('A client must be specified.');
        if (typeof id !== 'string') throw new Error('Argument type ID must be a string.');
        if (id !== id.toLowerCase()) throw new Error('Argument type ID must be lowercase.');

        /**
         * @name ArgumentType#client
         * @type {MaestroClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * ID of this argument type
         * @type {string}
         */
        this.id = id;
    }

    /**
     * Validate any value
     * @param {string} value The value to validate
     * @returns {Boolean}
     */
    validate(value, regex) {
        return value.match(regex) ? true : false;
    }

    /**
     * Parse any value
     * @param {string} value
     */
    parse(msg, value) {
        return value;
    }
}

module.exports = ArgumentType;
