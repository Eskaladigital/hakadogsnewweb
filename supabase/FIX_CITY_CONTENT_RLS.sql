-- ============================================
-- FIX: Habilitar lectura pública de city_content_cache
-- ============================================
-- 
-- PROBLEMA: Los datos están en la tabla pero no son visibles 
-- con ANON_KEY porque falta política RLS de lectura
--
-- SOLUCIÓN: Crear política para permitir SELECT público
-- ============================================

-- 1. Verificar si RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'city_content_cache';

-- 2. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "city_content_public_read" ON city_content_cache;
DROP POLICY IF EXISTS "Permitir lectura pública" ON city_content_cache;
DROP POLICY IF EXISTS "Enable read access for all users" ON city_content_cache;

-- 3. Crear política de lectura pública
CREATE POLICY "city_content_public_read"
ON city_content_cache
FOR SELECT
TO public
USING (true);

-- 4. Verificar que la política se creó correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'city_content_cache';

-- 5. TEST: Verificar que ahora se puede leer
SELECT city_slug, city_name 
FROM city_content_cache 
WHERE city_slug IN ('alicante', 'san-javier', 'gijon')
ORDER BY city_slug;
