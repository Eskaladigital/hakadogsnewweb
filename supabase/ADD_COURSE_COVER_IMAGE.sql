-- =====================================================
-- AGREGAR CAMPO COVER_IMAGE_URL A TABLA COURSES
-- =====================================================
-- Descripción: Añade soporte para imagen de portada en cursos
-- Bucket de Storage: course-images
-- =====================================================

-- PASO 1: Agregar columna cover_image_url a la tabla courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- PASO 2: Agregar comentario a la columna
COMMENT ON COLUMN courses.cover_image_url IS 'URL de la imagen de portada del curso almacenada en storage bucket course-images';

-- PASO 3: Verificar que la columna se haya agregado correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'courses' 
  AND column_name = 'cover_image_url';

-- =====================================================
-- VERIFICAR BUCKET DE STORAGE
-- =====================================================
-- El bucket 'course-images' debe estar creado en Supabase Storage
-- con políticas RLS apropiadas:
-- - Lectura pública (para mostrar imágenes)
-- - Escritura solo para usuarios autenticados con rol admin
-- =====================================================

-- =====================================================
-- EJEMPLO DE USO
-- =====================================================
-- Actualizar un curso con imagen de portada:
-- UPDATE courses 
-- SET cover_image_url = 'https://your-project.supabase.co/storage/v1/object/public/course-images/curso-1.jpg'
-- WHERE id = 'course-id-here';
-- =====================================================
