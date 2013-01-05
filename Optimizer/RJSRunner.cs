using System;
using System.Diagnostics;
using System.IO;

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
        File.Delete(config.OutputPath);
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
          RedirectStandardOutput = true
        },
        EnableRaisingEvents = true
      };

      process.OutputDataReceived += (s, e) => Console.WriteLine(e.Data);

      process.Start();
      process.BeginOutputReadLine();
      process.WaitForExit();
      process.CancelOutputRead();
    }
  }
}