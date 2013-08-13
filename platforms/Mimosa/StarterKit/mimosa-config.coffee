exports.config =
  minMimosaVersion:'0.14.10'

  modules: ['server', 'require', 'minify', 'live-reload', 'combine', 'mimosa-requirebuild-textplugin-include', 'bower']

  watch:
    javascriptDir: 'javascripts/app'

  bower:
    bowerDir:
      clean:false
    copy:
      mainOverrides:
        "knockout.js":["knockout.js","knockout-2.3.0.debug.js"]
        "bootstrap": [
          "docs/assets/js/bootstrap.js"
          "docs/assets/css/bootstrap.css"
          "docs/assets/css/bootstrap-responsive.css"
        ]

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/bootstrap/bootstrap.css'
          'vendor/bootstrap/bootstrap-responsive.css'
          'vendor/font-awesome.css'
          'durandal.css'
          'starterkit.css'
        ]
      }
    ]

  server:
    defaultServer:
      enabled: true
      onePager: true
    views:
      compileWith: 'html'
      extension: 'html'

  requireBuildTextPluginInclude:
    extensions: ['html']

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true
        paths:
          'text': '../vendor/text',
          'durandal': '../vendor/durandal',
          'plugins': '../vendor/durandal/plugins',
          'transitions': '../vendor/durandal/transitions',
          'knockout': '../vendor/knockout-2.2.1',
          'bootstrap': '../vendor/bootstrap',
          'jquery': '../vendor/jquery-1.9.1'