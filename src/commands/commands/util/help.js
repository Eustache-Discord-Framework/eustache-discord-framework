'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../base");

class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            alias: ['h', 'aide'],
            description: "affiche ce message d'aide.",
            args: [
                {
                    key: 'cmd',
                    label: 'Commande',
                    type: 'command',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const commands = Array.from(this.client.registry.findCommand())
        const embed = new MessageEmbed({
            color: 'RANDOM',
            title: `Message d'aide`,
            fields: [
                {
                    name: 'Commandes',
                    value: commands.map(cmd => cmd.hidden ? '' : `\`${this.client.commandPrefix}${cmd.name}\` ${cmd.description ? `: ${cmd.description}` : ''}`).join("\n")
                }
            ],
            footer: {
                text: this.client.user.username
            },
            timestamp: new Date()
        })

        msg.reply(embed);
    }
}

module.exports = HelpCommand;
