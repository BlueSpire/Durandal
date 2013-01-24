exports.config =
  modules: ['server', 'require', 'minify', 'live-reload', 'combine', 'mimosa-requirebuild-textplugin-include', 'skeleton']

  combine:[
    {
      folder:'Content'
      output:'Content/styles.css'
    }
    {
      folder:'Scripts'
      output:'Scripts/vendor.js'
      order: ['jquery-1.8.3.js', 'knockout-2.2.0.js']
    }
  ]

  copy:
    extensions: ['js', 'css', 'png', 'jpg', 'gif', 'html', 'eot', 'svg', 'ttf', 'woff', 'otf', 'json', 'txt', 'xml', 'xsd']

  watch:
    sourceDir: 'assets'
    javascriptDir: 'App'

  server:
    port: 3000
    useDefaultServer: true

    views:
      compileWith: 'html'
      extension: 'html'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  require:
    optimize:
      overrides:
        name: 'durandal/amd/almond-custom'
        inlineText: true
        stubModules: ['text']
        paths:
          text: 'durandal/amd/text'