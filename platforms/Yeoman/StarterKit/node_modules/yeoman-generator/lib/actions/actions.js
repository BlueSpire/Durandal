var logger = process.logging || require('./utils/log');
var log = logger('generators:action');

var fs = require('fs');
var path = require('path');
var events = require('events');
var mkdirp = require('mkdirp');
var isBinaryFile = require('isbinaryfile');
var rimraf = require('rimraf');
var async = require('async');

var actions = module.exports;

actions.log = log;

// Stores and return the source root for this class. The source root is used to
// prefix filepath with `.read()` or `.template()`.
//
// - root - A string to resolve `sourceRoot` against.
//
// Returns the source root value.
actions.sourceRoot = function sourceRoot(root) {
  if (root) {
    this._sourceRoot = path.resolve(root);
  }

  return this._sourceRoot;
};

// Sets the destination root for this class, the working directory.
//
// Relatives path are added to the directory where the script was invoked and
// expanded.
//
// This automatically creates the working directory if it doensn't exists and
// cd into it.
//
// - root - A string to resolve `destinationRoot` against.
//
// Returns the destinatio root value.
actions.destinationRoot = function destinationRoot(root) {
  if (root) {
    this._destinationRoot = path.resolve(root);

    if (!fs.existsSync(root)) {
      this.mkdir(root);
    }

    process.chdir(root);
  }

  return this._destinationRoot || './';
};

// Make some of the file API aware of our source / destination root paths.
// copy, template (only when could be applied/required by legacy code),
// write and alike consider:
//
// - source      - the source path to be relative to generator's `templates/` directory.
// - destination - the destination path to be relative to application Gruntfile's directory
// - process     - the function to process the source file contents with
actions.copy = function copy(source, destination, process) {
  var body;
  destination = destination || source;

  if (typeof destination === 'function') {
    process = destination;
    destination = source;
  }

  source = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);

  var encoding = null;
  var binary = isBinaryFile(source);
  if (!binary) {
    encoding = 'utf-8';
  }

  body = fs.readFileSync(source, encoding);

  if (typeof process === 'function' && !binary) {
    body = process(body, source, destination, {
      encoding: encoding
    });
  }

  try {
    body = this.engine(body, this);
  } catch (err) {
    // This happens in some cases when trying to copy a JS file like lodash/underscore
    // (conflicting the templating engine)
  }

  this.checkForCollision(destination, body, function (err, config) {
    var stats;

    if (err) {
      config.callback(err);
      return this.emit('error', err);
    }

    // Create or force means file write, identical or skip prevent the
    // actual write
    if (!(/force|create/.test(config.status))) {
      return config.callback();
    }

    mkdirp.sync(path.dirname(destination));
    fs.writeFileSync(destination, body);

    // Synchronize stats and modification times from the original file.
    stats = fs.statSync(source);
    try {
      fs.chmodSync(destination, stats.mode);
      fs.utimesSync(destination, stats.atime, stats.mtime);
    } catch (err) {
      this.log.error('Error setting permissions of "' + destination.bold + '" file: ' + err);
    }

    config.callback();
  }.bind(this));

  return this;
};


// A simple method to read the content of the a file.
//
// The encoding is utf8 by default, to read binary files, pass the proper
// encoding or null.
//
// Non absolute path are prefixed by the source root.
//
// - source   - A filepath String to read from
// - encoding - An optional encoding value to use (default: utf8)
//
// Returns the file content
actions.read = function read(source, encoding) {
  source = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  encoding = encoding === undefined ? 'utf8' : encoding;
  return fs.readFileSync(source, encoding);
};


// Writes a chunk of data to a given `filepath`, checking for collision prior
// to the file write.
//
// - filepath - Path to write to
// - conent   - File content to write
//
// Returns the generator instance
actions.write = function write(filepath, content) {
  this.checkForCollision(filepath, content, function (err, config) {
    if (err) {
      config.callback(err);
      return this.emit('error', err);
    }

    // create or force means file write, identical or skip prevent the
    // actual write
    if (/force|create/.test(config.status)) {
      mkdirp.sync(path.dirname(filepath));
      fs.writeFileSync(filepath, content);
    }

    config.callback();
  });
  return this;
};

