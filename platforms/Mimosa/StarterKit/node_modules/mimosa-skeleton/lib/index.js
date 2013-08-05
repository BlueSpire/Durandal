"use strict";
var list, newSkeleton, search;

newSkeleton = require('./command/new');

list = require('./command/list');

search = require('./command/search');

exports.registerCommand = function(program) {
  newSkeleton(program);
  list(program);
  return search(program);
};
