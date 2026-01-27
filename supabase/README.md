# 🗄️ Supabase - Base de Datos Hakadogs

**Versión:** 2.6.0 GAMIFICATION SYSTEM  
**Actualizado:** 12 Enero 2026  
**Estado:** ✅ Schema completo y consolidado

---

## 📋 ARCHIVOS EN ESTA CARPETA

### ✅ SCHEMA PRINCIPAL (Usar para nuevas instalaciones)

#### `SCHEMA_COMPLETO.sql` ⭐ **ARCHIVO MAESTRO**

**Schema completo todo-en-uno para configurar toda la base de datos de Hakadogs.**

**Incluye (en orden de ejecución):**

1. **Sistema de Cursos** (`setup_completo.sql`)
   - Tablas: courses, course_lessons, course_modules, course_resources
   - Progreso: user_lesson_progress, user_course_progress
   - Compras: course_purchases
   - Storage buckets: course-images, course-resources, course-videos
   - Políticas RLS completas
   - Triggers automáticos

2. **Sistema de Roles** (`user_roles_table.sql`)
   - Tabla: user_roles
   - Funciones: get_user_role(), is_admin()
   - Trigger: create_user_with_role()
   - RLS policies

3. **Sistema de Contactos** (`contacts_table.sql`)
   - Tabla: contacts
   - Estados: pending, in_progress, responded, closed
   - Funciones: get_contacts_stats(), mark_contact_responded()
   - Vista: contacts_admin_view

4. **Dashboard Admin** (`dashboard_functions.sql`)
   - Funciones RPC: get_dashboard_stats(), get_recent_users(), etc.
   - 7 funciones para estadísticas en tiempo real

5. **Sistema de Blog** (`blog_schema.sql`)
   - Tablas: blog_posts, blog_categories, blog_post_views
   - Storage bucket: blog-images
   - RLS policies (`blog_storage_SOLO_RLS.sql`)

6. **Caché de Contenido IA** (`city_content_cache.sql`)
   - Tabla: city_content_cache
   - Para contenido generado por OpenAI+SerpApi
   - Ahorro de costos ($0 recurrente)

7. **Sistema de Gamificación** (`gamification_system.sql`)
   - Tablas: user_badges, badge_definitions, user_streaks, etc.
   - 15 badges predefinidos
   - Leaderboard y sistema de puntos
   - Triggers automáticos de logros

**Total:** 24+ tablas, 12+ funciones RPC, 40+ RLS policies

---

### 📚 DOCUMENTACIÓN

#### `README.md` - Este archivo
Guía principal con instrucciones de instalación y estructura de la base de datos.

---

### 🗂️ ARCHIVOS INDIVIDUALES (Para referencia)

Estos archivos están consolidados en `SCHEMA_COMPLETO.sql` pero se mantienen para referencia:

- `setup_completo.sql` - Base de cursos
- `user_roles_table.sql` - Roles de usuario
- `contacts_table.sql` - Sistema de contactos
- `dashboard_functions.sql` - Funciones del dashboard
- `blog_schema.sql` - Sistema de blog
- `blog_storage_SOLO_RLS.sql` - RLS para blog-images
- `city_content_cache.sql` - Caché de contenido IA
- `gamification_system.sql` - Sistema de gamificación
- `module_tests_rls.sql` - Tests por módulo con RLS
- `fix_badge_counter.sql` - Fix contador de badges
- `fix_streak_realista.sql` - Fix de rachas realistas
- `FIX_ADMIN_EMAIL_CONFIRMATION.sql` - ⭐ Confirmar emails de administradores
- `FIX_ADMIN_METADATA_URGENTE.sql` - ⭐ Sincronizar rol en metadata (CRÍTICO)
- `HACER_USUARIO_ADMIN.sql` - ⭐ Utilidad para asignar rol admin

### 📁 Archivos Archivados

- `_archivos_antiguos_rls/` - Scripts RLS antiguos (obsoletos, no usar)

---

## 🚀 INSTALACIÓN RÁPIDA

### Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Espera a que termine de inicializar (~2 minutos)

### Paso 2: Ejecutar Schema Completo

1. Ve a **SQL Editor** en Supabase Dashboard
2. Click en **New Query**
3. Copia y pega **`SCHEMA_COMPLETO.sql`** completo
4. Click en **Run** (o Ctrl+Enter)
5. Espera a que termine (~30 segundos)
6. Verifica que todo se creó correctamente (ver verificación al final del script)

### Paso 3: Crear Usuario Admin

**⚠️ IMPORTANTE:** Para que un administrador pueda acceder desde cualquier dispositivo, el rol debe estar en DOS lugares:

1. **En la tabla `user_roles`** (para gestión interna)
2. **En los `user_metadata` de Supabase Auth** (para el login)

**Usar el script completo:**

```bash
# Ejecutar en orden:
1. supabase/HACER_USUARIO_ADMIN.sql
2. supabase/FIX_ADMIN_EMAIL_CONFIRMATION.sql  
3. supabase/FIX_ADMIN_METADATA_URGENTE.sql
```

**O ejecutar manualmente:**

