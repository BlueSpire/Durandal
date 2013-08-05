var logger = process.logging || require('./log');

var fs = require('fs');
var path = require('path');
var events = require('events');
var diff = require('diff');
var prompt = require('../actions/prompt');
var log = logger('conflicter');
var async = require('async');

var conflicter = module.exports = Object.create(events.EventEmitter.prototype);

conflicter.conflicts = [];

conflicter.add = function add(conflict) {
  if (typeof conflict === 'string') {
    conflict = {
      file: conflict,
      content: fs.readFileSync(conflict, 'utf8')
    };
  }

  if (!conflict.file) {
    throw new Error('Missing conflict.file option');
  }

  if (conflict.content === undefined) {
    throw new Error('Missing conflict.content option');
  }

  this.conflicts.push(conflict);
  return this;
};

conflicter.reset = function reset() {
  this.conflicts = [];
  return this;
};

conflicter.pop = function pop() {
  return this.conflicts.pop();
};

conflicter.shift = function shift() {
  return this.conflicts.shift();
};

conflicter.resolve = function resolve(cb) {
  var resolveConflicts = function (conflict) {
    return function (next) {
      if (!conflict) {
        return next();
      }

      conflicter.collision(conflict.file, conflict.content, function (status) {
        conflicter.emit('resolved:' + conflict.file, {
          status: status,
          callback: next
        });
      });
    };
  };

  async.series(this.conflicts.map(resolveConflicts), function (err) {
    if (err) {
      cb();
      return self.emit('error', err);
    }

    conflicter.reset();
    cb();
  }.bind(this));
};

conflicter._ask = function (filepath, content, cb) {
  // for this particular use case, might use prompt module directly to avoid
  // the additional "Are you sure?" prompt

  var self = this;

  var config = [{
    type: 'list',
    message: 'Overwrite ' + filepath + '?',
    choices: [{
      name: 'overwrite',
      value: function (cb) {
        log.force(filepath);
        return cb('force');
      }
    }, {
      name: 'do not overwrite',
      value: function (cb) {
        log.skip(filepath);
        return cb('skip');
      }
    }, {
      name: 'overwrite this and all others',
      value: function (cb) {
        log.force(filepath);
        self.force = true;
        return cb('force');
      }
    }, {
      name: 'abort',
      value: function (cb) {
        log.writeln('Aborting ...');
        return process.exit(0);
      }
    }, {
      name: 'show the differences between the old and the new',
      value: function (cb) {
        console.log(conflicter.diff(fs.readFileSync(filepath, 'utf8'), content));
        return self._ask(filepath, content, cb);
      }
    }],
    name: 'overwrite'
  }];

  process.nextTick(function () {
    this.emit('prompt', config);
    this.emit('conflict', filepath);
  }.bind(this));

  prompt(config, function (result) {
    result.overwrite(function (action) {
      cb(action);
    });
  });
};

conflicter.collision = function collision(filepath, content, cb) {
  var self = this;

  if (!fs.existsSync(filepath)) {
    log.create(filepath);
    return cb('create');
  }

  // TODO(mklabs): handle non utf8 file (images, etc.) and compare mtime instead,
  // something like that.
  var actual = fs.readFileSync(path.resolve(filepath), 'utf8');
  if (actual === content) {
    log.identical(filepath);
    return cb('identical');
  }

  if (self.force) {
    log.force(filepath);
    return cb('force');
  }

  log.conflict(filepath);
  conflicter._ask(filepath, content, cb);
};

// below is borrowed code from visionmedia's excellent mocha (and its reporter)

conflicter.colors = {
  'diff added': 42,
  'diff removed': 41
};

conflicter.diff = function _diff(actual, expected) {
  var msg = diff.diffLines(actual, expected).map(function (str) {
    if (str.added) {
      return conflicter.colorLines('diff added', str.value);
    }

    if (str.removed) {
      return conflicter.colorLines('diff removed', str.value);
    }

    return str.value;
  }).join('');

  // legend
  msg = '\n' +
    conflicter.color('diff removed', 'removed') +
    ' ' +
    conflicter.color('diff added', 'added') +
    '\n\n' +
    msg +
    '\n';

  return msg;
};

conflicter.color = function (type, str) {
  return '\u001b[' + conflicter.colors[type] + 'm' + str + '\u001b[0m';
};

conflicter.colorLines = function colorLines(name, str) {
  return str.split('\n').map(function (str) {
    return conflicter.color(name, str);
  }).join('\n');
};
