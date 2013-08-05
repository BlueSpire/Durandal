var _ = require('lodash');
_.str = require('underscore.string');

// Mix in non-conflicting functions to Underscore namespace and
// Generators.
//
// Examples
//
//    this._.humanize('stuff-dash')
//    this._.classify('hello-model');
//
_.mixin(_.str.exports());

// and expose that
module.exports._ = _;
