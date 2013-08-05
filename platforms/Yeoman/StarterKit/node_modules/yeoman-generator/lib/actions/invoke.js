var path = require('path');

// Receives a `namespace`, and an Hash of `options` to invoke a given
// generator. The usual list of arguments can be set with `options.args`
// (ex. nopt's argv.remain array)
//
// It's used to `hookFor` another generator from within your generators.
//
// - namespace - The namespace value to look for.
// - options   - The Hash of options to invoke the generator with. See
//               `Environment#create` for the list of possible values.
//
// Returns the generator instance.
module.exports = function invoke(namespace, options, cb) {
  cb = cb || function () {};
  options = options || {};
  options.args = options.args || [];

  var generator = this.env.create(namespace, options);

  if (!generator.sourceRoot()) {
    generator.sourceRoot(path.join(path.dirname(generator.resolved), 'templates'));
  }

  // validate the generator (show help on missing argument / options)
  // also show help if --help was specifically passed

  var requiredArgs = generator._arguments.some(function (arg) {
    return arg.config && arg.config.required;
  });

  if (!options.args.length && requiredArgs) {
    return console.log(generator.help());
  }

  if (options.help) {
    return console.log(generator.help());
  }

  this.log.emit('up');
  this.log.invoke(namespace);
  this.log.emit('up');

  generator.on('end', this.log.emit.bind(this.log, 'down'));
  generator.on('end', this.log.emit.bind(this.log, 'down'));

  return generator.run(cb);
};
