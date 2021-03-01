'use strict';

const discord = require("discord.js");
const EustacheDispatcher = require("./dispatcher");
const EustacheRegistry = require("./registry");

/**
 * Extends the Discord Client
 * @extends Client
 */
class EustacheClient extends discord.Client {
    constructor(data = {}) {
        super()

        /**
         * This registry (types & commands)
         * @type {EustacheRegistry}
         */
        this.registry = new EustacheRegistry(this);

        /**
         * This dispatcher
         * @type {EustacheDispatcher}
         */
        this.dispatcher = new EustacheDispatcher(this, this.registry);

        /**
         * This bot command prefix
         * @readonly
         * @type {string}
         */
        this.commandPrefix = 'commandPrefix' in data ? data.commandPrefix : '!';

        this.on('message', msg => { this.dispatcher.handleMessage(msg); });
    }
}

module.exports = EustacheClient;
