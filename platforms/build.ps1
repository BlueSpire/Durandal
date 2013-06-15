$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

$durandalJS = "../dist/durandal/js/*"
$durandalCSS = "../dist/durandal/css/*"
$durandalImages = "../dist/durandal/images/*"

$samplesApp = "../dist/samples/app/*"
$samplesCSS = "../dist/samples/css/*"

$starterKitApp = "../dist/starterkit/app/*"
$starterKitCSS = "../dist/starterkit/css/*"

function copyDurandal($jsDest, $cssDest, $imagesDest){
	Copy-Item $durandalJS $jsDest -recurse -force
	Copy-Item $durandalCSS $cssDest
	Copy-Item $durandalImages $imagesDest
}

function copySamples($appDest, $cssDest){
	Copy-Item $samplesApp $appDest -recurse -force
	Copy-Item $samplesCSS $cssDest
}

function copyStarterKit($appDest, $cssDest){
	Copy-Item $starterKitApp $appDest -recurse -force
	Copy-Item $starterKitCSS $cssDest
}

Write-Host "Building HTML/Samples"

copyDurandal "HTML/Samples/lib/durandal/js" `
	   		 "HTML/Samples/lib/durandal/css" `
		 	 "HTML/Samples/lib/durandal/img"

copySamples "HTML/Samples/app" `
		 	"HTML/Samples/css"

Write-Host "Building HTML/StarterKit"

copyDurandal "HTML/StarterKit/lib/durandal/js" `
	   		 "HTML/StarterKit/lib/durandal/css" `
		 	 "HTML/StarterKit/lib/durandal/img"

copyStarterKit "HTML/StarterKit/app" `
			   "HTML/StarterKit/css"

Write-Host "Building .NET/Samples"  

copyDurandal "Microsoft.NET/Samples/Durandal.Samples/Scripts/durandal" `
		 	 "Microsoft.NET/Samples/Durandal.Samples/Content" `
		 	 "Microsoft.NET/Samples/Durandal.Samples/Content/images"

copySamples "Microsoft.NET/Samples/Durandal.Samples/App" `
		 	"Microsoft.NET/Samples/Durandal.Samples/Content"

Write-Host "Building .NET/StarterKit"

copyDurandal "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Scripts/durandal" `
		 	 "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Content" `
		 	 "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Content/images"

copyStarterKit "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/App" `
		 	   "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Content"

Write-Host "Building .NET/Core Nuget Packages"

copyDurandal "Microsoft.NET/Nuget/Durandal/content/Scripts/durandal" `
		 	 "Microsoft.NET/Nuget/Durandal/content/Content" `
		 	 "Microsoft.NET/Nuget/Durandal/content/Content/images"

copyDurandal "Microsoft.NET/Nuget/Durandal.Transitions/content/Scripts/durandal" `
		 	 "Microsoft.NET/Nuget/Durandal.Transitions/content/Content" `
		 	 "Microsoft.NET/Nuget/Durandal.Transitions/content/Content/images"

Write-Host "Building .NET/StarterKit Nuget Package"

copyStarterKit "Microsoft.NET/Nuget/Durandal.StarterKit/content/App" `
		 	   "Microsoft.NET/Nuget/Durandal.StarterKit/content/Content"

Copy-Item "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/App_Start/DurandalBundleConfig.cs.pp" `
          "Microsoft.NET/Nuget/Durandal.StarterKit/content/App_Start" -recurse -force

Copy-Item "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Controllers/DurandalController.cs.pp" `
          "Microsoft.NET/Nuget/Durandal.StarterKit/content/Controllers" -recurse -force

Copy-Item "Microsoft.NET/StarterKit/vstemplate/DurandalTemplate/DurandalTemplate/Views/Durandal/*" `
          "Microsoft.NET/Nuget/Durandal.StarterKit/content/Views/Durandal" -recurse -force

Write-Host "Building Mimosa/StarterKit"

copyDurandal "Mimosa/StarterKit/assets/javascripts/vendor/durandal" `
		 	 "Mimosa/StarterKit/assets/stylesheets" `
		 	 "Mimosa/StarterKit/assets/images"

copyStarterKit "Mimosa/StarterKit/assets/javascripts/app" `
		 	   "Mimosa/StarterKit/assets/stylesheets"