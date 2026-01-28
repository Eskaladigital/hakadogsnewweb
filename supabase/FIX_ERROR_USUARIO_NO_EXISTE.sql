-- =====================================================
-- FIX: ERROR "USUARIO NO EXISTE" AL INTENTAR LOGIN
-- =====================================================
-- Problema: Usuario con email verificado no puede hacer login
-- Error: "Usuario no existe" o "Invalid login credentials"
-- Fecha: 28 enero 2026
-- =====================================================

-- =====================================================
-- PASO 1: DIAGNÓSTICO - Verificar el estado del usuario
-- =====================================================

-- Reemplaza 'email@usuario.com' con el email del usuario afectado
DO $$
DECLARE
  user_email TEXT := 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL
BEGIN
  RAISE NOTICE '=== DIAGNÓSTICO DEL USUARIO: % ===', user_email;
END $$;

-- 1.1 Verificar si el usuario existe en auth.users
SELECT 
  '1. Usuario en auth.users' as verificacion,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Usuario existe'
    ELSE '❌ Usuario NO existe en auth.users'
  END as resultado,
  COUNT(*) as cantidad
FROM auth.users
WHERE email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- 1.2 Ver detalles completos del usuario
SELECT 
  '2. Detalles del usuario' as verificacion,
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  last_sign_in_at,
  raw_user_meta_data,
  raw_app_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  deleted_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN '⚠️ USUARIO ELIMINADO (soft delete)'
    WHEN email_confirmed_at IS NULL THEN '⚠️ EMAIL NO CONFIRMADO'
    WHEN banned_until IS NOT NULL AND banned_until > NOW() THEN '⚠️ USUARIO BANEADO'
    ELSE '✅ Usuario activo'
  END as estado
FROM auth.users
WHERE email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- 1.3 Verificar si tiene rol asignado
SELECT 
  '3. Rol del usuario' as verificacion,
  CASE 
    WHEN COUNT(*) > 0 THEN CONCAT('✅ Tiene rol: ', MAX(role))
    ELSE '⚠️ NO tiene rol asignado'
  END as resultado
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- 1.4 Verificar configuración de autenticación en Supabase
SELECT 
  '4. Configuración de Auth' as verificacion,
  jsonb_pretty(
    jsonb_build_object(
      'email_confirmation_required', 
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM auth.users 
          WHERE email = 'email@usuario.com' 
          AND email_confirmed_at IS NULL
        ) THEN 'Email NO confirmado - puede ser el problema'
        ELSE 'Email confirmado - OK'
      END
    )
  ) as configuracion;

-- =====================================================
-- PASO 2: SOLUCIONES SEGÚN EL PROBLEMA DETECTADO
-- =====================================================

-- SOLUCIÓN A: Si el usuario existe pero tiene email_confirmed_at = NULL
-- Esto confirma el email manualmente
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW()),
  updated_at = NOW()
WHERE 
  email = 'email@usuario.com' -- ⚠️ CAMBIAR ESTE EMAIL
  AND email_confirmed_at IS NULL;

-- Verificar resultado
SELECT 
  'SOLUCIÓN A aplicada' as resultado,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmado exitosamente'
    ELSE '⚠️ No se necesitaba confirmar o no existe'
  END as estado,
  email,
  email_confirmed_at
FROM auth.users
WHERE email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- SOLUCIÓN B: Si el usuario existe pero fue eliminado (soft delete)
-- Esto restaura el usuario
UPDATE auth.users
SET 
  deleted_at = NULL,
  updated_at = NOW()
WHERE 
  email = 'email@usuario.com' -- ⚠️ CAMBIAR ESTE EMAIL
  AND deleted_at IS NOT NULL;

-- Verificar resultado
SELECT 
  'SOLUCIÓN B aplicada' as resultado,
  CASE 
    WHEN deleted_at IS NULL THEN '✅ Usuario restaurado exitosamente'
    ELSE '⚠️ Usuario no estaba eliminado'
  END as estado,
  email,
  deleted_at
FROM auth.users
WHERE email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- SOLUCIÓN C: Si el usuario existe pero está baneado
-- Esto quita el ban
UPDATE auth.users
SET 
  banned_until = NULL,
  updated_at = NOW()
WHERE 
  email = 'email@usuario.com' -- ⚠️ CAMBIAR ESTE EMAIL
  AND banned_until IS NOT NULL
  AND banned_until > NOW();

-- Verificar resultado
SELECT 
  'SOLUCIÓN C aplicada' as resultado,
  CASE 
    WHEN banned_until IS NULL OR banned_until <= NOW() THEN '✅ Usuario desbaneado exitosamente'
    ELSE '⚠️ Usuario no estaba baneado'
  END as estado,
  email,
  banned_until
FROM auth.users
WHERE email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- SOLUCIÓN D: Si el usuario NO tiene rol asignado
-- Esto asigna el rol 'user' por defecto
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id, 
  'user' as role
FROM auth.users
WHERE 
  email = 'email@usuario.com' -- ⚠️ CAMBIAR ESTE EMAIL
  AND id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;

-- Verificar resultado
SELECT 
  'SOLUCIÓN D aplicada' as resultado,
  CASE 
    WHEN COUNT(*) > 0 THEN CONCAT('✅ Usuario tiene rol: ', MAX(role))
    ELSE '⚠️ No se pudo asignar rol'
  END as estado
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- SOLUCIÓN E: Resetear la contraseña si está corrupta
-- Genera un token para que el usuario pueda cambiar su contraseña
-- NOTA: Esto solo muestra cómo hacerlo, NO lo ejecuta automáticamente

