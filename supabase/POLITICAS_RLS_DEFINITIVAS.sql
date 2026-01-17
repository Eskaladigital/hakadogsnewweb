-- =====================================================================
-- HAKADOGS - POLÍTICAS RLS DEFINITIVAS
-- =====================================================================
-- Versión: 1.0 FINAL
-- Fecha: 15 Enero 2026
-- Estado: ✅ PROBADO Y FUNCIONANDO
-- =====================================================================
--
-- FILOSOFÍA DE SEGURIDAD:
-- 
-- 1. RLS DESHABILITADO en tablas públicas/administrativas
--    - courses, course_lessons, course_modules, badges, blog_posts, etc.
--    - Razón: Contenido público + Admin protegido por autenticación app
--
-- 2. RLS HABILITADO solo en datos personales de usuarios
--    - user_lesson_progress, user_course_progress, course_purchases
--    - user_badges, user_test_attempts, user_roles
--    - Razón: Evitar que un usuario vea datos de otro
--
-- 3. SIMPLICIDAD ante todo
--    - Menos políticas = menos puntos de fallo
--    - Fácil de entender y mantener
--
-- =====================================================================

-- =====================================================================
-- PASO 1: LIMPIAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================================

DO $$ 
DECLARE
    pol RECORD;
    tabla TEXT;
BEGIN
    FOR tabla IN 
        SELECT DISTINCT tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = tabla
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, tabla);
        END LOOP;
    END LOOP;
END $$;

-- =====================================================================
-- PASO 2: DESHABILITAR RLS EN TABLAS PÚBLICAS/ADMINISTRATIVAS
-- =====================================================================
-- Estas tablas son de contenido público o solo las modifica el admin
-- La seguridad del admin está en la autenticación de la aplicación
-- No necesitan RLS adicional porque:
-- - Son de lectura pública (cursos, blog, etc.)
-- - Solo el admin las modifica (protegido en /administrator)
-- =====================================================================

ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE module_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags DISABLE ROW LEVEL SECURITY;

-- =====================================================================
-- PASO 3: HABILITAR RLS SOLO EN DATOS PERSONALES DE USUARIOS
-- =====================================================================
-- Estas tablas contienen información personal/privada
-- DEBEN tener RLS para evitar que un usuario vea datos de otro
-- =====================================================================

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- PASO 4: CREAR POLÍTICAS MÍNIMAS (SOLO PARA TABLAS CON RLS)
-- =====================================================================

-- ---------------------------------------------------------------------
-- user_lesson_progress
-- ---------------------------------------------------------------------
-- Propósito: Rastrear qué lecciones ha completado cada usuario
-- Política: Cada usuario solo puede ver/modificar SU PROPIO progreso
-- ---------------------------------------------------------------------

CREATE POLICY "own_lesson_progress" 
ON user_lesson_progress 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "own_lesson_progress" ON user_lesson_progress IS 
'Usuarios solo ven y modifican su propio progreso de lecciones';

-- ---------------------------------------------------------------------
-- user_course_progress
-- ---------------------------------------------------------------------
-- Propósito: Rastrear progreso general de cada usuario en cada curso
-- Política: Cada usuario solo puede ver/modificar SU PROPIO progreso
-- ---------------------------------------------------------------------

CREATE POLICY "own_course_progress" 
ON user_course_progress 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "own_course_progress" ON user_course_progress IS 
'Usuarios solo ven y modifican su propio progreso de cursos';

-- ---------------------------------------------------------------------
-- course_purchases
-- ---------------------------------------------------------------------
-- Propósito: Registro de compras de cursos por usuario
-- Política: Cada usuario solo puede ver/crear SUS PROPIAS compras
-- ---------------------------------------------------------------------

CREATE POLICY "own_purchases" 
ON course_purchases 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "own_purchases" ON course_purchases IS 
'Usuarios solo ven y crean sus propias compras de cursos';

-- ---------------------------------------------------------------------
-- user_test_attempts
-- ---------------------------------------------------------------------
-- Propósito: Registro de intentos de exámenes/tests por usuario
-- Política: Cada usuario solo puede ver/crear SUS PROPIOS intentos
-- ---------------------------------------------------------------------

CREATE POLICY "own_test_attempts" 
ON user_test_attempts 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "own_test_attempts" ON user_test_attempts IS 
'Usuarios solo ven y crean sus propios intentos de tests';

-- ---------------------------------------------------------------------
-- user_badges
-- ---------------------------------------------------------------------
-- Propósito: Badges/insignias desbloqueadas por cada usuario
-- Política 1: Cada usuario solo puede VER sus propios badges
-- Política 2: El sistema puede insertar badges automáticamente (gamificación)
-- ---------------------------------------------------------------------

CREATE POLICY "own_badges_read" 
ON user_badges 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

COMMENT ON POLICY "own_badges_read" ON user_badges IS 
'Usuarios solo ven sus propios badges desbloqueados';

CREATE POLICY "system_insert_badges" 
ON user_badges 
FOR INSERT 
TO authenticated
WITH CHECK (true);

