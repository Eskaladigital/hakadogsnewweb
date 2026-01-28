-- =====================================================
-- VERIFICACIÓN: Compras de Stripe en Supabase
-- =====================================================
-- Este script ayuda a diagnosticar problemas con
-- el registro de compras desde el webhook de Stripe
-- =====================================================

-- 1. VER TODAS LAS COMPRAS RECIENTES (últimos 7 días)
SELECT 
  '=== COMPRAS RECIENTES (últimos 7 días) ===' as info;

SELECT 
  cp.id,
  cp.user_id,
  u.email as usuario_email,
  cp.course_id,
  c.title as curso_titulo,
  cp.price_paid,
  cp.payment_status,
  cp.payment_method,
  cp.payment_id as stripe_payment_id,
  cp.purchase_date,
  CASE 
    WHEN cp.purchase_date > NOW() - INTERVAL '1 hour' THEN '🔥 Muy reciente'
    WHEN cp.purchase_date > NOW() - INTERVAL '1 day' THEN '✅ Hoy'
    ELSE '📅 Anterior'
  END as cuando
FROM course_purchases cp
LEFT JOIN auth.users u ON cp.user_id = u.id
LEFT JOIN courses c ON cp.course_id = c.id
WHERE cp.purchase_date > NOW() - INTERVAL '7 days'
ORDER BY cp.purchase_date DESC;

-- 2. CONTAR COMPRAS POR DÍA (últimos 30 días)
SELECT 
  '=== COMPRAS POR DÍA (últimos 30 días) ===' as info;

SELECT 
  DATE(purchase_date) as fecha,
  COUNT(*) as total_compras,
  SUM(price_paid) as revenue_total,
  STRING_AGG(payment_id, ', ') as stripe_payment_ids
FROM course_purchases
WHERE purchase_date > NOW() - INTERVAL '30 days'
GROUP BY DATE(purchase_date)
ORDER BY DATE(purchase_date) DESC;

-- 3. VERIFICAR SI UN PAGO DE STRIPE SE REGISTRÓ
-- Reemplaza 'pi_xxxxxxxxxxxxx' con el Payment Intent ID de Stripe
SELECT 
  '=== BUSCAR PAGO ESPECÍFICO DE STRIPE ===' as info;

SELECT 
  cp.id,
  cp.user_id,
  u.email as usuario,
  cp.course_id,
  c.title as curso,
  cp.price_paid,
  cp.payment_status,
  cp.payment_id,
  cp.purchase_date
FROM course_purchases cp
LEFT JOIN auth.users u ON cp.user_id = u.id
LEFT JOIN courses c ON cp.course_id = c.id
WHERE cp.payment_id ILIKE '%pi_%'  -- Todos los Payment Intents
ORDER BY cp.purchase_date DESC
LIMIT 20;

-- Para buscar un pago específico, descomentar y reemplazar:
-- WHERE cp.payment_id = 'pi_xxxxxxxxxxxxx';

-- 4. VERIFICAR POLÍTICAS RLS ACTIVAS
SELECT 
  '=== POLÍTICAS RLS DE course_purchases ===' as info;

SELECT 
  policyname,
  cmd as operacion,
  roles,
  CASE 
    WHEN policyname ILIKE '%service%role%' THEN '✅ CRÍTICA para webhook'
    ELSE 'Normal'
  END as importancia,
  qual as condicion_select,
  with_check as condicion_insert
FROM pg_policies
WHERE tablename = 'course_purchases'
ORDER BY 
  CASE 
    WHEN policyname ILIKE '%service%role%' THEN 1
    ELSE 2
  END;

-- 5. ESTADÍSTICAS GENERALES
SELECT 
  '=== ESTADÍSTICAS GENERALES ===' as info;

SELECT 
  COUNT(*) as total_compras,
  COUNT(DISTINCT user_id) as usuarios_compraron,
  COUNT(DISTINCT course_id) as cursos_vendidos,
  SUM(price_paid) as revenue_total,
  AVG(price_paid) as precio_promedio,
  MIN(purchase_date) as primera_compra,
  MAX(purchase_date) as ultima_compra,
  COUNT(*) FILTER (WHERE purchase_date > NOW() - INTERVAL '24 hours') as compras_ultimas_24h,
  COUNT(*) FILTER (WHERE purchase_date > NOW() - INTERVAL '7 days') as compras_ultima_semana
FROM course_purchases
WHERE payment_status = 'completed';

-- 6. VERIFICAR COMPRAS SIN CURSO O SIN USUARIO (datos corruptos)
SELECT 
  '=== VERIFICAR INTEGRIDAD DE DATOS ===' as info;

SELECT 
  'Compras sin usuario válido' as problema,
  COUNT(*) as cantidad
FROM course_purchases cp
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE id = cp.user_id)

UNION ALL

SELECT 
  'Compras sin curso válido' as problema,
  COUNT(*) as cantidad
FROM course_purchases cp
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = cp.course_id)

UNION ALL

