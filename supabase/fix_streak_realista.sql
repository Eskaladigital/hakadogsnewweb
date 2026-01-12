-- ============================================
-- ACTUALIZAR TRIGGERS DE RACHA A VALORES REALISTAS
-- ============================================
-- Este script actualiza los valores de racha en los triggers
-- de 7/30/100 días a 3/7/14 días (mucho más alcanzables)
-- ============================================

-- Actualizar la función de racha con valores REALISTAS
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Obtener datos actuales
  SELECT 
    last_activity_date, 
    current_streak_days,
    longest_streak_days
  INTO 
    v_last_date, 
    v_current_streak,
    v_longest_streak
  FROM user_stats
  WHERE user_id = NEW.user_id;

  -- Si es el mismo día, no hacer nada
  IF v_last_date = CURRENT_DATE THEN
    RETURN NEW;
  END IF;

  -- Si es el día siguiente, incrementar racha
  IF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  -- Si pasó más de un día, resetear racha
  ELSIF v_last_date < CURRENT_DATE - INTERVAL '1 day' OR v_last_date IS NULL THEN
    v_current_streak := 1;
  END IF;

  -- Actualizar racha más larga
  v_longest_streak := GREATEST(v_longest_streak, v_current_streak);

  -- Actualizar en la base de datos
  UPDATE user_stats
  SET 
    current_streak_days = v_current_streak,
    longest_streak_days = v_longest_streak,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- Otorgar badges de racha (VALORES REALISTAS)
  IF v_current_streak = 3 THEN
    PERFORM award_badge(NEW.user_id, 'streak_7_days'); -- Ahora es racha de 3 días
  ELSIF v_current_streak = 7 THEN
    PERFORM award_badge(NEW.user_id, 'streak_30_days'); -- Ahora es racha de 7 días
  ELSIF v_current_streak = 14 THEN
    PERFORM award_badge(NEW.user_id, 'streak_100_days'); -- Ahora es racha de 14 días
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- Los CODES de los badges NO se cambian (streak_7_days, streak_30_days, streak_100_days)
-- para mantener compatibilidad con la base de datos existente.
-- 
-- Solo se actualizan:
-- - Los NOMBRES (Racha 3 Días, Racha 7 Días, Racha 14 Días)
-- - Las DESCRIPCIONES
-- - Los PUNTOS
-- - La LÓGICA del trigger (3/7/14 en lugar de 7/30/100)
--
-- ============================================
-- EJECUTAR ESTE SCRIPT EN SUPABASE SQL EDITOR
-- ============================================