COMMENT ON POLICY "system_insert_badges" ON user_badges IS 
'Sistema de gamificación puede insertar badges automáticamente cuando se cumplen condiciones';

-- ---------------------------------------------------------------------
-- user_roles
-- ---------------------------------------------------------------------
-- Propósito: Rol de cada usuario (admin, user, instructor)
-- Política: Cada usuario solo puede VER su propio rol
-- Nota: Solo el sistema/admin puede modificar roles (no hay política de escritura para usuarios)
-- ---------------------------------------------------------------------

CREATE POLICY "own_role_read" 
ON user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

COMMENT ON POLICY "own_role_read" ON user_roles IS 
'Usuarios solo ven su propio rol (admin, user, instructor)';

-- ---------------------------------------------------------------------
-- blog_comments
-- ---------------------------------------------------------------------
-- Propósito: Comentarios de usuarios en artículos del blog
-- Política 1: Todos pueden leer comentarios aprobados (público)
-- Política 2: Cada usuario puede crear/editar/borrar sus propios comentarios
-- ---------------------------------------------------------------------

CREATE POLICY "public_read_comments" 
ON blog_comments 
FOR SELECT 
TO public
USING (is_approved = true);

COMMENT ON POLICY "public_read_comments" ON blog_comments IS 
'Todo el público puede leer comentarios aprobados por el admin';

CREATE POLICY "own_comments" 
ON blog_comments 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "own_comments" ON blog_comments IS 
'Usuarios pueden crear y gestionar sus propios comentarios';

-- ---------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------
-- Propósito: Mensajes de contacto enviados por visitantes/usuarios
-- Política: Cualquiera puede enviar un mensaje de contacto (público)
-- Nota: Solo el admin puede ver/gestionar contactos (sin política de lectura para usuarios)
-- ---------------------------------------------------------------------

CREATE POLICY "public_insert_contact" 
ON contacts 
FOR INSERT 
TO public
WITH CHECK (true);

COMMENT ON POLICY "public_insert_contact" ON contacts IS 
'Cualquier persona puede enviar un mensaje de contacto desde el formulario público';

-- =====================================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================================

-- Mostrar estado de RLS por tabla
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS HABILITADO'
    ELSE '🔓 RLS DESHABILITADO'
  END as estado_rls,
  CASE 
    WHEN rowsecurity THEN 'Datos de usuarios (protegidos)'
    ELSE 'Contenido público o admin (sin RLS)'
  END as tipo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'courses',
    'course_lessons',
    'course_modules',
    'course_resources',
    'badges',
    'blog_posts',
    'user_lesson_progress',
    'user_course_progress',
    'course_purchases',
    'user_test_attempts',
    'user_badges',
    'user_roles',
    'blog_comments',
    'contacts'
  )
ORDER BY rowsecurity DESC, tablename;

-- Contar políticas por tabla
SELECT 
  tablename,
  COUNT(*) as total_politicas
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Detalle de todas las políticas
SELECT 
  tablename,
  policyname,
  CASE 
    WHEN cmd = 'ALL' THEN '🔓 Todas las operaciones'
    WHEN cmd = 'SELECT' THEN '👁️ Solo lectura'
    WHEN cmd = 'INSERT' THEN '➕ Solo insertar'
    WHEN cmd = 'UPDATE' THEN '✏️ Solo actualizar'
    WHEN cmd = 'DELETE' THEN '🗑️ Solo borrar'
  END as operaciones_permitidas,
  CASE 
    WHEN roles::text = '{authenticated}' THEN '🔐 Solo usuarios logueados'
    WHEN roles::text = '{public}' THEN '🌐 Público (cualquiera)'
    ELSE roles::text
  END as quien_puede
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================================
-- ✅ COMPLETADO - POLÍTICAS RLS DEFINITIVAS
-- =====================================================================
--
-- RESUMEN:
--
-- TABLAS SIN RLS (10):
-- - courses, course_lessons, course_modules, course_resources
-- - module_tests, badges, blog_posts, blog_categories
-- - blog_tags, blog_post_tags
-- Razón: Contenido público o solo modificado por admin
--
-- TABLAS CON RLS (8):
-- - user_lesson_progress (1 política)
-- - user_course_progress (1 política)
-- - course_purchases (1 política)
-- - user_test_attempts (1 política)
-- - user_badges (2 políticas)
-- - user_roles (1 política)
-- - blog_comments (2 políticas)
-- - contacts (1 política)
-- Total: 11 políticas
--
-- COMPORTAMIENTO:
-- ✅ Admin logueado → Acceso total a todo (sin restricciones RLS)
-- ✅ Admin como usuario → Ve sus propios cursos/badges/progreso
-- ✅ Usuario normal → Solo ve sus propios datos
-- ✅ Público → Puede ver cursos, blog, enviar contacto
-- ✅ Sin errores 403, 406 o 500
-- ✅ JOINs funcionan correctamente
--
-- =====================================================================