SELECT 
  'Compras sin payment_id' as problema,
  COUNT(*) as cantidad
FROM course_purchases
WHERE payment_id IS NULL OR payment_id = '';

-- 7. CURSOS MÁS VENDIDOS
SELECT 
  '=== TOP 10 CURSOS MÁS VENDIDOS ===' as info;

SELECT 
  c.title as curso,
  c.slug,
  c.price as precio_actual,
  COUNT(cp.id) as ventas,
  SUM(cp.price_paid) as revenue,
  AVG(cp.price_paid) as precio_promedio_pagado,
  MAX(cp.purchase_date) as ultima_venta
FROM course_purchases cp
JOIN courses c ON cp.course_id = c.id
WHERE cp.payment_status = 'completed'
GROUP BY c.id, c.title, c.slug, c.price
ORDER BY ventas DESC
LIMIT 10;

-- 8. USUARIOS QUE MÁS HAN COMPRADO
SELECT 
  '=== TOP 10 USUARIOS CON MÁS COMPRAS ===' as info;

SELECT 
  u.email,
  u.raw_user_meta_data->>'name' as nombre,
  COUNT(cp.id) as total_compras,
  SUM(cp.price_paid) as total_gastado,
  MAX(cp.purchase_date) as ultima_compra
FROM course_purchases cp
JOIN auth.users u ON cp.user_id = u.id
WHERE cp.payment_status = 'completed'
GROUP BY u.id, u.email, u.raw_user_meta_data
ORDER BY total_compras DESC, total_gastado DESC
LIMIT 10;

-- 9. COMPRAS PENDIENTES O FALLIDAS
SELECT 
  '=== COMPRAS NO COMPLETADAS ===' as info;

SELECT 
  cp.id,
  u.email as usuario,
  c.title as curso,
  cp.payment_status,
  cp.payment_id,
  cp.purchase_date
FROM course_purchases cp
LEFT JOIN auth.users u ON cp.user_id = u.id
LEFT JOIN courses c ON cp.course_id = c.id
WHERE cp.payment_status != 'completed'
ORDER BY cp.purchase_date DESC;

-- 10. CREAR FUNCIÓN PARA DIAGNÓSTICO RÁPIDO DE UN PAGO
CREATE OR REPLACE FUNCTION check_stripe_payment(payment_intent_id TEXT)
RETURNS TABLE (
  encontrado BOOLEAN,
  purchase_id UUID,
  usuario TEXT,
  curso TEXT,
  precio NUMERIC,
  estado TEXT,
  fecha TIMESTAMPTZ,
  mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  record_count INT;
BEGIN
  SELECT COUNT(*) INTO record_count
  FROM course_purchases
  WHERE payment_id = payment_intent_id;

  IF record_count = 0 THEN
    RETURN QUERY SELECT 
      FALSE as encontrado,
      NULL::UUID as purchase_id,
      NULL::TEXT as usuario,
      NULL::TEXT as curso,
      NULL::NUMERIC as precio,
      NULL::TEXT as estado,
      NULL::TIMESTAMPTZ as fecha,
      '❌ Pago NO encontrado en Supabase. El webhook probablemente falló.' as mensaje;
  ELSE
    RETURN QUERY
    SELECT 
      TRUE as encontrado,
      cp.id as purchase_id,
      u.email as usuario,
      c.title as curso,
      cp.price_paid as precio,
      cp.payment_status as estado,
      cp.purchase_date as fecha,
      '✅ Pago encontrado y registrado correctamente.' as mensaje
    FROM course_purchases cp
    LEFT JOIN auth.users u ON cp.user_id = u.id
    LEFT JOIN courses c ON cp.course_id = c.id
    WHERE cp.payment_id = payment_intent_id;
  END IF;
END;
$$;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION check_stripe_payment(TEXT) TO authenticated, service_role;

-- Ejemplo de uso:
-- SELECT * FROM check_stripe_payment('pi_3QopL5LNDfpodT5T1PjCNF7M');

-- =====================================================
-- COMANDOS ÚTILES PARA COPIAR Y PEGAR
-- =====================================================

-- Ver últimas 10 compras:
-- SELECT id, user_id, course_id, price_paid, payment_id, purchase_date 
-- FROM course_purchases 
-- ORDER BY purchase_date DESC 
-- LIMIT 10;

-- Buscar un pago específico de Stripe:
-- SELECT * FROM check_stripe_payment('pi_xxxxxxxxxxxxx');

-- Ver todas las compras de hoy:
-- SELECT * FROM course_purchases 
-- WHERE DATE(purchase_date) = CURRENT_DATE;

-- Ver revenue total:
-- SELECT SUM(price_paid) as revenue_total 
-- FROM course_purchases 
-- WHERE payment_status = 'completed';

-- Verificar que el service_role puede insertar:
-- SELECT policyname FROM pg_policies 
-- WHERE tablename = 'course_purchases' 
-- AND policyname ILIKE '%service%role%';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
