-- =============================================
-- 🔍 DIAGNÓSTICO COMPLETO: PERMISOS RLS
-- =============================================
-- Este script verifica TODO el sistema de permisos
-- Ejecuta CADA SECCIÓN y copia los resultados
-- =============================================

-- =============================================
-- 1. VERIFICAR RLS HABILITADO
-- =============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename;

-- Resultado esperado: rls_habilitado = true en ambas

-- =============================================
-- 2. VERIFICAR POLÍTICAS EXISTENTES
-- =============================================
SELECT 
  tablename,
  policyname,
  cmd as operacion,
  roles,
  CASE 
    WHEN policyname LIKE '%view%' THEN 'Leer (SELECT)'
    WHEN policyname LIKE '%insert%' THEN 'Crear (INSERT)'
    WHEN policyname LIKE '%update%' THEN 'Actualizar (UPDATE)'
    ELSE 'Otro'
  END as tipo_permiso
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, cmd, policyname;

-- Resultado esperado: 8 políticas (4 por tabla)

-- =============================================
-- 3. VER DEFINICIÓN COMPLETA DE POLÍTICAS
-- =============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as condicion_lectura,
  with_check as condicion_escritura
FROM pg_policies
WHERE tablename = 'user_lesson_progress'
ORDER BY cmd, policyname;

-- Esto muestra las condiciones exactas de cada política

-- =============================================
-- 4. PROBAR ACCESO DIRECTO (COMO USUARIO AUTENTICADO)
-- =============================================
-- ⚠️ IMPORTANTE: Ejecuta esto MIENTRAS ESTÁS LOGUEADO en la app
-- Abre la app en otra pestaña, loguéate, y luego ejecuta esto:

-- Ver tu user_id actual
SELECT auth.uid() as mi_user_id;

-- Intentar leer tu propio progreso
SELECT * FROM user_lesson_progress 
WHERE user_id = auth.uid() 
LIMIT 5;

-- Si da error aquí, el problema está en las políticas

-- =============================================
-- 5. VERIFICAR FUNCIÓN auth.uid()
-- =============================================
-- Ver si auth.uid() funciona correctamente
SELECT 
  auth.uid() as user_id_actual,
  current_user as rol_actual,
  session_user as sesion_actual;

-- Si auth.uid() es NULL, el problema es autenticación

-- =============================================
-- 6. VERIFICAR DATOS EXISTENTES
-- =============================================
-- Ver si hay datos en las tablas
SELECT 
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_unicos
FROM user_lesson_progress;

SELECT 
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_unicos
FROM user_course_progress;

-- =============================================
-- 7. VERIFICAR ESTRUCTURA DE TABLAS
-- =============================================
-- Ver columnas de user_lesson_progress
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_lesson_progress'
ORDER BY ordinal_position;

-- Verificar que existe columna 'user_id' de tipo UUID

-- =============================================
-- 8. VERIFICAR FOREIGN KEYS
-- =============================================
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('user_lesson_progress', 'user_course_progress')
  AND tc.constraint_type = 'FOREIGN KEY';

-- Verificar que user_id apunta a auth.users(id)

-- =============================================
-- 9. PROBAR INSERCIÓN MANUAL
-- =============================================
-- ⚠️ Reemplaza 'TU_USER_ID' y 'UNA_LESSON_ID' con valores reales

-- Primero, obtener tu user_id:
-- SELECT auth.uid();

-- Luego, obtener una lesson_id válida:
-- SELECT id FROM course_lessons LIMIT 1;

-- Finalmente, intentar insertar:
/*
INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
VALUES (
  auth.uid(), -- Tu user_id
  'PONER_LESSON_ID_AQUI', -- Una lesson_id real
  true,
  NOW()
);
*/

-- Si esto da error, copia el mensaje completo

-- =============================================
-- 10. VERIFICAR TRIGGERS
-- =============================================
SELECT 
  trigger_name,
  event_manipulation as evento,
  event_object_table as tabla,
  action_statement as accion,
  action_timing as cuando
FROM information_schema.triggers
WHERE event_object_table IN ('user_lesson_progress', 'user_course_progress')
ORDER BY event_object_table, trigger_name;

-- Debe existir trigger_update_course_progress

-- =============================================
-- ✅ RESUMEN DE QUÉ REPORTAR
-- =============================================
-- Copia los resultados de:
-- - Sección 1: ¿RLS habilitado?
-- - Sección 2: ¿Cuántas políticas? (debe ser 8)
-- - Sección 3: Definición completa
-- - Sección 4: ¿Puedes leer tus datos?
-- - Sección 5: ¿auth.uid() retorna algo?
-- - Sección 9: ¿Qué error da al insertar?
-- =============================================
