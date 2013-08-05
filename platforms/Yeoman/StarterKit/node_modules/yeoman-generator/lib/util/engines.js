var _ = require('lodash');

// TODO(mklabs):
// - handle cache
// - implement adpaters for others engines (but do not add hard deps on them,
// should require manual install for anything that is not an underscore
// template)
// - put in multiple files, possibly other packages.

// engines
var engines = module.exports;


// Underscore
// ----------

// Underscore templates facade.
//
// Special kind of markers `<%%` for opening tags can be used to escape the
// placeholder opening tag. This is often useful for templates including
// snippet of templates you don't want to be interpolated.

var matcher = /<%%([^%]+)%>/g;
var detecter = /<%%?[^%]+%>/;
engines.underscore = function underscore(source, data) {
  source = source.replace(matcher, function (m, content) {
    // let's add some funny markers to replace back when templating is done,
    // should be fancy enough to reduce frictions with files using markers like
    // this already.
    return '(;>%%<;)' + content + '(;>%<;)';
  });

  source = _.template(source)(data);

  source = source
    .replace(/\(;>%%<;\)/g, '<%')
    .replace(/\(;>%<;\)/g, '%>');

  return source;
};

engines.underscore.detect = function detect(body) {
  return detecter.test(body);
};
