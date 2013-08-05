var fs = require('fs');
var util = require('util');
var path = require('path');
var events = require('events');
var spawn = require('child_process').spawn;
var glob = require('glob');
var _ = require('lodash');
var log = process.logging('generators');
var engines = require('./util/engines');

var debug = require('debug')('generators:environment');

var Base = require('./base');

// TODO(mklabs):
//
// - path manipulation methods ({append,prepend}{Path,Lookup}) can be dryed out.
// - if it gets too huge (more than 200loc), split this into mulitple mixins.
// - register() method too long, split logic for namespace etc. elsewhere
// - flesh out Error handling, consider emitting error instead of throwing,
//   even for synchronous operation.

// `Environment` object is responsible of handling the lifecyle and bootstrap
// of generators in a specific environment (your app).
//
// It provides a high-level API to create and run generators, as well as further
// tuning where and how a generator is resolved.
//
// An environment is created using a list of `arguments` and a Hash of
// `options`. Usually, this is the list of arguments you get back from your CLI
// options parser.
//
// - args - A String or Array of arguments to init the env with.
// - opts - A Hash of options to init the env with.
var Environment = module.exports = function Environment(args, opts) {
  events.EventEmitter.call(this);

  args = args || [];
  this.arguments = Array.isArray(args) ? args : args.split(' ');
  this.options = opts || {};

  this.cwd = this.options.cwd || process.cwd();
  this.generators = {};
  this.aliases = [];

  this.lookups = [];
  this.paths = [];
  this.appendLookup('.');
  this.appendLookup('lib/generators');

  this.appendPath('.');

  // adds support for global generators. ensures support across all OS since the
  // global node_modules dir always is four levels up from env.js
  this.appendPath(path.join(__dirname, '../../../..'));

  this._prefixReg = null;
  this._prefixes = this._prefixes || [];
  this._suffix = this._suffix || '';
  this.prefix(this.options.prefix || 'generator-');
  this.suffix(this.options.suffix || '*/index.js');

  this.plugins('node_modules');
};

util.inherits(Environment, events.EventEmitter);

// Error handler taking `err` instance of Error.
//
// The `error` event is emitted with the error object, if no `error` listener
// is registered, then we throw the error.
//
// Returns the environment instance.
Environment.prototype.error = function error(err) {
  err = err instanceof Error ? err : new Error(err);
  if (!this.emit('error', err)) {
    throw err;
  }

  return this;
};

// Configures the `engine` to use for this environment.
//
// - engine  - String matching an available engine, or a Function taking `src`
//             and `data` as argument and returning the rendered template.
//
// Returns the environment.
Environment.prototype.engine = function _engine(engine) {
  if (typeof engine === 'function') {
    this._engine = engine;
    return this;
  }

  if (!engines[engine]) {
    return this.error(new Error('Wrong engine (' + engine + '). Available: ' + Object.keys(engines).join(' ')));
  }

  this._engine = engines[engine];
  return this;
};

// Appends a `filepath` to the list of loadpaths.
//
// - filepath - Absolute or relative (to current working dir) path to add.
//
// Returns the environment.
Environment.prototype.appendPath = function appendPath(filepath) {
  if (!filepath) {
    return this.error(new Error('Missing filepath.'));
  }

  this.paths.push(filepath);
  return this;
};

// Appends a new `filepath` to the list of lookups path. This should be a
// relative filepath, like `support/scaffold`. Environments are created with
// `lib/generators` as a lookup path by default.
//
// - filepath - Relative path to append to the list of lookup paths.
//
// Returns the environment.
Environment.prototype.appendLookup = function appendLookup(filepath) {
  if (!filepath) {
    return this.error(new Error('Missing filepath.'));
  }

  this.lookups.push(filepath);
  return this;
};

