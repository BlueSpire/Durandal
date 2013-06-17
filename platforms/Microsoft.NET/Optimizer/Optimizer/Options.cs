using System;
using CommandLine;
using CommandLine.Text;
using System.Collections.Generic;

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

    [OptionList('i', "ignore", HelpText = "Ignore certain files or folders relative to the app path, separated by semicolon ;", Separator = ';')]
    public IList<string> Ignores { get; set; }

    [Option('o', "output", DefaultValue = "main-built.js", HelpText="Specify the name of the output combined and minified built file. Relative to the application source folder (-s option)")]
    public string OutputFileName { get; set; }

    [Option("buildFile", DefaultValue = "app.build.js", HelpText="Specify where the json configuration for r.js will be saved within this folder")]
    public string BuildFile { get; set; }

    [Option("mainEntry", DefaultValue = "main.js", HelpText = "Specify the main entry point file")]
    public string MainEntry { get; set; }

    [Option("name", DefaultValue = "main", HelpText = "Specify the module name")]
    public string ModuleName { get; set; }

    [Option("lang", Required = false, DefaultValue = "en", HelpText = "Specify the language to be replaced %LANG% paths on modules. You need to provide a custom configuration file first (-c) that has defined modules and we'll replace the %LANG% with this value in all the 'include' options of all the provided modules")]
    public string Lang { get; set; }

    [Option("preserveLicenseComments", DefaultValue = true, HelpText = "Specify false to remove the license comments")]
    public bool? PreserveLicenseComments { get; set; }

    [OptionList('r', "require", HelpText = "Default: main. Include extra requires separated by semicolon (;)", Separator = ';')]
    public IList<string> InsertRequire { get; set; }

    [OptionList('x', "exclude", HelpText = "Exclude certain modules i.e. if they were built before", Separator = ';')]
    public IList<string> Excludes { get; set; }


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