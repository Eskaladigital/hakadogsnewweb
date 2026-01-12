@echo off
echo.
echo ========================================
echo   Verificador Post-Fix
echo ========================================
echo.
echo Cargando variables de entorno...
for /f "tokens=*" %%a in ('type .env.local ^| findstr "NEXT_PUBLIC_SUPABASE"') do set %%a
echo.
node scripts/verify-fix.js
echo.
pause
