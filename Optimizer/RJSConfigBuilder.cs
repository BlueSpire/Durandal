using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Optimizer {
  class RJSConfigBuilder {
    readonly Options options;
    readonly string[] extensionIncludes;
    readonly string[] fileExcludes = new[] {"app.build.js", "r.js", "optimizer.base.js", "main-built.js"};
    const string relativeAlmondPath = "vendor/almond-custom";

    public RJSConfigBuilder(Options options) {
      this.options = options;
      extensionIncludes = new[] {".js", options.ViewExtension};
    }

    public RJSConfig Build() {
      var info = new RJSConfig {
        Config = IO.GetBaseConfiguration(options),
        BaseUrl = DetermineApplicationPath()
      };

      info.Excludes = FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl));
      info.Includes = FixupPaths(info.BaseUrl, GetIncludes(info.BaseUrl)).Except(info.Excludes);

      info.BuildFilePath = Path.Combine(options.ApplicationSource, "vendor/app.build.js");
      info.OptimizerPath = Path.Combine(options.ApplicationSource, "vendor/r.js");
      info.AlmondPath = Path.Combine(options.ApplicationSource, relativeAlmondPath + ".js");
      info.OutputPath = Path.Combine(options.ApplicationSource, "main-built.js");
      info.MainPath = Path.Combine(options.ApplicationSource, "main.js");

      BuildConfig(info);

      return info;
    }

    void BuildConfig(RJSConfig info) {
      var config = info.Config;

      if(options.Almond) {
        options.Log("Configuring for deploy with almond (custom).");

        JSON.EnsureProperty(config, "name", relativeAlmondPath);
        JSON.EnsureProperty(config, "mainConfigFile", info.MainPath);
        JSON.EnsureProperty(config, "wrap", true);

        var insertRequire = JSON.EnsureArray(config, "insertRequire");
        insertRequire.Add("main");
      } else {
        options.Log("Configuring for deploy with require.");

        JSON.EnsureProperty(config, "name", "main");
      }

      JSON.EnsureProperty(config, "baseUrl", info.BaseUrl);
      JSON.EnsureProperty(config, "out", info.OutputPath);

      var include = JSON.EnsureArray(config, "include");
      if(include.Count < 1) {
        foreach(var item in info.Includes) {
          include.Add(item);
        }
      }
    }

    string DetermineApplicationPath() {
      var sourcePath = options.ApplicationSource;

      if(!string.IsNullOrEmpty(sourcePath)) {
        if(!Path.IsPathRooted(sourcePath)) {
          sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
        }
      } else {
        var current = Directory.GetCurrentDirectory();
        sourcePath = new DirectoryInfo(current).Parent.FullName;
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
      var vendor = Path.Combine(applicationSource, "vendor");

      if(!Directory.Exists(vendor)) {
        return new string[] {};
      }

      return from fileName in Directory.EnumerateFiles(vendor, "*", SearchOption.AllDirectories)
             select fileName;
    }

    bool ShouldIncludeFile(FileInfo info) {
      var extension = Path.GetExtension(info.FullName);

      if(!extensionIncludes.Contains(extension)) {
        return false;
      }

      return !fileExcludes.Contains(info.Name);
    }

    IEnumerable<string> FixupPaths(string applicationPath, IEnumerable<string> paths) {
      var rootMarker = applicationPath + "\\";
      var rootMarkerLength = rootMarker.Length;

      foreach(var path in paths) {
        var relativePath = path;
        var index = relativePath.LastIndexOf(rootMarker);

        if(index != -1) {
          relativePath = relativePath.Substring(index + rootMarkerLength);
        }

        relativePath = relativePath.Replace("\\", "/");

        if(relativePath.EndsWith(options.ViewExtension)) {
          yield return options.ViewPlugin + "!" + relativePath;
        } else {
          relativePath = relativePath.Replace(".js", string.Empty);
          yield return relativePath;
        }
      }
    }
  }
}