var logger, outputSkeletons, register, retrieveRegistry, util, _list;

logger = require('logmimosa');

util = require('../util');

retrieveRegistry = util.retrieveRegistry;

outputSkeletons = util.outputSkeletons;

_list = function() {
  return retrieveRegistry(function(registry) {
    logger.green('\n  The following skeletons are available for install. To use a skeleton find the name of the');
    logger.green('  skeleton you want and enter:');
    logger.blue('\n    mimosa skel:new [skeleton name] [name of directory to install skeleton] \n');
    logger.green('  To find skeletons that use specific technologies, use the mod:search command.');
    logger.blue('\n    mimosa skel:search backbone\n');
    logger.green('  Skeletons');
    return outputSkeletons(registry.skels);
  });
};

register = function(program) {
  var _this = this;

  return program.command('skel:list').description("List all skeletons").option("-D, --debug", "run in debug mode").action(_list).on('--help', function() {
    logger.green('  The skel:list will list all of the skeletons in the skeleton registry.');
    logger.green('  It will list all of the details for each skeleton.');
    return logger.blue('\n    $ mimosa skel:list\n');
  });
};

module.exports = function(program) {
  return register(program);
};
