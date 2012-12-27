namespace Optimizer {
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json.Linq;

    class RJSConfigBuilder {
        readonly Options options;
        readonly string[] extensionIncludes = new[] { ".js", ".html" };
        readonly string[] fileExcludes = new[] { "app.build.js", "r.js", "optimizer.base.js" };

        public RJSConfigBuilder(Options options) {
            this.options = options;
        }

        public RJSConfig Build() {
            var info = new RJSConfig {
                Config = IO.GetBaseConfiguration(options),
                BaseUrl = DetermineApplicationPath()
            };

            info.Includes = FixupPaths(info.BaseUrl, GetIncludes(info.BaseUrl));
            info.Excludes = FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl));

            info.OutputDirectory = Path.Combine(new DirectoryInfo(info.BaseUrl).Parent.FullName, "app-built");
            info.BuildFilePath = Path.Combine(options.ApplicationSource, "app.build.js");

            BuildConfig(info);

            return info;
        }

        void BuildConfig(RJSConfig info) {
            var config = info.Config;

            JSON.EnsureProperty(config, "baseUrl", info.BaseUrl);
            JSON.EnsureProperty(config, "dir", info.OutputDirectory);

            var modules = JSON.EnsureArray(config, "modules");

            var mainModule = modules.FirstOrDefault() as JObject;
            if(mainModule == null) {
                mainModule = new JObject();
                modules.Add(mainModule);
            }

            JSON.EnsureProperty(mainModule, "name", "main");

            var include = JSON.EnsureArray(mainModule, "include");
            if(include.Count < 1) {
                foreach(var item in info.Includes) {
                    include.Add(item);
                }
            }

            var exclude = JSON.EnsureArray(mainModule, "exclude");
            if(exclude.Count < 1) {
                foreach(var item in info.Excludes) {
                    exclude.Add(item);
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

            if(!Directory.Exists(vendor)) {
                yield break;
            }

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