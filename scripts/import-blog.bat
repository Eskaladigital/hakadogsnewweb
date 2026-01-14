@echo off
REM Script para importar artículos del blog desde CSV a Supabase
REM Uso: ejecutar desde la raíz del proyecto: .\scripts\import-blog.bat

echo ================================
echo   IMPORTAR BLOG DESDE CSV
echo ================================
echo.

REM Verificar que existe el archivo CSV
if not exist "Table 1-Grid view (1).csv" (
    echo [ERROR] No se encuentra el archivo: Table 1-Grid view ^(1^).csv
    echo        Asegurate de que este en la raiz del proyecto
    echo.
    pause
    exit /b 1
)

REM Verificar que existe el archivo .env.local
if not exist ".env.local" (
    echo [ERROR] No se encuentra el archivo .env.local
    echo        Necesitas configurar las variables de entorno:
    echo        - NEXT_PUBLIC_SUPABASE_URL
    echo        - SUPABASE_SERVICE_ROLE_KEY
    echo.
    pause
    exit /b 1
)

echo [INFO] Archivo CSV encontrado: Table 1-Grid view ^(1^).csv
echo [INFO] Archivo .env.local encontrado
echo.

REM Cargar variables de entorno del .env.local
for /f "tokens=*" %%a in (.env.local) do (
    set "%%a"
)

echo [INFO] Variables de entorno cargadas
echo.

REM Preguntar confirmación
echo ATENCION: Este script insertara/actualizara articulos en Supabase
echo           Los articulos con el mismo slug seran actualizados
echo.
set /p confirm="Deseas continuar? (S/N): "

if /i not "%confirm%"=="S" (
    echo.
    echo [CANCELADO] Importacion cancelada por el usuario
    pause
    exit /b 0
)

echo.
echo [EJECUTANDO] Importando articulos...
echo.

REM Ejecutar el script de Node.js
node scripts/import-blog-posts.js

echo.
echo ================================
echo   PROCESO COMPLETADO
echo ================================
echo.
pause
