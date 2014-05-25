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

      i18n.install({ culture: "fr-ca" });
    });

    describe("the culture fallback", function () {
      var module = { __moduleId__: "module1" };
      beforeEach(function () {
        binder.binding(module);
      });

      describe("after initialization", function () {
        it("can get the right value if present in the culture file and it doesn't exist in parent cultures", function () {
          expect(module.__i18n__().key1).toBe("fr-ca 1");
        });

        it("can get the right value if present in the culture file and exists in parent cultures", function () {
          expect(module.__i18n__().key2).toBe("fr-ca 2");
        });

        it("can get the right value if not present in the culture file and exists in direct parent", function () {
          expect(module.__i18n__().key4).toBe("fr 4");
        });

        it("can get the right value if not present in the culture file and exists in grand parent", function () {
          expect(module.__i18n__().key5).toBe("root 5");
        });

        it("can get the right complex value if it doesn't exist in parent cultures", function () {
          expect(module.__i18n__().key3.key1).toBe("fr-ca 3-1");
        });

        it("can get the right copmlex value if it exists in parent cultures", function () {
          expect(module.__i18n__().key3.key2).toBe("fr-ca 3-2");
        });

        it("can get the right complex value if not present in the culture file and exists in direct parent", function () {
          expect(module.__i18n__().key3.key3).toBe("fr 3-3");
        });

        it("can get the right complex value if not present in the culture file and exists in grand parent", function () {
          expect(module.__i18n__().key3.key4).toBe("root 3-4");
        });
      });

      describe("after culture change", function () {
        beforeEach(function () {
          i18n.changeCulture("en-ca");
        });

        it("can get the right value if present in the culture file and it doesn't exist in parent cultures", function () {
          expect(module.__i18n__().key1).toBe("en-ca 1");
        });

        it("can get the right value if present in the culture file and exists in parent cultures", function () {
          expect(module.__i18n__().key2).toBe("en-ca 2");
        });

        it("can get the right value if not present in the culture file and exists in direct parent", function () {
          expect(module.__i18n__().key4).toBe("en 4");
        });

        it("can get the right value if not present in the culture file and exists in grand parent", function () {
          expect(module.__i18n__().key5).toBe("root 5");
        });

        it("can get the right complex value if it doesn't exist in parent cultures", function () {
          expect(module.__i18n__().key3.key1).toBe("en-ca 3-1");
        });

        it("can get the right copmlex value if it exists in parent cultures", function () {
          expect(module.__i18n__().key3.key2).toBe("en-ca 3-2");
        });

        it("can get the right complex value if not present in the culture file and exists in direct parent", function () {
          expect(module.__i18n__().key3.key3).toBe("en 3-3");
        });

        it("can get the right complex value if not present in the culture file and exists in grand parent", function () {
          expect(module.__i18n__().key3.key4).toBe("root 3-4");
        });
      });

    });
  });
});