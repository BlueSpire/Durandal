var util = require('util');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

// Exposes convenience methods for wiring up markup with scripts,
// stylesheets and other types of dependencies.
var wiring = module.exports;

// Update a file containing HTML markup with new content, either
// appending, prepending or replacing content matching a particular
// selector
//
// - html     - a string containing HTML markup
// - tagName  - a valid CSS selector
// - content  - the inline content to update your selector with
// - mode     - a(ppend), p(repend), r(eplace), d(elete)
//
wiring.domUpdate = function domUpdate(html, tagName, content, mode) {
  var $ = cheerio.load(html);

  if (content !== undefined) {
    if (mode === 'a') {
      $(tagName).append(content);
    } else if (mode === 'p') {
      $(tagName).prepend(content);
    } else if (mode === 'r') {
      $(tagName).html(content);
    } else if (mode === 'd') {
      $(tagName).remove();
    }
    return $.html();
  } else {
    console.error('Please supply valid content to be updated.');
  }
};

// Insert specific content as the last child of each element matched
// by the tagName selector. Returns a string.
wiring.append = function append(html, tagName, content) {
  return this.domUpdate(html, tagName, content, 'a');
};

// Insert specific content as the first child of each element matched
// by the tagName selector. Returns a string.
wiring.prepend = function prepend(html, tagName, content) {
  return this.domUpdate(html, tagName, content, 'p');
};

// Insert specific content as the last child of each element matched
// by the tagName selector. Writes to file.
wiring.appendToFile = function appendToFile(path, tagName, content) {
  var html = this.readFileAsString(path);
  var updatedContent = this.append(html, tagName, content);
  this.writeFileFromString(path, updatedContent);
};

// Insert specific content as the first child of each element matched
// by the tagName selector. Writes to file.
wiring.prependToFile = function prependToFile(path, tagName, content) {
  var html = this.readFileAsString(path);
  var updatedContent = this.prepend(html, tagName, content);
  this.writeFileFromString(path, updatedContent);
};

// Generate a usemin-handler block.
//
// - blockType      - js, css
// - optimizedPath  - the final file to build
// - filesBlock     - a string containing populated script/style tags ready to be
//                    injected into a usemin block.
// - searchPath     - either a single string, specifying an alternate search
//                    path to look in for files, or an array of strings.
//
// Returns the new block.
wiring.generateBlock = function generateBlock(blockType, optimizedPath, filesBlock, searchPath) {
  var blockStart, blockEnd;
  var blockSearchPath = '';

  if (searchPath !== undefined) {
    if (util.isArray(searchPath)) {
      searchPath = '{' + searchPath.join(',') + '}';
    }
    blockSearchPath = '(' + searchPath +  ')';
  }

  blockStart = '\n        <!-- build:' + blockType + blockSearchPath + ' ' + optimizedPath + ' -->\n';
  blockEnd = '        <!-- endbuild -->\n';
  return blockStart + filesBlock + blockEnd;
};

// Append files, specifying the optimized path and generating the necessary
// usemin blocks to be used for the build process. In the case of scripts and
// styles, boilerplate script/stylesheet tags are written for you.
//
// - htmlOrOptions  - string to append the files to or an object of this and
//                    the remaining options
// - fileType       - js (appends to the end of 'body'), css (appends to the
//                    end of 'head')
// - optimizedPath  - the final file to build
// - sourceFileList - the list of files to be appended. We check against the
//                    fileType to ensure the correct tags are wrapped around
//                    them and the right usemin blocks generated.
// - attrs          - A Hash of html attributes to generate along the generated
//                    script / link tags
// - searchPath     - an alternate path to look in for files
//
// Returns updated content.
wiring.appendFiles = function appendFiles(htmlOrOptions, fileType, optimizedPath, sourceFileList, attrs, searchPath) {
  var blocks, updatedContent;
  var html = htmlOrOptions;
  var files = '';

  if (typeof htmlOrOptions === 'object') {
    html = htmlOrOptions.html;
    fileType = htmlOrOptions.fileType;
    optimizedPath = htmlOrOptions.optimizedPath;
    sourceFileList = htmlOrOptions.sourceFileList;
    attrs = htmlOrOptions.attrs;
    searchPath = htmlOrOptions.searchPath;
  }

  attrs = this.attributes(attrs);

  if (fileType === 'js') {
    sourceFileList.forEach(function (el) {
      files += '        <script ' + attrs + ' src="' + el + '"></script>\n';
    });
    blocks = this.generateBlock('js', optimizedPath, files, searchPath);
    updatedContent = this.append(html, 'body', blocks);
  } else if (fileType === 'css') {
    sourceFileList.forEach(function (el) {
      files += '        <link ' + attrs + ' rel="stylesheet" href="' + el  + '">\n';
    });
    blocks = this.generateBlock('css', optimizedPath, files, searchPath);
    updatedContent = this.append(html, 'head', blocks);
  }

  // cleanup trailing whitespace
  return updatedContent.replace(/[\t ]+$/gm, '');
};

// Computes a given Hash object of attributes into its HTML representation
//
// - attrs  - Hash object of attributes to generate
//
// Returns the generated string of attributes.
wiring.attributes = function attributes(attrs) {
  return Object.keys(attrs || {}).map(function (key) {
    return key + '="' + attrs[key] + '"';
  }).join(' ');
};

// Scripts alias to appendFiles
wiring.appendScripts = function appendScripts(html, optimizedPath, sourceFileList, attrs) {
  return this.appendFiles(html, 'js', optimizedPath, sourceFileList, attrs);
};

// Simple script removal
wiring.removeScript = function removeScript(html, scriptPath) {
  return this.domUpdate(html, 'script[src$="' + scriptPath + '"]', '', 'd');
};

// Style alias to appendFiles
wiring.appendStyles = function appendStyles(html, optimizedPath, sourceFileList, attrs) {
  return this.appendFiles(html, 'css', optimizedPath, sourceFileList, attrs);
};

// Simple style removal
wiring.removeStyle = function removeStyle(html, path) {
  return this.domUpdate(html, 'link[href$="' + path + '"]', '', 'd');
};

// Append a directory of scripts
wiring.appendScriptsDir = function appendScriptsDir(html, optimizedPath, sourceScriptDir, attrs) {
  var sourceScriptList = fs.readdirSync(path.resolve(sourceScriptDir));
  return this.appendFiles(html, 'js', optimizedPath, sourceScriptList, attrs);
};

// Append a directory of stylesheets
wiring.appendStylesDir = function appendStylesDir(html, optimizedPath, sourceStyleDir, attrs) {
  var sourceStyleList = fs.readdirSync(path.resolve(sourceStyleDir));
  return this.appendFiles(html, 'css', optimizedPath, sourceStyleList, attrs);
};

// Read in the contents of a resolved file path as a string
wiring.readFileAsString = function readFileAsString(filePath) {
  return fs.readFileSync(path.resolve(filePath), 'utf8');
};

// Write the content of a string to a resolved file path
wiring.writeFileFromString = function writeFileFromString(html, filePath) {
  fs.writeFileSync(path.resolve(filePath), html, 'utf8');
};
