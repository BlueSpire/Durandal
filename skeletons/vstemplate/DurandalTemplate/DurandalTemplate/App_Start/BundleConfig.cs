using System;
using System.Web.Optimization;

namespace DurandalTemplate {
  public class BundleConfig {
    public static void RegisterBundles(BundleCollection bundles) {
      bundles.IgnoreList.Clear();
      AddDefaultIgnorePatterns(bundles.IgnoreList);

      bundles.Add(
        new ScriptBundle("~/scripts/vendor")
          .Include("~/scripts/app/vendor/jquery-1.7.min.js")
          .Include("~/scripts/app/vendor/knockout-2.2.0.js")
          .Include("~/scripts/app/vendor/sammy.js")
          .Include("~/scripts/app/vendor/bootstrap.min.js")
        );

      bundles.Add(
        new StyleBundle("~/css/vendor")
          .Include("~/css/bootstrap.min.css")
          .Include("~/css/bootstrap-responsive.min.css")
        );

      bundles.Add(
        new StyleBundle("~/css/app")
          .Include("~/css/app.css")
        );
    }

    public static void AddDefaultIgnorePatterns(IgnoreList ignoreList) {
      if(ignoreList == null) {
        throw new ArgumentNullException("ignoreList");
      }

      ignoreList.Ignore("*.intellisense.js");
      ignoreList.Ignore("*-vsdoc.js");
      ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
      //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
      //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
    }
  }
}