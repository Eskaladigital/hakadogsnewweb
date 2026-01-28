# Configurar Bucket course-images en Supabase

Este documento explica cómo configurar el bucket `course-images` en Supabase Storage para almacenar las imágenes de portada de los cursos.

## 📋 Pasos para Configurar el Bucket

### 1. Acceder a Supabase Storage

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, haz clic en **Storage**
3. Haz clic en **"New bucket"** o **"Create a new bucket"**

### 2. Crear el Bucket

Configura el bucket con los siguientes parámetros:

- **Name:** `course-images`
- **Public bucket:** ✅ **SÍ** (marcar como público)
- **File size limit:** `5 MB` (opcional, pero recomendado)
- **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp`

Haz clic en **"Create bucket"**

### 3. Configurar Políticas RLS (Row Level Security)

Para permitir que los administradores suban imágenes y que todos puedan verlas, necesitas configurar políticas RLS.

#### Opción A: Configurar desde la UI de Supabase

1. En Storage, haz clic en el bucket `course-images`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**

**Política 1: Lectura Pública (SELECT)**
- **Policy name:** `Public read access`
- **Allowed operation:** `SELECT`
- **Policy definition:** 
  ```sql
  true
  ```

**Política 2: Subida solo para Admins (INSERT)**
- **Policy name:** `Admin upload only`
- **Allowed operation:** `INSERT`
- **Policy definition:**
  ```sql
  auth.uid() IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  )
  OR
  (auth.jwt()->>'role')::text = 'admin'
  ```

**Política 3: Actualización solo para Admins (UPDATE)**
- **Policy name:** `Admin update only`
- **Allowed operation:** `UPDATE`
- **Policy definition:**
  ```sql
  auth.uid() IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  )
  OR
  (auth.jwt()->>'role')::text = 'admin'
  ```

**Política 4: Eliminación solo para Admins (DELETE)**
- **Policy name:** `Admin delete only`
- **Allowed operation:** `DELETE`
- **Policy definition:**
  ```sql
  auth.uid() IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  )
  OR
  (auth.jwt()->>'role')::text = 'admin'
  ```

#### Opción B: Configurar desde SQL Editor

Ve a **SQL Editor** y ejecuta el siguiente script:

```sql
-- =====================================================
-- POLÍTICAS RLS PARA BUCKET course-images
-- =====================================================

-- 1. Habilitar RLS en el bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Política de LECTURA PÚBLICA (todos pueden ver las imágenes)
CREATE POLICY "Public read access for course-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-images');

-- 3. Política de INSERCIÓN solo para ADMINISTRADORES
CREATE POLICY "Admin upload only for course-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-images'
  AND (
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- 4. Política de ACTUALIZACIÓN solo para ADMINISTRADORES
CREATE POLICY "Admin update only for course-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-images'
  AND (
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- 5. Política de ELIMINACIÓN solo para ADMINISTRADORES
CREATE POLICY "Admin delete only for course-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-images'
  AND (
    auth.uid() IN (
      SELECT user_id 
      FROM public.user_roles 
      WHERE role = 'admin'
    )
    OR
    (auth.jwt()->>'role')::text = 'admin'
  )
);

-- =====================================================
-- VERIFICAR POLÍTICAS CREADAS
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%course-images%';
```

### 4. Agregar la Columna a la Base de Datos

Ejecuta el script SQL que ya creamos:

```sql
-- En SQL Editor de Supabase, ejecuta:
-- Ubicación: supabase/ADD_COURSE_COVER_IMAGE.sql

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

COMMENT ON COLUMN courses.cover_image_url IS 'URL de la imagen de portada del curso almacenada en storage bucket course-images';
```

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. **Verificar bucket:** En Storage, debes ver el bucket `course-images` marcado como público
2. **Verificar políticas:** En Storage > course-images > Policies, debes ver las 4 políticas creadas
3. **Verificar columna:** Ejecuta en SQL Editor:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'courses' 
     AND column_name = 'cover_image_url';
   ```

## 🎨 Uso en la Aplicación

### Subir Imagen desde el Panel de Administración

1. Ve a `/administrator/cursos`
2. Haz clic en "Editar" en cualquier curso
3. En la pestaña **"1. Información del Curso"**
4. Verás el componente **"Imagen de Portada"**
5. Haz clic para seleccionar una imagen (JPG, PNG o WEBP, máx 5MB)
6. La imagen se subirá automáticamente al bucket
7. Guarda los cambios del curso

### Visualización en Frontend

Las imágenes de portada se mostrarán automáticamente en:
- `/cursos` - Lista de cursos públicos
- `/administrator/cursos` - Lista de cursos en el panel admin

## 📐 Recomendaciones de Imagen

- **Resolución recomendada:** 1200 x 675 px (ratio 16:9)
- **Formato recomendado:** WEBP para mejor compresión, o JPG/PNG
- **Peso máximo:** 5 MB (se comprimirá automáticamente)
- **Contenido:** Imagen representativa del tema del curso

## 🚨 Solución de Problemas

### Error: "new row violates row-level security policy"
- Verifica que el usuario esté autenticado como admin
- Verifica que las políticas RLS estén creadas correctamente
- Verifica que el rol 'admin' esté en `user_roles` Y en `user_metadata`

### Error: "Bucket not found"
- Verifica que el bucket se llama exactamente `course-images`
- Verifica que el bucket está marcado como público

### Error: "File type not allowed"
- Solo se permiten: JPG, JPEG, PNG, WEBP
- Verifica la extensión del archivo

### Las imágenes no se muestran en frontend
- Verifica que el bucket sea público
- Verifica que la política de lectura pública esté activa
- Verifica que `cover_image_url` tenga la URL correcta en la base de datos

## 📚 Recursos Adicionales

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Policies](https://supabase.com/docs/guides/storage/security/access-control)
