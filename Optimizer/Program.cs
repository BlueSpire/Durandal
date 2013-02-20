using System;
using CommandLine;

namespace Optimizer {
  class Program {
    static void Main(string[] args) {
      try {
        var hasNode = IO.ExistsOnPath("node.exe");
        if (!hasNode) {
          Console.WriteLine("Exiting - Node is not installed.");
          Console.WriteLine("Please visit http://nodejs.org/ to install nodejs.");
          return;
        }

        var options = new Options();
        if(CommandLineParser.Default.ParseArguments(args, options)) {
#if DEBUG
        options.Verbose = true;
#endif

          var configBuilder = new RJSConfigBuilder(options);
          var config = configBuilder.Build();

          IO.WriteConfiguration(config, options);

          if(options.Mode == Options.ModeOptions.Build) {
            var runner = new RJSRunner(config, options);
            runner.Run();
          }
        }
      } catch(Exception ex) {
        Console.WriteLine(ex.Message);
      }
    }
  }
}