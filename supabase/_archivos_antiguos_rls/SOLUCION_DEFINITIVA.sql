-- =====================================================
-- SOLUCIÓN DEFINITIVA - ELIMINAR TODO LO RELACIONADO CON user_roles
-- =====================================================

-- 1. Ver qué triggers hay actualmente
SELECT 
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
AND tgname NOT LIKE 'pg_%';

-- 2. Eliminar TODOS los triggers relacionados con user_roles
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_create_role_safe ON auth.users;
DROP TRIGGER IF EXISTS create_user_role_trigger ON auth.users;

-- 3. Eliminar TODAS las funciones relacionadas con user_roles
DROP FUNCTION IF EXISTS create_user_with_role();
DROP FUNCTION IF EXISTS create_user_with_role_safe();
DROP FUNCTION IF EXISTS public.create_user_with_role();
DROP FUNCTION IF EXISTS public.create_user_with_role_safe();

-- 4. IMPORTANTE: NO eliminar el trigger de gamificación (create_user_stats_on_signup)
-- Este trigger SÍ lo necesitamos para que funcione la gamificación

-- 5. Verificar que solo quede el trigger de gamificación
SELECT 
  'TRIGGERS RESTANTES (debería solo estar create_user_stats_on_signup):' as info,
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
AND tgname NOT LIKE 'pg_%';

-- 6. OPCIONAL: Desactivar RLS en user_roles para evitar problemas futuros
-- (Si decides mantener la tabla pero sin que cause problemas)
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
-- Deberías ver solo 1 trigger:
-- - on_auth_user_created (para gamificación) ✅
-- 
-- NO deberías ver:
-- - on_auth_user_created_create_role ❌
-- - create_user_with_role_safe ❌
-- =====================================================
