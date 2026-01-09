-- =============================================
-- FUNCIÓN PARA OBTENER EL ROL DEL USUARIO
-- =============================================
-- Esta función permite leer el rol directamente desde auth.users
-- Ejecuta esto en el SQL Editor de Supabase

-- Crear función que lea el rol desde auth.users
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Leer desde raw_user_meta_data primero
  SELECT raw_user_meta_data->>'role' INTO user_role
  FROM auth.users
  WHERE id = user_id;
  
  -- Si no está en user_metadata, intentar desde app_metadata
  IF user_role IS NULL OR user_role = '' THEN
    SELECT raw_app_meta_data->>'role' INTO user_role
    FROM auth.users
    WHERE id = user_id;
  END IF;
  
  -- Si aún no está, devolver 'user' por defecto
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Dar permisos para que usuarios autenticados puedan ejecutar esta función
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

-- Verificar que se creó correctamente
SELECT proname, proargtypes, prosrc 
FROM pg_proc 
WHERE proname = 'get_user_role';
