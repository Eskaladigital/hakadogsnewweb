-- =====================================================
-- POLÍTICAS RLS PARA BUCKET blog-images
-- (El bucket debe crearse manualmente desde el Dashboard)
-- =====================================================

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Imágenes públicas lectura" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden subir imágenes blog" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden actualizar imágenes blog" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden eliminar imágenes blog" ON storage.objects;

-- Permitir lectura pública de imágenes
CREATE POLICY "Imágenes públicas lectura"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Solo admins pueden subir imágenes
CREATE POLICY "Admins pueden subir imágenes blog"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Solo admins pueden actualizar imágenes
CREATE POLICY "Admins pueden actualizar imágenes blog"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Solo admins pueden eliminar imágenes
CREATE POLICY "Admins pueden eliminar imágenes blog"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