```sql
-- 1. Asignar rol admin en tabla user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- 2. Confirmar email del administrador
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'tu-email@ejemplo.com'
  AND email_confirmed_at IS NULL;

-- 3. CRÍTICO: Actualizar user_metadata con el rol
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'tu-email@ejemplo.com';

-- 4. Verificar que todo está correcto
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_metadata,
  ur.role as role_tabla,
  u.email_confirmed_at IS NOT NULL as email_confirmado
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'tu-email@ejemplo.com';
```

**Resultado esperado:** 
- ✅ `role_metadata = 'admin'`
- ✅ `role_tabla = 'admin'`
- ✅ `email_confirmado = true`

### Paso 4: Configurar Variables de Entorno

En **Vercel** (Settings → Environment Variables):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_TINYMCE_API_KEY=tu_tinymce_key
NEXT_PUBLIC_SITE_URL=https://www.hakadogs.com
NEXT_PUBLIC_GA_ID=G-NXPT2KNYGJ
```

Ver [`/docs/setup/CONFIGURAR_SUPABASE_VERCEL.md`](../docs/setup/CONFIGURAR_SUPABASE_VERCEL.md) para más detalles.

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### 📚 Sistema de Cursos

```
courses (11 cursos)
├── course_modules (organización temática)
├── course_lessons (lecciones por módulo)
│   └── course_resources (PDFs, documentos)
│
├── course_purchases (compras de usuarios)
├── user_course_progress (progreso general por curso)
└── user_lesson_progress (progreso detallado por lección)
```

### 🎮 Sistema de Gamificación

```
badge_definitions (15 badges predefinidos)
├── user_badges (badges desbloqueados)
├── user_points (puntos XP por usuario)
├── user_streaks (rachas de estudio)
├── user_levels (niveles alcanzados)
└── leaderboard (ranking global)
```

### 👥 Sistema de Usuarios

```
auth.users (Supabase Auth)
├── user_roles (roles: admin, instructor, user)
└── contacts (mensajes de contacto)
```

### 📝 Sistema de Blog

```
blog_categories
├── blog_posts
└── blog_post_views (contador de vistas)
```

### 💾 Caché y Contenido

```
city_content_cache (contenido IA generado por ciudad)
```

### 🔧 Funciones Administrativas

```
dashboard_functions.sql:
- get_dashboard_stats() - Estadísticas generales
- get_recent_users(limit) - Usuarios recientes
- get_recent_sales(limit) - Ventas recientes
- get_recent_contacts(limit) - Contactos recientes
- get_sales_chart_data() - Datos para gráficas
- get_top_selling_courses(limit) - Top cursos
- get_conversion_metrics() - Métricas de conversión
```

---

## 🗄️ STORAGE BUCKETS

| Bucket | Público | Tamaño Máx | Uso |
|--------|---------|------------|-----|
| `course-images` | ✅ Sí | 5 MB | Thumbnails de cursos |
| `course-resources` | ❌ No | 50 MB | PDFs, documentos (solo comprados) |
| `course-videos` | ✅ Sí | 500 MB | Videos de lecciones |
| `blog-images` | ✅ Sí | 5 MB | Imágenes de artículos |

---

## 🔒 SEGURIDAD (RLS)

### Filosofía de Seguridad Simplificada

**Versión:** 1.0 DEFINITIVA (15 Enero 2026)  
**Estado:** ✅ Probado y funcionando

#### Enfoque Pragmático:

1. **RLS Deshabilitado en contenido público/administrativo** (10 tablas)
   - courses, course_lessons, course_modules, course_resources
   - module_tests, badges, blog_posts, blog_categories, blog_tags
   - **Razón:** Contenido público + Admin protegido por autenticación de la app

2. **RLS Habilitado solo en datos personales** (8 tablas)
   - user_lesson_progress, user_course_progress, course_purchases
   - user_test_attempts, user_badges, user_roles
   - blog_comments, contacts
   - **Razón:** Evitar que un usuario vea datos de otro

#### Políticas Activas:

| Tabla | Políticas | Descripción |
|-------|-----------|-------------|
| `user_lesson_progress` | 1 | Solo ver/modificar propio progreso |
| `user_course_progress` | 1 | Solo ver/modificar propio progreso |
| `course_purchases` | 1 | Solo ver/crear propias compras |
| `user_test_attempts` | 1 | Solo ver/crear propios intentos |
| `user_badges` | 2 | Ver propios + Sistema inserta auto |
| `user_roles` | 1 | Solo ver propio rol |
| `blog_comments` | 2 | Público lee aprobados + Gestionar propios |
| `contacts` | 1 | Cualquiera puede enviar contacto |

**Total: 11 políticas** (reducido de 40+ a 11 para simplicidad)

#### Documentación Completa:

- 📄 `POLITICAS_RLS_DEFINITIVAS.sql` - Script SQL completo
- 📖 `POLITICAS_RLS_EXPLICADAS.md` - Guía detallada con ejemplos

#### Comportamiento:

✅ **Admin logueado** → Acceso total sin restricciones  
✅ **Usuario normal** → Solo ve sus propios datos  
✅ **Usuario anónimo** → Ve contenido público (cursos, blog)  
✅ **Sin errores 403, 406 o 500**  
✅ **JOINs funcionan correctamente**

---

## 🧪 VERIFICACIÓN

### Verificar Instalación Completa

```sql
-- 1. Contar tablas creadas (debe ser 24+)
SELECT COUNT(*) as total_tablas
FROM information_schema.tables
WHERE table_schema = 'public';

