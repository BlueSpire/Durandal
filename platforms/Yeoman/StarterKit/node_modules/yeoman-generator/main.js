process.logging = process.logging || require('./lib/util/log');

// The generator system is a framework for node to author reusable and
// composable Generators, for a vast majority of use-case.
//
// Inspired and based off the work done on Thor and Rails 3 Generators, we try
// to provide the same kind of infrastructure.
//
//    var generators = require('yeoman-generators');
//
//    var env = generators('angular:model')
//      .run(function(err) {
//        console.log('done!');
//      });
//
// Generators are registered by namespace, where namespaces are mapping the
// structure of the file system with `:` being simply converted to `/`.
//
// Generators are standard node modules, they are simply required as usual, and
// they can be shipped into reusable npm packages.
//
// The lookup is done depending on the configured load path, which is by
// default `lib/generators` in every generators package installed (ie.
// node_modules/yeoman-backbone/lib/generators)

var Environment = require('./lib/env');

var generators = module.exports = function createEnv(args, opts) {
  return new Environment(args, opts);
};

// hoist up top level class the generator extend
generators.Base = require('./lib/base');
generators.NamedBase = require('./lib/named-base');

// expose test helpers for generators.
generators.test = require('./lib/test/helpers');

// backward compat, make them available as generators.generators.Base &
// NamedBase (as most of generators use yeoman.generators.Stuff)
generators.generators = {};
generators.generators.Base = generators.Base;
generators.generators.NamedBase = generators.NamedBase;
