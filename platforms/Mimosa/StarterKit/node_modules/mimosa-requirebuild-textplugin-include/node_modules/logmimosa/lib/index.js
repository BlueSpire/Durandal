var Logger, color, growl,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

color = require('ansi-color').set;

growl = require('growl');

require('date-utils');

Logger = (function() {
  function Logger() {
    this.success = __bind(this.success, this);
    this.debug = __bind(this.debug, this);
    this.fatal = __bind(this.fatal, this);
    this.info = __bind(this.info, this);
    this.warn = __bind(this.warn, this);
    this.error = __bind(this.error, this);
    this.red = __bind(this.red, this);
    this.green = __bind(this.green, this);
    this.blue = __bind(this.blue, this);
    this.buildDone = __bind(this.buildDone, this);
  }

  Logger.prototype.isDebug = false;

  Logger.prototype.isStartup = true;

  Logger.prototype.setDebug = function(isDebug) {
    this.isDebug = isDebug != null ? isDebug : true;
  };

  Logger.prototype.setConfig = function(config) {
    return this.config = config.growl;
  };

  Logger.prototype.buildDone = function(isStartup) {
    this.isStartup = isStartup != null ? isStartup : false;
  };

  Logger.prototype._log = function(logLevel, messages, color, growlTitle) {
    var growlMessage, imageUrl;

    if (growlTitle == null) {
      growlTitle = null;
    }
    if (growlTitle != null) {
      imageUrl = (function() {
        switch (logLevel) {
          case 'success':
            return "" + __dirname + "/assets/success.png";
          case 'error':
            return "" + __dirname + "/assets/failed.png";
          case 'fatal':
            return "" + __dirname + "/assets/failed.png";
          default:
            return '';
        }
      })();
      growlMessage = messages.join(",").replace(/\n/g, '');
      growl(growlMessage, {
        title: growlTitle,
        image: imageUrl
      });
    }
    messages = this._wrap(messages, color);
    if (logLevel === 'error' || logLevel === 'warn' || logLevel === 'fatal') {
      return console.error.apply(console, messages);
    } else {
      return console.log.apply(console, messages);
    }
  };

  Logger.prototype._wrap = function(messages, textColor) {
    messages[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + messages[0];
    return messages.map(function(message) {
      return color(message, textColor);
    });
  };

  Logger.prototype.blue = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    parms = parms.map(function(parm) {
      return color(parm, "blue+bold");
    });
    return console.log.apply(console, parms);
  };

  Logger.prototype.green = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    parms = parms.map(function(parm) {
      return color(parm, "green+bold");
    });
    return console.log.apply(console, parms);
  };

  Logger.prototype.red = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    parms = parms.map(function(parm) {
      return color(parm, "red+bold");
    });
    return console.log.apply(console, parms);
  };

  Logger.prototype.error = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('error', parms, 'red+bold', 'Error');
  };

  Logger.prototype.warn = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('warn', parms, 'yellow');
  };

  Logger.prototype.info = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    parms[0] = ("" + (new Date().toFormat('HH24:MI:SS')) + " - ") + parms[0];
    return console.log.apply(console, parms);
  };

  Logger.prototype.fatal = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    parms[0] = "FATAL: " + parms[0];
    return this._log('fatal', parms, 'red+bold+underline', "Fatal Error");
  };

  Logger.prototype.debug = function() {
    var parms;

    parms = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.isDebug || process.env.DEBUG) {
      return this._log('debug', parms, 'blue');
    }
  };

  Logger.prototype.success = function() {
    var options, parms, s, title, _i;

    parms = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
    if (parms.length === 0) {
      parms = [options];
    }
    title = options === true ? "Success" : this.config ? (s = this.config.onSuccess, this.isStartup && !this.config.onStartup ? null : !options || (options.isJavascript && s.javascript) || (options.isCSS && s.css) || (options.isTemplate && s.template) || (options.isCopy && s.copy) ? "Success" : null) : "Success";
    return this._log('success', parms, 'green+bold', title);
  };

  Logger.prototype.defaults = function() {
    return {
      growl: {
        onStartup: false,
        onSuccess: {
          javascript: true,
          css: true,
          template: true,
          copy: true
        }
      }
    };
  };

  Logger.prototype.placeholder = function() {
    return "\t\n\n  # growl:\n    # onStartup: false       # Controls whether or not to Growl when assets successfully\n                             # compile/copy on startup, If you've got 100 CoffeeScript files,\n                             # and you do a clean and then start watching, you'll get 100 Growl\n                             # notifications.  This is set to false by default to prevent that.\n                             # Growling for every successful file on startup can also cause\n                             # EMFILE issues. See watch.throttle\n    # onSuccess:             # Controls whether to Growl when assets successfully compile/copy\n      # javascript: true     # growl on successful compilation? will always send on failure\n      # css: true            # growl on successful compilation? will always send on failure\n      # template: true       # growl on successful compilation? will always send on failure\n      # copy: true           # growl on successful copy?";
  };

  Logger.prototype.validate = function(config) {
    var errors, succ, type, _i, _len, _ref;

    errors = [];
    if (config.growl != null) {
      if (typeof config.growl === "object" && !Array.isArray(config.growl)) {
        if (config.growl.onStartup != null) {
          if (typeof config.growl.onStartup !== "boolean") {
            errors.push("growl.onStartup must be boolean");
          }
        }
        if (config.growl.onSuccess != null) {
          succ = config.growl.onSuccess;
          if (typeof succ === "object" && !Array.isArray(succ)) {
            _ref = ["javascript", "css", "template", "copy"];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              type = _ref[_i];
              if (succ[type] != null) {
                if (typeof succ[type] !== "boolean") {
                  errors.push("growl.onSuccess." + type + " must be boolean.");
                }
              }
            }
          } else {
            errors.push("growl.onSuccess must be an object.");
          }
        }
      } else {
        errors.push("lint configuration must be an object.");
      }
    }
    return errors;
  };

  return Logger;

})();

module.exports = new Logger();
