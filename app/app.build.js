({
    appDir: ".",
    baseUrl: ".",
    dir: "../your_build_output_file_name_goes_here",
    keepBuildDir: false,
    inlineText: true,
    stubModules: ["lib/text"],
    modules: [
        {
            name: "main",
            include: [
                //list all modules that should be included in the optimized build
                'main',
                'samples/navigation/shell',
                'samples/navigation/text!shell.html',
                'samples/navigation/first',
                'samples/navigation/text!first.html',
                'samples/navigation/second',
                'samples/navigation/text!second.html',
                //be sure to include all durandal modules too
            ]
        }
    ]
})