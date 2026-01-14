@echo off
REM Script para descargar variables de entorno de Vercel y ejecutar importación

echo ================================
echo   DESCARGAR VARIABLES DE VERCEL
echo ================================
echo.

REM Verificar si Vercel CLI está instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI no esta instalado
    echo.
    echo Para instalarlo:
    echo   npm install -g vercel
    echo.
    echo O descarga las variables manualmente desde:
    echo   https://vercel.com/dashboard/project/settings/environment-variables
    echo.
    pause
    exit /b 1
)

echo [INFO] Descargando variables de entorno de Vercel...
echo.

REM Descargar variables de entorno (esto crea .env.local automáticamente)
vercel env pull .env.local

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudieron descargar las variables
    echo        Asegurate de estar autenticado: vercel login
    echo.
    pause
    exit /b 1
)

echo.
echo [EXITO] Variables descargadas en .env.local
echo.

REM Ejecutar importación
echo [INFO] Ejecutando importacion de articulos...
echo.

node scripts/run-import.js

pause
