-- =====================================================
-- VERIFICACIÓN RÁPIDA DE PERMISOS ADMIN
-- Ejecutar este script para ver exactamente cuál es el problema
-- =====================================================

-- 1️⃣ ¿Existe la tabla user_roles?
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
    ) THEN
        RAISE NOTICE '✅ La tabla user_roles EXISTE';
    ELSE
        RAISE NOTICE '❌ La tabla user_roles NO EXISTE - Ejecuta el PASO 2 del manual';
    END IF;
END $$;

-- 2️⃣ ¿Tienes rol de admin?
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ TIENES ROL DE ADMIN'
        ELSE '❌ NO TIENES ROL DE ADMIN - Necesitas ejecutar el PASO 3'
    END as estado_admin,
    auth.uid() as tu_user_id,
    auth.email() as tu_email
FROM public.user_roles
WHERE user_id = auth.uid() AND role = 'admin';

-- 3️⃣ Ver todos los usuarios con rol admin
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;

-- 4️⃣ ¿Existen las políticas RLS para blog-images?
SELECT 
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ LAS 4 POLÍTICAS EXISTEN'
        WHEN COUNT(*) > 0 THEN '⚠️ SOLO HAY ' || COUNT(*) || ' POLÍTICAS (deberían ser 4)'
        ELSE '❌ NO HAY POLÍTICAS - Ejecuta DIAGNOSTICO_STORAGE.sql'
    END as estado_politicas,
    COUNT(*) as total_politicas
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%';

-- 5️⃣ Listar las políticas existentes
SELECT 
    policyname as nombre_politica,
    cmd as operacion,
    roles as para_roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY cmd;

-- 6️⃣ Verificar configuración del bucket
SELECT 
    id,
    name,
    CASE 
        WHEN public THEN '✅ PÚBLICO'
        ELSE '❌ PRIVADO (debería ser público)'
    END as estado_publico,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'blog-images';

-- =====================================================
-- RESUMEN DE LO QUE NECESITAS HACER
-- =====================================================

DO $$ 
DECLARE
    tiene_tabla BOOLEAN;
    tiene_admin BOOLEAN;
    num_politicas INTEGER;
BEGIN
    -- Verificar tabla
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
    ) INTO tiene_tabla;
    
    -- Verificar admin (solo si la tabla existe)
    IF tiene_tabla THEN
        SELECT EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        ) INTO tiene_admin;
    ELSE
        tiene_admin := FALSE;
    END IF;
    
    -- Verificar políticas
    SELECT COUNT(*) INTO num_politicas
    FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname LIKE '%Blog images%';
    
    -- Mostrar resumen
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'RESUMEN DEL DIAGNÓSTICO';
    RAISE NOTICE '==========================================';
    
    IF NOT tiene_tabla THEN
        RAISE NOTICE '❌ PROBLEMA 1: La tabla user_roles no existe';
        RAISE NOTICE '   SOLUCIÓN: Ejecuta el PASO 2 de SOLUCION_ERROR_500_STORAGE.md';
    END IF;
    
    IF tiene_tabla AND NOT tiene_admin THEN
        RAISE NOTICE '❌ PROBLEMA 2: No tienes rol de admin';
        RAISE NOTICE '   SOLUCIÓN: Ejecuta el PASO 3 de SOLUCION_ERROR_500_STORAGE.md';
    END IF;
    
    IF num_politicas < 4 THEN
        RAISE NOTICE '❌ PROBLEMA 3: Faltan políticas RLS (hay % de 4)', num_politicas;
        RAISE NOTICE '   SOLUCIÓN: Ejecuta DIAGNOSTICO_STORAGE.sql completo';
    END IF;
    
    IF tiene_tabla AND tiene_admin AND num_politicas = 4 THEN
        RAISE NOTICE '✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE';
        RAISE NOTICE '   Si sigue fallando, cierra sesión y vuelve a iniciar sesión';
    END IF;
    
    RAISE NOTICE '==========================================';
END $$;
