Durandal Release Checklist

1. Update Durandal Version
	* system.version
	* yuidoc.json
	* bower.json
	* vsix version
	* nuget versions and dependency versions
	* start.jsfrag
2. Build Durandal
3. Test All Starter Kits, Samples and Known Apps
4. Build Nugets - Durandal, Durandal.Transitions, Durandal.StarterKit
5. Test Nugets
6. Build VSIX
	* Copy Versioned Nugets to Packages folder
	* Update Package References in Files
	* Build
7. Test VSIX
8. Build Zips - Durandal, StarterKit, Samples
	* Include Changes.txt
	* Include License.txt
9. Update Website with New Downloads
10. Test Mimosa
11. Publish Bower 
	* Include License and Readme
	* Test Locally
	* Update Github
	* Github Tag
	* (Register with Bower)
12. Publish Mimosa Skeleton via Github
13. Publish Nugets
14. Publish VSIX
15. Release on Github
	* Tag with semver
	* Attach all artifacts
16. Publish Website