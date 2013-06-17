using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;

namespace Optimizer {
    class RJSConfigBuilder {
        readonly Options options;
        readonly string[] extensionIncludes;
        const string amdPath = "durandal/amd";
        const string almondName = "almond-custom";

        public RJSConfigBuilder(Options options) {
            this.options = options;
            extensionIncludes = new[] { ".js", options.ViewExtension };
        }

        public RJSConfig Build() {
            var info = new RJSConfig {
                Config = IO.GetBaseConfiguration(options),
                BaseUrl = DetermineApplicationPath()
            };

            //buildFilePath, OutputPath and MainPath are now configurable
            //same for moduleName, mainEntry
            info.Excludes = FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl)).ToArray();
            info.Includes = FixupPaths(info.BaseUrl, GetIncludes(info.BaseUrl)).Except(info.Excludes, StringComparer.OrdinalIgnoreCase).ToArray();

            info.BuildFilePath = Path.Combine(options.ApplicationSource, amdPath, options.BuildFile);
            info.OptimizerPath = Path.Combine(options.ApplicationSource, amdPath, "r.js");
            info.AlmondPath = Path.Combine(options.ApplicationSource, amdPath, almondName + ".js");
            info.OutputPath = Path.Combine(options.ApplicationSource, options.OutputFileName);
            info.MainPath = Path.Combine(options.ApplicationSource, options.MainEntry);

            BuildConfig(info);

            return info;
        }


        void BuildConfig(RJSConfig info) {
            var config = info.Config;
            var modulesProperty = config.Property("modules");
            var modules = modulesProperty == null ? null : modulesProperty.Value as JArray;
            var hasModules = modules != null && modules.HasValues;

            var insertRequire = JSON.EnsureArray(config, "insertRequire");

            if (options.InsertRequire == null)
                options.InsertRequire = new List<string> { "main" };

            foreach (var require in options.InsertRequire) {
                insertRequire.Add(require);
            }

            JSON.EnsureProperty(config, "baseUrl", info.BaseUrl);
            if (options.PreserveLicenseComments.HasValue)
                JSON.EnsureProperty(config, "preserveLicenseComments", options.PreserveLicenseComments);

            if (hasModules) {
                //added support for modules. Used in conjunction with option -c
                //we load files defined as path/*.js or path/**.js recursively
                //also we load text!path/*.html or text!path/**.html recursively
                var baseUrlProp = config.Property("baseUrl");
                var baseUrl = (baseUrlProp == null ? null : baseUrlProp.Value as JValue).Value as string ?? "";
                foreach (var module in modules.Children())
                    if (module is JObject) {
                        var includeProp = (module as JObject).Property("include");

                        var include = includeProp == null ? null : includeProp.Value as JArray;
                        if (include != null) {
                            foreach (var item in include.ToArray()) {
                                if (item is JValue) {
                                    var token = item as JValue;
                                    var file = token.Value as string;
                                    var searchOption = SearchOption.TopDirectoryOnly;
                                    token.Value = file;
                                    if (file.Contains("**")) {
                                        searchOption = SearchOption.AllDirectories;
                                        file = file.Replace("**", "*");
                                    }
                                    if (file.Contains("*")) {
                                        var indexOf = file.IndexOf('!');
                                        var prefix = "";
                                        if (indexOf >= 0) {
                                            prefix = file.Substring(0, indexOf + 1);
                                            file = file.Substring(indexOf + 1);
                                        }
                                        var path = Path.GetDirectoryName(file);
                                        if (!Path.IsPathRooted(path))
                                            path = Path.Combine(baseUrl, path);
                                        var pattern = Path.GetFileName(file);

                                        foreach (var f in Directory.GetFiles(path, pattern, searchOption)
                                            .Select(f => f.Substring(baseUrl.Length))
                                            .Select(f => ".js".Equals(Path.GetExtension(f)) ? Path.Combine(Path.GetDirectoryName(f), Path.GetFileNameWithoutExtension(f)) : f)
                                            .Select(f => f.StartsWith("/") || f.StartsWith("\\") ? f.Substring(1) : f)
                                            .Select(f => f.Replace('\\', '/'))
                                            )
                                            include.Add(new JValue(prefix + f));
                                        include.Remove(item);
                                    }
                                }
                            }
                        }
                    }
            }
            else {
                if (options.Loader == Options.LoaderOptions.Almond) {
                    options.Log("Configuring for deploy with almond (custom).");

                    JSON.EnsureProperty(config, "name", amdPath + "/" + almondName);
                    JSON.EnsureProperty(config, "mainConfigFile", info.MainPath);
                    JSON.EnsureProperty(config, "wrap", true);
                }
                else {
                    options.Log("Configuring for deploy with require.");

                    JSON.EnsureProperty(config, "name", options.ModuleName);
                }
                JSON.EnsureProperty(config, "out", info.OutputPath);

                var include = JSON.EnsureArray(config, "include");
                if (include.Count < 1) {
                    foreach (var item in info.Includes) {
                        include.Add(item);
                    }
                }
            }
            var excludes = JSON.EnsureArray(config, "exclude");
            if (options.Excludes != null)
                foreach (var exclude in options.Excludes) {
                    excludes.Add(exclude);
                }
        }

        string DetermineApplicationPath() {
            var sourcePath = options.ApplicationSource;

            if (!string.IsNullOrEmpty(sourcePath)) {
                if (!Path.IsPathRooted(sourcePath)) {
                    sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
                }
            } else {
                var current = Directory.GetCurrentDirectory();
                sourcePath = new DirectoryInfo(current).Parent.Parent.FullName;
                //amd -> durandal -> App
            }

            options.ApplicationSource = sourcePath;
            return sourcePath;
        }

        IEnumerable<string> GetIncludes(string applicationSource) {
            return from fileName in Directory.EnumerateFiles(applicationSource, "*", SearchOption.AllDirectories)
                   let info = new FileInfo(fileName)
                   where ShouldIncludeFile(info)
                   select info.FullName;
        }

        public IEnumerable<string> GetExcludes(string applicationSource) {
            //updated to include options.Ignores
            var vendor = Path.Combine(applicationSource, "durandal/amd");

            if (Directory.Exists(vendor)) {
                foreach (var f in from fileName in Directory.EnumerateFiles(vendor, "*", SearchOption.AllDirectories)
                                  select fileName)
                    yield return f;
            }
            if (options.Ignores != null) {
                foreach (var ingore in options.Ignores)
                    if (!string.IsNullOrWhiteSpace(ingore)) {
                        var path = Path.Combine(applicationSource, ingore);
                        if (File.Exists(path))
                            yield return path;
                        else if (Directory.Exists(path))
                            foreach (var f in from fileName in Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories)
                                              select fileName)
                                yield return f;
                    }
            }


        }

        bool ShouldIncludeFile(FileInfo info) {
            var extension = Path.GetExtension(info.FullName);
            return extensionIncludes.Contains(extension);
        }

        IEnumerable<string> FixupPaths(string applicationPath, IEnumerable<string> paths) {
            var rootMarker = applicationPath + "\\";
            var rootMarkerLength = rootMarker.Length;

            foreach (var path in paths) {
                var relativePath = path;
                var index = relativePath.LastIndexOf(rootMarker);

                if (index != -1) {
                    relativePath = relativePath.Substring(index + rootMarkerLength);
                }

                relativePath = relativePath.Replace("\\", "/");

                if (relativePath.EndsWith(options.ViewExtension)) {
                    yield return options.ViewPlugin + "!" + relativePath;
                } else {
                    relativePath = relativePath.Replace(".js", string.Empty);
                    yield return relativePath;
                }
            }
        }
    }
}