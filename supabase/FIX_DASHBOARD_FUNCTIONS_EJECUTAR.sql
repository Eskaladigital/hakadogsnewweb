-- =====================================================
-- FUNCIONES DASHBOARD - EJECUTAR EN SUPABASE SQL EDITOR
-- =====================================================
-- Fecha: 17 Feb 2026
-- NOTA: Estas funciones usan course_purchases (tabla real)
-- en lugar de user_courses (que no tiene datos)
-- =====================================================

-- =====================================================
-- 1. get_dashboard_stats - Estadísticas generales
-- =====================================================
DROP FUNCTION IF EXISTS get_dashboard_stats();

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM auth.users),
      'today', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM auth.users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),
      'admins', (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin')
    ),
    'courses', json_build_object(
      'total', (SELECT COUNT(*) FROM public.courses),
      'published', (SELECT COUNT(*) FROM public.courses WHERE is_published = true),
      'draft', (SELECT COUNT(*) FROM public.courses WHERE is_published = false),
      'free', (SELECT COUNT(*) FROM public.courses WHERE is_free = true),
      'paid', (SELECT COUNT(*) FROM public.courses WHERE is_free = false)
    ),
    'sales', json_build_object(
      'total', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date IS NOT NULL),
      'today', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE)),
      'revenue_total', (SELECT COALESCE(SUM(amount), 0) FROM public.course_purchases WHERE purchase_date IS NOT NULL),
      'revenue_today', (SELECT COALESCE(SUM(amount), 0) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE),
      'revenue_month', (SELECT COALESCE(SUM(amount), 0) FROM public.course_purchases WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE))
    ),
    'contacts', json_build_object(
      'total', (SELECT COUNT(*) FROM public.contacts),
      'pending', (SELECT COUNT(*) FROM public.contacts WHERE status = 'pending'),
      'in_progress', (SELECT COUNT(*) FROM public.contacts WHERE status = 'in_progress'),
      'responded', (SELECT COUNT(*) FROM public.contacts WHERE status = 'responded'),
      'today', (SELECT COUNT(*) FROM public.contacts WHERE created_at >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM public.contacts WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')
    ),
    'progress', json_build_object(
      'completed_courses', (SELECT COUNT(*) FROM public.user_course_progress WHERE progress_percentage = 100),
      'in_progress', (SELECT COUNT(*) FROM public.user_course_progress WHERE progress_percentage > 0 AND progress_percentage < 100),
      'avg_completion', (SELECT COALESCE(AVG(progress_percentage), 0) FROM public.user_course_progress)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;

-- =====================================================
-- 2. get_recent_sales - Ventas recientes
-- =====================================================
DROP FUNCTION IF EXISTS get_recent_sales(INTEGER);

CREATE OR REPLACE FUNCTION get_recent_sales(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  user_name TEXT,
  course_title TEXT,
  price_paid DECIMAL,
  purchase_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    u.email::TEXT as user_email,
    (u.raw_user_meta_data->>'name')::TEXT as user_name,
    c.title::TEXT as course_title,
    cp.amount as price_paid,
    cp.purchase_date
  FROM public.course_purchases cp
  INNER JOIN auth.users u ON cp.user_id = u.id
  INNER JOIN public.courses c ON cp.course_id = c.id
  WHERE cp.purchase_date IS NOT NULL
  ORDER BY cp.purchase_date DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_recent_sales(INTEGER) TO authenticated;

-- =====================================================
-- 3. get_sales_chart_data - Gráfica de ventas
-- =====================================================
DROP FUNCTION IF EXISTS get_sales_chart_data();

CREATE OR REPLACE FUNCTION get_sales_chart_data()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'month', TO_CHAR(month_date, 'Mon YYYY'),
      'sales_count', COALESCE(sales_count, 0),
      'revenue', COALESCE(revenue, 0)
    ) ORDER BY month_date
  )
  INTO result
  FROM (
    SELECT 
      DATE_TRUNC('month', purchase_date) as month_date,
      COUNT(*) as sales_count,
      SUM(amount) as revenue
    FROM public.course_purchases
    WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
      AND purchase_date IS NOT NULL
    GROUP BY DATE_TRUNC('month', purchase_date)
  ) monthly_data;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_sales_chart_data() TO authenticated;

-- =====================================================
-- 4. get_top_selling_courses - Cursos más vendidos
-- =====================================================
DROP FUNCTION IF EXISTS get_top_selling_courses(INTEGER);

CREATE OR REPLACE FUNCTION get_top_selling_courses(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  course_id UUID,
  title TEXT,
  sales_count BIGINT,
  revenue NUMERIC,
  avg_progress NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.title::TEXT,
    COUNT(cp.id) as sales_count,
    COALESCE(SUM(cp.amount), 0) as revenue,
    COALESCE(AVG(ucp.progress_percentage), 0) as avg_progress
  FROM public.courses c
  LEFT JOIN public.course_purchases cp ON c.id = cp.course_id AND cp.purchase_date IS NOT NULL
  LEFT JOIN public.user_course_progress ucp ON c.id = ucp.course_id
  WHERE c.is_free = false
  GROUP BY c.id, c.title
  ORDER BY sales_count DESC, revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_top_selling_courses(INTEGER) TO authenticated;

-- =====================================================
-- 5. get_conversion_metrics - Métricas de conversión
-- =====================================================
DROP FUNCTION IF EXISTS get_conversion_metrics();

CREATE OR REPLACE FUNCTION get_conversion_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_users INTEGER;
  users_with_purchases INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(DISTINCT user_id) INTO users_with_purchases 
    FROM public.course_purchases WHERE purchase_date IS NOT NULL;
  
  SELECT json_build_object(
    'total_users', total_users,
    'users_with_purchases', users_with_purchases,
    'conversion_rate', CASE 
      WHEN total_users > 0 THEN ROUND((users_with_purchases::DECIMAL / total_users * 100), 2)
      ELSE 0
    END,
    'avg_purchases_per_user', CASE
      WHEN users_with_purchases > 0 THEN ROUND(
        (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date IS NOT NULL)::DECIMAL / users_with_purchases, 2
      )
      ELSE 0
    END
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_conversion_metrics() TO authenticated;

-- =====================================================
-- 6. get_recent_contacts - Contactos recientes
-- =====================================================
DROP FUNCTION IF EXISTS get_recent_contacts(INTEGER);

CREATE OR REPLACE FUNCTION get_recent_contacts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  hours_since_created NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name::TEXT,
    c.email::TEXT,
    c.phone::TEXT,
    c.subject::TEXT,
    c.message::TEXT,
    c.status::TEXT,
    c.created_at,
    EXTRACT(EPOCH FROM (NOW() - c.created_at))/3600 as hours_since_created
  FROM public.contacts c
  ORDER BY c.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_recent_contacts(INTEGER) TO authenticated;

-- =====================================================
-- VERIFICACION RAPIDA
-- =====================================================

-- Verificar que todas las funciones existen
SELECT proname as funcion, prosecdef as security_definer
FROM pg_proc 
WHERE proname IN (
  'get_dashboard_stats', 
  'get_recent_users', 
  'get_recent_sales', 
  'get_sales_chart_data',
  'get_top_selling_courses',
  'get_conversion_metrics',
  'get_recent_contacts',
  'admin_update_user_role',
  'get_user_role',
  'is_admin'
)
ORDER BY proname;
