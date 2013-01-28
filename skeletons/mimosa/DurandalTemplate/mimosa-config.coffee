exports.config =
  minMimosaVersion:'0.8.7'

  modules: ['server', 'require', 'minify', 'live-reload', 'combine', 'mimosa-requirebuild-textplugin-include', 'skeleton']

  combine:[
    {
      folder:'Content'
      output:'Content/styles.css'
      order: ['bootstrap.css', 'bootstrap-responsive.css']
    }
    {
      folder:'Scripts'
      output:'Scripts/vendor.js'
      order: ['jquery-1.8.3.js', 'knockout-2.2.0.js']
    }
  ]

  copy:
    extensions: ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'htm', 'html', 'eot', 'svg', 'ttf', 'woff', 'otf', 'yaml', 'kml', 'ico', 'htc', 'json', 'txt', 'xml', 'xsd']

  watch:
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