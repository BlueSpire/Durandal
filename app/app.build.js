// To creat an optimized build:
// 1. Install node.js http://nodejs.org/
// 2. From the command line, in the same directory as this file, run: node r.js -o app.build.js 
// 3. Test the build by changing data-main="app/main" in index.html to data-main="app-built/main" 
({
    appDir: ".",
    baseUrl: ".",
    dir: "../app-built",
    keepBuildDir: false,
    inlineText: true,
    paths: {
        "text": "lib/text"
    },
    stubModules: ["text"],
    optimize: "uglify",
    modules: [
        {
            name: "main",
            include: [
                //list all modules that should be included in the optimized build
                //precede html files with text! so that they can be inlines with the text plugin
                'main',
                'samples/navigation/shell',
                'text!samples/navigation/shell.html',
                'samples/navigation/first',
                'text!samples/navigation/first.html',
                'samples/navigation/second',
                'text!samples/navigation/second.html',
                //be sure to include all durandal modules too
            ]
        }
    ]
})