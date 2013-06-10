$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

function pause() {
    Write-Host "Press any key to continue ..."
    cmd /c pause | out-null
}

function buildDurandal(){
  $outFileNm = "../dist/durandal/js/durandal.debug.js"
  $outMinFileNm = "../dist/durandal/js/durandal.js"

  Write-Host "Building Durandal"
  cat durandal/js/*.js > withBOM.tmp
  $contents = Get-Content withBOM.tmp
  # writes the file without the BOM (cuases Uglify to fail if we don't)
  [System.IO.File]::WriteAllLines($outFileNm, $contents)
  $expr = "uglifyjs " + $outFileNm + " -mt -c -o " + $outMinFileNm
  invoke-expression $expr

  remove-item withBOM.tmp

  Copy-Item "durandal/css/durandal.css"  "../dist/durandal/css/"
  Copy-Item "durandal/images/*"  "../dist/durandal/images/"
}

function buildOptionalModules($folderName){
  Write-Host "Building $folderName"
  $moduleDirectory = $srcDir + "/" + $folderName + "/js";

  foreach($file in Get-ChildItem $moduleDirectory){
      $filePath = $moduleDirectory + "\" + $file;
      $contents = Get-Content -path $filePath
      $outFileNm = "../dist/durandal/js/" + $folderName + "/" + $file.BaseName + ".debug.js"
      $outMinFileNm = "../dist/durandal/js/" + $folderName + "/" + $file.name

      [System.IO.File]::WriteAllLines($outFileNm, $contents)
      $expr = "uglifyjs " + $outFileNm + " -mt -c -o " + $outMinFileNm
      invoke-expression $expr
  }
}

function buildSamples(){
  Write-Host "Building Samples"
  Copy-Item "samples/*" "../dist/samples" -recurse -force
}

function buildStarterKit(){
  Write-Host "Building StarterKit"
  Copy-Item "starterkit/*" "../dist/starterkit" -recurse -force
}

buildDurandal
buildOptionalModules "plugins"
buildOptionalModules "transitions"
buildSamples
buildStarterKit

pause