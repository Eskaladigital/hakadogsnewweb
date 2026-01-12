@echo off
REM Script de verificación rápida de RLS para Windows
REM USO: check-rls.bat

echo.
echo 🔍 Verificador Rapido de Politicas RLS
echo ========================================
echo.

REM Verificar si Node está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no esta instalado
    exit /b 1
)

REM Ejecutar script de verificación
node scripts\check-rls-policies.js

pause
