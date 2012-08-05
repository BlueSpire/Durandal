// To run this build  file, install node.js and run
// node r.js -o app.build.js from the same directory as this file
// To test the build, change data-main="app/main" in index.html to data-main="app-built/main" 
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