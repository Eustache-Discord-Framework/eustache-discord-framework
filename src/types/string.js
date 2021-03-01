'use strict';

const ArgumentType = require("./base");

/** Represent string type */
class StringArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'string')
    }

    validate(value) {
        return super.validate(value, /./i);
    }

    parse(msg, value) {
        return String(value);
    }
}

module.exports = StringArgumentType;
