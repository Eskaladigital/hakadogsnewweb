-- =====================================================
-- VERIFICACIÓN RÁPIDA: Artículos del Blog
-- =====================================================
-- Ejecuta esto en Supabase SQL Editor AHORA
-- =====================================================

-- 1. ¿Cuántos artículos hay?
SELECT 
  '📊 TOTAL DE ARTÍCULOS' as info,
  COUNT(*) as cantidad
FROM blog_posts;

-- 2. Artículos por estado
SELECT 
  '📋 ARTÍCULOS POR ESTADO' as info,
  status,
  COUNT(*) as cantidad
FROM blog_posts
GROUP BY status
ORDER BY cantidad DESC;

-- 3. Últimas modificaciones (para ver si se borraron hace poco)
SELECT 
  '🕐 ÚLTIMAS MODIFICACIONES' as info,
  id,
  title,
  status,
  updated_at,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) / 60 as minutos_desde_modificacion
FROM blog_posts
ORDER BY updated_at DESC
LIMIT 10;

-- 4. ¿Hay columna deleted_at? (soft delete)
SELECT 
  '🗑️ ARTÍCULOS EN PAPELERA' as info,
  COUNT(*) as cantidad
FROM blog_posts
WHERE deleted_at IS NOT NULL;

-- 5. Ver artículos borrados recientemente (si existe la columna)
SELECT 
  id,
  title,
  status,
  deleted_at,
  EXTRACT(EPOCH FROM (NOW() - deleted_at)) / 60 as minutos_desde_borrado
FROM blog_posts
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC;
