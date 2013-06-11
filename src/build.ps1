$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$distDir = [IO.Path]::GetFullPath( (join-path $srcDir "../dist") )

function buildDurandal(){
  $outFileNm = $distDir + "/durandal/js/durandal.debug.js"
  $outMinFileNm = $distDir + "/durandal/js/durandal.js"

  Write-Host "Building Durandal"
  cat durandal/js/*.js > withBOM.tmp
  $contents = Get-Content withBOM.tmp
  # writes the file without the BOM (cuases Uglify to fail if we don't)
  [System.IO.File]::WriteAllLines($outFileNm, $contents)
  $expr = "uglifyjs " + $outFileNm + " -mt -c -o " + $outMinFileNm
  invoke-expression $expr

  remove-item withBOM.tmp

  Copy-Item "durandal/css/durandal.css" ($distDir + "/durandal/css/")
  Copy-Item "durandal/images/*" ($distDir + "/durandal/images/")
}

function buildOptionalModules($folderName){
  Write-Host "Building $folderName"
  $moduleDirectory = $srcDir + "/" + $folderName + "/js";

  foreach($file in Get-ChildItem $moduleDirectory){
      $filePath = $moduleDirectory + "\" + $file;
      $contents = Get-Content -path $filePath
      $outFileNm = $distDir + "/durandal/js/" + $folderName + "/" + $file.BaseName + ".debug.js"
      $outMinFileNm = $distDir + "/durandal/js/" + $folderName + "/" + $file.name

      [System.IO.File]::WriteAllLines($outFileNm, $contents)
      $expr = "uglifyjs " + $outFileNm + " -mt -c -o " + $outMinFileNm
      invoke-expression $expr
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