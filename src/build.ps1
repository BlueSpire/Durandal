$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$distDir = [IO.Path]::GetFullPath( (join-path $srcDir "../dist") )

Remove-Item $distDir -Force -Recurse

$startFragment = $srcDir + "/start.jsfrag"

function buildDurandal(){
  Write-Host "Building Durandal"

  $moduleDirectory = $srcDir + "/durandal/js";
  $outputFolder = $distDir + "/durandal/js"

  if ( -not (Test-Path $outputFolder) ) {New-Item $outputFolder  -Type Directory  | Out-Null}

  foreach($file in Get-ChildItem $moduleDirectory){
    $filePath = $moduleDirectory + "/" + $file;
    $outputPath = $outputFolder + "/"+ $file.name
    
    Get-Content $startFragment, $filePath | Set-Content $outputPath
  }

  $outputFolder = $distDir + "/durandal/css/";
  if ( -not (Test-Path $outputFolder) ) {New-Item $outputFolder  -Type Directory  | Out-Null}
  Copy-Item "durandal/css/durandal.css" ($distDir + "/durandal/css/")

  $outputFolder = $distDir + "/durandal/images/";
  if ( -not (Test-Path $outputFolder) ) {New-Item $outputFolder  -Type Directory  | Out-Null}
  Copy-Item "durandal/images/*" ($distDir + "/durandal/images/")
}

function buildOptionalModules($folderName){
  Write-Host "Building $folderName"

  $moduleDirectory = $srcDir + "/" + $folderName + "/js";
  $outputFolder = $distDir + "/durandal/js/" + $folderName
  if ( -not (Test-Path $outputFolder) ) {New-Item $outputFolder  -Type Directory  | Out-Null}

  foreach($file in Get-ChildItem $moduleDirectory){
      $filePath = $moduleDirectory + "/" + $file;
      $outputPath =  $outputFolder + "/" + $file.name

      Get-Content $startFragment, $filePath | Set-Content $outputPath
  }
}

function buildSamples(){
  Write-Host "Building Samples"
  cmd /c robocopy.exe "./samples" ($distDir + "/samples") /e /np /r:1 /w:1
}

function buildStarterKit(){
  Write-Host "Building StarterKit"
  cmd /c robocopy.exe "./starterkit" ($distDir + "/starterkit") /e /np /r:1 /w:1
}

buildDurandal
buildOptionalModules "plugins"
buildOptionalModules "transitions"
buildSamples
buildStarterKit