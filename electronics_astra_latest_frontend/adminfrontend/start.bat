@echo off
echo ========================================
echo ElectronicsAstra Admin Panel
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting admin panel on port 3071...
echo.
call npm run dev
