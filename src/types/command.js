'use strict';

const ArgumentType = require("./base");

/** Represent string type */
class CommandArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'command');
    }

    validate(value) {
        return this.client.registry.findCommand(value) ? true : false;
    }

    parse(msg, value) {
        return this.client.registry.findCommand(value);
    }
}

module.exports = CommandArgumentType;
