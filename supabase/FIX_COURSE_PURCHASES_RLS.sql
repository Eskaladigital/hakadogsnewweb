-- =====================================================
-- FIX: Políticas RLS para course_purchases
-- =====================================================
-- Este script arregla el error 406 (Not Acceptable) 
-- que ocurre al verificar si un usuario ya compró un curso
-- =====================================================

-- 1. Primero verificamos si RLS está habilitado
-- Si da error, la tabla no existe
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'course_purchases';

-- 2. Habilitar RLS si no está habilitado
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Users can view their own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Service role can do everything" ON course_purchases;
DROP POLICY IF EXISTS "Anon can read purchases" ON course_purchases;

-- 4. Crear políticas correctas

-- Política para que usuarios autenticados puedan ver SUS compras
CREATE POLICY "Users can view their own purchases"
ON course_purchases
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Política para que usuarios autenticados puedan insertar SUS compras
CREATE POLICY "Users can insert their own purchases"
ON course_purchases
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Política para que el service role (webhooks, admin) pueda hacer todo
CREATE POLICY "Service role can do everything"
ON course_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'course_purchases';

-- =====================================================
-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → SQL Editor
-- 2. Copia y pega este script
-- 3. Ejecuta (Run)
-- 4. Debería mostrar las políticas creadas
-- =====================================================
