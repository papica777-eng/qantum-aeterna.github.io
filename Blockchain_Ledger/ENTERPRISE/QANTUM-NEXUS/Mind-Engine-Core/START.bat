@echo off
echo.
echo ========================================
echo    QANTUM SERVER - Starting...
echo ========================================
echo.

cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

:: Check if dist exists
if not exist "dist" (
    echo Building TypeScript...
    npm run build
)

:: Start server
echo Starting server on port 3000...
echo.
node dist/start-server.js

pause
