'use strict';

const Command = require('../../base');

/**
 * @class
 * @extends Command
 */
class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: "renvoie la latence entre le client et l'API."
        });
    }

    run(msg) {
        const ping = Math.round(this.client.ws.ping);
        return msg.reply(`la latence actuelle est de \`${ping} ms\`.`);
    }
}

module.exports = PingCommand;
