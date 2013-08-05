'use strict';

var inquirer = require('inquirer');

// Prompt for user input based on the given Array of `prompts` to perform in
// series, and call `done` callback on completion.
//
// Options can be any prompt's option: https://github.com/SBoudrias/Inquirer.js
//
// - prompts    - an Array of Hash options.
// - done       - Callback to call on error or on completion.
//
// Returns the generator instance.
module.exports = function prompt() {
  inquirer.prompt.apply(inquirer, arguments);
  return this;
};
