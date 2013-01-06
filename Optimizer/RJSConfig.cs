using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Optimizer {
  class RJSConfig {
    public JObject Config { get; set; }
    public string BaseUrl { get; set; }
    public IEnumerable<string> Includes { get; set; }
    public IEnumerable<string> Excludes { get; set; }
    public string BuildFilePath { get; set; }
    public string OptimizerPath { get; set; }
    public string OutputPath { get; set; }
    public string MainPath { get; set; }
    public string AlmondPath { get; set; }
  }
}