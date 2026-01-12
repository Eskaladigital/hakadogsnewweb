-- =============================================
-- SCRIPT DE VERIFICACIÓN: Estado Actual de Políticas RLS
-- =============================================
-- Ejecuta este script en Supabase SQL Editor para ver
-- qué políticas están actualmente configuradas
-- =============================================

-- Ver si RLS está habilitado en las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress',
  'courses',
  'course_lessons'
)
ORDER BY tablename;

-- Ver todas las políticas RLS existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress',
  'courses',
  'course_lessons',
  'course_modules',
  'course_resources',
  'course_purchases'
)
ORDER BY tablename, cmd, policyname;

-- Si no hay políticas, verás un resultado vacío en la segunda query
-- Eso confirma que necesitas ejecutar fix_rls_policies.sql
