-- =====================================================
-- DIAGNÓSTICO: Problema subida imágenes blog
-- =====================================================
-- Ejecuta este script para diagnosticar problemas
-- con la subida de imágenes del blog
-- =====================================================

-- 1. VERIFICAR BUCKET
-- =====================================================
SELECT 
  'BUCKET' as tipo,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images') 
    THEN '✅ Bucket blog-images existe'
    ELSE '❌ Bucket blog-images NO existe'
  END as estado,
  id,
  name,
  public as es_publico,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'blog-images';

-- 2. VERIFICAR POLÍTICAS RLS
-- =====================================================
SELECT 
  'POLÍTICAS RLS' as tipo,
  policyname as nombre_politica,
  cmd as operacion,
  CASE 
    WHEN policyname LIKE '%blog%' THEN '✅ Política encontrada'
    ELSE '⚠️ Política no relacionada'
  END as estado
FROM pg_policies
WHERE tablename = 'objects'
AND (policyname LIKE '%blog%' OR policyname LIKE '%Blog%')
ORDER BY policyname;

-- 3. VERIFICAR FUNCIÓN is_admin
-- =====================================================
SELECT 
  'FUNCIÓN' as tipo,
  proname as nombre_funcion,
  CASE 
    WHEN prosecdef THEN '✅ SECURITY DEFINER activado'
    ELSE '❌ NO tiene SECURITY DEFINER'
  END as estado_security_definer,
  proacl as permisos
FROM pg_proc
WHERE proname = 'is_admin';

-- 4. VERIFICAR USUARIOS ADMIN
-- =====================================================
SELECT 
  'USUARIOS ADMIN' as tipo,
  u.email,
  ur.role as rol_en_tabla,
  CASE 
    WHEN public.is_admin(u.id) THEN '✅ Verificado como admin'
    ELSE '❌ NO verificado como admin'
  END as verificado,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin' OR u.email LIKE '%@%'
ORDER BY ur.role DESC NULLS LAST, u.created_at DESC
LIMIT 10;

-- 5. VERIFICAR POLÍTICAS DE user_roles (pueden bloquear la lectura)
-- =====================================================
SELECT 
  'POLÍTICAS user_roles' as tipo,
  policyname as nombre_politica,
  cmd as operacion,
  roles as roles_aplicables
FROM pg_policies
WHERE tablename = 'user_roles'
ORDER BY policyname;

-- 6. TEST: Verificar si la función is_admin funciona correctamente
-- =====================================================
-- Esto debería devolver TRUE para usuarios admin
SELECT 
  'TEST FUNCIÓN' as tipo,
  u.email,
  public.is_admin(u.id) as resultado_funcion,
  CASE 
    WHEN public.is_admin(u.id) = TRUE THEN '✅ Función funciona'
    WHEN public.is_admin(u.id) = FALSE AND ur.role = 'admin' THEN '⚠️ Usuario tiene rol pero función devuelve FALSE'
    ELSE 'ℹ️ Usuario no es admin'
  END as estado
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
LIMIT 5;

-- =====================================================
-- RESUMEN DE VERIFICACIONES
-- =====================================================
-- Si ves algún ❌ en los resultados, ese es el problema
-- 
-- Problemas comunes:
-- 1. ❌ Bucket NO existe → Ejecutar setup_blog_images_bucket.sql
-- 2. ❌ Políticas RLS no encontradas → Ejecutar FIX_BLOG_IMAGES_RLS.sql
-- 3. ❌ Función NO tiene SECURITY DEFINER → Ejecutar FIX_BLOG_IMAGES_RLS.sql
-- 4. ❌ Usuario NO verificado como admin → Asignar rol admin
-- 5. ❌ Email NO confirmado → Confirmar email del usuario
-- =====================================================
