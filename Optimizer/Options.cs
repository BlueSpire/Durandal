using System;
using CommandLine;
using CommandLine.Text;

namespace Optimizer {
  class Options : CommandLineOptionsBase {
    [Option("b", "build", DefaultValue = true, HelpText = "Indicates that the optimizer should build the optimized JS application.")]
    public bool Build { get; set; }

    [Option("g", "generate", DefaultValue = false, HelpText = "Indicates that the optimizer should not build the optimized JS application, but only generate the r.js configuration file.")]
    public bool Generate { get; set; }

    [Option("s", "source", DefaultValue = "", HelpText = "The path to the folder which contains the application source.")]
    public string ApplicationSource { get; set; }

    [Option("c", "config", DefaultValue = "", HelpText = "The path to the customized r.js configuration file to be used as a base for the generated configuration.")]
    public string ConfigurationSource { get; set; }

    [Option("v", "verbose", DefaultValue = false, HelpText = "Indicates that verbose console logging should be used.")]
    public bool Verbose { get; set; }

    [Option("a", "almond", DefaultValue = true, HelpText = "Indicates whether or not to use almond instead of require.js.")]
    public bool Almond { get; set; }

    [Option("p", "plugin", DefaultValue = "text", HelpText = "The view plugin used to optimize views into the final build file.")]
    public string ViewPlugin { get; set; }

    [Option("e", "pluginExtension", DefaultValue = ".html", HelpText = "The view file extension.")]
    public string ViewExtension { get; set; }

    [HelpOption]
    public string GetUsage() {
      return HelpText.AutoBuild(this, x => HelpText.DefaultParsingErrorsHandler(this, x));
    }

    public void Log(object toLog, bool force = false) {
      if(Verbose || force) {
        Console.WriteLine(toLog);
      }
    }
  }
}