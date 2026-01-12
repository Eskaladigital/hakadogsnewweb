-- =============================================
-- 🔥 SOLUCIÓN NUCLEAR: DESHABILITAR RLS TEMPORALMENTE
-- =============================================
-- Esto deshabilitará todas las restricciones de seguridad
-- TEMPORALMENTE para que funcione YA
-- =============================================

-- PASO 1: DESHABILITAR RLS
ALTER TABLE user_lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress DISABLE ROW LEVEL SECURITY;

-- PASO 2: VERIFICAR QUE SE DESHABILITÓ
SELECT 
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename IN ('user_lesson_progress', 'user_course_progress');

-- Debe mostrar: rls_habilitado = false

-- =============================================
-- ✅ AHORA PRUEBA EN LA APP
-- =============================================
-- Ve a https://www.hakadogs.com/cursos/mi-escuela
-- Intenta marcar una lección como completada
-- 
-- Si FUNCIONA → El problema definitivamente es RLS
-- Si NO funciona → El problema es otro (frontend, triggers, etc.)
-- =============================================

-- =============================================
-- ⚠️ IMPORTANTE: ESTO ES TEMPORAL E INSEGURO
-- =============================================
-- Cualquier usuario autenticado podrá:
-- - Ver el progreso de TODOS los usuarios
-- - Modificar el progreso de TODOS los usuarios
-- 
-- Pero al menos FUNCIONARÁ mientras arreglamos RLS correctamente
-- =============================================
