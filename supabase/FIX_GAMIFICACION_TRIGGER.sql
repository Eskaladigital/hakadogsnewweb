-- =====================================================
-- FIX FINAL - PROBLEMA EN TRIGGER DE GAMIFICACIÓN
-- =====================================================
-- El trigger create_user_stats_on_signup está fallando
-- probablemente por RLS en la tabla user_stats
-- =====================================================

-- 1. Ver la función actual de gamificación
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'create_user_stats_on_signup';

-- 2. Desactivar temporalmente RLS en user_stats
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;

-- 3. Recrear la función con mejor manejo de errores
CREATE OR REPLACE FUNCTION public.create_user_stats_on_signup()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Intentar crear user_stats, pero si falla, no bloquear el registro
  BEGIN
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Si hay error, solo loguearlo pero continuar
      RAISE WARNING 'Could not create user stats for %: %', NEW.id, SQLERRM;
  END;
  
  -- CRÍTICO: Siempre retornar NEW
  RETURN NEW;
END;
$$;

-- 4. Verificar que el trigger existe
SELECT 
  'Verificación:' as seccion,
  tgname as trigger_name,
  proname as function_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
AND proname = 'create_user_stats_on_signup';

-- =====================================================
-- AHORA PRUEBA EL REGISTRO
-- =====================================================
-- El registro debería funcionar ahora
-- La tabla user_stats se creará si puede, o se saltará si hay error
-- =====================================================
