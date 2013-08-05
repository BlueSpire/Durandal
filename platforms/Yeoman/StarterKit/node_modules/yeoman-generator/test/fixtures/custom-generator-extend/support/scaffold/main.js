
// in real use case, users need to require `yeoman-generators`
// var generators = require('yeoman-generators');
var generators = require('../../../../../');
var util = require('util');

var Generator = module.exports = function Generator(args, options) {
  generators.NamedBase.apply(this, arguments);
  // arguments === this.arguments
  // options === this.options
};

// namespace
// Generator.namespace = 'custom-generator-extend';

util.inherits(Generator, generators.NamedBase);
