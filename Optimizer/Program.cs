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

                var config = new RJSConfigBuilder(options);
                var info = config.Build();

                if (options.Build || options.Generate) {
                    IO.WriteConfiguration(info, options.Verbose);
                }

                if(options.Build && !options.Generate) {
                    //call r.js
                }

                Console.ReadKey();
            }
        }
    }
}