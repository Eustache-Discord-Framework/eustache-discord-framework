'use strict';

const discord = require('discord.js');
const Command = require('./commands/base');
const ArgumentType = require('./types/base');

/**
 * Registers and searchs for commands and types
 */
class EustacheRegistry {
    constructor(client) {
        /**
         * The client this registry is for
         * @name EustacheRegistry#client
         * @type {EustacheClient}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        /**
         * Registered commands, mapped by their name
         * @type {Collection<string, Command>}
         */
        this.commands = new discord.Collection();

        /**
         * Registered argument types, mapped by their ID
         * @type {Collection<string, ArgumentType>}
         */
        this.types = new discord.Collection();

		/**
		 * Command to run when an unknown command is used
		 * @type {?Command}
		 */
		this.unknownCommand = null;
    }

    /**
    * Registers a single type
    * @param {Function} type The constructor of the type being registered
    * @returns {EustacheRegistry}
    */
    registerType(type) {
        if (!(type.prototype instanceof ArgumentType)) throw new Error(`Invalid command object to register: ${command}`);
        type = new type(this.client)

        // Browse the collection for conflicts
        if(this.types.has(type.id)) throw new Error(`An argument type with the ID "${type.id}" is already registered.`);

        // Register the type
        this.types.set(type.id, type);

        /**
         * Emitted when a type is registered
         * @event EustacheClient#typeRegistered
         * @param {ArgumentType} type The registered type
         */
        this.client.emit('typeRegistered', type);

        return this;
    }

    /**
     * Registers multiple types
     * @param {Function[]} types An Array of type constructors
     * @returns {EustacheRegistry}
     */
    registerTypes(types) {
        if (!Array.isArray(types)) throw new Error('Types must be an Array.');
        for (const type of types) {
            this.registerType(type);
        }
        return this;
    }

    /**
    * Registers a single type
    * @param {Function} command The constructor of the command being registered
    * @returns {EustacheRegistry}
    */
    registerCommand(command) {
        if (!(command.prototype instanceof Command)) throw new Error(`Invalid command object to register: ${command}`);
        command = new command(this.client)

        // Browse the collection for conflicts
        const keywords = Array.of(command.name).concat(command.alias ?? null);
        for (const keyword of keywords) {
            if (this.commands.some(cmd => cmd.name === keyword || cmd.aliases.includes(keyword))) {
                throw new Error(`A command with the name/alias "${keyword}" is already registered.`);
            }
        }
        if (command.unknown && this.unknownCommand) throw new Error('An unknown command is already registered.');

        // Register the command
        this.commands.set(command.name, command);
        if(command.unknown) this.unknownCommand = command;

        /**
         * Emitted when a command is registered
         * @event EustacheClient#commandRegistered
         * @param {Command} command The registered command
         */
        this.client.emit('commandRegistered', command);

        return this;
    }

    /**
     * Registers multiple types
     * @param {Function[]} commands An Array of command constructors
     * @returns {EustacheRegistry}
     */
    registerCommands(commands) {
        if (!Array.isArray(commands)) throw new Error('Commands must be an Array.');
        for (const command of commands) {
            this.registerCommand(command);
        }
        return this;
    }

    /**
     * Register the default argument types and commands
     * @returns {EustacheRegistry}
     */
    registerDefaults() {
        this.registerDefaultTypes();
        this.registerDefaultCommands();
        return this;
    }

    /**
     * Register the default types
     * @param {Object} types
     * @param {boolean} [commands.string=true] Whether to register the built-in string type
     * @param {boolean} [commands.command=true] Whether to register the built-in command type
     * @returns {EustacheRegistry}
     */
    registerDefaultTypes(types = {}) {
        types = {
            string: true, command: true, ...types
        };
        if (types.string) this.registerType(require('./types/string'));
        if (types.command) this.registerType(require('./types/command'));
        return this;
    }

    /**
     * Register the default commands
     * @param {Object} commands
     * @param {boolean} [commands.help=true] Whether to register the built-in help command
     * @param {boolean} [commands.ping=true] Whether to register the built-in ping command
     * @param {boolean} [commands.unknown=true] Whether to register the built-in unknown command
     * @returns {EustacheRegistry}
     */
    registerDefaultCommands(commands = {}) {
        commands = {
            help: true, ping: true, unknown: true, ...commands
        };
        if (commands.help) this.registerCommand(require('./commands/commands/util/help'));
        if (commands.ping) this.registerCommand(require('./commands/commands/util/ping'));
        if (commands.unknown) this.registerCommand(require('./commands/commands/util/unknown'));
        return this;
    }

    /**
     * Fetches any type from the registry
     * @param {?string} key The key to search for
     * @returns {ArgumentType}
     */
    findType(key = null) {
        if (!key) return this.types
        else  key = key.toLocaleLowerCase()
        return this.types.has(key) ? this.types.get(key) : null;
    }

    /**
     * Fetches any command from the registry
     * @param {?string} key The key to search for
     * @returns {Command}
     */
    findCommand(key = null) {
        if (!key) return this.commands.values();
        else  key = key.toLowerCase()
        return this.commands.find(cmd => cmd.name === key || cmd.aliases.includes(key));
    }

    /**
	 * Resolves a CommandResolvable to a Command object
	 * @param {Command|string} command The command to resolve
	 * @return {Command} The resolved Command
	 */
	resolveCommand(command) {
		if(command instanceof Command) return command;
		if(command instanceof discord.Message && command.command) return this.resolveCommand(command);
		if(typeof command === 'string') return this.findCommand(command);
		throw new Error('Unable to resolve command.');
	}
}

module.exports = EustacheRegistry;
