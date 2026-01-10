-- =============================================
-- 🔒 HAKADOGS - POLÍTICAS DE SEGURIDAD RLS
-- =============================================
-- 
-- IMPORTANTE: Este script implementa Row Level Security (RLS)
-- para proteger el contenido de los cursos contra acceso no autorizado.
--
-- EJECUTAR EN: Supabase Dashboard → SQL Editor
--
-- =============================================

-- =============================================
-- PASO 1: ACTIVAR RLS EN TODAS LAS TABLAS
-- =============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PASO 2: POLÍTICAS PARA courses
-- =============================================

-- Lectura: Cursos publicados (público) o todos (admin)
DROP POLICY IF EXISTS "courses_read_published" ON courses;
CREATE POLICY "courses_read_published"
ON courses FOR SELECT
TO public
USING (is_published = true);

DROP POLICY IF EXISTS "courses_read_all_admin" ON courses;
CREATE POLICY "courses_read_all_admin"
ON courses FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Escritura: Solo admin
DROP POLICY IF EXISTS "courses_insert_admin" ON courses;
CREATE POLICY "courses_insert_admin"
ON courses FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "courses_update_admin" ON courses;
CREATE POLICY "courses_update_admin"
ON courses FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "courses_delete_admin" ON courses;
CREATE POLICY "courses_delete_admin"
ON courses FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 3: POLÍTICAS PARA course_lessons (CRÍTICO)
-- =============================================

-- Lectura para usuarios autenticados: Solo si compraste O es admin O es preview O curso gratis
DROP POLICY IF EXISTS "lessons_read_purchased" ON course_lessons;
CREATE POLICY "lessons_read_purchased"
ON course_lessons FOR SELECT
TO authenticated
USING (
  -- Es admin
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  -- Es preview gratuita
  is_free_preview = true
  OR
  -- Compró el curso
  EXISTS (
    SELECT 1 FROM course_purchases cp
    WHERE cp.user_id = auth.uid()
    AND cp.course_id = course_lessons.course_id
    AND cp.payment_status = 'completed'
  )
  OR
  -- El curso es gratuito Y publicado
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_lessons.course_id
    AND c.is_free = true
    AND c.is_published = true
  )
);

-- Lectura pública: Solo previews gratuitas y títulos (para listar lecciones)
DROP POLICY IF EXISTS "lessons_read_free_preview_public" ON course_lessons;
CREATE POLICY "lessons_read_free_preview_public"
ON course_lessons FOR SELECT
TO public
USING (
  is_free_preview = true
  OR
  -- Permitir leer título y metadatos básicos de cursos gratuitos publicados
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_lessons.course_id
    AND c.is_free = true
    AND c.is_published = true
  )
);

-- Escritura: Solo admin
DROP POLICY IF EXISTS "lessons_insert_admin" ON course_lessons;
CREATE POLICY "lessons_insert_admin"
ON course_lessons FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "lessons_update_admin" ON course_lessons;
CREATE POLICY "lessons_update_admin"
ON course_lessons FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "lessons_delete_admin" ON course_lessons;
CREATE POLICY "lessons_delete_admin"
ON course_lessons FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 4: POLÍTICAS PARA course_resources
-- =============================================

-- Lectura: Solo si compraste el curso O es admin
DROP POLICY IF EXISTS "resources_read_purchased" ON course_resources;
CREATE POLICY "resources_read_purchased"
ON course_resources FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  EXISTS (
    SELECT 1 FROM course_purchases cp
    JOIN course_lessons cl ON cl.course_id = cp.course_id
    WHERE cp.user_id = auth.uid()
    AND cl.id = course_resources.lesson_id
    AND cp.payment_status = 'completed'
  )
  OR
  -- Recursos de cursos gratuitos
  EXISTS (
    SELECT 1 FROM course_lessons cl
    JOIN courses c ON c.id = cl.course_id
    WHERE cl.id = course_resources.lesson_id
    AND c.is_free = true
    AND c.is_published = true
  )
);

