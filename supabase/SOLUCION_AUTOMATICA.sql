-- =====================================================
-- SOLUCIÓN AUTOMÁTICA - Error 500 Subir Imágenes
-- Ejecutar TODO este script de una vez
-- =====================================================

-- PASO 1: Crear tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores de user_roles (por si existen)
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Política para que los usuarios puedan ver su propio rol
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para que los admins puedan gestionar roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- =====================================================
-- PASO 2: Asignar rol admin al usuario actual
-- =====================================================

-- Insertar o actualizar el rol admin para el usuario actual
INSERT INTO public.user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- =====================================================
-- PASO 3: Configurar políticas RLS para blog-images
-- =====================================================

-- Eliminar políticas anteriores
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin update" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

-- 1. Lectura pública
CREATE POLICY "Blog images public read"
ON storage.objects 
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 2. INSERT - Solo admins
CREATE POLICY "Blog images admin insert"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 3. UPDATE - Solo admins
CREATE POLICY "Blog images admin update"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 4. DELETE - Solo admins
CREATE POLICY "Blog images admin delete"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar tu usuario y rol
SELECT 
    '✅ TU USUARIO TIENE ROL ADMIN' as estado,
    auth.uid() as user_id,
    auth.email() as email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();

-- Mostrar políticas creadas
SELECT 
    '✅ POLÍTICAS RLS CREADAS' as estado,
    policyname,
    cmd as operacion
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY cmd;

-- Instrucciones finales
DO $$ 
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ CONFIGURACIÓN COMPLETADA';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 SIGUIENTE PASO:';
    RAISE NOTICE '1. Cierra sesión en tu app';
    RAISE NOTICE '2. Vuelve a iniciar sesión';
    RAISE NOTICE '3. Intenta subir una imagen';
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
END $$;
