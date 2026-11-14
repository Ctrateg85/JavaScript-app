@echo off
chcp 65001 >nul
REM JavaScript — .exe ýasamak
REM Talap: Python 3 (py buýrugy) we internet (diňe ilkinji gezek, kitaphanalary gurnamak üçin)

cd /d "%~dp0"

echo [1/3] Gerek kitaphanalar gurnalýar (pywebview, pyinstaller)...
py -3 -m pip install --user --upgrade pywebview pyinstaller
if errorlevel 1 goto :error

echo [2/3] .exe ýygnalýar...
py -3 -m PyInstaller --noconfirm --clean --onefile --windowed --name JavaScript ^
  --add-data "index.html;." ^
  --add-data "css;css" ^
  --add-data "js;js" ^
  --add-data "books;books" ^
  --hidden-import lan ^
  main.py
if errorlevel 1 goto :error

echo [3/3] Taýýar!
echo.
echo   Faýl: %~dp0dist\JavaScript.exe
echo   Bu faýly islendik Windows 10/11 kompýuterine göçürip işledip bolýar.
echo   Maglumatlar şu ýerde saklanýar: %%APPDATA%%\JSOwren
echo.
pause
exit /b 0

:error
echo.
echo Ýalňyşlyk ýüze çykdy. Ýokardaky habary okaň.
pause
exit /b 1
