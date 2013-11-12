exports.config =
  minMimosaVersion:'1.0.0'

  modules: [
    'server'
    'require'
    'minify'
    'live-reload'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'lint'
  ]

  watch:
    javascriptDir: 'javascripts/app'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"javascripts"
    patterns: ['app/**/*.js', 'vendor/durandal/**/*.js']

  bower:
    copy:
      mainOverrides:
        "knockout.js":["knockout.js","knockout-3.0.0.debug.js"]
        "bootstrap": [
          { "docs/assets/fonts": "../../fonts" }
          "docs/assets/js/bootstrap.js"
          "docs/assets/css/bootstrap.css"
        ]
        "font-awesome": [
          { fonts: "../../fonts" }
          "css/font-awesome.css"
        ]
        "durandal": [
          {
            img: "../../images"
            js: "durandal"
            css: "durandal"
          }
        ]

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/bootstrap/bootstrap.css'
          'vendor/font-awesome/font-awesome.css'
          'vendor/durandal/durandal.css'
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

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true