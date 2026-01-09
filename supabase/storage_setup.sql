-- =============================================
-- HAKADOGS - CONFIGURACIÓN STORAGE (BUCKETS Y POLÍTICAS)
-- =============================================

-- =============================================
-- CREAR BUCKETS
-- =============================================

-- Bucket para imágenes de cursos (thumbnails, banners)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para recursos descargables (PDFs, documentos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-resources',
  'course-resources',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para videos de cursos (opcional)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POLÍTICAS DE SEGURIDAD - COURSE-IMAGES
-- =============================================

-- Cualquiera puede VER las imágenes (público)
CREATE POLICY "course_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-images');

-- Solo admins pueden SUBIR imágenes
CREATE POLICY "course_images_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-images' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ACTUALIZAR imágenes
CREATE POLICY "course_images_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-images' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'course-images' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ELIMINAR imágenes
CREATE POLICY "course_images_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-images' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- =============================================
-- POLÍTICAS DE SEGURIDAD - COURSE-RESOURCES
-- =============================================

-- Solo usuarios con curso comprado pueden VER recursos
CREATE POLICY "course_resources_purchased_read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-resources' 
  AND (
    -- Admin puede ver todo
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR
    -- Usuario con curso comprado
    EXISTS (
      SELECT 1 
      FROM course_purchases cp
      WHERE cp.user_id = auth.uid()
      AND split_part(name, '/', 1) = cp.course_id::text
    )
  )
);

-- Solo admins pueden SUBIR recursos
CREATE POLICY "course_resources_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-resources'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ACTUALIZAR recursos
CREATE POLICY "course_resources_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-resources'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'course-resources'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ELIMINAR recursos
CREATE POLICY "course_resources_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-resources'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- =============================================
-- POLÍTICAS DE SEGURIDAD - COURSE-VIDEOS
-- =============================================

-- Cualquiera puede VER los videos (público)
CREATE POLICY "course_videos_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-videos');

-- Solo admins pueden SUBIR videos
CREATE POLICY "course_videos_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-videos'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ACTUALIZAR videos
CREATE POLICY "course_videos_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-videos'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'course-videos'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Solo admins pueden ELIMINAR videos
CREATE POLICY "course_videos_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-videos'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- =============================================
-- VERIFICACIÓN
-- =============================================

-- Ver todos los buckets creados
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('course-images', 'course-resources', 'course-videos');

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE 'course_%'
ORDER BY policyname;
