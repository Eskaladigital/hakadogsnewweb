-- =====================================================
-- POLÍTICAS RLS PARA BUCKET blog-images
-- Ejecutar DESPUÉS de crear el bucket manualmente
-- =====================================================

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin update" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

-- 1. Permitir lectura pública de todas las imágenes del blog
CREATE POLICY "Blog images public read"
ON storage.objects 
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 2. Solo admins pueden subir imágenes
CREATE POLICY "Blog images admin insert"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 3. Solo admins pueden actualizar imágenes
CREATE POLICY "Blog images admin update"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 4. Solo admins pueden eliminar imágenes
CREATE POLICY "Blog images admin delete"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY policyname;
