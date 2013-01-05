using System;
using System.Diagnostics;

namespace Optimizer {
  class RJSRunner {
    readonly RJSConfig config;

    public RJSRunner(RJSConfig config, Options options) {
      this.config = config;
    }

    public void Run() {
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