-- ============================================
-- FIX: Actualizar contador de badges
-- ============================================
-- Ejecutar este SQL en Supabase para arreglar el contador de badges
-- Fecha: 12 Enero 2026

-- 1. Actualizar la función award_badge() para que cuente badges automáticamente
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_badge_id UUID;
  v_points INTEGER;
  v_already_has BOOLEAN;
BEGIN
  -- Obtener el badge
  SELECT id, points INTO v_badge_id, v_points
  FROM badges
  WHERE code = p_badge_code AND is_active = true;

  IF v_badge_id IS NULL THEN
    RETURN false;
  END IF;

  -- Verificar si ya lo tiene
  SELECT EXISTS(
    SELECT 1 FROM user_badges 
    WHERE user_id = p_user_id AND badge_id = v_badge_id
  ) INTO v_already_has;

  IF v_already_has THEN
    RETURN false;
  END IF;

  -- Otorgar el badge
  INSERT INTO user_badges (user_id, badge_id, earned_at, is_unlocked)
  VALUES (p_user_id, v_badge_id, NOW(), true);

  -- Sumar puntos Y actualizar contador de badges
  UPDATE user_stats
  SET 
    total_points = total_points + v_points,
    experience_points = experience_points + v_points,
    total_badges = (
      SELECT COUNT(*) 
      FROM user_badges 
      WHERE user_id = p_user_id AND is_unlocked = true
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Calcular nivel
  PERFORM calculate_user_level(p_user_id);

  -- Registrar logro
  INSERT INTO user_achievements (
    user_id, 
    badge_id, 
    achieved_at,
    achievement_type
  )
  VALUES (
    p_user_id, 
    v_badge_id, 
    NOW(),
    'badge_earned'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 2. Recalcular total_badges para todos los usuarios existentes
UPDATE user_stats
SET total_badges = (
  SELECT COUNT(*) 
  FROM user_badges 
  WHERE user_badges.user_id = user_stats.user_id 
    AND is_unlocked = true
);

-- 3. Verificar el resultado
SELECT 
  us.user_id,
  us.total_badges AS "Badges en Stats",
  COUNT(ub.id) AS "Badges Reales",
  CASE 
    WHEN us.total_badges = COUNT(ub.id) THEN '✅ Correcto'
    ELSE '❌ Incorrecto'
  END AS "Estado"
FROM user_stats us
LEFT JOIN user_badges ub ON ub.user_id = us.user_id AND ub.is_unlocked = true
GROUP BY us.user_id, us.total_badges
ORDER BY us.user_id;