SELECT 
  'SOLUCIÓN E - Resetear contraseña' as solucion,
  'Ir a: Authentication > Users > Buscar usuario > Actions > Send Magic Link' as instrucciones,
  'O ejecutar desde código: supabase.auth.resetPasswordForEmail()' as alternativa;

-- =====================================================
-- PASO 3: VERIFICACIÓN FINAL
-- =====================================================

-- Ver estado final del usuario después de todas las correcciones
SELECT 
  '=== ESTADO FINAL DEL USUARIO ===' as titulo,
  u.id,
  u.email,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status,
  CASE 
    WHEN u.deleted_at IS NULL THEN '✅ Usuario activo'
    ELSE '❌ Usuario eliminado'
  END as deleted_status,
  CASE 
    WHEN u.banned_until IS NULL OR u.banned_until <= NOW() THEN '✅ Usuario no baneado'
    ELSE '❌ Usuario baneado'
  END as ban_status,
  COALESCE(ur.role, '❌ Sin rol') as role_status,
  u.last_sign_in_at,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'email@usuario.com'; -- ⚠️ CAMBIAR ESTE EMAIL

-- =====================================================
-- PASO 4: SOLUCIÓN PREVENTIVA
-- =====================================================

-- Crear función para diagnosticar usuarios con problemas de login
CREATE OR REPLACE FUNCTION diagnose_user_login(user_email TEXT)
RETURNS TABLE (
  problema TEXT,
  severidad TEXT,
  solucion TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Buscar el usuario
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = user_email;

  -- Si no existe
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      'Usuario no existe'::TEXT,
      'CRÍTICO'::TEXT,
      'Verificar que el email sea correcto. Si es correcto, el usuario debe registrarse.'::TEXT;
    RETURN;
  END IF;

  -- Email no confirmado
  IF user_record.email_confirmed_at IS NULL THEN
    RETURN QUERY SELECT 
      'Email no confirmado'::TEXT,
      'ALTO'::TEXT,
      'Ejecutar: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = ''' || user_email || ''''::TEXT;
  END IF;

  -- Usuario eliminado
  IF user_record.deleted_at IS NOT NULL THEN
    RETURN QUERY SELECT 
      'Usuario eliminado (soft delete)'::TEXT,
      'ALTO'::TEXT,
      'Ejecutar: UPDATE auth.users SET deleted_at = NULL WHERE email = ''' || user_email || ''''::TEXT;
  END IF;

  -- Usuario baneado
  IF user_record.banned_until IS NOT NULL AND user_record.banned_until > NOW() THEN
    RETURN QUERY SELECT 
      'Usuario baneado'::TEXT,
      'ALTO'::TEXT,
      'Ejecutar: UPDATE auth.users SET banned_until = NULL WHERE email = ''' || user_email || ''''::TEXT;
  END IF;

  -- Sin rol asignado
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_record.id) THEN
    RETURN QUERY SELECT 
      'Sin rol asignado'::TEXT,
      'MEDIO'::TEXT,
      'Ejecutar: INSERT INTO public.user_roles (user_id, role) VALUES (''' || user_record.id || ''', ''user'')'::TEXT;
  END IF;

  -- Todo OK
  IF NOT EXISTS (
    SELECT 1 FROM auth.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    WHERE u.email = user_email
    AND (
      u.email_confirmed_at IS NULL
      OR u.deleted_at IS NOT NULL
      OR (u.banned_until IS NOT NULL AND u.banned_until > NOW())
      OR ur.user_id IS NULL
    )
  ) THEN
    RETURN QUERY SELECT 
      'Usuario configurado correctamente'::TEXT,
      'OK'::TEXT,
      'El problema puede ser la contraseña incorrecta. Verificar con el usuario.'::TEXT;
  END IF;
END;
$$;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION diagnose_user_login(TEXT) TO authenticated, service_role;

-- =====================================================
-- CÓMO USAR ESTA FUNCIÓN DE DIAGNÓSTICO
-- =====================================================

-- Ejemplo de uso:
SELECT * FROM diagnose_user_login('email@usuario.com'); -- ⚠️ CAMBIAR ESTE EMAIL

-- =====================================================
-- VERIFICACIÓN DE CONFIGURACIÓN DE SUPABASE
-- =====================================================

-- Verificar que la configuración de Auth en Supabase permite el login
SELECT 
  '=== CONFIGURACIÓN RECOMENDADA ===' as titulo,
  'En Supabase Dashboard > Authentication > Settings:' as ubicacion,
  '1. Email Confirmation: Puede estar OFF para testing' as config1,
  '2. Secure email change: Recomendado ON' as config2,
  '3. Enable email confirmations: Depende del proyecto' as config3,
  '4. Minimum password length: 6+ caracteres' as config4;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 
-- 1. SIEMPRE cambia 'email@usuario.com' por el email real del usuario
-- 2. Ejecuta PASO 1 primero para diagnosticar el problema exacto
-- 3. Ejecuta las SOLUCIONES según los resultados del diagnóstico
-- 4. Verifica el PASO 3 para confirmar que todo está correcto
-- 5. Usa la función diagnose_user_login() para futuros problemas
-- 
-- ERRORES COMUNES:
-- - "Invalid login credentials" = Email no confirmado o contraseña incorrecta
-- - "User not found" = Usuario eliminado o no existe
-- - "Email not confirmed" = Email no verificado (email_confirmed_at = NULL)
-- - "Too many requests" = Rate limiting activado (esperar unos minutos)
-- 
-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
