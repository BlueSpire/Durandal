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
        readonly string[] extensionIncludes = new[] { ".js", ".html" };
        readonly string[] fileExcludes = new[] { "app.build.js", "r.js", "optimizer.base.js" };

        public RJSConfig(Options options) {
            this.options = options;
        }

        public void Generate() {
            var config = GetBaseConfiguration();
            var applicationPath = DetermineApplicationPath();
            var includes = GetIncludes(applicationPath);
            var fixedIncludes = FixupIncludePaths(applicationPath, includes);

            WriteConfig(config, applicationPath, fixedIncludes);
        }

        string DetermineApplicationPath() {
            var sourcePath = options.ApplicationSource;

            if(!string.IsNullOrEmpty(sourcePath)) {
                if(!Path.IsPathRooted(sourcePath)) {
                    sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
                }
            }
            else {
                sourcePath = Directory.GetCurrentDirectory();
            }

            return sourcePath;
        }

        void WriteConfig(JObject config, string applicationPath, IEnumerable<string> includes) {
            Console.Write(config);
            Console.ReadKey();

            //var buildFilePath = Path.Combine(options.ApplicationSource, "app.build.js");

            //using(var file = File.Create(buildFilePath))
            //using(var writer = new StreamWriter(file)) {
            //    writer.Write(config.ToString());
            //}
        }

        IEnumerable<string> GetIncludes(string applicationSource) {
            return from fileName in Directory.EnumerateFiles(applicationSource, "*", SearchOption.AllDirectories)
                   let info = new FileInfo(fileName)
                   where IncludeFile(info)
                   select info.FullName;
        }

        bool IncludeFile(FileInfo info) {
            var extension = Path.GetExtension(info.FullName);

            if(!extensionIncludes.Contains(extension)) {
                return false;
            }

            return !fileExcludes.Contains(info.FullName);
        }

        IEnumerable<string> FixupIncludePaths(string applicationPath, IEnumerable<string> paths) {
            var rootMarker = "\\" + applicationPath + "\\";
            var rootMarkerLength = rootMarker.Length;

            foreach (var path in paths) {
                var relativePath = path;
                var index = relativePath.LastIndexOf(rootMarker);

                if (index != -1) {
                    relativePath = relativePath.Substring(index + rootMarkerLength);
                }

                relativePath = relativePath.Replace("\\", "/");

                if (relativePath.EndsWith(".html")) {
                    yield return "'text!" + relativePath + "'";
                }
                else {
                    relativePath = relativePath.Replace(".js", string.Empty);
                    yield return "'" + relativePath + "'";
                }
            }
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