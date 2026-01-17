-- =============================================
-- 🔴 FIX URGENTE: ERRORES 403 Y 406
-- =============================================
-- Ejecuta este script COMPLETO en Supabase SQL Editor
-- para solucionar los errores de progreso
-- 
-- Errores que soluciona:
-- ❌ 403 Forbidden en user_lesson_progress
-- ❌ 406 Not Acceptable en user_course_progress
-- 
-- Tiempo de ejecución: ~2 segundos
-- =============================================

-- =============================================
-- 1. POLÍTICAS PARA user_lesson_progress
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
-- 2. POLÍTICAS PARA user_course_progress
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
-- 3. VERIFICACIÓN
-- =============================================

-- Ver políticas creadas (deberías ver 8 filas)
SELECT 
  tablename,
  policyname,
  cmd as operacion,
  CASE 
    WHEN policyname LIKE '%admin%' THEN '🔑 Admin'
    ELSE '👤 Usuario'
  END as tipo
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, cmd, policyname;

-- =============================================
-- ✅ COMPLETADO
-- =============================================
-- Si ves 8 políticas arriba, ¡está solucionado!
-- 
-- Próximos pasos:
-- 1. Ir a https://www.hakadogs.com/cursos/mi-escuela
-- 2. Abrir DevTools (F12) → Console
-- 3. Recargar página (Ctrl+R)
-- 4. ✅ Ya NO deberías ver errores 403 ni 406
-- =============================================