-- 2. Ver tablas por sistema
SELECT 
  CASE 
    WHEN table_name LIKE 'course%' THEN 'Cursos'
    WHEN table_name LIKE 'user_%' AND table_name LIKE '%badge%' THEN 'Gamificación'
    WHEN table_name LIKE 'blog%' THEN 'Blog'
    WHEN table_name = 'contacts' THEN 'Contactos'
    WHEN table_name = 'user_roles' THEN 'Roles'
    ELSE 'Otros'
  END as sistema,
  COUNT(*) as tablas
FROM information_schema.tables
WHERE table_schema = 'public'
GROUP BY sistema
ORDER BY sistema;

-- 3. Ver buckets de storage (debe ser 4)
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id IN ('course-images', 'course-resources', 'course-videos', 'blog-images');

-- 4. Ver funciones RPC (debe ser 10+)
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'get%'
ORDER BY routine_name;
```

**Resultado esperado:**
- ✅ 24+ tablas creadas
- ✅ 4 buckets de storage
- ✅ 10+ funciones RPC
- ✅ 40+ políticas RLS

---

## 📈 ESTADÍSTICAS DEL PROYECTO

### Base de Datos:
- **Tablas:** 24+
- **Funciones RPC:** 12+
- **Triggers:** 8+
- **Políticas RLS:** 40+
- **Storage Buckets:** 4
- **Líneas SQL:** ~2,500

### Sistemas Implementados:
- ✅ Cursos con módulos y lecciones
- ✅ Gamificación completa
- ✅ Blog profesional
- ✅ Panel administrativo
- ✅ Sistema de contactos
- ✅ Roles de usuario
- ✅ Caché de contenido IA

---

## 🛠️ MANTENIMIENTO

### Reiniciar Base de Datos (Solo Desarrollo)

⚠️ **CUIDADO:** Esto elimina todos los datos.

```sql
-- 1. Eliminar tablas de gamificación
DROP TABLE IF EXISTS user_badge_progress CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badge_definitions CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_levels CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;

-- 2. Eliminar tablas de blog
DROP TABLE IF EXISTS blog_post_views CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;

-- 3. Eliminar tablas de contactos y roles
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- 4. Eliminar tablas de cursos
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;
DROP TABLE IF EXISTS course_resources CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- 5. Eliminar caché
DROP TABLE IF EXISTS city_content_cache CASCADE;

-- 6. Re-ejecutar SCHEMA_COMPLETO.sql
```

---

## 📞 SOPORTE

### Problemas Comunes:

**Error: "relation already exists"**
- Solución: Algunas tablas ya existen. Puedes continuar o hacer DROP de las tablas existentes primero.

**Error: "permission denied"**
- Solución: Asegúrate de tener permisos de administrador en Supabase.

**Error: "function does not exist"**
- Solución: Ejecuta todo el script `SCHEMA_COMPLETO.sql`, no solo partes.

**No puedo acceder al panel admin**
- **Causa:** Usuario no tiene rol 'admin' correctamente configurado
- **Solución completa:**
  1. Ejecutar `supabase/HACER_USUARIO_ADMIN.sql` (cambiar email)
  2. Ejecutar `supabase/FIX_ADMIN_EMAIL_CONFIRMATION.sql` (cambiar email)
  3. Ejecutar `supabase/FIX_ADMIN_METADATA_URGENTE.sql` (cambiar email)
  4. Cerrar sesión completamente
  5. Iniciar sesión de nuevo
- **Verificación:** El rol debe estar en `user_roles` Y en `auth.users.raw_user_meta_data`

**Admin no puede acceder desde otros dispositivos**
- **Síntoma:** Error "Email not confirmed" al iniciar sesión desde nueva IP/dispositivo
- **Solución:** Ejecutar `supabase/FIX_ADMIN_EMAIL_CONFIRMATION.sql` + `FIX_ADMIN_METADATA_URGENTE.sql`
- **Resultado:** Admin puede acceder desde cualquier lugar

### Enlaces Útiles:
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Documentación Supabase:** https://supabase.com/docs
- **Documentación Hakadogs:** [`/docs`](../docs/README.md)

---

## 🎯 PRÓXIMOS PASOS

Después de instalar el schema:

1. ✅ Deploy en Vercel completo
2. ✅ Acceder a `/administrator` con usuario admin
3. ✅ Crear cursos desde el panel
4. ✅ Configurar badges y gamificación
5. ✅ Publicar artículos en el blog
6. ✅ Usuarios pueden registrarse y comprar cursos

---

**Última actualización:** 12 Enero 2026  
**Versión:** 2.6.0 GAMIFICATION SYSTEM  
**Estado:** ✅ Schema completo y verificado  
**Proyecto:** Hakadogs - Educación Canina Profesional
