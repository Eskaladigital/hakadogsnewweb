-- =============================================
-- FIX: POLÍTICAS RLS PARA PROGRESO DE CURSOS
-- =============================================
-- Este script soluciona los errores 403 y 406 en las tablas de progreso
-- Ejecuta este script en Supabase SQL Editor

-- =============================================
-- 1. HABILITAR RLS EN LAS TABLAS
-- =============================================

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. POLÍTICAS PARA user_lesson_progress
-- =============================================

-- Leer: Los usuarios pueden ver su propio progreso
DROP POLICY IF EXISTS "users_can_view_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_view_own_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insertar: Los usuarios pueden crear su propio progreso
DROP POLICY IF EXISTS "users_can_insert_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_insert_own_lesson_progress"
ON user_lesson_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Actualizar: Los usuarios pueden actualizar su propio progreso
DROP POLICY IF EXISTS "users_can_update_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_update_own_lesson_progress"
ON user_lesson_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todo
DROP POLICY IF EXISTS "admins_can_view_all_lesson_progress" ON user_lesson_progress;
CREATE POLICY "admins_can_view_all_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 3. POLÍTICAS PARA user_course_progress
-- =============================================

-- Leer: Los usuarios pueden ver su propio progreso
DROP POLICY IF EXISTS "users_can_view_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_view_own_course_progress"
ON user_course_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insertar: Los usuarios pueden crear su propio progreso
DROP POLICY IF EXISTS "users_can_insert_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_insert_own_course_progress"
ON user_course_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Actualizar: Los usuarios pueden actualizar su propio progreso
DROP POLICY IF EXISTS "users_can_update_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_update_own_course_progress"
ON user_course_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todo
DROP POLICY IF EXISTS "admins_can_view_all_course_progress" ON user_course_progress;
CREATE POLICY "admins_can_view_all_course_progress"
ON user_course_progress
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 4. POLÍTICAS PARA courses (lectura pública)
-- =============================================

-- Todos pueden ver cursos publicados
DROP POLICY IF EXISTS "courses_public_read" ON courses;
CREATE POLICY "courses_public_read"
ON courses
FOR SELECT
TO public
USING (is_published = true);

-- Admins pueden ver todos los cursos (incluidos no publicados)
DROP POLICY IF EXISTS "admins_can_view_all_courses" ON courses;
CREATE POLICY "admins_can_view_all_courses"
ON courses
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins pueden crear cursos
DROP POLICY IF EXISTS "admins_can_insert_courses" ON courses;
CREATE POLICY "admins_can_insert_courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins pueden actualizar cursos
DROP POLICY IF EXISTS "admins_can_update_courses" ON courses;
CREATE POLICY "admins_can_update_courses"
ON courses
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins pueden eliminar cursos
DROP POLICY IF EXISTS "admins_can_delete_courses" ON courses;
CREATE POLICY "admins_can_delete_courses"
ON courses
FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 5. POLÍTICAS PARA course_lessons
-- =============================================

-- Lectura pública: cualquiera puede ver lecciones de cursos publicados
DROP POLICY IF EXISTS "lessons_public_read" ON course_lessons;
CREATE POLICY "lessons_public_read"
ON course_lessons
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_lessons.course_id 
    AND courses.is_published = true
  )
);

-- Admins pueden hacer CRUD completo
DROP POLICY IF EXISTS "admins_can_manage_lessons" ON course_lessons;
CREATE POLICY "admins_can_manage_lessons"
ON course_lessons
FOR ALL
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 6. POLÍTICAS PARA course_modules
-- =============================================

-- Lectura pública: cualquiera puede ver módulos de cursos publicados
DROP POLICY IF EXISTS "modules_public_read" ON course_modules;
CREATE POLICY "modules_public_read"
ON course_modules
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_modules.course_id 
    AND courses.is_published = true
  )
);

-- Admins pueden hacer CRUD completo
DROP POLICY IF EXISTS "admins_can_manage_modules" ON course_modules;
CREATE POLICY "admins_can_manage_modules"
ON course_modules
FOR ALL
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 7. POLÍTICAS PARA course_resources
-- =============================================

-- Usuarios autenticados pueden ver recursos
DROP POLICY IF EXISTS "authenticated_can_view_resources" ON course_resources;
CREATE POLICY "authenticated_can_view_resources"
ON course_resources
FOR SELECT
TO authenticated
USING (true);

-- Admins pueden hacer CRUD completo
DROP POLICY IF EXISTS "admins_can_manage_resources" ON course_resources;
CREATE POLICY "admins_can_manage_resources"
ON course_resources
FOR ALL
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 8. POLÍTICAS PARA course_purchases
-- =============================================

-- Los usuarios pueden ver sus propias compras
DROP POLICY IF EXISTS "users_can_view_own_purchases" ON course_purchases;
CREATE POLICY "users_can_view_own_purchases"
ON course_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios pueden registrar sus propias compras
DROP POLICY IF EXISTS "users_can_insert_own_purchases" ON course_purchases;
CREATE POLICY "users_can_insert_own_purchases"
ON course_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todas las compras
DROP POLICY IF EXISTS "admins_can_view_all_purchases" ON course_purchases;
CREATE POLICY "admins_can_view_all_purchases"
ON course_purchases
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 9. VERIFICACIÓN DE POLÍTICAS
-- =============================================

-- Ver todas las políticas creadas para user_lesson_progress
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
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
ORDER BY tablename, policyname;

-- =============================================
-- ✅ POLÍTICAS RLS CONFIGURADAS CORRECTAMENTE
-- =============================================
