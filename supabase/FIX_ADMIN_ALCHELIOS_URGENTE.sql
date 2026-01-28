-- =====================================================
-- FIX URGENTE: VERIFICAR Y CORREGIR ROL DE ALCHELIOS@GMAIL.COM
-- =====================================================
-- Usuario reportado: alchelios@gmail.com
-- Debe tener EXACTAMENTE los mismos permisos que contacto@eskaladigital.com
-- =====================================================

-- PASO 1: VERIFICAR ESTADO ACTUAL DE AMBOS ADMINISTRADORES
-- =====================================================
SELECT 
  '📊 ESTADO ACTUAL DE ADMINISTRADORES' as seccion,
  u.email,
  u.id as user_id,
  u.email_confirmed_at,
  ur.role as rol_en_user_roles,
  u.raw_user_meta_data->>'role' as rol_en_metadata,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status,
  CASE 
    WHEN ur.role = 'admin' THEN '✅ Tiene rol admin en user_roles'
    ELSE '❌ NO tiene rol admin en user_roles'
  END as status_user_roles,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN '✅ Tiene rol admin en metadata'
    ELSE '❌ NO tiene rol admin en metadata'
  END as status_metadata,
  CASE 
    WHEN public.is_admin(u.id) THEN '✅ Función is_admin() devuelve TRUE'
    ELSE '❌ Función is_admin() devuelve FALSE'
  END as status_funcion
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY u.email;


-- PASO 2: ASIGNAR/ACTUALIZAR ROL ADMIN A ALCHELIOS@GMAIL.COM
-- =====================================================
-- Esto asegura que alchelios@gmail.com tiene rol admin en user_roles

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'alchelios@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Verificar que se insertó/actualizó
SELECT 
  '✅ ROL ACTUALIZADO EN user_roles' as resultado,
  u.email,
  ur.role,
  ur.created_at,
  ur.updated_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchelios@gmail.com';


-- PASO 3: ACTUALIZAR METADATA EN auth.users
-- =====================================================
-- Esto es CRÍTICO para que el login y las políticas RLS funcionen

UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'alchelios@gmail.com';

-- Verificar que se actualizó
SELECT 
  '✅ ROL ACTUALIZADO EN METADATA' as resultado,
  email,
  raw_user_meta_data->>'role' as rol_metadata,
  raw_user_meta_data
FROM auth.users
WHERE email = 'alchelios@gmail.com';


-- PASO 4: CONFIRMAR EMAIL SI NO ESTÁ CONFIRMADO
-- =====================================================

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'alchelios@gmail.com';

-- Verificar
SELECT 
  '✅ EMAIL CONFIRMADO' as resultado,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ NO confirmado'
  END as status
FROM auth.users
WHERE email = 'alchelios@gmail.com';


-- PASO 5: VERIFICAR FUNCIÓN is_admin()
-- =====================================================

SELECT 
  '🔍 VERIFICACIÓN FUNCIÓN is_admin()' as seccion,
  email,
  public.is_admin(id) as es_admin,
  CASE 
    WHEN public.is_admin(id) = TRUE THEN '✅ CORRECTO: es_admin devuelve TRUE'
    ELSE '❌ ERROR: es_admin devuelve FALSE'
  END as resultado
FROM auth.users
WHERE email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY email;


-- PASO 6: COMPARACIÓN ENTRE AMBOS ADMINISTRADORES
-- =====================================================

SELECT 
  '📊 COMPARACIÓN DE PERMISOS' as seccion,
  u.email,
  ur.role,
  u.raw_user_meta_data->>'role' as metadata_role,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  public.is_admin(u.id) as funcion_is_admin,
  CASE 
    WHEN ur.role = 'admin' 
      AND u.raw_user_meta_data->>'role' = 'admin' 
      AND u.email_confirmed_at IS NOT NULL 
      AND public.is_admin(u.id) = TRUE 
    THEN '✅ TODO CORRECTO'
    ELSE '❌ HAY PROBLEMAS'
  END as estado_final
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY u.email;


-- PASO 7: VERIFICAR POLÍTICAS RLS DE STORAGE
-- =====================================================

SELECT 
  '🔐 POLÍTICAS RLS DE STORAGE (blog-images)' as seccion,
  policyname as politica,
  cmd as operacion,
  CASE 
    WHEN policyname LIKE '%blog%' THEN '✅ Política de blog-images'
    ELSE '⚠️ Otra política'
  END as tipo
FROM pg_policies
WHERE tablename = 'objects'
AND (policyname LIKE '%blog%' OR policyname LIKE '%Blog%')
ORDER BY policyname;


-- PASO 8: TEST DE PERMISOS EN STORAGE
-- =====================================================
-- Verificar que ambos usuarios pueden acceder al bucket

SELECT 
  '🧪 TEST DE PERMISOS EN STORAGE' as seccion,
  u.email,
  u.id as user_id,
  public.is_admin(u.id) as puede_subir_imagenes,
  CASE 
    WHEN public.is_admin(u.id) = TRUE 
    THEN '✅ PUEDE SUBIR imágenes al blog'
    ELSE '❌ NO PUEDE SUBIR imágenes'
  END as resultado
FROM auth.users u
WHERE u.email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY u.email;


-- =====================================================
-- RESUMEN FINAL
-- =====================================================

SELECT 
  '🎯 RESUMEN FINAL - ESTADO DE ALCHELIOS@GMAIL.COM' as titulo,
  email,
  CASE 
    WHEN ur.role = 'admin' THEN '✅ Sí' 
    ELSE '❌ No' 
  END as "Tiene rol en user_roles",
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN '✅ Sí' 
    ELSE '❌ No' 
  END as "Tiene rol en metadata",
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Sí' 
    ELSE '❌ No' 
  END as "Email confirmado",
  CASE 
    WHEN public.is_admin(u.id) = TRUE THEN '✅ Sí' 
    ELSE '❌ No' 
  END as "Función is_admin() OK",
  CASE 
    WHEN ur.role = 'admin' 
      AND u.raw_user_meta_data->>'role' = 'admin' 
      AND u.email_confirmed_at IS NOT NULL 
      AND public.is_admin(u.id) = TRUE 
    THEN '✅✅✅ TODO CONFIGURADO CORRECTAMENTE - PUEDE SUBIR IMÁGENES'
    ELSE '❌❌❌ HAY PROBLEMAS - REVISAR ARRIBA'
  END as "ESTADO FINAL"
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchelios@gmail.com';


-- =====================================================
-- INSTRUCCIONES ADICIONALES
-- =====================================================
-- Si después de ejecutar este script alchelios@gmail.com 
-- TODAVÍA no puede subir imágenes:
--
-- 1. Ejecutar también: FIX_BLOG_IMAGES_RLS.sql
--    (para asegurar que las políticas RLS de storage están correctas)
--
-- 2. El usuario debe CERRAR SESIÓN y VOLVER A INICIAR SESIÓN
--    para que los cambios en metadata surtan efecto
--
-- 3. Verificar en el navegador que la sesión se actualizó:
--    - Abrir DevTools (F12)
--    - Ir a Application > Local Storage
--    - Buscar la clave de Supabase
--    - Verificar que user_metadata.role = "admin"
-- =====================================================
