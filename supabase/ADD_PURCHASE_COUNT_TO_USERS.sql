-- =====================================================
-- ACTUALIZACIÓN: Agregar contador de compras a usuarios
-- =====================================================
-- 
-- Este script actualiza la función get_recent_users para
-- incluir el número de compras realizadas por cada usuario
--
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- Eliminar la función anterior si existe
DROP FUNCTION IF EXISTS get_recent_users(INTEGER);

-- Crear función actualizada con contador de compras
CREATE OR REPLACE FUNCTION get_recent_users(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  name TEXT,
  role VARCHAR(50),
  created_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ,
  purchase_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    (u.raw_user_meta_data->>'name')::TEXT as name,
    COALESCE(ur.role, 'user')::VARCHAR(50) as role,
    u.created_at,
    u.last_sign_in_at as last_sign_in,
    COUNT(cp.id) as purchase_count
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  LEFT JOIN public.course_purchases cp ON u.id = cp.user_id
  GROUP BY u.id, u.email, u.raw_user_meta_data, ur.role, u.created_at, u.last_sign_in_at
  ORDER BY u.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario de la función
COMMENT ON FUNCTION get_recent_users(INTEGER) IS 'Obtiene los usuarios más recientes con contador de compras';

-- Permisos
GRANT EXECUTE ON FUNCTION get_recent_users(INTEGER) TO authenticated;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Probar la función (muestra los últimos 5 usuarios con sus compras)
SELECT 
  email,
  name,
  role,
  purchase_count,
  created_at
FROM get_recent_users(5)
ORDER BY purchase_count DESC;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- ✅ La función ahora retorna una columna adicional: purchase_count
-- ✅ purchase_count muestra el número de compras de cada usuario
-- ✅ Los usuarios sin compras muestran 0
-- ✅ La página de usuarios del administrador mostrará esta información
-- =====================================================
