-- Añadir campo audio_provider a las lecciones
-- Ejecuta este script en el SQL Editor de Supabase

ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS audio_provider TEXT DEFAULT NULL;

-- Verificar que se añadió correctamente
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'course_lessons' 
  AND column_name IN ('video_provider', 'audio_provider');
