var util = require('util');
var Base = require('./base');

// The `NamedBase` object is only dealing with one argument: `name`.
//
// You can use it whenever you need at least one **required** positional
// argument for your generator (which is a fairly common use case)
//
// - args - A String or Array of arguments to init the generator with.
// - opts - A Hash of options to init the generator with.
function NamedBase(args, options) {
  Base.apply(this, arguments);
  this.argument('name', { type: String, required: true });
}

util.inherits(NamedBase, Base);
module.exports = NamedBase;
