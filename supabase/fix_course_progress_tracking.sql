-- Función para inicializar o actualizar el progreso de un usuario en un curso
CREATE OR REPLACE FUNCTION sync_user_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS void AS $$
BEGIN
  -- Insertar o actualizar el progreso del curso
  INSERT INTO user_course_progress (user_id, course_id, progress_percentage, completed_lessons, total_lessons, completed)
  VALUES (
    p_user_id,
    p_course_id,
    COALESCE((
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN (COUNT(*) FILTER (WHERE ulp.completed = true) * 100 / COUNT(*))
        ELSE 0 
      END
      FROM course_lessons cl
      LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = cl.id AND ulp.user_id = p_user_id
      WHERE cl.course_id = p_course_id
    ), 0),
    COALESCE((
      SELECT COUNT(*)
      FROM user_lesson_progress ulp
      JOIN course_lessons cl ON cl.id = ulp.lesson_id
      WHERE ulp.user_id = p_user_id 
        AND cl.course_id = p_course_id
        AND ulp.completed = true
    ), 0),
    COALESCE((
      SELECT COUNT(*)
      FROM course_lessons cl
      WHERE cl.course_id = p_course_id
    ), 0),
    false
  )
  ON CONFLICT (user_id, course_id) 
  DO UPDATE SET
    progress_percentage = COALESCE((
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN (COUNT(*) FILTER (WHERE ulp.completed = true) * 100 / COUNT(*))
        ELSE 0 
      END
      FROM course_lessons cl
      LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = cl.id AND ulp.user_id = p_user_id
      WHERE cl.course_id = p_course_id
    ), 0),
    completed_lessons = COALESCE((
      SELECT COUNT(*)
      FROM user_lesson_progress ulp
      JOIN course_lessons cl ON cl.id = ulp.lesson_id
      WHERE ulp.user_id = p_user_id 
        AND cl.course_id = p_course_id
        AND ulp.completed = true
    ), 0),
    total_lessons = COALESCE((
      SELECT COUNT(*)
      FROM course_lessons cl
      WHERE cl.course_id = p_course_id
    ), 0),
    completed = (
      SELECT COUNT(*) = COUNT(*) FILTER (WHERE ulp.completed = true) AND COUNT(*) > 0
      FROM course_lessons cl
      LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = cl.id AND ulp.user_id = p_user_id
      WHERE cl.course_id = p_course_id
    ),
    completed_at = CASE 
      WHEN (
        SELECT COUNT(*) = COUNT(*) FILTER (WHERE ulp.completed = true) AND COUNT(*) > 0
        FROM course_lessons cl
        LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = cl.id AND ulp.user_id = p_user_id
        WHERE cl.course_id = p_course_id
      ) THEN NOW()
      ELSE user_course_progress.completed_at
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Mejorar el trigger existente para usar la nueva función
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
BEGIN
  -- Obtener el course_id de la lección
  SELECT course_id INTO v_course_id
  FROM course_lessons
  WHERE id = NEW.lesson_id;
  
  -- Sincronizar el progreso del curso
  PERFORM sync_user_course_progress(NEW.user_id, v_course_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recrear el trigger (por si no existía)
DROP TRIGGER IF EXISTS trigger_update_course_progress ON user_lesson_progress;
CREATE TRIGGER trigger_update_course_progress
AFTER INSERT OR UPDATE ON user_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_course_progress();

-- Hacer que la función sea accesible para usuarios autenticados
GRANT EXECUTE ON FUNCTION sync_user_course_progress(UUID, UUID) TO authenticated;

-- Comentarios
COMMENT ON FUNCTION sync_user_course_progress IS 'Sincroniza el progreso de un usuario en un curso basándose en las lecciones completadas';
COMMENT ON FUNCTION update_course_progress IS 'Trigger que actualiza automáticamente el progreso del curso cuando se completa una lección';
