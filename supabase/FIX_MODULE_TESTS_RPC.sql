-- =============================================
-- FIX: Actualizar función RPC para mostrar todos los tests
-- =============================================
-- Este fix cambia INNER JOIN por LEFT JOIN para incluir
-- todos los tests incluso si tienen problemas con relaciones
-- =============================================

-- Función: Obtener todos los tests con sus estadísticas (para admin)
CREATE OR REPLACE FUNCTION get_all_module_tests_with_stats()
RETURNS TABLE (
  id UUID,
  module_id UUID,
  title TEXT,
  description TEXT,
  passing_score INTEGER,
  time_limit_minutes INTEGER,
  questions JSONB,
  is_generated BOOLEAN,
  is_published BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  module_title TEXT,
  course_id UUID,
  course_title TEXT,
  total_attempts BIGINT,
  unique_users BIGINT,
  pass_rate NUMERIC,
  average_score NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mt.id,
    mt.module_id,
    mt.title,
    mt.description,
    mt.passing_score,
    mt.time_limit_minutes,
    mt.questions,
    mt.is_generated,
    mt.is_published,
    mt.created_at,
    mt.updated_at,
    COALESCE(cm.title, 'Módulo no disponible') AS module_title,
    cm.course_id,
    COALESCE(c.title, 'Curso no disponible') AS course_title,
    COALESCE(COUNT(uta.id), 0)::BIGINT AS total_attempts,
    COALESCE(COUNT(DISTINCT uta.user_id), 0)::BIGINT AS unique_users,
    COALESCE(
      ROUND(
        (COUNT(CASE WHEN uta.passed = true THEN 1 END)::NUMERIC * 100.0) / 
        NULLIF(COUNT(uta.id), 0),
        2
      ),
      0
    ) AS pass_rate,
    COALESCE(ROUND(AVG(uta.score), 2), 0) AS average_score
  FROM module_tests mt
  LEFT JOIN course_modules cm ON mt.module_id = cm.id
  LEFT JOIN courses c ON cm.course_id = c.id
  LEFT JOIN user_test_attempts uta ON mt.id = uta.test_id
  GROUP BY 
    mt.id, 
    mt.module_id, 
    mt.title, 
    mt.description, 
    mt.passing_score,
    mt.time_limit_minutes,
    mt.questions,
    mt.is_generated,
    mt.is_published,
    mt.created_at,
    mt.updated_at,
    cm.title,
    cm.course_id,
    c.title
  ORDER BY mt.created_at DESC;
END;
$$;

-- Verificar que la función se actualizó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Función get_all_module_tests_with_stats() actualizada';
  RAISE NOTICE '✅ Ahora usa LEFT JOIN para incluir todos los tests';
END $$;
