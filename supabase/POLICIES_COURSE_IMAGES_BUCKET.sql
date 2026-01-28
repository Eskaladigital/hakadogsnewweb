-- =====================================================
-- POLÍTICAS RLS PARA BUCKET course-images
-- =====================================================
-- Este script configura las políticas de seguridad Row Level Security (RLS)
-- para el bucket 'course-images' en Supabase Storage
-- 
-- IMPORTANTE: El bucket 'course-images' debe existir y estar marcado como PÚBLICO
-- =====================================================

-- 1. Habilitar RLS en el bucket (si no está habilitado)
-- Nota: Esto ya debería estar habilitado por defecto en Supabase
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ELIMINAR POLÍTICAS ANTERIORES (si existen)
-- =====================================================
DROP POLICY IF EXISTS "Public read access for course-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload only for course-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update only for course-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete only for course-images" ON storage.objects;

-- =====================================================
-- 2. POLÍTICA DE LECTURA PÚBLICA
-- =====================================================
-- Permite que TODOS (autenticados o no) puedan VER las imágenes de portada
CREATE POLICY "Public read access for course-images"
ON storage.objects 
FOR SELECT
USING (bucket_id = 'course-images');

COMMENT ON POLICY "Public read access for course-images" ON storage.objects IS 
'Permite acceso de lectura público a las imágenes de portada de cursos';

-- =====================================================
-- 3. POLÍTICA DE INSERCIÓN (UPLOAD) SOLO ADMINS
-- =====================================================
-- Solo usuarios con rol 'admin' pueden SUBIR imágenes
CREATE POLICY "Admin upload only for course-images"
ON storage.objects 
FOR INSERT
WITH CHECK (
  bucket_id = 'course-images'
  AND (
    -- Verificar en tabla user_roles
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    -- Verificar en JWT metadata (fallback)
    (auth.jwt()->>'role')::text = 'admin'
  )
);

COMMENT ON POLICY "Admin upload only for course-images" ON storage.objects IS 
'Solo administradores pueden subir imágenes de portada de cursos';

-- =====================================================
-- 4. POLÍTICA DE ACTUALIZACIÓN SOLO ADMINS
-- =====================================================
-- Solo usuarios con rol 'admin' pueden ACTUALIZAR imágenes
CREATE POLICY "Admin update only for course-images"
ON storage.objects 
FOR UPDATE
USING (
  bucket_id = 'course-images'
  AND (
    -- Verificar en tabla user_roles
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    -- Verificar en JWT metadata (fallback)
    (auth.jwt()->>'role')::text = 'admin'
  )
);

COMMENT ON POLICY "Admin update only for course-images" ON storage.objects IS 
'Solo administradores pueden actualizar imágenes de portada de cursos';

-- =====================================================
-- 5. POLÍTICA DE ELIMINACIÓN SOLO ADMINS
-- =====================================================
-- Solo usuarios con rol 'admin' pueden ELIMINAR imágenes
CREATE POLICY "Admin delete only for course-images"
ON storage.objects 
FOR DELETE
USING (
  bucket_id = 'course-images'
  AND (
    -- Verificar en tabla user_roles
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    -- Verificar en JWT metadata (fallback)
    (auth.jwt()->>'role')::text = 'admin'
  )
);

COMMENT ON POLICY "Admin delete only for course-images" ON storage.objects IS 
'Solo administradores pueden eliminar imágenes de portada de cursos';

-- =====================================================
-- VERIFICAR POLÍTICAS CREADAS
-- =====================================================
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
  AND policyname LIKE '%course-images%'
ORDER BY policyname;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- Deberías ver 4 políticas:
-- 1. Public read access for course-images (SELECT)
-- 2. Admin upload only for course-images (INSERT)
-- 3. Admin update only for course-images (UPDATE)
-- 4. Admin delete only for course-images (DELETE)
-- =====================================================

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 
-- 1. Asegúrate de que el bucket 'course-images' existe en Storage
-- 2. Marca el bucket como PÚBLICO en la configuración
-- 3. Ejecuta este script completo en el SQL Editor de Supabase
-- 4. Verifica que las 4 políticas aparezcan en el resultado
-- 5. Prueba subiendo una imagen desde /administrator/cursos/editar/[id]
-- 
-- =====================================================
