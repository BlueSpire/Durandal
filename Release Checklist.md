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
7. Test Mimosa
8. Build Zips - Durandal, StarterKit, Samples
	* Include Changes.txt
	* Include License.txt
	* Include Readme.md
9. Update Website with New Downloads, Documentation and API data
10. Merge version branch into master.
11. Publish Bower
	* Include License and Readme
	* Test Locally
	* Update Github
	* Github Tag
	* (Register with Bower)
12. Publish Mimosa Skeleton via Github
13. Publish Nugets
14. Publish VSIX
15. Publish TypeScript definitions
16. Release on Github
	* Tag with semver
	* Attach all artifacts
17. Publish Website