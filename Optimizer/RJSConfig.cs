namespace Optimizer {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json.Linq;

    class RJSConfig {
        readonly Options options;
        readonly string[] extensionIncludes = new[] { ".js", ".html" };
        readonly string[] fileExcludes = new[] { "app.build.js", "r.js", "optimizer.base.js" };

        public RJSConfig(Options options) {
            this.options = options;
        }

        public GenerationInfo Generate() {
            var info = new GenerationInfo {
                RJSConfig = IO.GetBaseConfiguration(options),
                BaseUrl = DetermineApplicationPath()
            };

            info.Includes = FixupPaths(info.BaseUrl, GetIncludes(info.BaseUrl));
            info.Excludes = FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl));

            info.OutputDirectory = Path.Combine(new DirectoryInfo(info.BaseUrl).Parent.FullName, "app-built");
            info.BuildFilePath = Path.Combine(options.ApplicationSource, "app.build.js");

            BuildConfig(info);

            return info;
        }

        void BuildConfig(GenerationInfo info) {
            var config = info.RJSConfig;

            EnsureProperty(config, "baseUrl", info.BaseUrl);
            EnsureProperty(config, "dir", info.OutputDirectory);


        }

        static void EnsureProperty(JObject config, string property, JToken value) {
            var baseUrl = config.Property(property);
            if(baseUrl == null) {
                config.Add(property, value);
            }
            else {
                var curentValue = baseUrl.Value.ToString();
                if(string.IsNullOrWhiteSpace(curentValue)) {
                    baseUrl.Value = value;
                }
            }
        }

        string DetermineApplicationPath() {
            var sourcePath = options.ApplicationSource;

            if(!string.IsNullOrEmpty(sourcePath)) {
                if(!Path.IsPathRooted(sourcePath)) {
                    sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
                }
            }
            else {
                var current = Directory.GetCurrentDirectory();
                sourcePath = new DirectoryInfo(current).Parent.FullName;
            }

            return sourcePath;
        }

        IEnumerable<string> GetIncludes(string applicationSource) {
            return from fileName in Directory.EnumerateFiles(applicationSource, "*", SearchOption.AllDirectories)
                   let info = new FileInfo(fileName)
                   where ShouldIncludeFile(info)
                   select info.FullName;
        }

        public static IEnumerable<string> GetExcludes(string applicationSource) {
            var vendor = Path.Combine(applicationSource, "vendor");
            foreach(var file in Directory.EnumerateFiles(vendor, "*", SearchOption.AllDirectories)) {
                yield return file;
            }
        }

        bool ShouldIncludeFile(FileInfo info) {
            var extension = Path.GetExtension(info.FullName);

            if(!extensionIncludes.Contains(extension)) {
                return false;
            }

            return !fileExcludes.Contains(info.FullName);
        }

        IEnumerable<string> FixupPaths(string applicationPath, IEnumerable<string> paths) {
            var rootMarker = "\\" + applicationPath + "\\";
            var rootMarkerLength = rootMarker.Length;

            foreach(var path in paths) {
                var relativePath = path;
                var index = relativePath.LastIndexOf(rootMarker);

                if(index != -1) {
                    relativePath = relativePath.Substring(index + rootMarkerLength);
                }

                relativePath = relativePath.Replace("\\", "/");

                if(relativePath.EndsWith(".html")) {
                    yield return "text!" + relativePath;
                }
                else {
                    relativePath = relativePath.Replace(".js", string.Empty);
                    yield return relativePath;
                }
            }
        }
    }
}