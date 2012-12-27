namespace Optimizer {
    using System;
    using CommandLine;

    class Program {
        static void Main(string[] args) {
            var options = new Options();
            if(CommandLineParser.Default.ParseArguments(args, options)) {
#if DEBUG
                options.Verbose = true;
#endif

                var configBuilder = new RJSConfigBuilder(options);
                var config = configBuilder.Build();

                if (options.Build || options.Generate) {
                    IO.WriteConfiguration(config, options.Verbose);
                }

                if(options.Build && !options.Generate) {
                    var runner = new RJSRunner(config);
                    runner.Run();
                }

                Console.ReadKey();
            }
        }
    }
}