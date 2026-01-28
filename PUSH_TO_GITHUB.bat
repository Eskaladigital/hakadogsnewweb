@echo off
echo ========================================
echo PUSH FIX CRITICO DE STRIPE A GITHUB
echo ========================================
echo.

cd /d "e:\Acttax Dropbox\Narciso Pardo\Eskala IA\W - HAKADOGS\hakadogsnewweb"

echo [1/3] Verificando estado del repositorio...
git status
echo.

echo [2/3] Verificando commit local...
git log -1 --oneline
echo.

echo [3/3] Haciendo PUSH a GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   PUSH EXITOSO!
    echo ========================================
    echo.
    echo Ahora:
    echo 1. Ve a Vercel: https://vercel.com/eskaladigital/hakadogsnewweb
    echo 2. Espera el deploy automatico (3-5 min^)
    echo 3. Verifica en Deployments que el nuevo deploy este Ready
    echo 4. Haz una compra de prueba
    echo 5. Verifica en Logs que aparezca: "Compra registrada exitosamente"
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR EN EL PUSH
    echo ========================================
    echo.
    echo Posibles soluciones:
    echo 1. Abre GitHub Desktop y haz push desde ahi
    echo 2. Abre VS Code y usa la extension de Git
    echo 3. Ejecuta en PowerShell: git push origin main
    echo.
)

pause
