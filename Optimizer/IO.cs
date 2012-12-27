namespace Optimizer {
    using System;
    using System.IO;
    using System.Reflection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    static class IO {
        public static JObject GetBaseConfiguration(Options options) {
            if(!string.IsNullOrEmpty(options.ConfigurationSource)) {
                var fullPath = options.ConfigurationSource;
                if(!Path.IsPathRooted(fullPath)) {
                    fullPath = Path.Combine(Directory.GetCurrentDirectory(), fullPath);
                }

                return ReadConfigFromFile(fullPath, options.Verbose);
            }

            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "optimizer.base.js");
            if(File.Exists(configPath)) {
                return ReadConfigFromFile(configPath, options.Verbose);
            }

            return ReadConfigFromResource(options.Verbose);
        }

        static JObject ReadConfigFromResource(bool verbose) {
            if(verbose) {
                Console.WriteLine("Using default base configuration.");
            }

            using(var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("Optimizer.optimizer.base.js"))
            using(var streamReader = new StreamReader(stream))
            using(var jsonReader = new JsonTextReader(streamReader)) {
                return JObject.Load(jsonReader);
            }
        }

        static JObject ReadConfigFromFile(string path, bool verbose) {
            if(verbose) {
                Console.WriteLine("Reading configuration from " + path);
            }

            using(var reader = File.OpenRead(path))
            using(var streamReader = new StreamReader(reader))
            using(var jsonReader = new JsonTextReader(streamReader)) {
                return JObject.Load(jsonReader);
            }
        }

        public static void WriteConfiguration(RJSConfig info, bool verbose) {
            if(verbose) {
                Console.Write(info.Config);
            }

            using (var file = File.Create(info.BuildFilePath))
            using (var writer = new StreamWriter(file)) {
                writer.Write(info.Config.ToString());
            }
        }
    }
}