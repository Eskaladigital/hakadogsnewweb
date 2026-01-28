-- =====================================================
-- FIX RÁPIDO: ASIGNAR ROL ADMIN A ALCHELIOS@GMAIL.COM
-- =====================================================
-- Este script es más simple y directo, sin ambigüedades
-- =====================================================

-- PASO 1: Asignar rol admin en user_roles
-- =====================================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'alchelios@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- PASO 2: Actualizar metadata en auth.users
-- =====================================================
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'alchelios@gmail.com';

-- PASO 3: Confirmar email si no está confirmado
-- =====================================================
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'alchelios@gmail.com';

-- PASO 4: Verificación - Estado de alchelios@gmail.com
-- =====================================================
SELECT 
  '🎯 ESTADO DE ALCHELIOS@GMAIL.COM' as titulo,
  u.email,
  ur.role as rol_en_user_roles,
  u.raw_user_meta_data->>'role' as rol_en_metadata,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ NO confirmado'
  END as email_status,
  CASE 
    WHEN public.is_admin(u.id) = TRUE THEN '✅ Es admin'
    ELSE '❌ NO es admin'
  END as verificacion_funcion
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchelios@gmail.com';

-- PASO 5: Verificación - Comparar ambos admins
-- =====================================================
SELECT 
  '📊 COMPARACIÓN DE ADMINISTRADORES' as titulo,
  u.email,
  ur.role as rol_tabla,
  u.raw_user_meta_data->>'role' as rol_metadata,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅' 
    ELSE '❌' 
  END as email_ok,
  CASE 
    WHEN public.is_admin(u.id) = TRUE THEN '✅' 
    ELSE '❌' 
  END as funcion_ok,
  CASE 
    WHEN ur.role = 'admin' 
      AND u.raw_user_meta_data->>'role' = 'admin' 
      AND u.email_confirmed_at IS NOT NULL 
      AND public.is_admin(u.id) = TRUE 
    THEN '✅✅✅ TODO OK'
    ELSE '❌ HAY PROBLEMAS'
  END as estado_final
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY u.email;

-- =====================================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- =====================================================
-- Si el resultado muestra "✅✅✅ TODO OK" para alchelios@gmail.com:
--
-- 1. El usuario debe CERRAR SESIÓN completamente
-- 2. Volver a INICIAR SESIÓN
-- 3. Ya podrá subir imágenes y cambiar roles
--
-- Si aún hay problemas después de esto:
-- - Ejecutar también: FIX_BLOG_IMAGES_RLS.sql
-- - Ejecutar también: FUNCION_UPDATE_USER_ROLE.sql
-- =====================================================
