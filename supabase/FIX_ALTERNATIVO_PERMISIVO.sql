-- =============================================
-- 🔧 SOLUCIÓN ALTERNATIVA: POLÍTICAS MÁS PERMISIVAS
-- =============================================
-- Si auth.uid() no funciona, usamos una alternativa
-- que permite a TODOS los usuarios autenticados acceder
-- (menos seguro pero funcional)
-- =============================================

-- =============================================
-- OPCIÓN A: POLÍTICAS PERMISIVAS (SOLUCIÓN TEMPORAL)
-- =============================================

-- Para user_lesson_progress
DROP POLICY IF EXISTS "users_can_view_own_lesson_progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "users_can_insert_own_lesson_progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "users_can_update_own_lesson_progress" ON user_lesson_progress;

-- Permitir a todos los autenticados LEER su progreso
CREATE POLICY "authenticated_can_read_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING (true); -- ⚠️ Temporal: permite ver todo

-- Permitir a todos los autenticados CREAR progreso
CREATE POLICY "authenticated_can_insert_lesson_progress"
ON user_lesson_progress
FOR INSERT
TO authenticated
WITH CHECK (true); -- ⚠️ Temporal: permite crear para cualquier user_id

-- Permitir a todos los autenticados ACTUALIZAR progreso
CREATE POLICY "authenticated_can_update_lesson_progress"
ON user_lesson_progress
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true); -- ⚠️ Temporal: permite actualizar todo

-- Para user_course_progress
DROP POLICY IF EXISTS "users_can_view_own_course_progress" ON user_course_progress;
DROP POLICY IF EXISTS "users_can_insert_own_course_progress" ON user_course_progress;
DROP POLICY IF EXISTS "users_can_update_own_course_progress" ON user_course_progress;

-- Permitir a todos los autenticados LEER progreso de cursos
CREATE POLICY "authenticated_can_read_course_progress"
ON user_course_progress
FOR SELECT
TO authenticated
USING (true);

-- Permitir a todos los autenticados CREAR progreso de cursos
CREATE POLICY "authenticated_can_insert_course_progress"
ON user_course_progress
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir a todos los autenticados ACTUALIZAR progreso de cursos
CREATE POLICY "authenticated_can_update_course_progress"
ON user_course_progress
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verificar
SELECT 
  tablename,
  policyname,
  cmd as operacion
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, cmd;

-- =============================================
-- ⚠️ NOTA IMPORTANTE
-- =============================================
-- Estas políticas permiten a cualquier usuario autenticado
-- acceder a TODOS los datos de progreso, no solo los suyos.
-- 
-- Es una solución TEMPORAL para verificar que el problema
-- es auth.uid() y no otra cosa.
-- 
-- Si esto FUNCIONA, significa que el problema era auth.uid()
-- y necesitamos arreglarlo de otra forma.
-- =============================================

-- =============================================
-- PROBAR DESPUÉS DE EJECUTAR
-- =============================================
-- 1. Ve a https://www.hakadogs.com/cursos/mi-escuela
-- 2. Loguéate como estudiante
-- 3. Intenta marcar una lección como completada
-- 4. Si FUNCIONA, el problema era auth.uid()
-- 5. Si NO funciona, el problema es otro
-- =============================================
