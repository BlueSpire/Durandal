"use strict";
var logger;

logger = require('logmimosa');

exports.defaults = function() {
  return {
    combine: {
      folders: [],
      removeCombined: {
        enabled: true,
        exclude: []
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # combine:\n    # folders: []      # Configuration for folder combining.  See\n                       # https://github.com/dbashford/mimosa-combine for details on how to set up\n                       # entries in the folders array\n    # removeCombined:  # configuration for removing combined files\n      # enabled:true   # when set to true, during 'mimosa build' only, mimosa-combine will remove\n                       # the files that were merged into single files\n      # exclude:[]     # mimosa-combine will not remove any of these files.\n";
};

exports.validate = function(config, validators) {
  var combine, combines, defaults, errorStart, errors, key, _i, _len;
  errors = [];
  errorStart = "combine.folders";
  if (Array.isArray(config.combine)) {
    logger.warn("You are using a deprecated configuration for mimosa-combine, which is, for now, still supported.\nIn 0.11.0 support for combine:[] will be removed. The new config takes the form: " + (exports.placeholder()) + "\nwhere combine.folders:[] is the old combine:[].\n");
    combines = config.combine;
    config.combine = {};
    defaults = exports.defaults();
    for (key in defaults.combine) {
      config.combine[key] = defaults.combine[key];
    }
    config.combine.folders = combines;
    config.combine.removeCombined.enabled = false;
    errorStart = "combine";
  }
  if (validators.ifExistsIsObject(errors, "combine", config.combine)) {
    combines = config.combine.folders;
    if (validators.ifExistsIsArray(errors, errorStart, combines)) {
      for (_i = 0, _len = combines.length; _i < _len; _i++) {
        combine = combines[_i];
        if (typeof combine === "object" && !Array.isArray(combine)) {
          if (combine.folder != null) {
            combine.folder = validators.multiPathNeedNotExist(errors, "" + errorStart + ".folder", combine.folder, config.watch.compiledDir);
          } else {
            errors.push("" + errorStart + " entries must have folder property.");
          }
          if (combine.output != null) {
            combine.output = validators.multiPathNeedNotExist(errors, "combine.output", combine.output, config.watch.compiledDir);
          } else {
            errors.push("" + errorStart + " entries must have output property.");
          }
          if (errors.length > 0) {
            continue;
          }
          validators.ifExistsArrayOfMultiPaths(errors, "" + errorStart + ".order", combine.order, combine.folder);
          validators.ifExistsFileExcludeWithRegexAndString(errors, "" + errorStart + ".exclude", combine, combine.folder);
        } else {
          errors.push("" + errorStart + " must be an array of objects.");
        }
      }
    }
    if (validators.ifExistsIsObject(errors, "combine.removeCombined", config.combine.removeCombined)) {
      validators.ifExistsIsBoolean(errors, "combine.removeCombined.enabled", config.combine.removeCombined.enabled);
      validators.ifExistsFileExcludeWithRegexAndString(errors, "combine.removeCombined.exclude", config.combine.removeCombined, config.watch.compiledDir);
    }
  }
  return errors;
};
