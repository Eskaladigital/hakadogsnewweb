-- =====================================================
-- TABLA USER_ROLES - HAKADOGS
-- =====================================================
-- Sistema de roles para usuarios (admin, user, instructor, etc.)
-- =====================================================

-- 1. Crear tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  -- Valores posibles: 'admin', 'user', 'instructor'
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: Un usuario solo puede tener un rol
  UNIQUE(user_id)
);

-- 2. Crear índices
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- 3. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_roles_updated_at_trigger
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_roles_updated_at();

-- 4. RLS (Row Level Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios pueden ver su propio rol
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Solo admins pueden ver todos los roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Solo admins pueden actualizar roles
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Solo admins pueden eliminar roles
CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Solo admins pueden insertar roles
CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 5. Función para obtener el rol de un usuario
-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS get_user_role(UUID);

CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para verificar si un usuario es admin
-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS is_admin(UUID);

CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Función para crear un usuario con rol automáticamente
CREATE OR REPLACE FUNCTION create_user_with_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Al crear un nuevo usuario, asignarle el rol 'user' por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger para crear rol automáticamente al registrarse
CREATE TRIGGER on_auth_user_created_create_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_with_role();

-- =====================================================
-- COMENTARIOS Y NOTAS
-- =====================================================

COMMENT ON TABLE public.user_roles IS 'Roles de usuarios del sistema (admin, user, instructor)';
COMMENT ON COLUMN public.user_roles.role IS 'Rol del usuario: admin, user, instructor';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Obtiene el rol de un usuario por su UUID';
COMMENT ON FUNCTION is_admin(UUID) IS 'Verifica si un usuario es administrador';
COMMENT ON FUNCTION create_user_with_role() IS 'Trigger que crea automáticamente un rol user al registrarse';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_roles'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_roles';
