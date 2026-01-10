-- =====================================================
-- SCRIPT COMPLETO PARA HABILITAR EL DASHBOARD
-- Ejecuta ESTE archivo completo en Supabase SQL Editor
-- =====================================================

-- PASO 1: Crear tabla user_roles (si no existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_roles
DROP POLICY IF EXISTS "Usuarios pueden ver su propio rol" ON public.user_roles;
CREATE POLICY "Usuarios pueden ver su propio rol" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Solo admins pueden actualizar roles" ON public.user_roles;
CREATE POLICY "Solo admins pueden actualizar roles" ON public.user_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger para crear rol automáticamente
CREATE OR REPLACE FUNCTION create_user_with_role()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;
CREATE TRIGGER on_auth_user_created_create_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_with_role();

-- Funciones auxiliares
DROP FUNCTION IF EXISTS get_user_role(UUID);
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

DROP FUNCTION IF EXISTS is_admin(UUID);
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = user_uuid;
  
  RETURN (user_role = 'admin');
END;
$$;


-- PASO 2: Crear tabla contacts (si no existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  source TEXT DEFAULT 'web_form',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contacts
DROP POLICY IF EXISTS "Admins pueden ver todos los contactos" ON public.contacts;
CREATE POLICY "Admins pueden ver todos los contactos" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins pueden actualizar contactos" ON public.contacts;
CREATE POLICY "Admins pueden actualizar contactos" ON public.contacts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Cualquiera puede crear contactos" ON public.contacts;
CREATE POLICY "Cualquiera puede crear contactos" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Función para contactos
DROP FUNCTION IF EXISTS get_contacts_stats();
CREATE OR REPLACE FUNCTION get_contacts_stats()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'responded', COUNT(*) FILTER (WHERE status = 'responded'),
    'closed', COUNT(*) FILTER (WHERE status = 'closed'),
    'today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
    'this_week', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'this_month', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days')
  ) INTO result
  FROM public.contacts;
  
  RETURN result;
END;
$$;

DROP FUNCTION IF EXISTS mark_contact_responded(UUID, UUID);
CREATE OR REPLACE FUNCTION mark_contact_responded(
  contact_id UUID,
  admin_user_id UUID
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.contacts
  SET 
    status = 'responded',
    responded_by = admin_user_id,
    responded_at = NOW(),
    updated_at = NOW()
  WHERE id = contact_id;
END;
$$;


-- PASO 3: FUNCIONES DEL DASHBOARD
-- =====================================================

-- 1. get_dashboard_stats
DROP FUNCTION IF EXISTS get_dashboard_stats();
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM auth.users),
      'today', (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'),
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
      'today', (SELECT COUNT(*) FROM public.course_purchases WHERE DATE(purchase_date) = CURRENT_DATE),
      'this_week', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE - INTERVAL '7 days'),
      'this_month', (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE - INTERVAL '30 days'),
      'revenue_total', COALESCE((SELECT SUM(price_paid) FROM public.course_purchases WHERE purchase_date IS NOT NULL), 0),
      'revenue_today', COALESCE((SELECT SUM(price_paid) FROM public.course_purchases WHERE DATE(purchase_date) = CURRENT_DATE), 0),
      'revenue_month', COALESCE((SELECT SUM(price_paid) FROM public.course_purchases WHERE purchase_date >= CURRENT_DATE - INTERVAL '30 days'), 0)
    ),
    'contacts', json_build_object(
      'total', COALESCE((SELECT COUNT(*) FROM public.contacts), 0),
      'pending', COALESCE((SELECT COUNT(*) FROM public.contacts WHERE status = 'pending'), 0),
      'in_progress', COALESCE((SELECT COUNT(*) FROM public.contacts WHERE status = 'in_progress'), 0),
      'responded', COALESCE((SELECT COUNT(*) FROM public.contacts WHERE status = 'responded'), 0),
      'today', COALESCE((SELECT COUNT(*) FROM public.contacts WHERE DATE(created_at) = CURRENT_DATE), 0),
      'this_week', COALESCE((SELECT COUNT(*) FROM public.contacts WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'), 0)
    ),
    'progress', json_build_object(
      'completed_courses', (SELECT COUNT(*) FROM public.user_course_progress WHERE progress_percentage = 100),
      'in_progress', (SELECT COUNT(DISTINCT user_id) FROM public.user_course_progress WHERE progress_percentage > 0 AND progress_percentage < 100),
      'avg_completion', COALESCE((SELECT ROUND(AVG(progress_percentage), 2) FROM public.user_course_progress), 0)
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 2. get_recent_users
DROP FUNCTION IF EXISTS get_recent_users(INTEGER);
CREATE OR REPLACE FUNCTION get_recent_users(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'name' as name,
    COALESCE(ur.role, 'user') as role,
    u.created_at,
    u.last_sign_in_at as last_sign_in,
    u.email_confirmed_at
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  ORDER BY u.created_at DESC
  LIMIT limit_count;
END;
$$;

-- 3. get_recent_sales
DROP FUNCTION IF EXISTS get_recent_sales(INTEGER);
CREATE OR REPLACE FUNCTION get_recent_sales(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  user_name TEXT,
  course_title TEXT,
  price_paid NUMERIC,
  purchase_date TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    c.title as course_title,
    cp.price_paid,
    cp.purchase_date
  FROM public.course_purchases cp
  JOIN auth.users u ON cp.user_id = u.id
  JOIN public.courses c ON cp.course_id = c.id
  WHERE cp.purchase_date IS NOT NULL
  ORDER BY cp.purchase_date DESC
  LIMIT limit_count;
END;
$$;

-- 4. get_recent_contacts
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
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
    EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600 as hours_since_created
  FROM public.contacts c
  ORDER BY c.created_at DESC
  LIMIT limit_count;
END;
$$;

-- 5. get_sales_chart_data
DROP FUNCTION IF EXISTS get_sales_chart_data();
CREATE OR REPLACE FUNCTION get_sales_chart_data()
RETURNS TABLE (
  month TEXT,
  sales_count BIGINT,
  revenue NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(purchase_date, 'YYYY-MM') as month,
    COUNT(*) as sales_count,
    COALESCE(SUM(price_paid), 0) as revenue
  FROM public.course_purchases
  WHERE purchase_date IS NOT NULL
    AND purchase_date >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY TO_CHAR(purchase_date, 'YYYY-MM')
  ORDER BY month DESC;
END;
$$;

-- 6. get_top_selling_courses
DROP FUNCTION IF EXISTS get_top_selling_courses(INTEGER);
CREATE OR REPLACE FUNCTION get_top_selling_courses(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  course_id UUID,
  title TEXT,
  sales_count BIGINT,
  revenue NUMERIC,
  avg_progress NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.title,
    COUNT(uc.id) as sales_count,
    COALESCE(SUM(uc.price_paid), 0) as revenue,
    COALESCE(ROUND(AVG(ucp.progress_percentage), 2), 0) as avg_progress
  FROM public.courses c
  LEFT JOIN public.user_courses uc ON c.id = uc.course_id AND uc.purchase_date IS NOT NULL
  LEFT JOIN public.user_course_progress ucp ON c.id = ucp.course_id
  WHERE c.is_published = true
  GROUP BY c.id, c.title
  ORDER BY sales_count DESC
  LIMIT limit_count;
END;
$$;

-- 7. get_conversion_metrics
DROP FUNCTION IF EXISTS get_conversion_metrics();
CREATE OR REPLACE FUNCTION get_conversion_metrics()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
  total_users BIGINT;
  users_with_purchases BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(DISTINCT user_id) INTO users_with_purchases 
    FROM public.course_purchases 
    WHERE purchase_date IS NOT NULL;
  
  SELECT json_build_object(
    'total_users', total_users,
    'users_with_purchases', users_with_purchases,
    'conversion_rate', CASE 
      WHEN total_users > 0 THEN ROUND((users_with_purchases::NUMERIC / total_users::NUMERIC) * 100, 2)
      ELSE 0
    END,
    'avg_purchases_per_user', CASE
      WHEN users_with_purchases > 0 THEN ROUND(
        (SELECT COUNT(*) FROM public.course_purchases WHERE purchase_date IS NOT NULL)::NUMERIC / users_with_purchases::NUMERIC, 2
      )
      ELSE 0
    END
  ) INTO result;
  
  RETURN result;
END;
$$;


-- PASO 4: Otorgar permisos necesarios
-- =====================================================

-- Permisos para acceder al esquema auth (necesario para funciones SECURITY DEFINER)
GRANT USAGE ON SCHEMA auth TO postgres, authenticated;
GRANT SELECT ON auth.users TO postgres, authenticated;

-- Permisos de ejecución para funciones
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_users(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_sales(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_contacts(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_sales_chart_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_selling_courses(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_contacts_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION mark_contact_responded(UUID, UUID) TO authenticated;

-- Cambiar el propietario de las funciones a postgres (para que tengan permisos completos)
ALTER FUNCTION get_dashboard_stats() OWNER TO postgres;
ALTER FUNCTION get_recent_users(INTEGER) OWNER TO postgres;
ALTER FUNCTION get_recent_sales(INTEGER) OWNER TO postgres;
ALTER FUNCTION get_recent_contacts(INTEGER) OWNER TO postgres;
ALTER FUNCTION get_sales_chart_data() OWNER TO postgres;
ALTER FUNCTION get_top_selling_courses(INTEGER) OWNER TO postgres;
ALTER FUNCTION get_conversion_metrics() OWNER TO postgres;
ALTER FUNCTION get_user_role(UUID) OWNER TO postgres;
ALTER FUNCTION is_admin(UUID) OWNER TO postgres;
ALTER FUNCTION get_contacts_stats() OWNER TO postgres;
ALTER FUNCTION mark_contact_responded(UUID, UUID) OWNER TO postgres;


-- PASO 5: Hacer admin a tu usuario
-- =====================================================
-- CAMBIA 'contacto@eskaladigital.com' por tu email real

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'contacto@eskaladigital.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';


-- PASO 6: Verificar que todo está OK
-- =====================================================

-- Ver tus funciones creadas
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'get_%'
ORDER BY routine_name;

-- Ver tu rol de admin
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'contacto@eskaladigital.com';
