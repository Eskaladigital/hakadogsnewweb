-- =============================================
-- HAKADOGS - SISTEMA DE GAMIFICACIÓN
-- =============================================
-- Sistema completo de badges, logros y puntos para usuarios
-- =============================================

-- ============================================
-- 1. TABLA: badges (Catálogo de Insignias)
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- Código único: 'first_course', 'welcome', etc
  name TEXT NOT NULL, -- Nombre del badge: "Primer Paso"
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- Emoji o nombre de icono: '🎓', '🏆', etc
  category TEXT NOT NULL DEFAULT 'general', -- 'progress', 'courses', 'time', 'special', 'knowledge', 'social'
  tier TEXT NOT NULL DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  points INTEGER DEFAULT 10, -- Puntos que otorga el badge
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  unlock_criteria JSONB, -- Criterios para desbloquear (ej: {"courses_completed": 1})
  color TEXT DEFAULT '#64748b', -- Color del badge en hex
  is_secret BOOLEAN DEFAULT false, -- Badge secreto (no se muestra hasta desbloquearlo)
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. TABLA: user_badges (Badges Ganados)
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 100, -- Progreso hacia el badge (0-100)
  is_unlocked BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- Si el usuario lo destaca en su perfil
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- 3. TABLA: user_stats (Estadísticas Usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Puntos y nivel
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  experience_to_next_level INTEGER DEFAULT 100,
  
  -- Cursos
  courses_started INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  
  -- Badges
  total_badges INTEGER DEFAULT 0,
  common_badges INTEGER DEFAULT 0,
  rare_badges INTEGER DEFAULT 0,
  epic_badges INTEGER DEFAULT 0,
  legendary_badges INTEGER DEFAULT 0,
  
  -- Racha (streak)
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- Interacción social
  comments_posted INTEGER DEFAULT 0,
  helpful_ratings INTEGER DEFAULT 0,
  
  -- Ranking
  global_rank INTEGER,
  percentile DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. TABLA: badge_progress (Progreso hacia Badges)
-- ============================================
CREATE TABLE IF NOT EXISTS badge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0, -- Valor actual (ej: 3 cursos completados)
  target_value INTEGER NOT NULL, -- Valor objetivo (ej: 5 cursos)
  progress_percentage INTEGER DEFAULT 0, -- Porcentaje 0-100
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- 5. TABLA: user_achievements (Logros del Usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- 'course_completed', 'streak_7_days', etc
  achievement_data JSONB, -- Datos adicionales del logro
  points_earned INTEGER DEFAULT 0,
  achieved_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para Optimización
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_tier ON badges(tier);

-- ============================================
-- FUNCIÓN: Crear stats para nuevo usuario
-- ============================================
CREATE OR REPLACE FUNCTION create_user_stats_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Crear stats automáticamente
DROP TRIGGER IF EXISTS trigger_create_user_stats ON auth.users;
CREATE TRIGGER trigger_create_user_stats
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_stats_on_signup();

-- ============================================
-- FUNCIÓN: Actualizar estadísticas del usuario
-- ============================================
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_course_id UUID;
BEGIN
  -- Obtener user_id y course_id
  v_user_id := NEW.user_id;
  
  IF TG_TABLE_NAME = 'user_lesson_progress' THEN
    SELECT course_id INTO v_course_id 
    FROM course_lessons 
    WHERE id = NEW.lesson_id;
  ELSIF TG_TABLE_NAME = 'user_course_progress' THEN
    v_course_id := NEW.course_id;
  END IF;

  -- Asegurar que existe el registro de stats
  INSERT INTO user_stats (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Actualizar lecciones completadas
  IF TG_TABLE_NAME = 'user_lesson_progress' AND NEW.completed = true THEN
    UPDATE user_stats
    SET 
      lessons_completed = (
        SELECT COUNT(*) 
        FROM user_lesson_progress 
        WHERE user_id = v_user_id AND completed = true
      ),
      updated_at = NOW()
    WHERE user_id = v_user_id;
  END IF;

  -- Actualizar cursos completados y en progreso
  IF TG_TABLE_NAME = 'user_course_progress' THEN
    UPDATE user_stats
    SET 
      courses_started = (
        SELECT COUNT(*) 
        FROM user_course_progress 
        WHERE user_id = v_user_id
      ),
      courses_completed = (
        SELECT COUNT(*) 
        FROM user_course_progress 
        WHERE user_id = v_user_id AND completed = true
      ),
      updated_at = NOW()
    WHERE user_id = v_user_id;
  END IF;

  -- Actualizar contador de badges
  UPDATE user_stats
  SET 
    total_badges = (
      SELECT COUNT(*) 
      FROM user_badges 
      WHERE user_id = v_user_id AND is_unlocked = true
    ),
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Actualizar fecha de última actividad
  UPDATE user_stats
  SET last_activity_date = CURRENT_DATE
  WHERE user_id = v_user_id 
    AND (last_activity_date IS NULL OR last_activity_date < CURRENT_DATE);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS para actualizar stats
DROP TRIGGER IF EXISTS trigger_update_stats_on_lesson ON user_lesson_progress;
CREATE TRIGGER trigger_update_stats_on_lesson
AFTER INSERT OR UPDATE ON user_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_stats_on_course ON user_course_progress;
CREATE TRIGGER trigger_update_stats_on_course
AFTER INSERT OR UPDATE ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- ============================================
-- FUNCIÓN: Otorgar Badge al Usuario
-- ============================================
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

  -- Sumar puntos
  UPDATE user_stats
  SET 
    total_points = total_points + v_points,
    experience_points = experience_points + v_points,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Calcular nivel
  PERFORM calculate_user_level(p_user_id);

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Calcular Nivel del Usuario
-- ============================================
CREATE OR REPLACE FUNCTION calculate_user_level(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_exp INTEGER;
  v_new_level INTEGER;
  v_exp_to_next INTEGER;
BEGIN
  -- Obtener experiencia actual
  SELECT experience_points INTO v_exp
  FROM user_stats
  WHERE user_id = p_user_id;

  -- Calcular nivel (nivel = raíz cuadrada de exp / 100)
  v_new_level := GREATEST(1, FLOOR(SQRT(v_exp / 100.0)) + 1);
  
  -- Calcular exp necesaria para siguiente nivel
  v_exp_to_next := POWER(v_new_level, 2) * 100 - v_exp;

  -- Actualizar
  UPDATE user_stats
  SET 
    level = v_new_level,
    experience_to_next_level = v_exp_to_next,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Verificar y Otorgar Badges Automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_courses_completed INTEGER;
  v_lessons_completed INTEGER;
  v_total_badges INTEGER;
BEGIN
  v_user_id := NEW.user_id;

  -- Obtener estadísticas actuales
  SELECT 
    courses_completed, 
    lessons_completed,
    total_badges
  INTO 
    v_courses_completed, 
    v_lessons_completed,
    v_total_badges
  FROM user_stats
  WHERE user_id = v_user_id;

  -- Badge: Bienvenida (primer login/registro)
  IF v_total_badges = 0 THEN
    PERFORM award_badge(v_user_id, 'welcome');
  END IF;

  -- Badge: Primera Lección
  IF v_lessons_completed = 1 THEN
    PERFORM award_badge(v_user_id, 'first_lesson');
  END IF;

  -- Badge: 10 Lecciones
  IF v_lessons_completed = 10 THEN
    PERFORM award_badge(v_user_id, 'ten_lessons');
  END IF;

  -- Badge: 50 Lecciones
  IF v_lessons_completed = 50 THEN
    PERFORM award_badge(v_user_id, 'fifty_lessons');
  END IF;

  -- Badge: Primer Curso Completado
  IF v_courses_completed = 1 THEN
    PERFORM award_badge(v_user_id, 'first_course');
  END IF;

  -- Badge: 3 Cursos Completados
  IF v_courses_completed = 3 THEN
    PERFORM award_badge(v_user_id, 'three_courses');
  END IF;

  -- Badge: 5 Cursos Completados - Experto
  IF v_courses_completed = 5 THEN
    PERFORM award_badge(v_user_id, 'five_courses');
  END IF;

  -- Badge: Todos los cursos completados
  IF v_courses_completed >= (SELECT COUNT(*) FROM courses WHERE is_published = true) THEN
    PERFORM award_badge(v_user_id, 'all_courses');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Verificar badges automáticamente
DROP TRIGGER IF EXISTS trigger_check_badges ON user_stats;
CREATE TRIGGER trigger_check_badges
AFTER UPDATE ON user_stats
FOR EACH ROW
WHEN (OLD.lessons_completed IS DISTINCT FROM NEW.lessons_completed 
   OR OLD.courses_completed IS DISTINCT FROM NEW.courses_completed)
EXECUTE FUNCTION check_and_award_badges();

-- ============================================
-- FUNCIÓN: Actualizar Racha (Streak)
-- ============================================
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

  -- Otorgar badges de racha
  IF v_current_streak = 7 THEN
    PERFORM award_badge(NEW.user_id, 'streak_7_days');
  ELSIF v_current_streak = 30 THEN
    PERFORM award_badge(NEW.user_id, 'streak_30_days');
  ELSIF v_current_streak = 100 THEN
    PERFORM award_badge(NEW.user_id, 'streak_100_days');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Actualizar racha
DROP TRIGGER IF EXISTS trigger_update_streak ON user_lesson_progress;
CREATE TRIGGER trigger_update_streak
AFTER INSERT OR UPDATE ON user_lesson_progress
FOR EACH ROW
WHEN (NEW.completed = true)
EXECUTE FUNCTION update_user_streak();

-- ============================================
-- FUNCIÓN: Obtener Top Usuarios (Leaderboard)
-- ============================================
CREATE OR REPLACE FUNCTION get_leaderboard(
  p_limit INTEGER DEFAULT 10,
  p_period TEXT DEFAULT 'all_time' -- 'all_time', 'this_month', 'this_week'
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_points INTEGER,
  level INTEGER,
  total_badges INTEGER,
  courses_completed INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    p.full_name,
    p.avatar_url,
    us.total_points,
    us.level,
    us.total_badges,
    us.courses_completed,
    ROW_NUMBER() OVER (ORDER BY us.total_points DESC, us.level DESC) as rank
  FROM user_stats us
  LEFT JOIN profiles p ON p.id = us.user_id
  WHERE us.total_points > 0
  ORDER BY us.total_points DESC, us.level DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas para badges (público puede leer)
CREATE POLICY "Badges son públicos" ON badges
  FOR SELECT USING (is_active = true);

-- Políticas para user_badges (usuarios ven sus propios badges)
CREATE POLICY "Usuarios pueden ver sus badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden ver badges de otros" ON user_badges
  FOR SELECT USING (true);

-- Políticas para user_stats
CREATE POLICY "Usuarios pueden ver sus stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Stats son públicos para leaderboard" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden actualizar sus stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para badge_progress
CREATE POLICY "Usuarios ven su progreso" ON badge_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para user_achievements
CREATE POLICY "Usuarios ven sus logros" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- INSERTAR BADGES INICIALES
-- ============================================

-- Badges de Bienvenida
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('welcome', 'Bienvenido a Hakadogs', '¡Has dado el primer paso en tu viaje de educación canina!', '👋', 'progress', 'bronze', 10, 'common', '#94a3b8', 1),
('first_lesson', 'Primera Lección', 'Has completado tu primera lección', '📚', 'progress', 'bronze', 20, 'common', '#94a3b8', 2),
('first_course', 'Primer Curso', 'Has completado tu primer curso completo', '🎓', 'courses', 'silver', 50, 'rare', '#3b82f6', 3);

-- Badges de Progreso en Cursos
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('three_courses', 'Aprendiz Dedicado', 'Has completado 3 cursos', '📖', 'courses', 'silver', 100, 'rare', '#3b82f6', 4),
('five_courses', 'Experto Canino', 'Has completado 5 cursos', '🏆', 'courses', 'gold', 200, 'epic', '#f59e0b', 5),
('all_courses', 'Maestro Hakadogs', 'Has completado todos los cursos disponibles', '👑', 'courses', 'diamond', 500, 'legendary', '#8b5cf6', 6);

-- Badges de Lecciones
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('ten_lessons', 'Estudiante Activo', 'Has completado 10 lecciones', '✨', 'knowledge', 'bronze', 30, 'common', '#94a3b8', 7),
('fifty_lessons', 'Conocimiento Profundo', 'Has completado 50 lecciones', '💎', 'knowledge', 'gold', 150, 'epic', '#f59e0b', 8);

-- Badges de Racha (Streak)
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('streak_7_days', 'Racha de 7 Días', 'Has estudiado 7 días seguidos', '🔥', 'time', 'silver', 75, 'rare', '#ef4444', 9),
('streak_30_days', 'Racha de 30 Días', 'Has estudiado 30 días seguidos', '🚀', 'time', 'gold', 250, 'epic', '#ef4444', 10),
('streak_100_days', 'Imparable', 'Has estudiado 100 días seguidos', '⚡', 'time', 'diamond', 1000, 'legendary', '#ef4444', 11);

-- Badges Especiales
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('early_bird', 'Madrugador', 'Has completado una lección antes de las 7 AM', '🌅', 'special', 'silver', 50, 'rare', '#10b981', 12),
('night_owl', 'Búho Nocturno', 'Has completado una lección después de las 11 PM', '🦉', 'special', 'silver', 50, 'rare', '#6366f1', 13),
('perfectionist', 'Perfeccionista', 'Has obtenido 100% en 5 evaluaciones', '💯', 'knowledge', 'gold', 200, 'epic', '#f59e0b', 14);

-- Badge Secreto
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, is_secret, order_index) VALUES
('easter_egg', 'Descubridor', 'Has encontrado el secreto oculto', '🥚', 'special', 'platinum', 500, 'legendary', '#a855f7', true, 15);

-- ============================================
-- COMENTARIOS FINALES
-- ============================================
-- Este sistema de gamificación incluye:
-- ✅ Sistema completo de badges con rareza y tiers
-- ✅ Seguimiento de estadísticas del usuario
-- ✅ Sistema de puntos y niveles
-- ✅ Racha de días consecutivos (streak)
-- ✅ Otorgamiento automático de badges
-- ✅ Leaderboard (tabla de clasificación)
-- ✅ Seguridad con RLS
-- ✅ 15 badges iniciales listos para usar
-- ✅ Sistema escalable y fácil de extender

-- Para ejecutar este script:
-- 1. Copia todo el contenido
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el código y ejecuta
-- 4. ¡Listo! El sistema estará funcionando

COMMENT ON TABLE badges IS 'Catálogo de badges/insignias disponibles en el sistema';
COMMENT ON TABLE user_badges IS 'Badges ganados por cada usuario';
COMMENT ON TABLE user_stats IS 'Estadísticas y progreso del usuario';
COMMENT ON TABLE badge_progress IS 'Progreso actual hacia badges no desbloqueados';
COMMENT ON TABLE user_achievements IS 'Registro histórico de logros del usuario';
