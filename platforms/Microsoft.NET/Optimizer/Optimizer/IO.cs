using System;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace Optimizer {
    static class IO {
        public static bool ExistsOnPath(string fileName) {
            if (GetFullPath(fileName) != null) {
                return true;
            }
            return false;
        }

        public static string GetFullPath(string fileName) {
            if (File.Exists(fileName)) {
                return Path.GetFullPath(fileName);
            }

            var values = Environment.GetEnvironmentVariable("PATH");
            foreach (var path in values.Split(';')) {
                var fullPath = Path.Combine(path, fileName);
                if (File.Exists(fullPath)) {
                    return fullPath;
                }
            }
            return null;
        }

        public static JObject GetBaseConfiguration(Options options) {
            if (!string.IsNullOrEmpty(options.ConfigurationSource)) {
                var fullPath = options.ConfigurationSource;
                if (!Path.IsPathRooted(fullPath)) {
                    fullPath = Path.Combine(Directory.GetCurrentDirectory(), fullPath);
                }

                return ReadConfigFromFile(fullPath, options);
            }

            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "optimizer.base.js");
            if (File.Exists(configPath)) {
                return ReadConfigFromFile(configPath, options);
            }

            return ReadConfigFromResource(options);
        }

        public static Stream ReadFromResource(string name) {
            return Assembly
              .GetExecutingAssembly()
              .GetManifestResourceStream("Optimizer.Resources." + name);
        }

        static JObject ReadConfigFromResource(Options options) {
            options.Log("Using default base configuration.");

            using (var stream = ReadFromResource("optimizer.base.js")) {
                using (var streamReader = new StreamReader(stream)) {
                    using (var jsonReader = new JsonTextReader(streamReader)) {
                        return JObject.Load(jsonReader);
                    }
                }
            }
        }

        static JObject ReadConfigFromFile(string path, Options options) {
            options.Log("Reading configuration from " + path);

            using (var reader = File.OpenRead(path)) {
                using (var streamReader = new StreamReader(reader)) {
                    var json = streamReader.ReadToEnd();
                    //allows i.e. module.exports = { } instead of a plain json, so you'd have intellisense in VS2012
                    var index = 0;
                    if ((index = json.IndexOf("{")) >= 0)
                        json = json.Substring(index);
                    json = Regex.Replace(json, "\\%LANG\\%", options.Lang, RegexOptions.IgnoreCase);
                    //replace // comments with /* comments */
                    var jsonFixed = Regex.Replace(json, "(.*)//(.*)\r\n", "$1/*$2*/\r\n", RegexOptions.Multiline);
                    return JObject.Parse(jsonFixed);
                }
            }
        }

        public static void WriteConfiguration(RJSConfig info, Options options) {
            options.Log(info.Config);

            using (var file = File.Create(info.BuildFilePath)) {
                using (var writer = new StreamWriter(file)) {
                    writer.Write(info.Config.ToString());
                }
            }
        }
    }
}