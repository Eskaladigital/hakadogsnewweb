-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA BLOG
-- =====================================================

-- Crear bucket para imágenes del blog (similar a course-images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- POLÍTICAS DE ACCESO
-- =====================================================

-- Permitir lectura pública de imágenes
DROP POLICY IF EXISTS "Imágenes públicas lectura" ON storage.objects;
CREATE POLICY "Imágenes públicas lectura"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Solo admins pueden subir imágenes
DROP POLICY IF EXISTS "Admins pueden subir imágenes blog" ON storage.objects;
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
DROP POLICY IF EXISTS "Admins pueden actualizar imágenes blog" ON storage.objects;
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
DROP POLICY IF EXISTS "Admins pueden eliminar imágenes blog" ON storage.objects;
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

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE storage.buckets IS 'Buckets de almacenamiento - blog-images añadido para imágenes de artículos';
