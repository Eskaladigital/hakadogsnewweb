-- =============================================
-- HAKADOGS - SETUP COMPLETO BASE DE DATOS
-- Para la web principal (cursos, no apps)
-- =============================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → SQL Editor
-- 2. Copia y pega este script completo
-- 3. Ejecuta (Run)
-- 4. Verifica que todo se creó correctamente
--
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PARTE 1: TABLAS DE CURSOS
-- =============================================

-- CURSOS (información general)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  icon TEXT DEFAULT '🎓',
  price DECIMAL(10,2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'basico',
  thumbnail_url TEXT,
  what_you_learn TEXT[],
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  total_lessons INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- LECCIONES/TEMAS de cada curso
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 5,
  video_url TEXT,
  video_provider TEXT,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- RECURSOS DESCARGABLES
CREATE TABLE IF NOT EXISTS course_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PROGRESO DEL USUARIO EN LECCIONES
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- COMPRAS DE CURSOS
CREATE TABLE IF NOT EXISTS course_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP DEFAULT NOW(),
  price_paid DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'completed',
  payment_method TEXT,
  payment_id TEXT,
  UNIQUE(user_id, course_id)
);

-- PROGRESO GENERAL DEL USUARIO EN CURSO
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- PARTE 2: ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON course_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_resources_lesson_id ON course_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course ON course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);

-- =============================================
-- PARTE 3: FUNCIONES Y TRIGGERS
-- =============================================

-- FUNCIÓN para actualizar el progreso del curso automáticamente
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_course_progress
  SET 
    completed_lessons = (
      SELECT COUNT(*) 
      FROM user_lesson_progress ulp
      JOIN course_lessons cl ON cl.id = ulp.lesson_id
      WHERE ulp.user_id = NEW.user_id 
        AND cl.course_id = (SELECT course_id FROM course_lessons WHERE id = NEW.lesson_id)
        AND ulp.completed = true
    ),
    total_lessons = (
      SELECT COUNT(*) 
      FROM course_lessons cl
      WHERE cl.course_id = (SELECT course_id FROM course_lessons WHERE id = NEW.lesson_id)
    ),
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND course_id = (SELECT course_id FROM course_lessons WHERE id = NEW.lesson_id);
  
  UPDATE user_course_progress
  SET 
    progress_percentage = CASE 
      WHEN total_lessons > 0 THEN (completed_lessons * 100 / total_lessons)
      ELSE 0
    END,
    completed = (completed_lessons = total_lessons AND total_lessons > 0),
    completed_at = CASE 
      WHEN completed_lessons = total_lessons AND total_lessons > 0 THEN NOW()
      ELSE completed_at
    END
  WHERE user_id = NEW.user_id 
    AND course_id = (SELECT course_id FROM course_lessons WHERE id = NEW.lesson_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER para actualizar progreso automáticamente
DROP TRIGGER IF EXISTS trigger_update_course_progress ON user_lesson_progress;
CREATE TRIGGER trigger_update_course_progress
AFTER INSERT OR UPDATE ON user_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_course_progress();

-- FUNCIÓN para actualizar duration total del curso
CREATE OR REPLACE FUNCTION update_course_duration()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET 
    duration_minutes = (
      SELECT COALESCE(SUM(duration_minutes), 0)
      FROM course_lessons
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    ),
    total_lessons = (
      SELECT COUNT(*)
      FROM course_lessons
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- TRIGGER para actualizar duración total del curso
DROP TRIGGER IF EXISTS trigger_update_course_duration ON course_lessons;
CREATE TRIGGER trigger_update_course_duration
AFTER INSERT OR UPDATE OR DELETE ON course_lessons
FOR EACH ROW
EXECUTE FUNCTION update_course_duration();

-- =============================================
-- PARTE 4: STORAGE (BUCKETS Y POLÍTICAS)
-- =============================================

-- Bucket para imágenes de cursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para recursos descargables
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-resources',
  'course-resources',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para videos de cursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- POLÍTICAS DE SEGURIDAD - COURSE-IMAGES
DROP POLICY IF EXISTS "course_images_public_read" ON storage.objects;
CREATE POLICY "course_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-images');

DROP POLICY IF EXISTS "course_images_admin_insert" ON storage.objects;
CREATE POLICY "course_images_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-images' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "course_images_admin_update" ON storage.objects;
CREATE POLICY "course_images_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-images' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'course-images' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "course_images_admin_delete" ON storage.objects;
CREATE POLICY "course_images_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-images' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- POLÍTICAS DE SEGURIDAD - COURSE-RESOURCES
DROP POLICY IF EXISTS "course_resources_purchased_read" ON storage.objects;
CREATE POLICY "course_resources_purchased_read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-resources' 
  AND (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR EXISTS (
      SELECT 1 FROM course_purchases cp
      WHERE cp.user_id = auth.uid()
      AND split_part(name, '/', 1) = cp.course_id::text
    )
  )
);

DROP POLICY IF EXISTS "course_resources_admin_insert" ON storage.objects;
CREATE POLICY "course_resources_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-resources' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "course_resources_admin_update" ON storage.objects;
CREATE POLICY "course_resources_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-resources' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'course-resources' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "course_resources_admin_delete" ON storage.objects;
CREATE POLICY "course_resources_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-resources' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- POLÍTICAS DE SEGURIDAD - COURSE-VIDEOS
DROP POLICY IF EXISTS "course_videos_public_read" ON storage.objects;
CREATE POLICY "course_videos_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-videos');

DROP POLICY IF EXISTS "course_videos_admin_insert" ON storage.objects;
CREATE POLICY "course_videos_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-videos' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "course_videos_admin_update" ON storage.objects;
CREATE POLICY "course_videos_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-videos' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'course-videos' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "course_videos_admin_delete" ON storage.objects;
CREATE POLICY "course_videos_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-videos' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================

-- Ver tablas creadas
SELECT 
  tablename, 
  schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'course%'
ORDER BY tablename;

-- Ver buckets creados
SELECT 
  id, 
  name, 
  public, 
  file_size_limit 
FROM storage.buckets 
WHERE id IN ('course-images', 'course-resources', 'course-videos');

-- Ver políticas de storage
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE 'course_%'
ORDER BY policyname;

-- =============================================
-- ✅ SI VES RESULTADOS CORRECTOS, ¡TODO LISTO!
-- =============================================
