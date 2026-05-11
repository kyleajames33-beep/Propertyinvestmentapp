@echo off
REM ================================================================================
REM Property Investment App - Asset Verification Script
REM ================================================================================

echo.
echo ================================================================================
echo PROPERTY INVESTMENT APP - v1.1 RELEASE VERIFICATION
echo ================================================================================
echo.

REM Check icons folder
echo Checking icons folder...
if exist "icons\" (
    echo [OK] Icons folder exists

    REM Check individual icon files
    set /a icon_count=0
    if exist "icons\icon-72x72.png" (set /a icon_count+=1)
    if exist "icons\icon-96x96.png" (set /a icon_count+=1)
    if exist "icons\icon-128x128.png" (set /a icon_count+=1)
    if exist "icons\icon-144x144.png" (set /a icon_count+=1)
    if exist "icons\icon-152x152.png" (set /a icon_count+=1)
    if exist "icons\icon-192x192.png" (set /a icon_count+=1)
    if exist "icons\icon-384x384.png" (set /a icon_count+=1)
    if exist "icons\icon-512x512.png" (set /a icon_count+=1)

    echo [INFO] Found %icon_count% of 8 required icon files

    if %icon_count% EQU 8 (
        echo [OK] All icon files present!
    ) else (
        echo [WARNING] Missing some icon files. Use icon-generator.html to generate.
        echo.
        echo Missing files:
        if not exist "icons\icon-72x72.png" echo  - icon-72x72.png
        if not exist "icons\icon-96x96.png" echo  - icon-96x96.png
        if not exist "icons\icon-128x128.png" echo  - icon-128x128.png
        if not exist "icons\icon-144x144.png" echo  - icon-144x144.png
        if not exist "icons\icon-152x152.png" echo  - icon-152x152.png
        if not exist "icons\icon-192x192.png" echo  - icon-192x192.png
        if not exist "icons\icon-384x384.png" echo  - icon-384x384.png
        if not exist "icons\icon-512x512.png" echo  - icon-512x512.png
    )
) else (
    echo [ERROR] Icons folder not found! Creating it now...
    mkdir icons
    echo [INFO] Icons folder created. Use icon-generator.html to generate icons.
)
echo.

REM Check screenshots folder
echo Checking screenshots folder...
if exist "screenshots\" (
    echo [OK] Screenshots folder exists

    if exist "screenshots\ios\" (
        echo [OK] iOS screenshots folder exists
        dir /b "screenshots\ios\*.png" 2>nul | find /c /v "" > temp_count.txt
        set /p ios_count=<temp_count.txt
        del temp_count.txt
        echo [INFO] Found %ios_count% iOS screenshots (need at least 3)
    ) else (
        echo [WARNING] iOS screenshots folder missing. Creating it...
        mkdir "screenshots\ios"
    )

    if exist "screenshots\android\" (
        echo [OK] Android screenshots folder exists
        dir /b "screenshots\android\*.png" 2>nul | find /c /v "" > temp_count.txt
        set /p android_count=<temp_count.txt
        del temp_count.txt
        echo [INFO] Found %android_count% Android screenshots (need at least 2)
    ) else (
        echo [WARNING] Android screenshots folder missing. Creating it...
        mkdir "screenshots\android"
    )
) else (
    echo [ERROR] Screenshots folder not found! Creating structure now...
    mkdir screenshots
    mkdir screenshots\ios
    mkdir screenshots\android
    echo [INFO] Screenshots folders created. Use screenshot-guide.html to capture.
)
echo.

REM Check core files
echo Checking core files...
if exist "index.html" (echo [OK] index.html exists) else (echo [ERROR] index.html missing!)
if exist "manifest.json" (echo [OK] manifest.json exists) else (echo [ERROR] manifest.json missing!)
if exist "service-worker.js" (echo [OK] service-worker.js exists) else (echo [ERROR] service-worker.js missing!)
if exist "privacy.html" (echo [OK] privacy.html exists) else (echo [ERROR] privacy.html missing!)
echo.

REM Check documentation
echo Checking documentation...
if exist "NEXT-STEPS.md" (echo [OK] NEXT-STEPS.md exists) else (echo [WARNING] NEXT-STEPS.md missing)
if exist "app-store-checklist.md" (echo [OK] app-store-checklist.md exists) else (echo [WARNING] app-store-checklist.md missing)
if exist "icon-generator.html" (echo [OK] icon-generator.html exists) else (echo [WARNING] icon-generator.html missing)
if exist "screenshot-guide.html" (echo [OK] screenshot-guide.html exists) else (echo [WARNING] screenshot-guide.html missing)
echo.

REM Summary
echo ================================================================================
echo SUMMARY
echo ================================================================================
echo.
echo Next Steps:
echo  1. If icons are missing: Open icon-generator.html in browser
echo  2. If screenshots are missing: Open screenshot-guide.html in browser
echo  3. Update privacy.html contact info (Section 10)
echo  4. See NEXT-STEPS.md for complete guide
echo.
echo After assets are ready:
echo  - Follow app-store-checklist.md for submission process
echo  - Estimated time to release: 5-7 hours
echo.
echo ================================================================================
echo.
pause
