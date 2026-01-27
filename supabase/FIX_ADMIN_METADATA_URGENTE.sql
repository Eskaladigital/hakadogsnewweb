-- =====================================================
-- FIX URGENTE: ACTUALIZAR ROL EN USER_METADATA
-- =====================================================
-- Problema: El rol está en user_roles pero NO en user_metadata de Auth
-- Solución: Actualizar AMBOS lugares para que el login funcione
-- =====================================================

-- PASO 1: Verificar el estado actual del usuario
-- ⚠️ CAMBIAR el email por el del usuario que acabas de hacer admin

SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_en_metadata,
  ur.role as role_en_tabla,
  u.email_confirmed_at,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN '✅ Rol en metadata'
    ELSE '❌ Rol NO en metadata'
  END AS metadata_status,
  CASE 
    WHEN ur.role = 'admin' THEN '✅ Rol en tabla'
    ELSE '❌ Rol NO en tabla'
  END AS tabla_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchalfos@gmail.com';  -- ⚠️ CAMBIAR ESTE EMAIL


-- PASO 2: ACTUALIZAR el user_metadata en auth.users
-- Esto es CRÍTICO para que el login funcione
-- ⚠️ CAMBIAR el email por el del usuario

UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'alchalfos@gmail.com';  -- ⚠️ CAMBIAR ESTE EMAIL


-- PASO 3: ASEGURAR que también está en user_roles
-- ⚠️ CAMBIAR el email por el del usuario

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'alchalfos@gmail.com'  -- ⚠️ CAMBIAR ESTE EMAIL
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';


-- PASO 4: CONFIRMAR email si no está confirmado
-- ⚠️ CAMBIAR el email por el del usuario

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'alchalfos@gmail.com';  -- ⚠️ CAMBIAR ESTE EMAIL


-- PASO 5: VERIFICAR que TODO está correcto ahora
-- ⚠️ CAMBIAR el email por el del usuario

SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_en_metadata,
  ur.role as role_en_tabla,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END AS email_status,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN '✅ Rol en metadata (LOGIN OK)'
    ELSE '❌ Rol NO en metadata (LOGIN FALLARÁ)'
  END AS metadata_status,
  CASE 
    WHEN ur.role = 'admin' THEN '✅ Rol en tabla'
    ELSE '❌ Rol NO en tabla'
  END AS tabla_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchalfos@gmail.com';  -- ⚠️ CAMBIAR ESTE EMAIL


-- =====================================================
-- SOLUCIÓN COMPLETA PARA TODOS LOS ADMINS EXISTENTES
-- =====================================================
-- Actualizar TODOS los usuarios que tienen rol admin en user_roles
-- pero NO lo tienen en user_metadata

UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE id IN (
  SELECT user_id 
  FROM public.user_roles 
  WHERE role = 'admin'
)
AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' != 'admin');


-- =====================================================
-- CREAR FUNCIÓN PARA SINCRONIZAR ROL AUTOMÁTICAMENTE
-- =====================================================
-- Esta función se ejecutará automáticamente cuando se asigne rol admin

CREATE OR REPLACE FUNCTION sync_role_to_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar raw_user_meta_data en auth.users con el nuevo rol
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('role', NEW.role)
      ELSE raw_user_meta_data || jsonb_build_object('role', NEW.role)
    END,
    -- También confirmar email si es admin
    email_confirmed_at = CASE 
      WHEN NEW.role = 'admin' THEN COALESCE(email_confirmed_at, NOW())
      ELSE email_confirmed_at
    END
  WHERE id = NEW.user_id;
  
  RAISE NOTICE 'Rol sincronizado a user_metadata para usuario: %', NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_sync_role_to_metadata ON public.user_roles;

-- Crear nuevo trigger que sincroniza rol a metadata
CREATE TRIGGER trigger_sync_role_to_metadata
  AFTER INSERT OR UPDATE OF role ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION sync_role_to_user_metadata();


-- =====================================================
-- VERIFICAR TODOS LOS ADMINISTRADORES
-- =====================================================

SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_metadata,
  ur.role as role_tabla,
  u.email_confirmed_at IS NOT NULL as email_confirmado,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' AND ur.role = 'admin' THEN '✅ TODO OK'
    WHEN ur.role = 'admin' AND u.raw_user_meta_data->>'role' != 'admin' THEN '⚠️ FALTA metadata'
    WHEN u.raw_user_meta_data->>'role' = 'admin' AND ur.role != 'admin' THEN '⚠️ FALTA tabla'
    ELSE '❌ ERROR'
  END AS estado
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin' OR u.raw_user_meta_data->>'role' = 'admin'
ORDER BY u.created_at DESC;


-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 
-- 1. Cambia 'alchalfos@gmail.com' por el email del usuario en los PASOS 1-5
-- 2. Ejecuta TODOS los comandos en orden
-- 3. El usuario debe CERRAR SESIÓN y volver a iniciar sesión
-- 4. Ahora debería poder acceder a /administrator
-- 
-- IMPORTANTE:
-- - El trigger ahora sincronizará automáticamente el rol a user_metadata
-- - Futuros administradores no necesitarán este fix manual
-- - El rol debe estar en AMBOS lugares: user_roles Y user_metadata
-- 
-- =====================================================