// Outputs the general help and usage. Optionnaly, if generators have been
// registered, the list of available generators is also displayed.
//
// - name - String name of the binary name to output (defaults: init)
//
// Returns the help output.
Environment.prototype.help = function help(name) {
  name = name || 'init';

  var out = [
    'Usage: :binary: GENERATOR [args] [options]',
    '',
    'General options:',
    '  -h, --help     # Print generator\'s options and usage',
    '  -f, --force    # Overwrite files that already exist',
    '',
    'Please choose a generator below.',
    ''
  ];

  var ns = this.namespaces();

  var groups = {};
  ns.sort().forEach(function (namespace) {
    var base = namespace.split(':')[0];

    if (!groups[base]) {
      groups[base] = [];
    }

    groups[base] = groups[base].concat(namespace);
  });

  Object.keys(groups).forEach(function (key) {
    var group = groups[key];

    if (group.length >= 1) {
      out.push('', key.charAt(0).toUpperCase() + key.slice(1));
    }

    groups[key].forEach(function (ns) {
      out.push('  ' + ns);
    });
  });

  return out.join('\n')
    .replace(/:binary:/g, name);
};

// Registers a specific `generator` to this environment. A generator can be a
// simple function or an object extending from `Generators.Base`. The later
// method is favored as it allows you to specify options / arguments for
// self-documented generator with `USAGE:` and so on.
//
// In case of a simple function, the generator does show up in the `--help`
// output, but without any kind of arguments / options. You must document them
// manually with your `USAGE` file.
//
// In any case, the API available in generators is the same. Raw functions are
// executed within the context of a `new Generators.Base`.
//
// `register()` can also take Strings, in which case it is considered a
// filepath to `require()`
//
// - name         - A string or Function. If it's a string, then it is considered to be
//                  a package to require. If it's a function, then the generator is
//                  registered directly.
//
// - namespace    - An optional String namespace to register this generator with
//
// Returns the environment.
Environment.prototype.register = function register(name, namespace) {
  if (!name) {
    return this.error(new Error('You must provide a generator to register.'));
  }

  var filepath = name;

  var generator;
  if (typeof name === 'string') {
    if (filepath.charAt(0) === '.') {
      filepath = path.resolve(filepath);
    }

    if (filepath.charAt(0) === '~') {
      filepath = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] + filepath.slice(1);
    }

    generator = require(filepath);
    generator.resolved = require.resolve(filepath);
    generator.namespace = this.namespace(generator.resolved);
  } else {
    generator = name;
  }

  if (typeof generator !== 'function') {
    return this.error(new Error('Generators must be exposed as a function.'));
  }

  var parents = Object.getPrototypeOf(generator.prototype);
  var ns = namespace || generator.namespace || this.namespace(name);

  if (!ns) {
    return this.error(new Error('Unable to determine namespace.'));
  }

  // normalize what we got, at this point if we were unable to find a
  // namespace, we just consider the directory name under which this generator
  // is found.
  if (ns.indexOf('/') !==  -1) {
    ns = path.basename(path.dirname(ns));
  }

  // we can't rely on instanceof, as our Base object is different than the one
  // require()-d in the generator (unless it was npm linked)
  //
  // so, we detect if it looks like a Base generator.

  var methods = ['option', 'argument', 'hookFor', 'run'];
  var isBase = methods.filter(function (method) {
    return !!parents[method];
  }).length === methods.length;


  generator.namespace = ns;
  generator.raw = !isBase;
  generator.resolved = generator.resolved || ns;
  this.generators[ns] = generator;

  debug('Registered %s (%s)', generator.namespace, generator.resolved);
  return this;
};

// Returns the list of registered namespace.
Environment.prototype.namespaces = function namespaces() {
  return Object.keys(this.generators);
};

// Get a single generator from the registered list of generators. The lookup is
// based on generator's namespace, "walking up" the namespaces until a matching
// is found. eg. if an `angular:common` namespace is registered, and we try to
// get `angular:common:all` then we get `angular:common` as a fallback (unless
// an `angular:common:all` generator is registered)
//
// - namespace - A String matching the namespace of the generator.
//
// Returns the generator (constructor or raw function) or undefined.
Environment.prototype.get = function get(namespace) {
  if (!namespace) {
    return;
  }

  var generator = this.generators[namespace];
  if (generator) {
    return generator;
  }

  var alias = this.alias(namespace);
  generator = this.generators[alias];
  if (generator) {
    return generator;
  }

  return this.get(namespace.split(':').slice(0, -1).join(':'));
};

