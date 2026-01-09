-- Script para crear usuario administrador en Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query

-- IMPORTANTE: Cambia estos valores por tus datos
-- Email: Tu email de administrador
-- Password: Tu contraseña (mínimo 6 caracteres)

-- Este script crea un usuario y lo confirma automáticamente
-- NO requiere confirmación de email

-- 1. Primero, asegúrate de que la confirmación de email esté desactivada
-- Ve a: Authentication → Providers → Email → Desactiva "Confirm email"

-- 2. Crea el usuario (CAMBIA EL EMAIL Y PASSWORD)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'contacto@eskaladigital.com', -- CAMBIA ESTO
  crypt('TU_PASSWORD_AQUI', gen_salt('bf')), -- CAMBIA ESTO
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin Hakadogs","role":"admin"}', -- Nombre y rol de admin
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 3. Crear identidad para el usuario
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'contacto@eskaladigital.com'), -- Mismo email de arriba
  jsonb_build_object('sub', (SELECT id::text FROM auth.users WHERE email = 'contacto@eskaladigital.com')),
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- ✅ LISTO! Ahora puedes hacer login con:
-- Email: contacto@eskaladigital.com (o el que pusiste)
-- Password: TU_PASSWORD_AQUI (el que pusiste)

-- VERIFICAR que el usuario se creó correctamente:
SELECT 
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data->>'name' as nombre,
  raw_user_meta_data->>'role' as rol
FROM auth.users 
WHERE email = 'contacto@eskaladigital.com';
