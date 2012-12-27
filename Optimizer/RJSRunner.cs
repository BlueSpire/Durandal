namespace Optimizer {
    using System.Diagnostics;
    using System.IO;

    class RJSRunner {
        readonly RJSConfig config;

        public RJSRunner(RJSConfig config) {
            this.config = config;
        }

        public void Run() {
            if(!Directory.Exists(config.BaseUrl)) {
                Directory.CreateDirectory(config.BaseUrl);
            }

            var command = "/C node \"" +
                          config.OptimizerPath + "\" -o \"" +
                          config.BuildFilePath + "\"";

            var proc = Process.Start("cmd.exe", command);
            proc.WaitForExit();
        }
    }
}