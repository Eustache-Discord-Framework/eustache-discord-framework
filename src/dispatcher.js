'use strict';

/** Dispatch commands through the app */
class EustacheDispatcher {
    constructor(client, registry) {
        /**
         * The client this registry is for
         * @name EustacheDispatcher#client
         * @type {EustacheClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * The registry this registry is for
         * @name EustacheDispatcher#registry
         * @type {EustacheRegistry}
         * @readonly
         */
        Object.defineProperty(this, 'registry', { value: registry });
    }

    /**
     * Handles any message
     * @param {Discord.Message} msg The message to handle
     */
    handleMessage(msg) {
        if (!this.shouldHandleMessage(msg)) return;
        // Parse the message
        const parsedMessage = this.parseMessage(msg, msg.content);
        msg.command = parsedMessage.shift();
        msg.args = parsedMessage;

        const command = this.registry.resolveCommand(msg.command);
        if (!command) {
            this.registry.unknownCommand.run(msg);
            /**
             * Emitted when an unknown command is triggered
             * @event EustacheClient#unknownCommand
             * @param {discord.Message} msg Message that triggered the event
             */
            return this.client.emit('unknownCommand', msg);
        }

        let args = null;
        const collector = command.argsCollector ?? null;
        if (collector) {
            const collection = collector.collect(msg, command, msg.args);
            if (collection.failed) return msg.reply(collection.message)
            args = collection.values;
        }

        command.run(msg, args);

        /**
         * Emitted when a command is triggered
         * @event EustacheClient#commandTrigger
         * @param {Command} command The triggered command
         * @param {Object} args The passed arguments
         * @param {discord.Message} msg The message that triggered the command
         */
        this.client.emit('commandTrigger', command, args, msg);
    }

    /**
     * Wether the dispatcher should handle the message or not
     * @param {Discord.Message} msg
     * @returns {Boolean}
     */
    shouldHandleMessage(msg) {
        const commandPattern = new RegExp(`^\\${this.client.commandPrefix}\\w+(\\s+)?(.+)?`, 'i');
        return (!msg.author.bot && msg.content.match(commandPattern) ? true : false);
    }

    /**
     * Parses the message content
     * @param {string} content The message content to parse
     * @returns {Array<string>} The parsed content
     */
    parseMessage(msg, content) {
        return content.substring(this.client.commandPrefix.length).replace(/\s+/, ' ').split(' ');
    }
}

module.exports = EustacheDispatcher;