-- Escritura: Solo admin
DROP POLICY IF EXISTS "resources_insert_admin" ON course_resources;
CREATE POLICY "resources_insert_admin"
ON course_resources FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "resources_update_admin" ON course_resources;
CREATE POLICY "resources_update_admin"
ON course_resources FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "resources_delete_admin" ON course_resources;
CREATE POLICY "resources_delete_admin"
ON course_resources FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 5: POLÍTICAS PARA user_lesson_progress
-- =============================================

-- Solo puedes ver/editar tu propio progreso (o admin ve todo)
DROP POLICY IF EXISTS "progress_read_own" ON user_lesson_progress;
CREATE POLICY "progress_read_own"
ON user_lesson_progress FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "progress_insert_own" ON user_lesson_progress;
CREATE POLICY "progress_insert_own"
ON user_lesson_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "progress_update_own" ON user_lesson_progress;
CREATE POLICY "progress_update_own"
ON user_lesson_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin puede eliminar progreso
DROP POLICY IF EXISTS "progress_delete_admin" ON user_lesson_progress;
CREATE POLICY "progress_delete_admin"
ON user_lesson_progress FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 6: POLÍTICAS PARA course_purchases
-- =============================================

-- Solo puedes ver tus propias compras (o admin ve todo)
DROP POLICY IF EXISTS "purchases_read_own" ON course_purchases;
CREATE POLICY "purchases_read_own"
ON course_purchases FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "purchases_insert_own" ON course_purchases;
CREATE POLICY "purchases_insert_own"
ON course_purchases FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Solo admin puede modificar/eliminar compras
DROP POLICY IF EXISTS "purchases_update_admin" ON course_purchases;
CREATE POLICY "purchases_update_admin"
ON course_purchases FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "purchases_delete_admin" ON course_purchases;
CREATE POLICY "purchases_delete_admin"
ON course_purchases FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 7: POLÍTICAS PARA user_course_progress
-- =============================================

-- Solo puedes ver tu propio progreso (o admin ve todo)
DROP POLICY IF EXISTS "course_progress_read_own" ON user_course_progress;
CREATE POLICY "course_progress_read_own"
ON user_course_progress FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "course_progress_insert_own" ON user_course_progress;
CREATE POLICY "course_progress_insert_own"
ON user_course_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "course_progress_update_own" ON user_course_progress;
CREATE POLICY "course_progress_update_own"
ON user_course_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin puede eliminar progreso
DROP POLICY IF EXISTS "course_progress_delete_admin" ON user_course_progress;
CREATE POLICY "course_progress_delete_admin"
ON user_course_progress FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- PASO 8: VERIFICACIÓN DE POLÍTICAS
-- =============================================

-- Ver políticas creadas para cada tabla
SELECT 
  schemaname,
  tablename,
  policyname,
  CASE cmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
  END as operation,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING presente'
    ELSE 'Sin USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK presente'
    ELSE 'Sin WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'courses',
  'course_lessons',
  'course_resources',
  'user_lesson_progress',
  'course_purchases',
  'user_course_progress'
)
ORDER BY tablename, policyname;

-- Verificar que RLS está activado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'courses',
  'course_lessons',
  'course_resources',
  'user_lesson_progress',
  'course_purchases',
  'user_course_progress'
)
ORDER BY tablename;

-- =============================================
-- ✅ SI VES "rls_enabled = true" EN TODAS, ¡LISTO!
-- =============================================

-- TEST: Verificar que un usuario normal NO puede ver lecciones sin comprar
-- (Ejecutar esto después de crear un usuario de prueba)
/*
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'user-id-de-prueba';
SET LOCAL request.jwt.claims.user_metadata TO '{"role": "user"}';

SELECT * FROM course_lessons LIMIT 1;
-- Debería devolver 0 filas si no ha comprado ningún curso

RESET ROLE;
*/
