-- =============================================
-- HAKADOGS - AGREGAR SISTEMA DE MÓDULOS
-- =============================================
-- Este script agrega la estructura de módulos a la base de datos existente
-- Permite organizar: Curso → Módulos → Lecciones

-- 1. CREAR TABLA DE MÓDULOS
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false, -- Si el módulo completo está bloqueado
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. AGREGAR CAMPO module_id A course_lessons
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL;

-- 3. ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);

-- 4. FUNCIÓN PARA OBTENER LECCIONES POR MÓDULO
CREATE OR REPLACE FUNCTION get_lessons_by_module(module_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  content TEXT,
  order_index INTEGER,
  duration_minutes INTEGER,
  video_url TEXT,
  video_provider TEXT,
  audio_url TEXT,
  audio_provider TEXT,
  is_free_preview BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cl.id,
    cl.title,
    cl.slug,
    cl.content,
    cl.order_index,
    cl.duration_minutes,
    cl.video_url,
    cl.video_provider,
    cl.audio_url,
    cl.audio_provider,
    cl.is_free_preview
  FROM course_lessons cl
  WHERE cl.module_id = module_id_param
  ORDER BY cl.order_index ASC;
END;
$$ LANGUAGE plpgsql;

-- 5. FUNCIÓN PARA OBTENER MÓDULOS CON CONTADOR DE LECCIONES
CREATE OR REPLACE FUNCTION get_course_modules_with_stats(course_id_param UUID, user_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  order_index INTEGER,
  total_lessons INTEGER,
  completed_lessons INTEGER,
  duration_minutes INTEGER,
  is_locked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.id,
    cm.title,
    cm.description,
    cm.order_index,
    COUNT(cl.id)::INTEGER as total_lessons,
    COUNT(ulp.id) FILTER (WHERE ulp.completed = true)::INTEGER as completed_lessons,
    COALESCE(SUM(cl.duration_minutes), 0)::INTEGER as duration_minutes,
    cm.is_locked
  FROM course_modules cm
  LEFT JOIN course_lessons cl ON cl.module_id = cm.id
  LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = cl.id AND ulp.user_id = user_id_param
  WHERE cm.course_id = course_id_param
  GROUP BY cm.id, cm.title, cm.description, cm.order_index, cm.is_locked
  ORDER BY cm.order_index ASC;
END;
$$ LANGUAGE plpgsql;

-- 6. GRANTS
GRANT SELECT ON course_modules TO authenticated;
GRANT EXECUTE ON FUNCTION get_lessons_by_module(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_modules_with_stats(UUID, UUID) TO authenticated;

-- =============================================
-- COMENTARIOS:
-- =============================================
-- Después de ejecutar este script:
-- 1. Todos los cursos seguirán funcionando (lecciones sin módulo)
-- 2. Puedes crear módulos nuevos desde el panel admin
-- 3. Puedes asignar lecciones existentes a módulos
-- 4. La UI puede mostrar módulos colapsables
-- 5. Compatible con la estructura anterior (lecciones sueltas)
