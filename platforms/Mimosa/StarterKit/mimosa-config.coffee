exports.config =
  minMimosaVersion:'0.10.0'

  modules: ['server', 'require', 'minify', 'live-reload', 'combine', 'mimosa-requirebuild-textplugin-include', 'skeleton']

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: ['bootstrap.css', 'bootstrap-responsive.css', 'font-awesome.css', 'durandal.css', 'starterkit.css']
      }
    ]

  watch:
    javascriptDir: 'javascripts/app'

  server:
    port: 3000
    defaultServer:
      enabled: true
      onePager: true

    views:
      compileWith: 'html'
      extension: 'html'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
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