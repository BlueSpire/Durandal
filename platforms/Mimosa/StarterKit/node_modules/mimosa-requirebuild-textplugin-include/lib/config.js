"use strict";exports.defaults = function() {
  return {
    requireBuildTextPluginInclude: {
      folder: "",
      pluginPath: "vendor/text",
      extensions: ["html"]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # requireBuildTextPluginInclude:\n    # folder: \"\"                       # A subdirectory of the javascriptDir used to narrow\n                                       # down the location of included files.\n    # pluginPath: \"vendor/text\"        # AMD path to the text plugin\n    # extensions: [\"html\"]             # A list of extensions for files to include in the r.js\n                                       # config's 'include' array attached to the text plugin\n                                       # path listed above.  Ex: vendor/text!app/foo.html\n                                       # All files in the folder that match this\n                                       # extension will be pushed into the array and already\n                                       # present array entries will be left alone. Extensions\n                                       # should not include the period.\n";
};

exports.validate = function(config, validators) {
  var errors;

  errors = [];
  if (validators.ifExistsIsObject(errors, "requireBuildTextPluginInclude config", config.requireBuildTextPluginInclude)) {
    validators.stringMustExist(errors, "requireBuildTextPluginInclude.pluginPath", config.requireBuildTextPluginInclude.pluginPath);
    validators.stringMustExist(errors, "requireBuildTextPluginInclude.folder", config.requireBuildTextPluginInclude.folder);
    validators.isArrayOfStringsMustExist(errors, "requireBuildTextPluginInclude.extensions", config.requireBuildTextPluginInclude.extensions);
  }
  return errors;
};
