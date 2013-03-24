call mimosa clean --force
call mimosa build -mo

rmdir dist /S /Q
mkdir dist
xcopy public dist /S
copy views\index-optimize.html dist\index.html