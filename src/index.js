'use strict';

module.exports = {
    EustacheClient: require('./client'),
    EustacheDispatcher: require('./dispatcher'),
    EustacheRegistry: require('./registry'),
    Command: require('./commands/base'),
    Argument: require('./commands/Argument'),
    ArgumentCollector: require('./commands/ArgumentCollector'),

    version: require('../package').version
}
