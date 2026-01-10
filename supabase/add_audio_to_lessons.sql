-- Añadir campo audio_url a las lecciones
-- Ejecuta este script en el SQL Editor de Supabase

ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Verificar que se añadió correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'course_lessons' 
  AND column_name IN ('video_url', 'audio_url', 'content');
