-- =====================================================
-- FIX ERROR 406: Actualización de cursos bloqueada
-- EJECUTAR EN SUPABASE SQL EDITOR
-- =====================================================
-- 
-- PROBLEMA:
-- Error 406 (Not Acceptable) al intentar actualizar cursos
-- Esto ocurre cuando hay políticas RLS que bloquean la lectura
-- después de un UPDATE con .select()
--
-- SOLUCIÓN:
-- 1. Eliminar TODAS las políticas RLS de la tabla courses
-- 2. Asegurar que RLS esté DESHABILITADO
-- 3. Verificar que no queden políticas activas
-- =====================================================

-- PASO 1: Ver estado actual de RLS y políticas
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS HABILITADO'
    ELSE '🔓 RLS DESHABILITADO'
  END as estado_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'courses';

-- Ver políticas existentes en courses
SELECT 
  policyname,
  cmd as operacion,
  roles::text as roles_permitidos
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'courses';

-- =====================================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS RLS DE courses
-- =====================================================

-- Eliminar políticas de SELECT
DROP POLICY IF EXISTS "courses_read_published" ON courses;
DROP POLICY IF EXISTS "courses_read_all_admin" ON courses;
DROP POLICY IF EXISTS "admins_can_view_all_courses" ON courses;
DROP POLICY IF EXISTS "courses_public_read" ON courses;

-- Eliminar políticas de INSERT
DROP POLICY IF EXISTS "courses_insert_admin" ON courses;
DROP POLICY IF EXISTS "admins_can_insert_courses" ON courses;

-- Eliminar políticas de UPDATE
DROP POLICY IF EXISTS "courses_update_admin" ON courses;
DROP POLICY IF EXISTS "admins_can_update_courses" ON courses;

-- Eliminar políticas de DELETE
DROP POLICY IF EXISTS "courses_delete_admin" ON courses;
DROP POLICY IF EXISTS "admins_can_delete_courses" ON courses;

-- Eliminar cualquier otra política que pueda existir
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
          AND tablename = 'courses'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON courses', pol.policyname);
        RAISE NOTICE 'Política eliminada: %', pol.policyname;
    END LOOP;
END $$;

-- =====================================================
-- PASO 3: DESHABILITAR RLS EN courses
-- =====================================================

ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que RLS esté deshabilitado
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '❌ RLS AÚN HABILITADO - PROBLEMA'
    ELSE '✅ RLS DESHABILITADO - CORRECTO'
  END as estado_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'courses';

-- Verificar que no queden políticas
SELECT 
  COUNT(*) as politicas_restantes
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'courses';

-- Si el COUNT es 0, entonces está correcto
-- Si el COUNT es > 0, mostrar cuáles quedan
SELECT 
  policyname,
  cmd as operacion
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'courses';

-- =====================================================
-- ✅ RESULTADO ESPERADO
-- =====================================================
-- 
-- Después de ejecutar este script:
-- ✅ RLS debe estar DESHABILITADO en courses
-- ✅ No debe haber políticas RLS activas
-- ✅ El error 406 debería desaparecer
-- ✅ Los admins podrán actualizar cursos sin problemas
--
-- =====================================================
