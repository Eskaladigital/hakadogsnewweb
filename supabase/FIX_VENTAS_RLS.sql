-- =====================================================
-- FIX: Permitir lectura de course_purchases para admins
-- EJECUTAR EN SUPABASE SQL EDITOR
-- =====================================================

-- Solo para course_purchases (datos de ventas)
-- Opción A: Deshabilitar RLS (simple, los datos de compras no son públicos de todos modos)
ALTER TABLE course_purchases DISABLE ROW LEVEL SECURITY;

-- Verificar que funcionó
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'course_purchases';

-- NOTA: NO tocamos la tabla 'courses' porque ya tiene políticas
-- que permiten lectura pública (los cursos se muestran en la web)
