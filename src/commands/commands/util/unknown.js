'use strict';

const Command = require('../../base');

/**
 * @class
 * @extends Command
 */
class UnknownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unknown',
            hidden: true,
            unknown: true
        });
    }

    run(msg) {
        msg.reply(`la commande \`${msg.command}\` n'existe pas.`);
    }
}

module.exports = UnknownCommand;
