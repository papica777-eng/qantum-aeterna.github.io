@echo off
:: ═══════════════════════════════════════════════════════════════════════════════
:: QANTUM AUTO-DOCUMENTER - Quick Launcher
:: Run this to update all project statistics
:: ═══════════════════════════════════════════════════════════════════════════════

echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║          🔄 QANTUM AUTO-DOCUMENTER - Updating Statistics...              ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d c:\MisteMind
npx ts-node scripts/auto-documenter.ts

echo.
echo ═══════════════════════════════════════════════════════════════════════════════
echo Done! Press any key to exit...
pause > nul

