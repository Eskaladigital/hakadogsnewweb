-- =============================================
-- ACTUALIZAR ROL DE USUARIO A ADMIN
-- =============================================
-- Este script actualiza el rol de un usuario en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Actualizar user_metadata con el rol admin
UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  updated_at = NOW()
WHERE email = 'contacto@eskaladigital.com';

-- 2. También actualizar app_metadata por si acaso
UPDATE auth.users
SET 
  raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  updated_at = NOW()
WHERE email = 'contacto@eskaladigital.com';

-- 3. Si existe la tabla profiles, actualizar también ahí
-- (Descomenta si tienes la tabla profiles)
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE email = 'contacto@eskaladigital.com';

-- VERIFICAR que se actualizó correctamente:
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as user_metadata_role,
  raw_app_meta_data->>'role' as app_metadata_role,
  email_confirmed_at
FROM auth.users 
WHERE email = 'contacto@eskaladigital.com';

-- IMPORTANTE: Después de ejecutar esto, el usuario debe:
-- 1. Cerrar sesión completamente
-- 2. Volver a iniciar sesión
-- Esto hará que los nuevos metadatos se carguen en la sesión
