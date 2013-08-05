var fs = require('fs');
var tar = require('tar');
var path = require('path');
var zlib = require('zlib');
var request = require('request');

var fetch = module.exports;

// Check if we're behind some kind of proxy.

var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// Download a single file at the given destination.
fetch.fetch = function _fetch(url, destination, cb) {
  this.mkdir(path.dirname(destination));

  var log = this.log('... Fetching %s ...', url);

  fetch.request(url)
    .on('error', cb)
    .on('data', function () {
      log.write('.');
    })
    .pipe(fs.createWriteStream(destination))
    .on('error', cb)
    .on('close', function () {
      log.write('Writing ' + destination + '...');
    })
    .on('close', cb);
};


// heavily based on npm's util/untar.js file
fetch.tarball = function _tarball(tarball, target, cb) {
  var now = Date.now();

  var log = this.log.write()
    .info('... Fetching %s ...', tarball)
    .info('This might take a few moments'.yellow);

  var extractOpts = { type: 'Directory', path: target, strip: 1 };
  var req = fetch.request.get(tarball).on('error', cb);

  req.on('data', function () {
    log.write('.');
  }).on('end', function () {
    log.write().ok('Done in ' + (Date.now() - now) / 1000 + 's.');
  });

  req
    .pipe(zlib.Unzip())
    .on('error', function (err) {
      console.error('unzip error', err);
      cb(err);
    })
    .pipe(tar.Extract(extractOpts))
    .on('entry', function (entry) {
      entry.props.uid = entry.uid = 501;
      entry.props.gid = entry.gid = 20;
    })
    .on('error', function (err) {
      console.error('untar error', err);
      cb(err);
    })
    .on('close', function () {
      log.ok('Done in ' + extractOpts.path).write();
      cb();
    });
};

// re-expose the request with proxy defaults, so that we can
// reuse this instance of request.
fetch.request = request.defaults({ proxy: proxy });
