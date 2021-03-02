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
                    default: 'help'
                }
            ]
        });
    }

    run(msg, args) {
        const cmd = 'cmd' in args ? args.cmd : null;
        const embed = new MessageEmbed({
            color: 'RANDOM',
            footer: {
                text: this.client.user.username
            },
            timestamp: new Date()
        });

        if (cmd.name === 'help') msg.reply(this.all(embed))
        else msg.reply(this.single(embed, cmd));
    }

    all(embed) {
        let commands = Array.from(this.client.registry.findCommand());
        commands = commands.filter(cmd => cmd.hidden === false);
        commands = commands.map(cmd => {
            let name = this.client.commandPrefix + cmd.name;
            let description = cmd.description ? `: ${cmd.description}` : '';
            return `\`${name}\`${description}`
        })

        if (commands && commands.length > 0) {
            return embed
                .setTitle("Message d'aide")
                .addField('Commands', commands.join("\n"));
        } else {
            return embed
                .setTitle('Mince alors...')
                .setDescription("Il n'y a aucune commande à afficher ici.");
        }
    }

    single(embed, cmd) {
        const name = this.client.commandPrefix + cmd.name;
        const args = cmd.argsCollector ? ' ' + cmd.argsCollector.args.map(arg => arg.format).join(' ') : '';
        const usage = name + args;
        const description = cmd.description ? `: ${cmd.description}` : '';
        const aliases = (cmd.aliases && cmd.aliases.length > 0) ? cmd.aliases.map(alias => `\`${this.client.commandPrefix + alias}\``).join(', ') : null;

        embed.setTitle(`Message d'aide - Commande \`${name}\``);
        embed.addField('Commande', `\`${usage}\`${description}`);
        if (aliases) embed.addField('Alias', aliases);

        return embed;
    }
}

module.exports = HelpCommand;
