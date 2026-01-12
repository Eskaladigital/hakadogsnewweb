-- ============================================
-- HAKADOGS - BADGES MEJORADOS Y REALISTAS
-- ============================================
-- Reemplazo de badges poco prácticos por badges útiles
-- relacionados con la educación canina real
-- ============================================

-- PASO 1: Eliminar badges poco prácticos
DELETE FROM badges WHERE code IN ('early_bird', 'night_owl', 'perfectionist', 'easter_egg');

-- PASO 2: Insertar badges más útiles y realistas (con ON CONFLICT para evitar duplicados)

-- Badges de Compromiso y Constancia
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('consistent_learner', 'Aprendiz Constante', 'Has estudiado al menos 3 veces esta semana', '📅', 'time', 'silver', 50, 'rare', '#10b981', 12),
('weekend_warrior', 'Guerrero del Fin de Semana', 'Has completado lecciones en fin de semana', '🎯', 'time', 'bronze', 30, 'common', '#10b981', 13)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  points = EXCLUDED.points,
  rarity = EXCLUDED.rarity,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- Badges de Progreso Real
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('quick_learner', 'Aprendizaje Rápido', 'Has completado 5 lecciones en un solo día', '⚡', 'knowledge', 'silver', 75, 'rare', '#f59e0b', 14),
('course_sprinter', 'Velocista', 'Has completado un curso en menos de 7 días', '🏃', 'courses', 'gold', 150, 'epic', '#f59e0b', 15)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  points = EXCLUDED.points,
  rarity = EXCLUDED.rarity,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- Badges de Especialización
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('puppy_expert', 'Experto en Cachorros', 'Has completado todos los cursos relacionados con cachorros', '🐕', 'special', 'gold', 200, 'epic', '#3b82f6', 16),
('behavior_specialist', 'Especialista en Conducta', 'Has completado todos los cursos de modificación de conducta', '🧠', 'special', 'gold', 200, 'epic', '#8b5cf6', 17)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  points = EXCLUDED.points,
  rarity = EXCLUDED.rarity,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- Badges de Dedicación Total
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, order_index) VALUES
('marathon_student', 'Estudiante Maratón', 'Has estudiado más de 10 horas en total', '🎖️', 'time', 'gold', 150, 'epic', '#ef4444', 18),
('knowledge_seeker', 'Buscador de Conocimiento', 'Has revisado lecciones previas 5 veces', '🔍', 'knowledge', 'silver', 100, 'rare', '#6366f1', 19)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  points = EXCLUDED.points,
  rarity = EXCLUDED.rarity,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- Badge Motivacional Final
INSERT INTO badges (code, name, description, icon, category, tier, points, rarity, color, is_secret, order_index) VALUES
('hakadogs_champion', 'Campeón Hakadogs', 'Has demostrado dedicación excepcional completando el 100% de la plataforma', '🏆', 'special', 'diamond', 500, 'legendary', '#ffd700', true, 20)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  points = EXCLUDED.points,
  rarity = EXCLUDED.rarity,
  color = EXCLUDED.color,
  is_secret = EXCLUDED.is_secret,
  order_index = EXCLUDED.order_index;

-- ============================================
-- ACTUALIZAR DESCRIPCIONES DE BADGES EXISTENTES
-- ============================================

-- Hacer descripciones más claras y motivadoras
UPDATE badges SET description = 'Das el primer paso en tu viaje de educación canina. ¡Bienvenido!' WHERE code = 'welcome';
UPDATE badges SET description = 'Has completado tu primera lección. ¡El conocimiento empieza aquí!' WHERE code = 'first_lesson';
UPDATE badges SET description = 'Has completado tu primer curso completo. ¡Vas por buen camino!' WHERE code = 'first_course';
UPDATE badges SET description = 'Has completado 3 cursos. Tu dedicación está dando frutos.' WHERE code = 'three_courses';
UPDATE badges SET description = 'Has completado 5 cursos. Eres un experto en formación.' WHERE code = 'five_courses';
UPDATE badges SET description = 'Has completado todos los cursos disponibles. ¡Eres un maestro!' WHERE code = 'all_courses';
UPDATE badges SET description = 'Has completado 10 lecciones. Sigues avanzando firme.' WHERE code = 'ten_lessons';
UPDATE badges SET description = 'Has completado 50 lecciones. Tu conocimiento es profundo.' WHERE code = 'fifty_lessons';

-- Actualizar badges de racha a valores MÁS REALISTAS
UPDATE badges SET 
  description = 'Has estudiado durante 3 días consecutivos. ¡Buen comienzo!',
  name = 'Racha de 3 Días',
  points = 30
WHERE code = 'streak_7_days';

UPDATE badges SET 
  description = 'Has estudiado durante 7 días consecutivos. ¡Qué constancia!',
  name = 'Racha de 7 Días',
  points = 100
WHERE code = 'streak_30_days';

UPDATE badges SET 
  description = 'Has estudiado durante 14 días consecutivos. ¡Eres increíble!',
  name = 'Racha de 14 Días',
  points = 300,
  rarity = 'epic'
WHERE code = 'streak_100_days';

-- ============================================
-- RESUMEN DE CAMBIOS
-- ============================================
-- ❌ ELIMINADOS (poco prácticos):
--    - Madrugador (completar antes de 7 AM)
--    - Búho Nocturno (completar después de 11 PM)
--    - Perfeccionista (100% en 5 evaluaciones)
--    - Descubridor (Easter egg secreto)
--
-- ✅ AÑADIDOS (útiles y motivadores):
--    - Aprendiz Constante (estudiar 3 veces/semana)
--    - Guerrero del Fin de Semana (estudiar en fin de semana)
--    - Aprendizaje Rápido (5 lecciones en un día)
--    - Velocista (curso en menos de 7 días)
--    - Experto en Cachorros (completar cursos cachorros)
--    - Especialista en Conducta (completar cursos conducta)
--    - Estudiante Maratón (más de 10 horas totales)
--    - Buscador de Conocimiento (revisar lecciones 5 veces)
--    - Campeón Hakadogs (100% completado - secreto)
--
-- ✏️ AJUSTADOS (más realistas):
--    - Racha 7 días → Racha 3 días (30 pts)
--    - Racha 30 días → Racha 7 días (100 pts)
--    - Racha 100 días → Racha 14 días (300 pts)
--
-- ============================================
-- EJECUTAR ESTE SCRIPT EN SUPABASE SQL EDITOR
-- ============================================
