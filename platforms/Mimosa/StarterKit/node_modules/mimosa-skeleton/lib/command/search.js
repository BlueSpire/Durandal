var color, logger, outputSkeletons, register, retrieveRegistry, util, _search;

logger = require('logmimosa');

color = require('ansi-color').set;

util = require('../util');

retrieveRegistry = util.retrieveRegistry;

outputSkeletons = util.outputSkeletons;

_search = function(keyword) {
  keyword = keyword.toLowerCase();
  return retrieveRegistry(function(registry) {
    var skels;

    skels = registry.skels.filter(function(skel) {
      var keywordIndex;

      keywordIndex = skel.keywords.map(function(k) {
        return k.toLowerCase();
      }).indexOf(keyword);
      if (keywordIndex > -1) {
        skel.keywords[keywordIndex] = color(skel.keywords[keywordIndex], "blue+bold");
        return true;
      } else {
        return false;
      }
    });
    if (skels.length === 0) {
      logger.green('\n  No skeletons found for that keyword.');
      logger.green('\n  To list all skeletons use the skel:list command.');
      logger.blue('\n    mimosa skel:list\n');
      return;
    }
    logger.green('\n  The following skeletons are available for install. To use a skeleton find the name of the');
    logger.green('  skeleton you want and enter:');
    logger.blue('\n    mimosa skel:new [skeleton name] [name of directory to install skeleton] \n');
    logger.green('  To find skeletons that use specific technologies, use the mod:search command.');
    logger.blue('\n    mimosa skel:search backbone\n');
    logger.green('  Skeletons');
    return outputSkeletons(skels);
  });
};

register = function(program) {
  var _this = this;

  return program.command('skel:search <keyword>').description("Search for skeletons using keywords").option("-D, --debug", "run in debug mode").action(_search).on('--help', function() {
    logger.green('  The skel:search will search the skeletons in the registry using the provided');
    logger.green('  keyword and list only those skeletons that have the keyword. Use this command');
    logger.green('  if you want to find skeletons that contain a specific technology.');
    return logger.blue('\n    $ mimosa skel:search backbone\n');
  });
};

module.exports = function(program) {
  return register(program);
};
