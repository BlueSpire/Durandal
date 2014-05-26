define(["durandal/system", "durandal/binder", "plugins/i18n", "jquery", "knockout"], function (system, binder, i18n, $, ko) {
  var modules = {
    "module1": {
      "fr-ca": {
        key1: "fr-ca 1",
        key2: "fr-ca 2",
        key3: {
          key1: "fr-ca 3-1",
          key2: "fr-ca 3-2"
        }
      },
      "en-ca": {
        key1: "en-ca 1",
        key2: "en-ca 2",
        key3: {
          key1: "en-ca 3-1",
          key2: "en-ca 3-2"
        }
      },
      "fr": {
        key2: "fr 2",
        key3: {
          key2: "fr 3-2",
          key3: "fr 3-3"
        },
        key4: "fr 4"
      },
      "en": {
        key2: "en 2",
        key3: {
          key2: "en 3-2",
          key3: "en 3-3"
        },
        key4: "en 4"
      },
      "root": {
        key2: "root 2",
        key3: {
          key2: "root 3-2",
          key4: "root 3-4"
        },
        key5: "root 5"
      }
    },
    "global": {
      "fr-ca": {
        key1: "global fr-ca 1"
      },
      "root": {
        key1: "global root 1"
      }
    }
  };

  describe("plugins/i18n", function () {
    beforeEach(function() {
      spyOn(system, "acquire").andCallFake(function (module) {
        var splitter = module.lastIndexOf(".");
        var moduleId = module.substring(0, splitter);
        var culture = module.substring(splitter + 1);

        var value = modules[moduleId][culture];

        return $.Deferred(function (dfd) {
          dfd.resolve(value);
        })
      });

      i18n.install({ culture: "fr-ca", globalModules: "global" });
    });

    describe("the culture fallback", function () {
      var module = { __moduleId__: "module1" };
      beforeEach(function () {
        binder.binding(module);
      });

      describe("after initialization", function () {
        it("can get the right value if present in the culture file and it doesn't exist in parent cultures", function () {
          var value;
          i18n.getValue(module, "key1", function (val) { value = val });
          expect(value).toBe("fr-ca 1");
        });

        it("can get the right value if present in the culture file and exists in parent cultures", function () {
          var value;
          i18n.getValue(module, "key2", function (val) { value = val });
          expect(value).toBe("fr-ca 2");
        });

        it("can get the right value if not present in the culture file and exists in direct parent", function () {
          var value;
          i18n.getValue(module, "key4", function (val) { value = val });
          expect(value).toBe("fr 4");
        });

        it("can get the right value if not present in the culture file and exists in grand parent", function () {
          var value;
          i18n.getValue(module, "key5", function (val) { value = val });
          expect(value).toBe("root 5");
        });

        it("can get the right complex value if it doesn't exist in parent cultures", function () {
          var value;
          i18n.getValue(module, "key3.key1", function (val) { value = val });
          expect(value).toBe("fr-ca 3-1");
        });

        it("can get the right copmlex value if it exists in parent cultures", function () {
          var value;
          i18n.getValue(module, "key3.key2", function (val) { value = val });
          expect(value).toBe("fr-ca 3-2");
        });

        it("can get the right complex value if not present in the culture file and exists in direct parent", function () {
          var value;
          i18n.getValue(module, "key3.key3", function (val) { value = val });
          expect(value).toBe("fr 3-3");
        });

        it("can get the right complex value if not present in the culture file and exists in grand parent", function () {
          var value;
          i18n.getValue(module, "key3.key4", function (val) { value = val });
          expect(value).toBe("root 3-4");
        });

        it("can get the right value from a global file", function () {
          var value;
          i18n.getValue("global", "key1", function (val) { value = val });
          expect(value).toBe("global fr-ca 1");
        });
      });

      describe("after culture change", function () {
        beforeEach(function () {
          i18n.changeCulture("en-ca");
        });

        it("can get the right value if present in the culture file and it doesn't exist in parent cultures", function () {
          var value;
          i18n.getValue(module, "key1", function (val) { value = val });
          expect(value).toBe("en-ca 1");
        });

        it("can get the right value if present in the culture file and exists in parent cultures", function () {
          var value;
          i18n.getValue(module, "key2", function (val) { value = val });
          expect(value).toBe("en-ca 2");
        });

        it("can get the right value if not present in the culture file and exists in direct parent", function () {
          var value;
          i18n.getValue(module, "key4", function (val) { value = val });
          expect(value).toBe("en 4");
        });

        it("can get the right value if not present in the culture file and exists in grand parent", function () {
          var value;
          i18n.getValue(module, "key5", function (val) { value = val });
          expect(value).toBe("root 5");
        });

        it("can get the right complex value if it doesn't exist in parent cultures", function () {
          var value;
          i18n.getValue(module, "key3.key1", function (val) { value = val });
          expect(value).toBe("en-ca 3-1");
        });

        it("can get the right copmlex value if it exists in parent cultures", function () {
          var value;
          i18n.getValue(module, "key3.key2", function (val) { value = val });
          expect(value).toBe("en-ca 3-2");
        });

        it("can get the right complex value if not present in the culture file and exists in direct parent", function () {
          var value;
          i18n.getValue(module, "key3.key3", function (val) { value = val });
          expect(value).toBe("en 3-3");
        });

        it("can get the right complex value if not present in the culture file and exists in grand parent", function () {
          var value;
          i18n.getValue(module, "key3.key4", function (val) { value = val });
          expect(value).toBe("root 3-4");
        });

        it("can get the right value from a global file", function () {
          var value;
          i18n.getValue("global", "key1", function (val) { value = val });
          expect(value).toBe("global root 1");
        });
      });
    });

    describe("the value getter", function () {
      it("returns a promise if no callback is provided", function () {
        var value;
        var promise = i18n.getValue("global", "key1");
        expect(promise).not.toBeUndefined();
        expect(promise.then).not.toBeUndefined();

        promise.then(function (val) { value = val });

        expect(value).toBe("global fr-ca 1");
      });

      it("returns nothing if a callback is provided", function () {
        var value;
        var promise = i18n.getValue("global", "key1", function (val) { value = val });

        expect(promise).toBeUndefined();
        expect(value).toBe("global fr-ca 1");
      });

      it("returns an array if we ask for an array of keys", function () {
        var values;
        i18n.getValue("global", ["key1", "key2"], function (val) { values = val });

        expect($.isArray(values)).toBe(true);
        expect(values.length).toBe(2);
        expect(values[0]).toBe("global fr-ca 1");
        expect(values[1]).toBeUndefined();
      });
    });
  });

  describe("plugins/i18n with delay", function () {
    var dfds;

    beforeEach(function () {
      dfds = [];

      spyOn(system, "acquire").andCallFake(function (module) {
        var splitter = module.lastIndexOf(".");
        var moduleId = module.substring(0, splitter);
        var culture = module.substring(splitter + 1);

        var resourceFile = modules[moduleId][culture];
        var dfd = $.Deferred();
        
        dfds.push({
          resourceFile: resourceFile,
          dfd: dfd
        });

        return dfd;
      });
      
      i18n.install({ culture: "fr-ca", globalModules: "global" });
    });

    it("waits for the reception of all files to complete before calling the callback of a single value", function () {
      var value;
      i18n.getValue("global", "key1", function (val) { value = val; });

      expect(value).toBeUndefined();

      dfds[0].dfd.resolve(dfds[0].resourceFile);
      expect(value).toBeUndefined();

      dfds[2].dfd.resolve(dfds[2].resourceFile);
      expect(value).toBeUndefined();

      dfds[1].dfd.resolve(dfds[1].resourceFile);
      expect(value).toBe("global fr-ca 1");
    });

    it("waits for the reception of all files to complete before resolving the promise of a single value", function () {
      var value;
      i18n.getValue("global", "key1").then(function (val) { value = val; });

      expect(value).toBeUndefined();

      dfds[0].dfd.resolve(dfds[0].resourceFile);
      expect(value).toBeUndefined();

      dfds[2].dfd.resolve(dfds[2].resourceFile);
      expect(value).toBeUndefined();

      dfds[1].dfd.resolve(dfds[1].resourceFile);
      expect(value).toBe("global fr-ca 1");
    });

    it("waits for the reception of all files to complete before calling the callback of an array of values", function () {
      var value;
      i18n.getValue("global", ["key1", "key2"]).then(function (val) { value = val; });

      expect(value).toBeUndefined();

      dfds[0].dfd.resolve(dfds[0].resourceFile);
      expect(value).toBeUndefined();

      dfds[2].dfd.resolve(dfds[2].resourceFile);
      expect(value).toBeUndefined();

      dfds[1].dfd.resolve(dfds[1].resourceFile);
      expect($.isArray(value)).toBe(true);
      expect(value.length).toBe(2);
      expect(value[0]).toBe("global fr-ca 1");
      expect(value[1]).toBeUndefined();
    });

    it("waits for the reception of all files to complete before resolving the promise of an array of values", function () {
      var value;
      i18n.getValue("global", ["key1", "key2"]).then(function (val) { value = val; });

      expect(value).toBeUndefined();

      dfds[0].dfd.resolve(dfds[0].resourceFile);
      expect(value).toBeUndefined();

      dfds[2].dfd.resolve(dfds[2].resourceFile);
      expect(value).toBeUndefined();

      dfds[1].dfd.resolve(dfds[1].resourceFile);
      expect($.isArray(value)).toBe(true);
      expect(value.length).toBe(2);
      expect(value[0]).toBe("global fr-ca 1");
      expect(value[1]).toBeUndefined();
    });

  });
  describe("plugins/i18n with delay and culture change", function () {
    var dfds;

    beforeEach(function () {
      dfds = [];

      spyOn(system, "acquire").andCallFake(function (module) {
        var splitter = module.lastIndexOf(".");
        var moduleId = module.substring(0, splitter);
        var culture = module.substring(splitter + 1);

        var value = modules[moduleId][culture];

        return $.Deferred(function (dfd) {
          dfd.resolve(value);
        })
      });

      i18n.install({ culture: "fr-ca", globalModules: "global" });

      system.acquire.isSpy = false;

      spyOn(system, "acquire").andCallFake(function (module) {
        var splitter = module.lastIndexOf(".");
        var moduleId = module.substring(0, splitter);
        var culture = module.substring(splitter + 1);

        var resourceFile = modules[moduleId][culture];
        var dfd = $.Deferred();

        dfds.push({
          resourceFile: resourceFile,
          dfd: dfd
        });

        return dfd;
      });
    });

    it("waits for the reception of all files to complete after a culture change", function () {
      var value;
      i18n.getValue("global", "key1", function (val) { value = val; });

      expect(value).toBe("global fr-ca 1");

      i18n.changeCulture("en-ca");

      value = undefined;
      i18n.getValue("global", "key1", function (val) { value = val; });

      expect(value).toBeUndefined();

      dfds[0].dfd.resolve(dfds[0].resourceFile);
      expect(value).toBeUndefined();

      dfds[2].dfd.resolve(dfds[2].resourceFile);
      expect(value).toBeUndefined();

      dfds[1].dfd.resolve(dfds[1].resourceFile);
      expect(value).toBe("global root 1");
    });
  });
});