@echo off
chcp 65001 > nul
echo =========================================================
echo   DIESEL POWER (الديزل باور) — E-COMMERCE SERVER
echo   Storefront: http://localhost:8000
echo   Admin Dashboard: http://localhost:8000/admin
echo =========================================================
cd /d "%~dp0"
python app.py
pause
