"use strict";
var config, fs, path, registration, windowsDrive, wrench, __determinePath, _appendFilesToInclude,
  __slice = [].slice;

path = require('path');

fs = require('fs');

wrench = require("wrench");

config = require('./config');

windowsDrive = /^[A-Za-z]:\\/;

registration = function(mimosaConfig, register) {
  var e;

  if (mimosaConfig.isOptimize) {
    e = mimosaConfig.extensions;
    register(['add', 'update', 'remove'], 'beforeOptimize', _appendFilesToInclude, __slice.call(e.javascript).concat(__slice.call(e.template)));
    return register(['postBuild'], 'beforeOptimize', _appendFilesToInclude);
  }
};

_appendFilesToInclude = function(mimosaConfig, options, next) {
  var hasExtensions, hasRunConfigs, _ref;

  hasRunConfigs = ((_ref = options.runConfigs) != null ? _ref.length : void 0) > 0;
  if (!hasRunConfigs) {
    return next();
  }
  hasExtensions = mimosaConfig.requireBuildTextPluginInclude.extensions.length > 0;
  if (!hasExtensions) {
    return next();
  }
  options.runConfigs.forEach(function(runConfig) {
    var files, includeFolder;

    includeFolder = __determinePath(mimosaConfig.requireBuildTextPluginInclude.folder, runConfig.baseUrl);
    files = wrench.readdirSyncRecursive(includeFolder);
    files = files.map(function(file) {
      return path.join(includeFolder, file);
    }).filter(function(file) {
      return fs.statSync(file).isFile();
    });
    return files.forEach(function(file) {
      var ext, fileAMD;

      ext = path.extname(file).substring(1);
      if (mimosaConfig.requireBuildTextPluginInclude.extensions.indexOf(ext) > -1) {
        fileAMD = (file.replace(runConfig.baseUrl, '').substring(1)).replace(/\\/g, "/");
        return runConfig.include.push("" + mimosaConfig.requireBuildTextPluginInclude.pluginPath + "!" + fileAMD);
      }
    });
  });
  return next();
};

__determinePath = function(thePath, relativeTo) {
  if (windowsDrive.test(thePath)) {
    return thePath;
  }
  if (thePath.indexOf("/") === 0) {
    return thePath;
  }
  return path.join(relativeTo, thePath);
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
