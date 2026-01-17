-- =====================================================
-- SOLUCIÓN SIMPLE Y RÁPIDA - ERROR 500 REGISTRO
-- =====================================================
-- Copia y pega TODO este archivo en Supabase SQL Editor
-- y dale a "Run"
-- =====================================================

-- Eliminar el trigger que causa el problema
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;

-- Eliminar la función del trigger
DROP FUNCTION IF EXISTS create_user_with_role();

-- Verificar que se eliminó correctamente
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Trigger eliminado correctamente. Ahora puedes registrar usuarios sin error 500.'
    ELSE '❌ El trigger aún existe. Contacta soporte.'
  END as resultado
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created_create_role';

-- =====================================================
-- ✅ LISTO! 
-- =====================================================
-- Ahora ve a https://hakadogs.com/cursos/auth/registro
-- y prueba crear un nuevo usuario.
-- Debería funcionar sin error 500.
-- =====================================================
