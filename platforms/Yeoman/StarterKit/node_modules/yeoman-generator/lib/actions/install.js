var _ = require('lodash');
var dargs = require('dargs');
var async = require('async');

var install = module.exports;

// Combine package manager cmd line arguments and run the "install" command
//
// - installer - A String containing the name of the package manager to use
// - paths     - A String or an Array of package name to install. Empty string for `npm install`
// - options   - [optional] The Hash of options to invoke `npm install` with. See `npm help install`.
// - callback  - [optional]
//
// Returns the generator instance.
install.runInstall = function (installer, paths, options, cb) {
  if (!cb && _.isFunction(options)) {
    cb = options;
    options = {};
  }

  options = options || {};
  cb = cb || function () {};
  paths = Array.isArray(paths) ? paths : (paths && paths.split(' ') || []);

  this.emit(installer + 'Install', paths);
  var args = ['install'].concat(paths).concat(dargs(options));

  this.spawnCommand(installer, args, cb)
    .on('error', cb)
    .on('exit', this.emit.bind(this, installer + 'Install:end', paths))
    .on('exit', function (err) {
      if (err === 127) {
        this.log.error('Could not find ' + installer + '. Please install with ' +
                            '`npm install -g ' + installer + '`.');
      }
      cb(err);
    }.bind(this));

  return this;
};


// Runs `npm` and `bower` in the generated directory concurrently and prints a
// message to let the user know.
//
// Options:
//  - npm: bool, whether to run `npm install`, default: true
//  - bower: bool, whether to run `bower install`, default: true
//  - skipInstall: bool, whether to skip automatic installation and just print a
//                 message to the user how to do it, default: false
//
// Example:
//
//   this.installDependencies({
//      bower: true,
//      npm: true,
//      skipInstall: false,
//      callback: function () {
//         console.log('Everything is ready!');
//      }
//   });
//
// Returns the generator instance.
install.installDependencies = function (options) {
  var msg = {
    commands: [],
    template: _.template('\n\nI\'m all done. ' +
    '<%= skipInstall ? "Just run" : "Running" %> <%= commands.bold.yellow %> ' +
    '<%= skipInstall ? "" : "for you " %>to install the required dependencies.' +
    '<% if (!skipInstall) { %> If this fails, try running the command yourself.<% } %>\n\n')
  };

  var commands = [];

  if (_.isFunction(options)) {
    options = {
      callback: options
    };
  }

  options = _.defaults(options || {}, {
    bower: true,
    npm: true,
    skipInstall: false,
    callback: function () {}
  });

  if (options.bower) {
    msg.commands.push('bower install');
    commands.push(function (cb) {
      this.bowerInstall(null, null, cb);
    }.bind(this));
  }

  if (options.npm) {
    msg.commands.push('npm install');
    commands.push(function (cb) {
      this.npmInstall(null, null, cb);
    }.bind(this));
  }

  if (msg.commands.length === 0) {
    throw new Error('installDependencies needs at least one of npm or bower to run.');
  }

  console.log(msg.template(_.extend(options, { commands: msg.commands.join(' & ') })));

  if (!options.skipInstall) {
    async.parallel(commands, options.callback);
  }
};

//
// Receives a list of `paths`, and an Hash of `options` to install through bower
//
// - paths     - A String or an Array of package name to install. Empty string for `bower install`
// - options   - [optional] The Hash of options to invoke `bower install` with. See `bower help install`.
// - callback  - [optional]
//
// Returns the generator instance.
install.bowerInstall = function install(paths, options, cb) {
  return this.runInstall('bower', paths, options, cb);
};


// Receives a list of `paths`, and an Hash of `options` to install through npm
//
// - paths     - A String or an Array of package name to install. Empty string for `npm install`
// - options   - [optional] The Hash of options to invoke `npm install` with. See `npm help install`.
// - callback  - [optional]
//
// Returns the generator instance.
install.npmInstall = function install(paths, options, cb) {
  return this.runInstall('npm', paths, options, cb);
};
