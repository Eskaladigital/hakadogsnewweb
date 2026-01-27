-- =====================================================
-- FIX: CONFIRMAR EMAIL DEL ADMINISTRADOR AUTOMÁTICAMENTE
-- =====================================================
-- Descripción: Este script confirma el email del administrador
--              para que pueda acceder desde cualquier dispositivo
-- Fecha: 27 enero 2026
-- Estado: URGENTE - Aplicar inmediatamente
-- =====================================================

-- PASO 1: Confirmar email del administrador actual
-- ⚠️ IMPORTANTE: Reemplaza 'admin@hakadogs.com' con tu email de administrador real

-- Opción A: Confirmar un administrador específico por email
UPDATE auth.users
SET 
  email_confirmed_at = NOW()
WHERE 
  email = 'admin@hakadogs.com' -- ⚠️ CAMBIAR ESTE EMAIL
  AND email_confirmed_at IS NULL;

-- Verificar que se aplicó correctamente
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@hakadogs.com'; -- ⚠️ CAMBIAR ESTE EMAIL


-- PASO 2: Confirmar email de TODOS los usuarios con rol admin
-- Esto asegura que cualquier admin pueda acceder desde cualquier dispositivo

UPDATE auth.users
SET 
  email_confirmed_at = NOW()
WHERE 
  id IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  )
  AND email_confirmed_at IS NULL;

-- Verificar que se aplicó correctamente a todos los admins
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.confirmed_at,
  ur.role,
  u.created_at
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC;


-- PASO 3: Crear función para confirmar email de administradores automáticamente
-- Esto asegura que futuros administradores también tengan acceso inmediato

CREATE OR REPLACE FUNCTION auto_confirm_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el usuario es asignado rol admin, confirmar su email automáticamente
  IF NEW.role = 'admin' THEN
    UPDATE auth.users
    SET 
      email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = NEW.user_id;
    
    RAISE NOTICE 'Email confirmado automáticamente para admin: %', NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger que se ejecuta cuando se asigna o actualiza un rol
DROP TRIGGER IF EXISTS trigger_auto_confirm_admin_email ON public.user_roles;

CREATE TRIGGER trigger_auto_confirm_admin_email
  AFTER INSERT OR UPDATE OF role ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.role = 'admin')
  EXECUTE FUNCTION auto_confirm_admin_email();


-- PASO 4: Crear función para verificar si el email del admin está confirmado
-- Esto es útil para debugging y verificación

CREATE OR REPLACE FUNCTION check_admin_email_confirmed()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  role TEXT,
  email_confirmed BOOLEAN,
  confirmed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email AS email,
    ur.role AS role,
    (u.email_confirmed_at IS NOT NULL) AS email_confirmed,
    u.confirmed_at AS confirmed_at
  FROM auth.users u
  INNER JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION check_admin_email_confirmed() TO authenticated;


-- PASO 5: Verificar la configuración actual de todos los administradores

SELECT 
  u.id,
  u.email,
  ur.role,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ NO CONFIRMADO'
  END AS status,
  u.email_confirmed_at,
  u.created_at
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC;


-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 
-- 1. Este script debe ejecutarse en el SQL Editor de Supabase
-- 2. Cambia 'admin@hakadogs.com' por tu email real de administrador
-- 3. El trigger asegura que futuros admins también tengan acceso inmediato
-- 4. Los administradores podrán acceder desde cualquier dispositivo/IP
-- 5. No afecta la seguridad: solo confirma emails de usuarios con rol admin
-- 
-- Para verificar manualmente:
-- SELECT * FROM check_admin_email_confirmed();
-- 
-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
