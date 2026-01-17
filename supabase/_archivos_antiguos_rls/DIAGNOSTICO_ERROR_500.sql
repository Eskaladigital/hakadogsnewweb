-- =====================================================
-- DIAGNÓSTICO COMPLETO - ERROR 500 PERSISTENTE
-- =====================================================
-- Ejecuta este script para ver qué está causando el error
-- =====================================================

-- 1. Verificar si hay OTROS triggers en auth.users que puedan causar problemas
SELECT 
  'TRIGGERS EN AUTH.USERS:' as seccion,
  tgname as trigger_name,
  proname as function_name,
  tgenabled as enabled,
  pg_get_triggerdef(t.oid) as definicion
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
AND tgname NOT LIKE 'pg_%';

-- 2. Verificar tablas que tienen foreign keys a auth.users
SELECT 
  'TABLAS CON FK A AUTH.USERS:' as seccion,
  tc.table_schema,
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name LIKE '%user_id%'
  AND tc.table_schema = 'public';

-- 3. Verificar políticas RLS en tablas públicas que puedan estar bloqueando
SELECT 
  'POLÍTICAS RLS ACTIVAS:' as seccion,
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Verificar funciones que usan SECURITY DEFINER (pueden causar problemas)
SELECT 
  'FUNCIONES SECURITY DEFINER:' as seccion,
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definicion
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true
  AND n.nspname IN ('public', 'auth')
ORDER BY n.nspname, p.proname;

-- 5. Verificar configuración de confirmación de email
-- (esto no se puede ver con SQL, hay que ir a Dashboard)

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script completo
-- 2. Copia TODOS los resultados (todas las secciones)
-- 3. Envíamelos para analizar qué puede estar causando el error
-- =====================================================
