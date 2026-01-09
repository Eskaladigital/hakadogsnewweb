# 🗄️ Supabase - Configuración de Base de Datos

## 📋 Archivos en esta carpeta

### ✅ **USAR PARA PRODUCCIÓN:**

#### 1. `setup_completo.sql` ⭐ **PRINCIPAL**
**Archivo todo-en-uno para configurar la base de datos completa.**

Incluye:
- ✅ Tablas de cursos y lecciones
- ✅ Progreso de usuario
- ✅ Compras de cursos
- ✅ Buckets de Storage (imágenes, recursos, videos)
- ✅ Políticas de seguridad (RLS)
- ✅ Funciones y triggers automáticos
- ✅ Verificación final

**Cómo usar:**
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. SQL Editor → New Query
4. Copia y pega `setup_completo.sql`
5. Run (Ctrl+Enter)
6. Verifica los resultados al final

---

#### 2. `seed.sql` (Opcional)
**Datos de ejemplo para testing.**

Contiene:
- Ejercicios de ejemplo para HakaTrainer (cuando las apps estén activas)
- Plantillas de eventos
- Posts del foro

**Nota:** Este archivo es para desarrollo. No es necesario para el sistema de cursos actual.

---

### ❌ **OBSOLETOS (No usar):**

#### 3. `schema.sql` ❌
Schema de las apps (HakaHealth, HakaTrainer, HakaCommunity).  
**Razón:** Las apps estarán en dominios separados.

#### 4. `notifications.sql` ❌
Notificaciones de las apps.  
**Razón:** No se usa en la web principal.

#### 5. `schema_cursos.sql` ❌
**Ya incluido en `setup_completo.sql`**

#### 6. `storage_setup.sql` ❌
**Ya incluido en `setup_completo.sql`**

---

## 🚀 Guía de Instalación Rápida

### Paso 1: Configurar Supabase

```bash
# 1. Crea un proyecto en supabase.com
# 2. Copia las credenciales del proyecto
```

### Paso 2: Ejecutar el Script Principal

1. Ve a **SQL Editor** en Supabase
2. **New Query**
3. Copia y pega `setup_completo.sql`
4. **Run**
5. Verifica que todo se creó correctamente (ver sección de verificación al final del script)

### Paso 3: Configurar Variables de Entorno en Vercel

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_TINYMCE_API_KEY=tu_tinymce_api_key
```

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

```
courses                    # Cursos
├── course_lessons        # Lecciones de cada curso
│   └── course_resources  # Recursos descargables (PDFs, etc)
│
├── course_purchases      # Compras realizadas
├── user_course_progress  # Progreso general por curso
└── user_lesson_progress  # Progreso por lección
```

### Storage Buckets

```
course-images      (público)   # Thumbnails, banners
course-resources   (privado)   # PDFs, documentos
course-videos      (público)   # Videos de lecciones
```

---

## 🔒 Seguridad (RLS)

### Políticas Implementadas:

#### course-images (público)
- ✅ Lectura: Cualquiera
- 🔐 Escritura: Solo admins

#### course-resources (privado)
- ✅ Lectura: Admins + usuarios con curso comprado
- 🔐 Escritura: Solo admins

#### course-videos (público)
- ✅ Lectura: Cualquiera
- 🔐 Escritura: Solo admins

---

## 🧪 Verificación

### Verificar Tablas Creadas

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'course%'
ORDER BY tablename;
```

**Resultado esperado:**
```
course_lessons
course_purchases
course_resources
courses
user_course_progress
user_lesson_progress
```

### Verificar Buckets Creados

```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('course-images', 'course-resources', 'course-videos');
```

**Resultado esperado:**
```
course-images     | true  | 5MB
course-resources  | false | 50MB
course-videos     | true  | 500MB
```

### Verificar Políticas de Storage

```sql
SELECT policyname, cmd 
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE 'course_%'
ORDER BY policyname;
```

**Resultado esperado:** 12 políticas creadas

---

## 🛠️ Mantenimiento

### Limpiar Base de Datos (Desarrollo)

```sql
-- ⚠️ CUIDADO: Elimina TODOS los datos
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;
DROP TABLE IF EXISTS course_resources CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
```

### Reiniciar desde Cero

1. Ejecutar script de limpieza (arriba)
2. Re-ejecutar `setup_completo.sql`

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que las credenciales en `.env.local` sean correctas
2. Verifica que las variables estén configuradas en Vercel
3. Revisa los logs de Supabase Dashboard → Logs
4. Verifica las políticas RLS → Database → Policies

---

## 🎓 Próximos Pasos

Una vez configurada la base de datos:

1. ✅ Deploy en Vercel debería completarse
2. ✅ Panel admin accesible en `/administrator`
3. ✅ Crear cursos desde el panel
4. ✅ Usuarios pueden registrarse y comprar cursos

---

**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Proyecto:** Hakadogs - Educación Canina Profesional
