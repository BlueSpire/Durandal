namespace Optimizer {
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;

    class GenerationInfo {
        public JObject RJSConfig { get; set; }
        public string BaseUrl { get; set; }
        public IEnumerable<string> Includes { get; set; }
        public IEnumerable<string> Excludes { get; set; }
        public string OutputDirectory { get; set; }
        public string BuildFilePath { get; set; }
    }
}