-- =====================================================
-- DIAGNÓSTICO Y CORRECCIÓN STORAGE blog-images
-- =====================================================

-- 1. Verificar si existe el bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'blog-images';

-- 2. Verificar políticas RLS activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY policyname;

-- 3. Verificar roles del usuario actual (ejecutar como admin autenticado)
SELECT 
  user_id,
  role,
  created_at
FROM public.user_roles
WHERE user_id = auth.uid();

-- =====================================================
-- SOLUCIÓN: Eliminar y recrear políticas correctamente
-- =====================================================

-- Eliminar todas las políticas anteriores
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin update" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

-- =====================================================
-- POLÍTICAS CORRECTAS CON VERIFICACIÓN DE AUTENTICACIÓN
-- =====================================================

-- 1. Lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Blog images public read"
ON storage.objects 
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 2. INSERT - Solo usuarios autenticados con rol admin
CREATE POLICY "Blog images admin insert"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 3. UPDATE - Solo usuarios autenticados con rol admin
CREATE POLICY "Blog images admin update"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 4. DELETE - Solo usuarios autenticados con rol admin
CREATE POLICY "Blog images admin delete"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY policyname;

-- Mostrar información del bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'blog-images';
