@echo off
echo Cargando variables de entorno...
for /f "tokens=*" %%a in ('type .env.local ^| findstr "NEXT_PUBLIC_SUPABASE"') do set %%a
echo.
node scripts/test-insert-progress.js
pause
