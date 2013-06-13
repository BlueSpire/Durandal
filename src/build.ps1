$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$distDir = [IO.Path]::GetFullPath( (join-path $srcDir "../dist") )
$startFragment = $srcDir + "/start.jsfrag"

function buildDurandal(){
  Write-Host "Building Durandal"

  $moduleDirectory = $srcDir + "/durandal/js";

  foreach($file in Get-ChildItem $moduleDirectory){
    $filePath = $moduleDirectory + "/" + $file;
    $outputPath = $distDir + "/durandal/js/" + $file.name

    cat $startFragment, $filePath > $outputPath
  }

  Copy-Item "durandal/css/durandal.css" ($distDir + "/durandal/css/")
  Copy-Item "durandal/images/*" ($distDir + "/durandal/images/")
}

function buildOptionalModules($folderName){
  Write-Host "Building $folderName"

  $moduleDirectory = $srcDir + "/" + $folderName + "/js";

  foreach($file in Get-ChildItem $moduleDirectory){
      $filePath = $moduleDirectory + "/" + $file;
      $outputPath = $distDir + "/durandal/js/" + $folderName + "/" + $file.name

      cat $startFragment, $filePath > $outputPath
  }
}

function buildSamples(){
  Write-Host "Building Samples"
  Copy-Item "samples/*" ($distDir + "/samples") -recurse -force
}

function buildStarterKit(){
  Write-Host "Building StarterKit"
  Copy-Item "starterkit/*" ($distDir + "/starterkit") -recurse -force
}

buildDurandal
buildOptionalModules "plugins"
buildOptionalModules "transitions"
buildSamples
buildStarterKit