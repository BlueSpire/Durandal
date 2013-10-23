Durandal Release Checklist

1. Update Durandal Version
	* system.version
	* yuidoc.json
	* bower.json
	* vsix version
	* nuget versions and dependency versions
	* start.jsfrag
2. Build Durandal
3. Run Tests
4. Test All Starter Kits, Samples and Known Apps
5. Build Nugets - Durandal, Durandal.Transitions, Durandal.StarterKit
6. Test Nugets
7. Build VSIX
	* Copy Versioned Nugets to Packages folder
	* Update Package References in Files
	* Build
8. Test VSIX
9. Build Zips - Durandal, StarterKit, Samples
	* Include Changes.txt
	* Include License.txt
10. Update Website with New Downloads and API Docs
11. Test Mimosa
12. Merge version branch into master.
13. Publish Bower
	* Include License and Readme
	* Test Locally
	* Update Github
	* Github Tag
	* (Register with Bower)
14. Publish Mimosa Skeleton via Github
15. Publish Nugets
16. Publish VSIX
17. Publish TypeScript definitions
18. Release on Github
	* Tag with semver
	* Attach all artifacts
19. Publish Website