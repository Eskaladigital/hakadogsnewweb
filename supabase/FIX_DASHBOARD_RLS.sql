-- =====================================================
-- FIX: Políticas RLS para Dashboard y Estadísticas
-- =====================================================
-- Este script arregla los problemas de conteo en el dashboard
-- y las valoraciones que no se muestran correctamente
-- =====================================================

-- 1. ARREGLAR course_purchases (para ventas)
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Admin can view all purchases" ON course_purchases;
DROP POLICY IF EXISTS "Service role full access" ON course_purchases;

-- Usuarios pueden ver sus propias compras
CREATE POLICY "Users can view their own purchases"
ON course_purchases FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins pueden ver todas las compras (verificando metadata)
CREATE POLICY "Admin can view all purchases"
ON course_purchases FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Service role (webhooks) tiene acceso total
CREATE POLICY "Service role full access"
ON course_purchases FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. ARREGLAR course_reviews (para valoraciones)
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON course_reviews;
DROP POLICY IF EXISTS "Users can manage own reviews" ON course_reviews;
DROP POLICY IF EXISTS "Admin can manage all reviews" ON course_reviews;

-- Cualquiera puede ver las reviews (son públicas)
CREATE POLICY "Anyone can view reviews"
ON course_reviews FOR SELECT
TO authenticated, anon
USING (true);

-- Usuarios pueden gestionar sus propias reviews
CREATE POLICY "Users can manage own reviews"
ON course_reviews FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. ACTUALIZAR FUNCIONES RPC PARA QUE USEN SECURITY DEFINER
-- Esto permite que las funciones ignoren RLS y cuenten todos los datos

-- Función para estadísticas de reviews (CORREGIDA)
CREATE OR REPLACE FUNCTION get_overall_review_stats()
RETURNS TABLE (
  total_reviews bigint,
  avg_overall_rating numeric,
  courses_with_reviews bigint,
  high_engagement_reviews bigint,
  low_engagement_reviews bigint
)
LANGUAGE plpgsql
SECURITY DEFINER  -- IMPORTANTE: Ignora RLS
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_reviews,
    COALESCE(AVG(overall_rating), 0)::numeric as avg_overall_rating,
    COUNT(DISTINCT course_id)::bigint as courses_with_reviews,
    -- Calcular engagement basado en el rating (5 = alto, 1-2 = bajo)
    COUNT(*) FILTER (WHERE overall_rating >= 4)::bigint as high_engagement_reviews,
    COUNT(*) FILTER (WHERE overall_rating <= 2)::bigint as low_engagement_reviews
  FROM course_reviews;
END;
$$;

-- Función para obtener ventas recientes (CORREGIDA)
CREATE OR REPLACE FUNCTION get_recent_sales(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  user_email text,
  user_name text,
  course_title text,
  price_paid numeric,
  purchase_date timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER  -- IMPORTANTE: Ignora RLS
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    au.email::text as user_email,
    COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1))::text as user_name,
    c.title::text as course_title,
    cp.price_paid,
    cp.created_at as purchase_date
  FROM course_purchases cp
  LEFT JOIN auth.users au ON cp.user_id = au.id
  LEFT JOIN courses c ON cp.course_id = c.id
  WHERE cp.payment_status = 'completed'
  ORDER BY cp.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Función para estadísticas del dashboard (CORREGIDA)
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- IMPORTANTE: Ignora RLS
SET search_path = public
AS $$
DECLARE
  result json;
  now_ts timestamptz := now();
  today_start timestamptz := date_trunc('day', now_ts);
  week_start timestamptz := date_trunc('week', now_ts);
  month_start timestamptz := date_trunc('month', now_ts);
BEGIN
  SELECT json_build_object(
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM auth.users),
      'today', (SELECT COUNT(*) FROM auth.users WHERE created_at >= today_start),
      'this_week', (SELECT COUNT(*) FROM auth.users WHERE created_at >= week_start),
      'this_month', (SELECT COUNT(*) FROM auth.users WHERE created_at >= month_start),
      'admins', (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
    ),
    'courses', json_build_object(
      'total', (SELECT COUNT(*) FROM courses),
      'published', (SELECT COUNT(*) FROM courses WHERE is_published = true),
      'draft', (SELECT COUNT(*) FROM courses WHERE is_published = false),
      'free', (SELECT COUNT(*) FROM courses WHERE is_free = true),
      'paid', (SELECT COUNT(*) FROM courses WHERE is_free = false)
    ),
    'sales', json_build_object(
      'total', (SELECT COUNT(*) FROM course_purchases WHERE payment_status = 'completed'),
      'today', (SELECT COUNT(*) FROM course_purchases WHERE payment_status = 'completed' AND created_at >= today_start),
      'this_week', (SELECT COUNT(*) FROM course_purchases WHERE payment_status = 'completed' AND created_at >= week_start),
      'this_month', (SELECT COUNT(*) FROM course_purchases WHERE payment_status = 'completed' AND created_at >= month_start),
      'revenue_total', COALESCE((SELECT SUM(price_paid) FROM course_purchases WHERE payment_status = 'completed'), 0),
      'revenue_today', COALESCE((SELECT SUM(price_paid) FROM course_purchases WHERE payment_status = 'completed' AND created_at >= today_start), 0),
      'revenue_month', COALESCE((SELECT SUM(price_paid) FROM course_purchases WHERE payment_status = 'completed' AND created_at >= month_start), 0)
    ),
    'contacts', json_build_object(
      'total', (SELECT COUNT(*) FROM contacts),
      'pending', (SELECT COUNT(*) FROM contacts WHERE status = 'pendiente'),
      'in_progress', (SELECT COUNT(*) FROM contacts WHERE status = 'en_progreso'),
      'responded', (SELECT COUNT(*) FROM contacts WHERE status = 'respondido'),
      'today', (SELECT COUNT(*) FROM contacts WHERE created_at >= today_start),
      'this_week', (SELECT COUNT(*) FROM contacts WHERE created_at >= week_start)
    ),
    'progress', json_build_object(
      'completed_courses', (SELECT COUNT(*) FROM user_course_progress WHERE progress_percentage = 100),
      'in_progress', (SELECT COUNT(*) FROM user_course_progress WHERE progress_percentage > 0 AND progress_percentage < 100),
      'avg_completion', COALESCE((SELECT AVG(progress_percentage) FROM user_course_progress), 0)
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 4. VERIFICAR QUE TODO ESTÁ CORRECTO
SELECT 'Políticas de course_purchases:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'course_purchases';

SELECT 'Políticas de course_reviews:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'course_reviews';

SELECT 'Test de estadísticas:' as info;
SELECT * FROM get_overall_review_stats();
SELECT * FROM get_dashboard_stats();
