-- =====================================================
-- SCRIPT DE VERIFICACIÓN DE FUNCIONES DEL DASHBOARD
-- Ejecuta este script para verificar que todas las funciones existen
-- =====================================================

-- 1. Verificar que todas las funciones existen
SELECT 
  routine_name as "Función",
  routine_type as "Tipo",
  data_type as "Tipo Retorno"
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'get_dashboard_stats',
    'get_recent_users',
    'get_recent_sales',
    'get_recent_contacts',
    'get_sales_chart_data',
    'get_top_selling_courses',
    'get_conversion_metrics',
    'get_user_role',
    'is_admin',
    'get_contacts_stats',
    'mark_contact_responded'
  )
ORDER BY routine_name;

-- 2. Verificar permisos de ejecución
SELECT 
  p.proname as "Función",
  pg_get_function_identity_arguments(p.oid) as "Parámetros",
  array_to_string(p.proacl, ', ') as "Permisos"
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'get_dashboard_stats',
    'get_recent_users',
    'get_recent_sales',
    'get_recent_contacts',
    'get_sales_chart_data',
    'get_top_selling_courses',
    'get_conversion_metrics',
    'get_user_role',
    'is_admin',
    'get_contacts_stats',
    'mark_contact_responded'
  )
ORDER BY p.proname;

-- 3. Probar ejecución de get_dashboard_stats (debe devolver JSON)
SELECT get_dashboard_stats() as "Resultado";

-- 4. Probar ejecución de get_recent_users (debe devolver tabla)
SELECT * FROM get_recent_users(5) LIMIT 5;

-- 5. Verificar que las tablas necesarias existen
SELECT 
  table_name as "Tabla",
  table_type as "Tipo"
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_roles', 'contacts', 'courses', 'user_courses', 'user_course_progress')
ORDER BY table_name;
