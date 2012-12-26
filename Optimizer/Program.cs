namespace Optimizer {
    using CommandLine;

    class Program {
        static void Main(string[] args) {
            var options = new Options();
            if(CommandLineParser.Default.ParseArguments(args, options)) {
                var config = new RJSConfig(options);
                config.Generate();

                if(options.Build && !options.Generate) {
                    //build the optimized file
                }
            }
        }
    }
}