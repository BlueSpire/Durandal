namespace Optimizer {
    using Newtonsoft.Json.Linq;

    static class JSON {
        public static JArray EnsureArray(JObject config, string propery) {
            JArray array;
            var prop = config.Property(propery);

            if(prop == null) {
                array = new JArray();
                config.Add(propery, array);
            }
            else {
                array = prop.Value as JArray;
                if(array == null) {
                    array = new JArray();
                    prop.Value = array;
                }
            }

            return array;
        }

        public static void EnsureProperty(JObject config, string property, JToken value) {
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
    }
}