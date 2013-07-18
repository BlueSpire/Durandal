@echo off

if "%1"=="" goto start
if "%1"=="start" goto start
if "%1"=="startd" goto startd
if "%1"=="build" goto build
if "%1"=="build-opt" goto buildo
if "%1"=="buildo" goto buildo
if "%1"=="clean" goto clean
if "%1"=="pack" goto pack
if "%1"=="package" goto pack
if "%1"=="dist" goto dist
if "%1"=="distribute" goto dist

echo make: *** No rule to make target `%1'.  Stop.
goto exit

:start
    echo [x] Building assets and starting development server...
    mimosa watch -s

:startd
    echo [x] Cleaning compiled directory, building assets and starting development server..
    mimosa watch -sd

:build
    echo [x] Building assets...
    mimosa build

:buildo
    echo [x] Building and optimizing assets...
    mimosa build -o

:clean
    echo [x] Removing compiled files...
    mimosa clean

:pack
    echo [x] Building and packaging application...
    mimosa build -omp

:dist
    echo [x] Building and distributing application...
    call mimosa clean --force
    call mimosa build -om
    rmdir /S /Q dist
    xcopy /S /Q public dist\
    copy views\index-optimize.html dist\index.html

:exit
