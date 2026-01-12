-- =============================================
-- 🔍 SOLUCIÓN ERROR 406: Crear registro inicial
-- =============================================
-- El error 406 significa que NO EXISTE el registro
-- en user_course_progress para ese usuario/curso
-- =============================================

-- PASO 1: Ver qué cursos tiene el usuario af798264-9d1b-403d-8990-b68584bebcdd
SELECT 
  ucp.user_id,
  ucp.course_id,
  c.title as curso_titulo,
  ucp.progress_percentage,
  ucp.completed_lessons,
  ucp.total_lessons
FROM user_course_progress ucp
JOIN courses c ON c.id = ucp.course_id
WHERE ucp.user_id = 'af798264-9d1b-403d-8990-b68584bebcdd';

-- Si está VACÍO, el usuario NO tiene ningún curso registrado

-- =============================================
-- PASO 2: Crear registros iniciales para TODOS los cursos
-- =============================================
-- Esto crea un registro en user_course_progress para cada curso
-- que el usuario debería tener acceso

INSERT INTO user_course_progress (user_id, course_id, progress_percentage, completed_lessons, total_lessons)
SELECT 
  'af798264-9d1b-403d-8990-b68584bebcdd' as user_id,
  c.id as course_id,
  0 as progress_percentage,
  0 as completed_lessons,
  c.total_lessons
FROM courses c
WHERE c.is_published = true
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Esto crea un registro inicial (0% progreso) para TODOS los cursos publicados

-- =============================================
-- PASO 3: Verificar que se crearon
-- =============================================
SELECT 
  ucp.course_id,
  c.title,
  ucp.progress_percentage,
  ucp.completed_lessons || '/' || ucp.total_lessons as progreso
FROM user_course_progress ucp
JOIN courses c ON c.id = ucp.course_id
WHERE ucp.user_id = 'af798264-9d1b-403d-8990-b68584bebcdd'
ORDER BY c.title;

-- Ahora deberías ver todos los cursos con 0% progreso

-- =============================================
-- ✅ DESPUÉS DE ESTO
-- =============================================
-- El error 406 debería desaparecer porque ahora
-- existen los registros en user_course_progress
-- =============================================
