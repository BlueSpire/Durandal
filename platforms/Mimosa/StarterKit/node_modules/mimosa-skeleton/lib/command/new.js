var exec, fs, logger, path, register, retrieveRegistry, rimraf, windowsDrive, wrench, _cloneGitHub, _isGitHub, _isSystemPath, _moveDirectoryContents, _newSkeleton;

exec = require('child_process').exec;

path = require("path");

fs = require("fs");

logger = require('logmimosa');

wrench = require("wrench");

rimraf = require("rimraf");

retrieveRegistry = require('../util').retrieveRegistry;

windowsDrive = /^[A-Za-z]:\\/;

_isSystemPath = function(str) {
  return windowsDrive.test(str) || str.indexOf("/") === 0;
};

_isGitHub = function(s) {
  return s.indexOf("https://github") === 0 || s.indexOf("git@github") === 0 || s.indexOf("git://github") === 0;
};

_newSkeleton = function(skeletonName, directory, opts) {
  if (opts.debug) {
    logger.setDebug();
    process.env.DEBUG = true;
  }
  directory = directory != null ? path.join(process.cwd(), directory) : process.cwd();
  if (_isGitHub(skeletonName)) {
    return _cloneGitHub(skeletonName, directory);
  } else if (_isSystemPath(skeletonName)) {
    _moveDirectoryContents(skeletonName, directory);
    return logger.success("Copied local skeleton to [[ " + directory + " ]]");
  } else {
    return retrieveRegistry(function(registry) {
      var skels;

      skels = registry.skels.filter(function(s) {
        return s.name === skeletonName;
      });
      if (skels.length === 1) {
        logger.info("Found skeleton in registry");
        return _cloneGitHub(skels[0].url, directory);
      } else {
        return logger.error("Unable to find a skeleton matching name [[ " + skeletonName + " ]]");
      }
    });
  }
};

_cloneGitHub = function(skeletonName, directory) {
  logger.info("Cloning GitHub repo [[ " + skeletonName + " ]] to temp holding directory.");
  return exec("git clone " + skeletonName + " temp-mimosa-skeleton-holding-directory", function(error, stdout, stderr) {
    var inPath;

    if (error != null) {
      return logger.error("Error cloning git repo: " + stderr);
    }
    inPath = path.join(process.cwd(), "temp-mimosa-skeleton-holding-directory");
    logger.info("Moving cloned repo to  [[ " + directory + " ]].");
    _moveDirectoryContents(inPath, directory);
    logger.info("Cleaning up...");
    return rimraf(inPath, function(err) {
      if (err) {
        if (process.platform === 'win32') {
          logger.warn("A known Windows/Mimosa has made the directory at [[ " + inPath + " ]] unremoveable. You will want to clean that up.  Apologies!");
          return logger.success("Skeleton successfully cloned from GitHub.");
        } else {
          return logger.error("An error occurred cleaning up the temporary holding directory", err);
        }
      } else {
        return logger.success("Skeleton successfully cloned from GitHub.");
      }
    });
  });
};

_moveDirectoryContents = function(sourcePath, outPath) {
  var contents, fileContents, fileStats, fullOutPath, fullSourcePath, item, _i, _len, _results;

  contents = wrench.readdirSyncRecursive(sourcePath).filter(function(p) {
    return p.indexOf('.git') !== 0 || p.indexOf('.gitignore') === 0;
  });
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
  _results = [];
  for (_i = 0, _len = contents.length; _i < _len; _i++) {
    item = contents[_i];
    fullSourcePath = path.join(sourcePath, item);
    fileStats = fs.statSync(fullSourcePath);
    fullOutPath = path.join(outPath, item);
    if (fileStats.isDirectory()) {
      logger.debug("Copying directory: [[ " + fullOutPath + " ]]");
      wrench.mkdirSyncRecursive(fullOutPath, 0x1ff);
    }
    if (fileStats.isFile()) {
      logger.debug("Copying file: [[ " + fullOutPath + " ]]");
      fileContents = fs.readFileSync(fullSourcePath);
      _results.push(fs.writeFileSync(fullOutPath, fileContents));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

register = function(program) {
  var _this = this;

  return program.command('skel:new <skeletonName> [directory]').description("Create a Mimosa project using a skeleton").option("-D, --debug", "run in debug mode").action(_newSkeleton).on('--help', function() {
    logger.green('  The skel:new command will create a new project using a Mimosa skeleton of your choice.');
    logger.green('  The first argument passed to skel:new is the name of the skeleton to use.  The name can');
    logger.green('  take several forms.  It can be either the 1) name of the skeleton from the skeleton');
    logger.green('  registry, 2) the github URL of the skeleton or 3) the path to the skeleton if the');
    logger.green('  skeleton is on the file system for when skeleton development is taking place. The second');
    logger.green('  argument is the name of the directory to place the skeleton in. If the directory does');
    logger.green('  not exist, Mimosa will create it. If the directory is not provided, the skeleton will be');
    logger.green('  placed in the current directory.');
    return logger.blue('\n    $ mimosa skel:new <skeletonName> <directory>\n');
  });
};

module.exports = function(program) {
  return register(program);
};
