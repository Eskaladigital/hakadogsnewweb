-- =====================================================
-- VERIFICACIÓN SIMPLE: Artículos del Blog
-- =====================================================
-- Sin columna deleted_at
-- =====================================================

-- 1. ¿Cuántos artículos hay EN TOTAL?
SELECT COUNT(*) as total_articulos FROM blog_posts;

-- 2. Artículos por estado
SELECT 
  status,
  COUNT(*) as cantidad
FROM blog_posts
GROUP BY status
ORDER BY cantidad DESC;

-- 3. Ver TODOS los artículos (títulos y estado)
SELECT 
  id,
  title,
  status,
  created_at,
  updated_at
FROM blog_posts
ORDER BY created_at DESC;

-- 4. Últimas 10 modificaciones
SELECT 
  id,
  title,
  status,
  updated_at,
  ROUND(EXTRACT(EPOCH FROM (NOW() - updated_at)) / 60) as minutos_desde_modificacion
FROM blog_posts
ORDER BY updated_at DESC
LIMIT 10;
