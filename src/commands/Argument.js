'use strict';

/** Represent a command argument */
class Argument {
    /**
     * Represent the argument infos used to set up and deliver the argument
     * @typedef {Object} ArgumentInfo
     * @property {string} key Argument key : used to retreive the argument in the run method
     * @property {string} label Argument label : used to interact with the user
     * @property {string} type Argument type
     * @property {*} default Default value
     * @property {Boolean} infinite Wether to capture the rest of the string
     */
    /**
     * @param {MaestroClient}
     * @param {ArgumentInfo} data
     */
    constructor(client, data) {
        this.constructor.validateData(data);
        if (!client) throw new Error(`Argument client must be specified.`)

        /**
		 * Client that this argument is for
		 * @name Argument#client
		 * @type {MaestroClient}
		 * @readonly
		 */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * This argument key
         * @type {string}
         */
        this.key = data.key;

        /**
         * This argument label
         * @type {string}
         */
        this.label = data.label;

        /**
         * This argument type (fetched from the registry)
         * Could be (string|url|int|time)
         * @type {string}
         */
        this.type = client.registry.types.get(data.type);
        // if (!this.type) throw new TypeError(`Argument type cannot be null.`);

        /**
         * This argument default value
         * @type {*}
         */
        this.default = typeof data.default !== 'undefined' ? data.default : null;

        /**
         * Wether this argument accept inifinite value
         */
        this.infinite = Boolean(data.infinite);

        /**
         * The argument format
         * @type {string}
         */
        this.format = this.default ? `[${this.label}]` : `<${this.label}>`;
    }

    /**
     * Validate the argument value
     * @param {*} value
     */
    validate(value) {
        return this.type.validate(value);
    }

    /**
     * Parse a string value into a neat argument
     * @param {*} value
     */
    parse(msg, value) {
        return this.type.parse(msg, value);
    }

    /**
     * Validate argument data before loading
     * @param {ArgumentInfo} data
     */
    static validateData(data) {
        if (!data.key) throw new Error(`Argument key cannot be empty.`);
        if (typeof data.key !== 'string') throw new TypeError(`Argument key must be a string`);
        if (data.key !== data.key.toLowerCase()) throw new Error(`Argument key must be in lower case.`);

        if (!data.label) throw new Error(`Argument label cannot be empty`);
        if (typeof data.label !== 'string') throw new Error(`Argument label must be a string`);

        if (!data.type) throw new Error(`Argument type cannot be empty`);
    }
}

module.exports = Argument;
