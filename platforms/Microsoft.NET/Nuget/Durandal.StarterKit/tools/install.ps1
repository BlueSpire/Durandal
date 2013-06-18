param($installPath, $toolsPath, $package, $project)

. (Join-Path $toolsPath common.ps1)

# VS 11 and above supports the new intellisense JS files
$vsVersion = [System.Version]::Parse($dte.Version)
$supportsJsIntelliSenseFile = $vsVersion.Major -ge 11

if (-not $supportsJsIntelliSenseFile) {
    $displayVersion = $vsVersion.Major
    Write-Host "IntelliSense JS files are not supported by your version of Visual Studio: $displayVersion"
    exit
}

# Update the _references.js file
AddOrUpdate-Reference $scriptsFolderProjectItem $requirejsFileNameRegEx $requirejsFileName