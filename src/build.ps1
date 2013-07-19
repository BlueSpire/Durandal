$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$distDir = [IO.Path]::GetFullPath( (join-path $srcDir "../dist") )
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding($False)

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
    $fileContent = Get-Content $startFragment, $filePath

    [System.IO.File]::WriteAllLines($outputPath, $fileContent, $Utf8NoBomEncoding)
  }

  $outputFolder = $distDir + "/durandal/css/";
  if ( -not (Test-Path $outputFolder) ) {New-Item $outputFolder  -Type Directory  | Out-Null}
  $fileContent = Get-Content "durandal/css/durandal.css"
  [System.IO.File]::WriteAllLines($outputFolder + "durandal.css", $fileContent, $Utf8NoBomEncoding)

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
    $fileContent = Get-Content $startFragment, $filePath

    [System.IO.File]::WriteAllLines($outputPath, $fileContent, $Utf8NoBomEncoding)
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