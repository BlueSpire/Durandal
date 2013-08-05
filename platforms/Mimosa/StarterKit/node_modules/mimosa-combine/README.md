mimosa-combine
===========

## Overview

This is a Mimosa module for merging a folders contents into a single file. This is an external module and does not come by default with Mimosa.

For more information regarding Mimosa, see http://mimosajs.com

## Usage

Add `'combine'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

The `'combine'` module configuration contains an array of `folders` that configure what folders' contents to merge, in what order, and where to write the output.

By default, binary files, like images, are excluded from merging and this cannot be configured.  Other exclusions can be added via the config, as can an order to the files get added.

When `mimosa build` is used, by default mimosa-combine cleans up the files it uses to build the combined file.

When `mimosa clean` or `mimosa watch` with the `--clean` flag is run, the `combine` module will clean up the files it has written.

# Config

```coffeescript
  combine:
    folders: []
    removeCombined:
      enabled:true
      exclude:[]
```

# Example Config

```coffeescript
combine:
  folders: [                           # An array of folder combination details
    {
      folder:"stylesheets/vendor"      # The folder to combine into a single file. Path can
                                         # be relative to the watch config setting, or absolute.
      output:"stylesheets/vendor.css"  # The output file for the folder combination. Path can
                                         # be relative to the watch config setting, or absolute.
      exclude:null                     # An array of regexs or strings that match files to
                                         # exclude from matching. Can be a mix of regex and
                                         # strings. Strings should be a path relative to the
                                         # folder or absolute.
                                         # ex: [/\.txt$/, "vendor/jqueryui.js"], which would keep
                                         # all .txt files and jqueryui.js out of your combined
                                         # file.
      order:null                       # An array of paths to the files to place at the start
                                         # of the merged file.  You do not need to name every
                                         # file, just those whose order is important. Paths
                                         # can be relative to the 'folder' directory or absolute.
                                         # Paths should point at the compiled file. So foo.css,
                                         # not foo.less. Can be left off or made null if not
                                         # needed.
    }
  removeCombined:                     # configuration for removing combined files
    enabled:true                      # when set to true, during 'mimosa build' only, mimosa-combine will remove
                                      # the files that were merged into single files
    exclude:[]                        # mimosa-combine will not remove any of these files.
]

```

* `combine`: root for mimosa-config configuration
* `combine.folders`: array of folders to combine
* `combine.folders.folder`: a string, the path to the folder to combine. Path is relative to the watch config settings.  Path can also be absolute.
* `combine.folders.output`: a string, the path to the output file result of the combine.  Path is relative to the watch config settings.  Path can also be absolute.
* `combine.folders.exclude`: an array of strings and/or regexs, the list of files and file patterns to exclude from the combine.Paths should be relative to `folder` and should point at the compiled file. So foo.css, not foo.less. Regexes can also be used at the same time.  ex: `ex: [/\.txt$/, "vendor/jqueryui.js"]`. Can be left off or made null if not needed.
* `combine.folders.order`: an array of strings, the list of files to include in the combined file first. Does not need to be all the files, just the files for which order is important. Paths should be relative to `folder` and should point at the compiled file. So foo.css, not foo.less. Can be left off or made null if not needed.
* `combine.removeCombined`: configuration for cleaning up during a `mimosa build`
* `combine.removeCombined.enabled`: Defaults to `true`, whether or not to clean up the files that went into making the combine files.
* `combine.removeCombined.exclude`: Files to exclude from removal, can be regex or string, strings are relative to the `watch.compiledDir`.


# Deprecated

This config was deprecated with version `0.6.0` of mimosa-combine. With `0.7.0` support of the deprecated config will be removed.

For the depracated config, `combine.removeCombined.enabled` is set to `false` as that functionality was not available prior to `0.6.0`.

## Deprecated Config

```
combine:[]
```

## Example Deprecated Config

```coffeescript
combine: [                           # An array of folder combination details
  {
    folder:"stylesheets/vendor"      # The folder to combine into a single file. Path can
                                       # be relative to the watch config setting, or absolute.
    output:"stylesheets/vendor.css"  # The output file for the folder combination. Path can
                                       # be relative to the watch config setting, or absolute.
    exclude:null                     # An array of regexs or strings that match files to
                                       # exclude from matching. Can be a mix of regex and
                                       # strings. Strings should be a path relative to the
                                       # folder or absolute.
                                       # ex: [/\.txt$/, "vendor/jqueryui.js"], which would keep
                                       # all .txt files and jqueryui.js out of your combined
                                       # file.
    order:null                       # An array of paths to the files to place at the start
                                       # of the merged file.  You do not need to name every
                                       # file, just those whose order is important. Paths
                                       # can be relative to the 'folder' directory or absolute.
                                       # Paths should point at the compiled file. So foo.css,
                                       # not foo.less. Can be left off or made null if not
                                       # needed.
  }
]

```

* `combine`: an array of combine configurations
* `folder`: a string, the path to the folder to combine. Path is relative to the watch config settings.  Path can also be absolute.
* `output`: a string, the path to the output file result of the combine.  Path is relative to the watch config settings.  Path can also be absolute.
* `exclude`: an array of strings and/or regexs, the list of files and file patterns to exclude from the combine.Paths should be relative to `folder` and should point at the compiled file. So foo.css, not foo.less. Regexes can also be used at the same time.  ex: `ex: [/\.txt$/, "vendor/jqueryui.js"]`. Can be left off or made null if not needed.
* `order`: an array of strings, the list of files to include in the combined file first. Does not need to be all the files, just the files for which order is important. Paths should be relative to `folder` and should point at the compiled file. So foo.css, not foo.less. Can be left off or made null if not needed.
