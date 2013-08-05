var color, logger, request;

request = require('request');

color = require('ansi-color').set;

logger = require('logmimosa');

exports.retrieveRegistry = function(callback) {
  logger.info("Retrieving registry...");
  return request('https://raw.github.com/dbashford/mimosa-skeleton/master/registry.json', function(error, response, body) {
    var err, registry;

    if (!error && response.statusCode === 200) {
      try {
        registry = JSON.parse(body);
        return callback(registry);
      } catch (_error) {
        err = _error;
        return logger.error("Registry JSON failed to parse: " + err);
      }
    } else {
      return logger.error("Problem retrieving registry JSON: " + error);
    }
  });
};

exports.outputSkeletons = function(skels) {
  console.log(color("\n  ---------------------------------------------------------------------------------------\n", "green+bold"));
  return skels.forEach(function(skel) {
    console.log("    " + (color("Name:", "green+bold")) + "        " + (color(skel.name, "blue+bold")));
    console.log("    " + (color("Description:", "green+bold")) + " " + skel.description);
    console.log("    " + (color("URL:", "green+bold")) + "         " + skel.url);
    console.log("    " + (color("Keywords:", "green+bold")) + "    " + (skel.keywords.join(', ')));
    return console.log(color("\n  ---------------------------------------------------------------------------------------\n", "green+bold"));
  });
};
