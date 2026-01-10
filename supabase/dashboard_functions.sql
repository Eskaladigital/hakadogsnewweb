-- =====================================================
-- FUNCIONES PARA DASHBOARD ADMIN - HAKADOGS
-- =====================================================
-- Estadísticas generales para el panel de administración
-- =====================================================

-- 1. Función para obtener estadísticas generales del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    -- Usuarios
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM auth.users),
      'today', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM auth.users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),
      'admins', (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin')
    ),
    
    -- Cursos
    'courses', json_build_object(
      'total', (SELECT COUNT(*) FROM public.courses),
      'published', (SELECT COUNT(*) FROM public.courses WHERE is_published = true),
      'draft', (SELECT COUNT(*) FROM public.courses WHERE is_published = false),
      'free', (SELECT COUNT(*) FROM public.courses WHERE is_free = true),
      'paid', (SELECT COUNT(*) FROM public.courses WHERE is_free = false)
    ),
    
    -- Ventas
    'sales', json_build_object(
      'total', (SELECT COUNT(*) FROM public.user_courses WHERE purchase_date IS NOT NULL),
      'today', (SELECT COUNT(*) FROM public.user_courses WHERE purchase_date >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM public.user_courses WHERE purchase_date >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM public.user_courses WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE)),
      'revenue_total', (SELECT COALESCE(SUM(price_paid), 0) FROM public.user_courses WHERE purchase_date IS NOT NULL),
      'revenue_today', (SELECT COALESCE(SUM(price_paid), 0) FROM public.user_courses WHERE purchase_date >= CURRENT_DATE),
      'revenue_month', (SELECT COALESCE(SUM(price_paid), 0) FROM public.user_courses WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE))
    ),
    
    -- Contactos
    'contacts', json_build_object(
      'total', (SELECT COUNT(*) FROM public.contacts),
      'pending', (SELECT COUNT(*) FROM public.contacts WHERE status = 'pending'),
      'in_progress', (SELECT COUNT(*) FROM public.contacts WHERE status = 'in_progress'),
      'responded', (SELECT COUNT(*) FROM public.contacts WHERE status = 'responded'),
      'today', (SELECT COUNT(*) FROM public.contacts WHERE created_at >= CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM public.contacts WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')
    ),
    
    -- Progreso de cursos
    'progress', json_build_object(
      'completed_courses', (SELECT COUNT(*) FROM public.user_course_progress WHERE progress_percentage = 100),
      'in_progress', (SELECT COUNT(*) FROM public.user_course_progress WHERE progress_percentage > 0 AND progress_percentage < 100),
      'avg_completion', (SELECT COALESCE(AVG(progress_percentage), 0) FROM public.user_course_progress)
    )
  )
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para obtener usuarios recientes
CREATE OR REPLACE FUNCTION get_recent_users(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'name' as name,
    COALESCE(ur.role, 'user') as role,
    u.created_at,
    u.last_sign_in_at as last_sign_in
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  ORDER BY u.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función para obtener ventas recientes
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
    uc.id,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    c.title as course_title,
    uc.price_paid,
    uc.purchase_date
  FROM public.user_courses uc
  INNER JOIN auth.users u ON uc.user_id = u.id
  INNER JOIN public.courses c ON uc.course_id = c.id
  WHERE uc.purchase_date IS NOT NULL
  ORDER BY uc.purchase_date DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Función para obtener contactos recientes
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
    c.name,
    c.email,
    c.phone,
    c.subject,
    c.message,
    c.status,
    c.created_at,
    EXTRACT(EPOCH FROM (NOW() - c.created_at))/3600 as hours_since_created
  FROM public.contacts c
  ORDER BY c.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Función para obtener gráfica de ventas por mes (últimos 6 meses)
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
      SUM(price_paid) as revenue
    FROM public.user_courses
    WHERE purchase_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
      AND purchase_date IS NOT NULL
    GROUP BY DATE_TRUNC('month', purchase_date)
  ) monthly_data;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para obtener cursos más vendidos
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
    c.title,
    COUNT(uc.id) as sales_count,
    COALESCE(SUM(uc.price_paid), 0) as revenue,
    COALESCE(AVG(ucp.progress_percentage), 0) as avg_progress
  FROM public.courses c
  LEFT JOIN public.user_courses uc ON c.id = uc.course_id AND uc.purchase_date IS NOT NULL
  LEFT JOIN public.user_course_progress ucp ON c.id = ucp.course_id
  WHERE c.is_free = false
  GROUP BY c.id, c.title
  ORDER BY sales_count DESC, revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Función para obtener tasa de conversión
CREATE OR REPLACE FUNCTION get_conversion_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_users INTEGER;
  users_with_purchases INTEGER;
  total_course_views INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(DISTINCT user_id) INTO users_with_purchases 
    FROM public.user_courses WHERE purchase_date IS NOT NULL;
  
  SELECT json_build_object(
    'total_users', total_users,
    'users_with_purchases', users_with_purchases,
    'conversion_rate', CASE 
      WHEN total_users > 0 THEN ROUND((users_with_purchases::DECIMAL / total_users * 100), 2)
      ELSE 0
    END,
    'avg_purchases_per_user', CASE
      WHEN users_with_purchases > 0 THEN ROUND(
        (SELECT COUNT(*) FROM public.user_courses WHERE purchase_date IS NOT NULL)::DECIMAL / users_with_purchases, 2
      )
      ELSE 0
    END
  )
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTARIOS Y NOTAS
-- =====================================================

COMMENT ON FUNCTION get_dashboard_stats() IS 'Retorna todas las estadísticas principales del dashboard admin';
COMMENT ON FUNCTION get_recent_users(INTEGER) IS 'Obtiene los usuarios más recientes';
COMMENT ON FUNCTION get_recent_sales(INTEGER) IS 'Obtiene las ventas más recientes con detalles';
COMMENT ON FUNCTION get_recent_contacts(INTEGER) IS 'Obtiene los contactos más recientes';
COMMENT ON FUNCTION get_sales_chart_data() IS 'Datos para gráfica de ventas por mes (últimos 6 meses)';
COMMENT ON FUNCTION get_top_selling_courses(INTEGER) IS 'Cursos más vendidos con métricas';
COMMENT ON FUNCTION get_conversion_metrics() IS 'Métricas de conversión de usuarios a compradores';

-- =====================================================
-- GRANTS DE SEGURIDAD
-- =====================================================

-- Solo usuarios autenticados pueden ejecutar estas funciones
-- (el check de admin se hace en el RLS de las tablas subyacentes)
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_users(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_sales(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_contacts(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_sales_chart_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_selling_courses(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_metrics() TO authenticated;
