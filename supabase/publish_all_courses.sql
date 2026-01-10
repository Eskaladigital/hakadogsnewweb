-- Script para publicar todos los cursos y marcar el primero como gratuito
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Publicar todos los cursos
UPDATE courses 
SET is_published = true
WHERE is_published = false;

-- 2. Marcar el curso de Cachorros como gratuito (si existe)
UPDATE courses 
SET is_free = true
WHERE slug = 'cachorros' 
  AND is_free = false;

-- 3. Verificar los cambios
SELECT 
  id,
  title,
  slug,
  is_published,
  is_free,
  price
FROM courses
ORDER BY order_index;
