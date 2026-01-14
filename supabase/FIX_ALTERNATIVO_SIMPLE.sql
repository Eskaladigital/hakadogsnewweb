-- =====================================================
-- SOLUCIÓN ALTERNATIVA: REGISTRO SIN TABLA user_roles
-- =====================================================
-- Esta solución elimina la dependencia de la tabla user_roles
-- y usa solo los metadatos de Supabase Auth
-- =====================================================

-- OPCIÓN 1: Eliminar completamente el trigger problemático
-- =====================================================

-- 1. Eliminar el trigger que causa el error 500
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;

-- 2. Eliminar la función del trigger
DROP FUNCTION IF EXISTS create_user_with_role();

-- =====================================================
-- NOTA: Con esta solución, el rol se guarda únicamente en:
-- - auth.users.user_metadata.role (asignado desde el frontend)
-- - auth.users.raw_user_meta_data (respaldo automático)
-- 
-- Ya NO necesitamos la tabla user_roles para que funcione el registro
-- =====================================================

-- OPCIÓN 2: Mantener la tabla pero hacer el trigger opcional
-- =====================================================

-- Si prefieres mantener la tabla user_roles pero que no bloquee el registro:

CREATE OR REPLACE FUNCTION public.create_user_with_role_safe()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Intentar insertar el rol, pero si falla, no importa
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Si hay cualquier error, solo loguearlo pero no bloquear
      RAISE WARNING 'Could not create user role for %: %', NEW.id, SQLERRM;
  END;
  
  -- IMPORTANTE: Siempre retornar NEW para no bloquear el registro
  RETURN NEW;
END;
$$;

-- Crear el trigger con la función segura
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;
CREATE TRIGGER on_auth_user_created_create_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_with_role_safe();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver si el trigger existe
SELECT 
  tgname as trigger_name,
  proname as function_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created_create_role';

-- =====================================================
-- ¿CUÁL OPCIÓN USAR?
-- =====================================================

-- OPCIÓN 1 (RECOMENDADA): Sin tabla user_roles
-- - Más simple y sin puntos de fallo
-- - El rol se guarda en user_metadata
-- - Ya está implementado en el código frontend
-- - EJECUTA las primeras 5 líneas de este script

-- OPCIÓN 2: Con tabla user_roles "segura"
-- - Mantiene la tabla por si la necesitas después
-- - Usa función con manejo de errores
-- - No bloquea el registro si falla
-- - EJECUTA desde "OPCIÓN 2" hasta "VERIFICACIÓN"

-- =====================================================
-- RECOMENDACIÓN FINAL
-- =====================================================

-- Te recomiendo la OPCIÓN 1 (eliminar el trigger)
-- Porque:
-- ✅ El sistema actual NO usa la tabla user_roles
-- ✅ El código lee el rol desde user_metadata
-- ✅ Es más simple y menos propenso a errores
-- ✅ Funciona perfectamente sin esa tabla

-- Si ejecutas OPCIÓN 1, también puedes eliminar la tabla:
-- DROP TABLE IF EXISTS public.user_roles CASCADE;
-- (Pero esto es opcional, puedes dejarla para uso futuro)

-- =====================================================
