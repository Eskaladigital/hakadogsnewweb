-- =====================================================
-- FUNCIÓN PARA ACTUALIZAR ROL DE USUARIO (ADMIN)
-- =====================================================
-- Esta función actualiza el rol en AMBOS lugares:
-- 1. user_roles (tabla)
-- 2. auth.users metadata
-- =====================================================

-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS public.update_user_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.admin_update_user_role(UUID, TEXT);

-- Crear función con SECURITY DEFINER para evitar problemas de permisos
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS JSON AS $$
DECLARE
  v_calling_user_id UUID;
  v_is_admin BOOLEAN;
  v_result JSON;
BEGIN
  -- Obtener el ID del usuario que llama
  v_calling_user_id := auth.uid();
  
  -- Verificar que el usuario que llama existe
  IF v_calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;
  
  -- Verificar que el usuario que llama es admin
  v_is_admin := public.is_admin(v_calling_user_id);
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Solo los administradores pueden cambiar roles';
  END IF;
  
  -- Validar que el nuevo rol es válido
  IF new_role NOT IN ('admin', 'user', 'instructor') THEN
    RAISE EXCEPTION 'Rol inválido: %. Debe ser admin, user o instructor', new_role;
  END IF;
  
  -- Actualizar en user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = new_role,
    updated_at = NOW();
  
  -- Actualizar en auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('role', new_role)
      ELSE raw_user_meta_data || jsonb_build_object('role', new_role)
    END
  WHERE id = target_user_id;
  
  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'user_id', target_user_id,
    'new_role', new_role,
    'message', 'Rol actualizado correctamente'
  ) INTO v_result;
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Capturar cualquier error y retornarlo como JSON
    SELECT json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Error al actualizar el rol: ' || SQLERRM
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, TEXT) TO authenticated;

-- Comentario de la función
COMMENT ON FUNCTION public.admin_update_user_role(UUID, TEXT) IS 
'Actualiza el rol de un usuario en user_roles Y en auth.users metadata. Solo admins pueden ejecutar.';


-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que la función existe
SELECT 
  proname as nombre_funcion,
  prosecdef as tiene_security_definer,
  proacl as permisos
FROM pg_proc
WHERE proname = 'admin_update_user_role';


-- =====================================================
-- TEST DE LA FUNCIÓN (OPCIONAL)
-- =====================================================
-- Descomentar para probar la función
-- ⚠️ CAMBIAR LOS IDs POR IDs REALES

/*
-- Test: Actualizar rol a admin
SELECT public.admin_update_user_role(
  'USER_ID_AQUI'::UUID,  -- ⚠️ Cambiar por el ID del usuario
  'admin'
);

-- Verificar el resultado
SELECT 
  u.email,
  ur.role as rol_en_tabla,
  u.raw_user_meta_data->>'role' as rol_en_metadata,
  CASE 
    WHEN ur.role = u.raw_user_meta_data->>'role' THEN '✅ Sincronizado'
    ELSE '❌ Desincronizado'
  END as estado
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.id = 'USER_ID_AQUI'::UUID;  -- ⚠️ Cambiar por el ID del usuario
*/


-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Esta función usa SECURITY DEFINER, por lo que ejecuta
--    con los permisos del creador, evitando problemas de RLS
--
-- 2. La función actualiza AMBOS lugares donde se almacena el rol:
--    - user_roles (tabla custom)
--    - auth.users.raw_user_meta_data (metadata de Auth)
--
-- 3. Solo usuarios con rol 'admin' pueden ejecutar esta función
--
-- 4. La función retorna un JSON con el resultado, incluyendo
--    mensajes de error si algo falla
--
-- 5. Para que el cambio de rol surta efecto en la sesión del usuario,
--    el usuario debe CERRAR SESIÓN y VOLVER A INICIAR SESIÓN
-- =====================================================
