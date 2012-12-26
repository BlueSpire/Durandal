namespace Optimizer {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    class RJSConfig {
        readonly Options options;

        public RJSConfig(Options options) {
            this.options = options;
        }

        public void Generate() {
            var config = GetBaseConfiguration();
            var includes = GetIncludes();

            WriteConfig(config);
        }

        static void WriteConfig(JObject config) {
            Console.Write(config);
            Console.ReadKey();
        }

        IEnumerable<string> GetIncludes() {
            var sourcePath = options.ApplicationSource;

            if(!string.IsNullOrEmpty(sourcePath)) {
                if(!Path.IsPathRooted(sourcePath)) {
                    sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
                }
            }else {
                sourcePath = Directory.GetCurrentDirectory();
            }

            return from fileName in Directory.EnumerateFiles(sourcePath, "*", SearchOption.AllDirectories)
                   let info = new FileInfo(fileName)
                   where IncludeFile(info)
                   select info.FullName;
        }

        bool IncludeFile(FileInfo info) {
            return info.Name != "app.build.js" && info.Name != "r.js";
        }

        JObject GetBaseConfiguration() {
            if(!string.IsNullOrEmpty(options.ConfigurationSource)) {
                var fullPath = options.ConfigurationSource;
                if(!Path.IsPathRooted(fullPath)) {
                    fullPath = Path.Combine(Directory.GetCurrentDirectory(), fullPath);
                }

                return ReadConfigFromFile(fullPath);
            }

            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "optimizer.base.js");
            if (File.Exists(configPath)) {
                return ReadConfigFromFile(configPath);
            }

            return ReadConfigFromResource();
        }

        JObject ReadConfigFromResource() {
            if (options.Verbose) {
                Console.WriteLine("Using default base configuration.");
            }

            using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("Optimizer.optimizer.base.js"))
            using (var streamReader = new StreamReader(stream))
            using (var jsonReader = new JsonTextReader(streamReader)) {
                return JObject.Load(jsonReader);
            }
        }

        JObject ReadConfigFromFile(string path) {
            if (options.Verbose) {
                Console.WriteLine("Reading configuration from " + path);
            }

            using(var reader = File.OpenRead(path))
            using(var streamReader = new StreamReader(reader))
            using(var jsonReader = new JsonTextReader(streamReader)) {
                return JObject.Load(jsonReader);
            }
        }
    }
}