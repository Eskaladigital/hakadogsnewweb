-- =============================================
-- HAKADOGS - POLÍTICAS RLS PARA TESTS DE MÓDULOS
-- =============================================
-- Ejecutar después de crear las tablas module_tests y user_test_attempts
-- =============================================

-- Habilitar RLS en las tablas
ALTER TABLE module_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_attempts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA module_tests
-- =============================================

-- Usuarios autenticados pueden ver tests publicados
DROP POLICY IF EXISTS "users_can_view_published_tests" ON module_tests;
CREATE POLICY "users_can_view_published_tests"
ON module_tests
FOR SELECT
TO authenticated
USING (is_published = true);

-- Admins pueden ver todos los tests
DROP POLICY IF EXISTS "admins_can_view_all_tests" ON module_tests;
CREATE POLICY "admins_can_view_all_tests"
ON module_tests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Admins pueden insertar tests
DROP POLICY IF EXISTS "admins_can_insert_tests" ON module_tests;
CREATE POLICY "admins_can_insert_tests"
ON module_tests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Admins pueden actualizar tests
DROP POLICY IF EXISTS "admins_can_update_tests" ON module_tests;
CREATE POLICY "admins_can_update_tests"
ON module_tests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Admins pueden eliminar tests
DROP POLICY IF EXISTS "admins_can_delete_tests" ON module_tests;
CREATE POLICY "admins_can_delete_tests"
ON module_tests
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- =============================================
-- POLÍTICAS PARA user_test_attempts
-- =============================================

-- Usuarios pueden ver sus propios intentos
DROP POLICY IF EXISTS "users_can_view_own_attempts" ON user_test_attempts;
CREATE POLICY "users_can_view_own_attempts"
ON user_test_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuarios pueden insertar sus propios intentos
DROP POLICY IF EXISTS "users_can_insert_own_attempts" ON user_test_attempts;
CREATE POLICY "users_can_insert_own_attempts"
ON user_test_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todos los intentos
DROP POLICY IF EXISTS "admins_can_view_all_attempts" ON user_test_attempts;
CREATE POLICY "admins_can_view_all_attempts"
ON user_test_attempts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- =============================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_module_tests_module_published 
ON module_tests(module_id, is_published);

CREATE INDEX IF NOT EXISTS idx_user_test_attempts_user_test 
ON user_test_attempts(user_id, test_id);

CREATE INDEX IF NOT EXISTS idx_user_test_attempts_passed 
ON user_test_attempts(test_id, passed);

-- =============================================
-- FUNCIÓN: Marcar lecciones completadas al aprobar test
-- =============================================

-- Función para marcar todas las lecciones de un módulo como completadas
CREATE OR REPLACE FUNCTION mark_module_lessons_complete(
  p_user_id UUID,
  p_module_id UUID
) RETURNS void AS $$
BEGIN
  INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at, updated_at)
  SELECT 
    p_user_id,
    cl.id,
    true,
    NOW(),
    NOW()
  FROM course_lessons cl
  WHERE cl.module_id = p_module_id
  ON CONFLICT (user_id, lesson_id) 
  DO UPDATE SET 
    completed = true,
    completed_at = COALESCE(user_lesson_progress.completed_at, NOW()),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Al aprobar un test, marcar lecciones como completadas
CREATE OR REPLACE FUNCTION trigger_complete_module_on_test_pass()
RETURNS TRIGGER AS $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Solo si aprobó el test
  IF NEW.passed = true THEN
    -- Obtener el module_id del test
    SELECT module_id INTO v_module_id
    FROM module_tests
    WHERE id = NEW.test_id;
    
    IF v_module_id IS NOT NULL THEN
      -- Marcar todas las lecciones del módulo como completadas
      PERFORM mark_module_lessons_complete(NEW.user_id, v_module_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_module_complete_on_test ON user_test_attempts;
CREATE TRIGGER trigger_module_complete_on_test
AFTER INSERT ON user_test_attempts
FOR EACH ROW
EXECUTE FUNCTION trigger_complete_module_on_test_pass();

-- =============================================
-- VERIFICACIÓN
-- =============================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS para module_tests creadas';
  RAISE NOTICE '✅ Políticas RLS para user_test_attempts creadas';
  RAISE NOTICE '✅ Índices de performance creados';
  RAISE NOTICE '✅ Función y trigger para completar lecciones creados';
END $$;
