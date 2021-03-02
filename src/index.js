'use strict';

module.exports = {
    EustacheClient: require('./client'),
    EustacheDispatcher: require('./dispatcher'),
    EustacheRegistry: require('./registry'),
    Command: require('./commands/base'),
    ArgumentCollector: require('./commands/ArgumentCollector'),
    Argument: require('./commands/Argument'),
    ArgumentType: require('./types/base'),

    version: require('../package').version,

    // commands
    HelpCommand: require('./commands/commands/util/help'),
    PingCommand: require('./commands/commands/util/ping'),
    UnknownCommand: require('./commands/commands/util/unknown'),

    // types
    StringArgumentType: require('./types/string'),
    CommandArgumentType: require('./types/command'),
}
