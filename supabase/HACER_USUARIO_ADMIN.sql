-- =====================================================
-- HACER USUARIO ADMINISTRADOR
-- =====================================================
-- Fecha: 27 enero 2026
-- Propósito: Asignar rol de administrador a un usuario específico
-- =====================================================

-- OPCIÓN 1: Por EMAIL (Más fácil - recomendado)
-- ⚠️ CAMBIAR el email por el del usuario que quieres hacer admin

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'alchalfos@gmail.com'  -- ⚠️ CAMBIAR ESTE EMAIL
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';


-- OPCIÓN 2: Por USER ID
-- ⚠️ CAMBIAR el UUID por el ID del usuario

INSERT INTO public.user_roles (user_id, role)
VALUES ('64f5aa50-507b-46c0-be51-4f7328d3954a', 'admin')  -- ⚠️ CAMBIAR ESTE ID
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';


-- =====================================================
-- VERIFICAR que se asignó correctamente
-- =====================================================

SELECT 
  u.id,
  u.email,
  ur.role,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END AS email_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'alchalfos@gmail.com'  -- ⚠️ CAMBIAR ESTE EMAIL
   OR u.id = '64f5aa50-507b-46c0-be51-4f7328d3954a';  -- ⚠️ O ESTE ID


-- =====================================================
-- CONFIRMAR EMAIL del nuevo administrador
-- =====================================================
-- Si el email no está confirmado, ejecuta también esto:

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'alchalfos@gmail.com'  -- ⚠️ CAMBIAR ESTE EMAIL
  AND email_confirmed_at IS NULL;


-- =====================================================
-- VER TODOS LOS ADMINISTRADORES
-- =====================================================

SELECT 
  u.id,
  u.email,
  ur.role,
  u.created_at,
  u.last_sign_in_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ NO confirmado'
  END AS email_status
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC;


-- =====================================================
-- NOTAS:
-- =====================================================
-- 
-- 1. ON CONFLICT hace que si el usuario ya tiene un rol, se actualice
-- 2. El email se confirmará automáticamente gracias al trigger que creamos
-- 3. El nuevo admin podrá acceder desde cualquier dispositivo
-- 4. Puedes hacer admin a varios usuarios ejecutando el INSERT múltiples veces
-- 
-- =====================================================
