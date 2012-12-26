{
    baseUrl: "",
    dir: "",
	keepBuildDir: true,
    inlineText: true,
    stubModules: ["vendor/text"],
	paths: {
        text: "vendor/text"
    },
	optimize: "uglify2",
    modules: [
        {
            name: "main",
            include: [],
			exclude:[]
        }
    ]
}