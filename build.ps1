function pause() {
    Write-Host "Press any key to continue ..."
    cmd /c pause | out-null
}

push-location "src" -PassThru
./build.ps1
pop-location

push-location "platforms" -PassThru
./build.ps1
pop-location

pause