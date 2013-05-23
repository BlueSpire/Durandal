using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace Optimizer {
  class RJSRunner {
    readonly RJSConfig config;
    readonly Options options;

    public RJSRunner(RJSConfig config, Options options) {
      this.config = config;
      this.options = options;
    }

    public void Run() {
      if(File.Exists(config.OutputPath)) {
        options.Log("Deleting old output file.", true);
        var info = new FileInfo(config.OutputPath);
        using(info.Create()) {
          //effectively deletes the contents of the file
          //calling delete seamed to break the following optimizer code, not sure why
        }
      }

      if(!File.Exists(config.OptimizerPath)) {
        using(var stream = IO.ReadFromResource("r.js"))
        using(var file = File.OpenWrite(config.OptimizerPath)) {
          stream.CopyTo(file);
        }
      }

      if(options.Loader == Options.LoaderOptions.Almond) {
        if(!File.Exists(config.AlmondPath)) {
          using(var stream = IO.ReadFromResource("almond-custom.js"))
          using(var file = File.OpenWrite(config.AlmondPath)) {
            stream.CopyTo(file);
          }
        }
      }

      var command = "/C node \"" +
                    config.OptimizerPath + "\" -o \"" +
                    config.BuildFilePath + "\"";

      var process = new Process {
        StartInfo = new ProcessStartInfo {
          FileName = "cmd.exe",
          Arguments = command,
          UseShellExecute = false,
          CreateNoWindow = true,
          RedirectStandardOutput = true,
          RedirectStandardError = true,
        },
        EnableRaisingEvents = true
      };

      process.OutputDataReceived += (s, e) => Console.WriteLine(e.Data);
      process.ErrorDataReceived += (s, e) => Console.Error.WriteLine(e.Data);

      process.Start();
      process.BeginOutputReadLine();
      process.BeginErrorReadLine();
      process.WaitForExit();
      process.CancelOutputRead();
      process.CancelErrorRead();
    }
  }
}