// Create is the Generator factory. It takes a namespace to lookup and optional
// hash of options, that lets you define `arguments` and `options` to
// instantiate the generator with.
//
// - namespace    - A string matching the namespace to lookup.
// - options      - An optional hash object with:
//    - arguments - The list of arguments (usually CLI args)
//    - options   - Hash of options (usually CLI options)
//
// An error is raised on invalid namespace.
//
// Returns the generator instance.
Environment.prototype.create = function create(namespace, options) {
  options = options || {};

  var names = namespace.split(':');
  var name = names.slice(-1)[0];

  var generator = this.get(namespace);

  var args = options.arguments || options.args || this.arguments;
  args = Array.isArray(args) ? args : args.split(' ');

  var opts = options.options || _.clone(this.options);

  if (!generator) {
    return this.error(
      new Error(
        'You don\'t seem to have a generator with the name ' + namespace + ' installed.\n' +
        'You can see available generators with ' + 'npm search yeoman-generator'.bold +
        ' and then install them with ' + 'npm install [name]'.bold + '.\n' +
        'To see the ' + this.namespaces().length + ' registered generators run yo with the `--help` option.'
      )
    );
  }

  // case of raw functions, we create a brand new Base object and attach this
  // raw function as one of the prototype method.  This effectively standardize
  // the interface for running Generators, while allowing less boilerplate for
  // generators authors.
  var Generator = generator;
  if (generator.raw) {
    Generator = function () {
      Base.apply(this, arguments);
    };
    util.inherits(Generator, Base);
    Generator.prototype.exec = generator;
  }

  opts.env = this;
  opts.name = name;
  opts.resolved = generator.resolved;
  return new Generator(args, opts);
};

// Tries to locate and run a specific generator. The lookup is done depending
// on the provided arguments, options and the list of registered generators.
//
// - arguments - A space-separated String or Array of arguments.
// - options   - (optional) An Hash object of options.
// - done      - (optional) A Function to call on completion, eg. when the generator and
//               all its hooks are done.
//
// When the environment was unable to resolve a generator, an error is raised.
//
// Returns the resolved generator.
Environment.prototype.run = function run(args, options, done) {
  args = args || this.arguments;

  if (typeof options === 'function') {
    done = options;
    options = this.options;
  }

  if (typeof args === 'function') {
    done = args;
    options = this.options;
    args = this.arguments;
  }

  args = Array.isArray(args) ? args : args.split(' ');
  options = options || this.options;

  var name = args.shift();
  if (!name) {
    return this.error(new Error('Must provide at least one argument, the generator namespace to invoke.'));
  }

  // is it a remote? Any generator with a `/` in it is considered
  // potential remote, and we simply proxy over `npm install` command to get
  // the generator locally.
  if (/\//.test(name)) {
    return this.remote(name, done);
  }

  var generator = this.create(name, {
    args: args,
    options: options
  });

  if (typeof done === 'function') {
    generator.on('end', done);
  }

  if (options.help) {
    return console.log(generator.help());
  }

  generator.on('start', this.emit.bind(this, 'generators:start'));
  generator.on('start', this.emit.bind(this, name + ':start'));

  var self = this;
  generator.on('method', function (method) {
    self.emit(name + ':' + method);
  });

  generator.on('end', this.emit.bind(this, name + ':end'));
  generator.on('end', this.emit.bind(this, 'generators:end'));

  return generator.run();
};