// File collision checked. Takes a `filepath` (the file about to be written)
// and the actual content. A basic check is done to see if the file exists, it it does:
//
// 1. read its content from FS
// 2. compare it with content provided
// 3. if identical, mark it as is and skip the check
// 4. if diverged, prepare and show up the file collision menu
//
// The menu has the following options:
//
// - Y - yes, overwrite
// - n - no, do not overwrite
// - a - all, overwrite this and all others
// - q - quit, abort
// - d - diff, show the differences between the old and the new
// - h - help, show this help
actions.checkForCollision = function checkForCollision(filepath, content, cb) {
  this.conflicter.add({
    file: filepath,
    content: content
  });

  this.conflicter.once('resolved:' + filepath, cb.bind(this, null));
};

// Gets a template at the relative source, executes it and makes a copy
// at the relative destination. If the destination is not given it's assumed
// to be equal to the source relative to destination.

// Use configured engine to render the provided `source` template at the given
// `destination`. `data` is an optional hash to pass to the template, if
// undefined, executes the template in the generator instance context.
actions.template = function template(source, destination, data) {
  data = data || this;
  destination = destination || source;

  var body = this.read(source, 'utf8');
  body = this.engine(body, data);

  this.write(destination, body);
  return this;
};

// The engine method is the function used whenever a template needs to be rendered.
//
// It uses the configured engine (default: underscore) to render the `body`
// template with the provided `data`.
//
// - body     - Template content
// - data     - Data to render the template with
//
// Returns the rendered string
actions.engine = function engine(body, data) {
  if (!this._engine) {
    throw new Error('Trying to render template without valid engine.');
  }

  return this._engine.detect && this._engine.detect(body) ?
    this._engine(body, data) :
    body;
};

// Copies recursively the files from source directory to root directory.
//
// - source       - Filepath of the directory to read from (relative to sourceRoot)
// - destination  - Filepath to copy to (relative to destinationRoot)
// - process      - Function to process source file contents with as part of copy process
// Returns the generator instance
actions.directory = function directory(source, destination, process) {
  var root = path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', { dot: true, cwd: root });
  var self = this;

  destination = destination || source;

  if (typeof destination === 'function') {
    process = destination;
    destination = source;
  }

  // get the path relative to the template root, and copy to the relative destination
  var resolveFiles = function (filepath) {
    return function (next) {
      if (!filepath) {
        self.emit('directory:end');
        return next();
      }

      var dest = path.join(destination, filepath);
      self.copy(path.join(root, filepath), dest, process);

      return next();
    };
  };

  async.parallel(files.map(resolveFiles));

  return this;
};

// Remotely fetch a package on github, store this into a _cache folder, and
// provide a "remote" object as a facade API to ourself (part of genrator API,
// copy, template, directory)
// It's possible to remove local cache, and force a new remote fetch of the package on github
//
// Example:
//
//    this.remote('user', 'repo', function(err, remote) {
//      remote.copy('.', 'vendors/user-repo');
//    });
//
// Returns the generator instance
actions.remote = function (username, repo, branch, cb, refresh) {
  if (!cb) {
    cb = branch;
    branch = 'master';
  }

  var self = this;
  var home = process.env.HOME || process.env.USERPROFILE;
  var cache = path.join(home, '.yeoman/cache', username, repo, branch);
  var url = 'http://github.com/' + [username, repo, 'archive', branch].join('/') + '.tar.gz';

  fs.stat(cache, function (err) {
    // already cached
    if (!err) {
      // no refresh, so we can use this cache
      if (!refresh) {
        return done();
      }

      // Otherwise, we need to remove it, to fetch it again
      rimraf(cache, function (err) {
        if (err) {
          return cb(err);
        }
        self.tarball(url, cache, done);
      });

    } else {
      self.tarball(url, cache, done);
    }
  });

  function done(err) {
    if (err) {
      return cb(err);
    }

    var files = self.expandFiles('**', { cwd: cache, dot: true });

    var remote = {};
    remote.cachePath = cache;

    // Simple proxy to `.copy(source, destination)`
    remote.copy = function copy(source, destination) {
      source = path.join(cache, source);
      self.copy(source, destination);
      return this;
    };

    // same as `.template(source, destination, data)`
    remote.template = function template(source, destination, data) {
      data = data || self;
      destination = destination || source;
      source = path.join(cache, source);

      var body = self.engine(self.read(source), data);
      self.write(destination, body);
    };

    // same as `.template(source, destination)`
    remote.directory = function directory(source, destination) {
      var root = self.sourceRoot();
      self.sourceRoot(cache);
      self.directory(source, destination);
      self.sourceRoot(root);
    };

    cb(err, remote, files);
  }

  return this;
};
