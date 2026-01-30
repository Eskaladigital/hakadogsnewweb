-- =====================================================
-- FIX: Permitir lectura de course_purchases para admins
-- EJECUTAR EN SUPABASE SQL EDITOR
-- =====================================================

-- Opción 1: Deshabilitar RLS completamente (más simple)
ALTER TABLE course_purchases DISABLE ROW LEVEL SECURITY;

-- Opción 2 (alternativa): Si prefieres mantener RLS pero permitir lectura a todos
-- DROP POLICY IF EXISTS "Allow read for authenticated" ON course_purchases;
-- CREATE POLICY "Allow read for authenticated" ON course_purchases
--   FOR SELECT TO authenticated USING (true);

-- También asegurar que courses sea legible
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Verificar que funcionó
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('course_purchases', 'courses');