// Receives namespaces in an array and tries to find matching generators in the
// load paths.
//
// We lookup namespaces in several places, namely `this.lookups`
// list of relatives directory path. A `generator-` prefix is added if a
// namespace wasn't require()-able directly, matching `generator-*` kind of
// pattern in npm installed package.
//
// You can also lookup using glob-like star pattern, eg. `angular:*` gets
// expanded to `angular/*/index.js`.
//
// The default alias `generator-$1` lookup is added automatically.
//
// - namespaces - A single namespace or an Array of namespaces to look for.
// - basedir    - The base directory to work from (defaults: cwd)
//
// Examples
//
//    // search for all angular generators in the load path
//    env.lookup('angular:*');
//
//    // register any valid set of generator in the load paths
//    env.lookup('*:*');
//
// Returns the environment.
Environment.prototype.lookup = function lookup(namespaces, lookupdir) {
  namespaces = Array.isArray(namespaces) ? namespaces : namespaces.split(' ');

  debug('Lookup %s', namespaces);
  namespaces.forEach(function (ns) {
    var filepath = path.join.apply(path, this.alias(ns).split(':'));

    this.paths.forEach(function (base) {
      debug('Looking in %s with filepath %s', base, filepath);

      // no glob pattern
      if (!~filepath.indexOf('*')) {
        try {
          debug('Attempt to register with direct filepath %s', filepath);
          this.register(filepath);
        } catch (e) {
          // silent fail unless not a loadpath error
          if (e.message.indexOf(filepath) === -1) {
            console.error('Unable to register %s (Error: %s)', ns, e.message);
          }
        }

        return;
      }

      this.lookups.forEach(function (lookupdir) {
        var depth = lookupdir && /^\.\/?$/.test(lookupdir) ? '*' : '**';

        var prefixes = this._prefixes.filter(function (prefix) {
          return !(/\//).test(prefix);
        });

        var pattern = filepath
          .replace(/^\*+/, '+(' + prefixes.join('|') + ')*')
          .replace(/\*+$/g, path.join(lookupdir, depth, 'index.js'))
          .replace(/^\*\//, '');

        debug('Globing for generator %s with pattern %s (cwd: %s)', ns, pattern, base);
        glob.sync(pattern, { cwd: base }).forEach(function (filename) {
          // now register, warn on failed require
          try {
            debug('found %s, trying to register', filename);
            this.register(path.resolve(base, filename));
          } catch (e) {
            console.error('Unable to register %s (Error: %s)', filename, e.message);
          }
        }, this);
      }, this);
    }, this);
  }, this);

  return this;
};

// Get or create an alias.
//
// Alias allows the `get()` and `lookup()` methods to search in alternate
// filepath for a given namespaces. It's used for example to map `generator-*`
// npm package to their namespace equivalent (without the generator- prefix),
// or to default a single namespace like `angular` to `angular:app` or
// `angular:all`.
//
// Given a single argument, this method acts as a getter. When both name and
// value are provided, acts as a setter and registers that new alias.
//
// If multiple alias are defined, then the replacement is recursive, replacing
// each alias in reverse order.
//
// An alias can be a single String or a Regular Expression. The finding is done
// based on .match().
//
// - match - A String or RegExp for pattern match
// - value - The String replacement value
//
// Examples
//
//    env.alias(/^([a-zA-Z0-9:\*]+)$/, 'generator-$1');
//    env.alias(/^([^:]+)$/, '$1:app');
//    env.alias(/^([^:]+)$/, '$1:all');
//    env.alias('foo');
//    // => generator-foo:all
//
// Returns the environment when acing as a setter, or the alias result for getter.
Environment.prototype.alias = function alias(match, value) {
  if (match && value) {
    this.aliases.push({
      match: match instanceof RegExp ? match : new RegExp('^' + match + '$'),
      value: value
    });
    return this;
  }

  var aliases = this.aliases.slice(0).reverse();

  var matcher = aliases.filter(function (alias) {
    return alias.match.test(match);
  });

  return aliases.reduce(function (res, alias) {
    if (!alias.match.test(res)) {
      return res;
    }

    return res.replace(alias.match, alias.value);
  }, match);
};

// Given a String `filepath`, tries to figure out the relative
// namespace.
//
// Examples
//
//    this.namespace('backbone/all/index.js');
//    // => backbone:all
//
//    this.namespace('generator-backbone/model');
//    // => backbone:model
//
//    this.namespace('backbone.js');
//    // => backbone
//
//
//    this.namespace('generator-mocha/backbone/model/index.js');
//    // => mocha:backbone:model
//
// Returns the resolved namespace
Environment.prototype.namespace = function namespace(filepath) {
  if (!filepath) {
    throw new Error('Missing namespace');
  }

  var self = this;

  // cleanup extension and normalize path for differents OS
  var ns = path.normalize(filepath.replace(path.extname(filepath), ''));

  // Extend every lookups folders with searchable file system paths
  var lookups = _(this.lookups).map(function (lookup) {
    return _.map(self.paths, function (filepath) {
      return path.join(filepath, lookup);
    });
  }).flatten().sortBy('length').value().reverse();

  // If `ns` contain a lookup dir in it's path, remove it.
  ns = lookups.reduce(function (ns, lookup) {
    return ns.replace(lookup, '');
  }, ns);

  // Cleanup `ns` from unwanted parts and then normalize slashes to `:`
  ns = ns
    .replace(/[\/\\]?node_modules[\/\\]?/, '') // remove `/node_modules/`
    .replace(/[\/\\](index|main)$/, '') // remove `/index` or `/main`
    .replace(/\.+/g, '') // remove `.`
    .replace(/^[\/\\]+/, '') // remove leading `/`
    .replace(/[\/\\]+/g, ':'); // replace slashes by `:`

  // if we still have prefix match at this point, then remove anything before
  // that match, this would catch symlinked package with a name begining with
  // `generator-*` (one of the configured prefix)
  ns = this._prefixes.reduce(function (ns, prefix) {
    var pos = ns.lastIndexOf(prefix);

    if (pos < 0) {
      return ns;
    }

    return ns.slice(pos + prefix.length);
  }, ns);

  debug('Resolve namespaces for %s: %s', filepath, ns);

  return ns;
};


// Adds the namespace prefix to this environment, such as `generator-*`,
// used when resolving namespace, replacing the leading `*` in the
// namespace by the configured prefix(es).
//
// Examples
//
//    this.prefix('generator-')
//
// Returns the environment
Environment.prototype.prefix = function _prefix(prefix) {
  if (!prefix) {
    throw new Error('Missing prefix');
  }

  this._prefixes.push(prefix);
  this._prefixReg = new RegExp('^(' + this._prefixes.join('|') + ')');

  return this;
};


// Get or set the namespace suffix to this environment, such as `*/index.js`,
// used when resolving namespace, replacing the last `*` in the
// namespace by the configured suffix.
//
// Examples
//
//    this.suffix('*/index.js')
//    this.suffix();
//    // => '*/index.js'
//
// Returns the environment
Environment.prototype.suffix = function _suffix(suffix) {
  this._suffix = this._suffix || '';

  if (!suffix) {
    return this._suffix;
  }

  this._suffix = suffix;
  return this;
};


// Walk up the filesystem looking for a `node_modules` folder, and add it if
// found to the load path.
//
// - filename   - The base filename to look for when walking up the file
//                system. Defaults to `node_modules`.
// - basedir    - The base directory to look for when walking up the file
//                system. Defaults to `process.cwd()`
Environment.prototype.plugins = function plugins(filename, basedir) {
  filename = filename || 'node_modules';
  basedir = basedir || process.cwd();

  var filepath = path.join(basedir, filename);

  if (fs.existsSync(filepath)) {
    this.appendPath(filepath);
    return this;
  }

  if (basedir === path.resolve('/')) {
    return this;
  }

  return this.plugins(filename, path.join(basedir, '..'));
};

// Install an npm package locally, expanding github like user/repo pattern to
// the remote tarball for master.
//
// It is taking care of potential remote packages (or local on the current file
// system) by delegating the groundwork of getting the package to npm.
//
// - name - The remote name to fetch from, that is simply passed to `npm install`
//
// Returns the environment.
Environment.prototype.remote = function remote(name, done) {
  var self = this;
  log.write().info('Installing remote package %s', name).write();
  var npm = spawn('npm', ['install', name, '--save-dev']);
  npm.stdout.pipe(process.stdout);
  npm.stderr.pipe(process.stderr);
  done = done || function () {};
  npm.on('exit', function (code) {
    if (code !== 0) {
      return self.error(new Error('Error initing from remote: ' + name + '. Code: ' + code));
    }

    log.ok('Installed %s package', name).write();
    log.info('You should see additional generators available').write()
    .write(self.help()).write();
    done();
  });
};
