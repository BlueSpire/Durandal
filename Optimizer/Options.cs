using System;
using CommandLine;
using CommandLine.Text;

namespace Optimizer {
  class Options {
    [Option('m', "mode", DefaultValue = ModeOptions.Build, HelpText = "Indicates whether the optimizer should only 'generate' the r.js config or actually 'build' the optimized JS application.")]
    public string Mode { get; set; }

    [Option('s', "source", DefaultValue = "", HelpText = "The path to the folder which contains the application source.")]
    public string ApplicationSource { get; set; }

    [Option('c', "config", DefaultValue = "", HelpText = "The path to the customized r.js configuration file to be used as a base for the generated configuration.")]
    public string ConfigurationSource { get; set; }

    [Option('v', "verbose", DefaultValue = false, HelpText = "Indicates that verbose console logging should be used.")]
    public bool Verbose { get; set; }

    [Option('l', "loader", DefaultValue = LoaderOptions.Almond, HelpText = "Indicates which script loader to optimize for 'almond' or 'require'.")]
    public string Loader { get; set; }

    [Option('p', "plugin", DefaultValue = "text", HelpText = "The view plugin used to optimize views into the final build file.")]
    public string ViewPlugin { get; set; }

    [Option('e', "pluginExtension", DefaultValue = ".html", HelpText = "The view file extension.")]
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

    public static class LoaderOptions {
      public const string Almond = "almond";
      public const string Require = "require";
    }

    public static class ModeOptions {
      public const string Generate = "generate";
      public const string Build = "build";
    }
  }
}