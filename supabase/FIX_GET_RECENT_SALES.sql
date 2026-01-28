-- =====================================================
-- FIX: Función get_recent_sales - Error 400 Bad Request
-- =====================================================
-- PROBLEMA: La función devuelve 400 al llamarla desde el frontend
-- CAUSA: Posibles problemas con el formato de retorno o permisos
-- =====================================================

-- Primero, eliminar la función existente si hay conflictos
DROP FUNCTION IF EXISTS get_recent_sales(INTEGER);

-- Recrear la función con el formato correcto
CREATE OR REPLACE FUNCTION get_recent_sales(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  user_name TEXT,
  course_title TEXT,
  price_paid NUMERIC,
  purchase_date TIMESTAMPTZ
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uc.id,
    u.email::TEXT as user_email,
    COALESCE(u.raw_user_meta_data->>'name', u.email)::TEXT as user_name,
    c.title::TEXT as course_title,
    uc.price_paid::NUMERIC,
    uc.purchase_date
  FROM public.user_courses uc
  INNER JOIN auth.users u ON uc.user_id = u.id
  INNER JOIN public.courses c ON uc.course_id = c.id
  WHERE uc.purchase_date IS NOT NULL
  ORDER BY uc.purchase_date DESC
  LIMIT limit_count;
END;
$$;

-- Asegurar los permisos correctos
GRANT EXECUTE ON FUNCTION get_recent_sales(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_sales(INTEGER) TO anon;

-- Agregar comentario
COMMENT ON FUNCTION get_recent_sales(INTEGER) IS 'Obtiene las ventas más recientes con detalles del usuario y curso';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Probar la función manualmente:
-- SELECT * FROM get_recent_sales(10);

-- Verificar que la función existe:
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_name = 'get_recent_sales';
