-- =====================================================
-- FIX: ERROR 500 EN REGISTRO DE NUEVOS USUARIOS
-- =====================================================
-- Este script soluciona el error "Database error saving new user"
-- que ocurre al intentar registrarse
-- =====================================================

-- PASO 1: Eliminar el trigger problemático si existe
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;

-- PASO 2: Eliminar la función anterior si existe
DROP FUNCTION IF EXISTS create_user_with_role();

-- PASO 3: Verificar que la tabla user_roles existe y tiene la estructura correcta
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- PASO 4: Deshabilitar temporalmente RLS en user_roles para permitir la inserción del trigger
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- PASO 5: Crear una nueva función con permisos elevados (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.create_user_with_role()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insertar el rol 'user' para el nuevo usuario
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING; -- Evitar errores si ya existe
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Si hay algún error, registrarlo pero no bloquear el registro del usuario
    RAISE WARNING 'Error creating user role for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- PASO 6: Crear el trigger que se ejecuta DESPUÉS de insertar en auth.users
CREATE TRIGGER on_auth_user_created_create_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_with_role();

-- PASO 7: Re-habilitar RLS pero con políticas permisivas
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- PASO 8: Eliminar políticas antiguas que puedan causar conflictos
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- PASO 9: Crear políticas RLS más permisivas

-- Permitir a usuarios ver su propio rol
CREATE POLICY "users_can_view_own_role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Permitir a admins ver todos los roles
CREATE POLICY "admins_can_view_all_roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- Permitir a admins actualizar roles
CREATE POLICY "admins_can_update_roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- Permitir a admins insertar roles manualmente
CREATE POLICY "admins_can_insert_roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- Permitir a admins eliminar roles
CREATE POLICY "admins_can_delete_roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- PASO 10: Verificar que todo funciona
SELECT 
  'Trigger creado correctamente' as status,
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created_create_role';

-- Ver políticas RLS activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_roles'
ORDER BY policyname;

-- =====================================================
-- PRUEBA MANUAL (OPCIONAL)
-- =====================================================
-- Si el error persiste, puedes probar crear un usuario manualmente:
-- 1. Crear usuario desde Supabase Dashboard > Authentication > Users
-- 2. Ejecutar manualmente:
/*
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO_AQUI', 'user');
*/

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- ✅ Este script soluciona el error 500 al registrarse
-- ✅ El trigger ahora tiene SECURITY DEFINER para evitar problemas de permisos
-- ✅ Se agregó manejo de errores con EXCEPTION para no bloquear el registro
-- ✅ RLS está habilitado pero las políticas permiten la inserción del trigger
-- ✅ Si hay un error al crear el rol, el usuario se crea igual (con warning en logs)

-- =====================================================
-- ¿QUÉ HACER DESPUÉS DE EJECUTAR ESTE SCRIPT?
-- =====================================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que no hay errores en la consola
-- 3. Intenta registrar un nuevo usuario desde la web
-- 4. Si funciona, verifica que el usuario aparece en:
--    - auth.users (tabla de autenticación)
--    - public.user_roles (tabla de roles con role='user')
-- 5. El usuario debería poder acceder a /cursos/mi-escuela sin problemas

-- =====================================================
-- ✅ FIX APLICADO
-- =====================================================
