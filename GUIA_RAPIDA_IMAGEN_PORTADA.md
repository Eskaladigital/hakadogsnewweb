# 🚀 GUÍA RÁPIDA: Imagen de Portada para Cursos

## ✅ ¿Qué se ha implementado?

Ahora cada curso puede tener una **imagen de portada** que se mostrará en:
- `/cursos` - Lista pública de cursos
- `/administrator/cursos` - Panel de administración

## 📋 Pasos para Configurar (IMPORTANTES)

### 1️⃣ Crear el Bucket en Supabase (5 minutos)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Menú lateral → **Storage**
3. Haz clic en **"New bucket"**
4. Configura:
   - **Name:** `course-images`
   - **Public bucket:** ✅ **MARCAR COMO PÚBLICO**
5. Haz clic en **"Create bucket"**

### 2️⃣ Agregar Columna a la Base de Datos

En Supabase → **SQL Editor** → ejecuta:

```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

### 3️⃣ Configurar Políticas de Seguridad

En Supabase → **SQL Editor** → copia y pega TODO el contenido del archivo:

📁 `supabase/POLICIES_COURSE_IMAGES_BUCKET.sql`

Haz clic en **"Run"**

### 4️⃣ Verificar que Todo Funciona

1. Ve a `/administrator/cursos`
2. Haz clic en **"Editar"** en cualquier curso
3. Verás el nuevo campo **"Imagen de Portada"** al inicio
4. Sube una imagen de prueba
5. Guarda el curso
6. Ve a `/cursos` y verifica que se muestra la imagen

---

## 🎨 ¿Cómo Usar?

### Subir Imagen de Portada:

1. `/administrator/cursos` → Editar curso
2. Pestaña **"1. Información del Curso"**
3. En la parte superior verás **"Imagen de Portada"**
4. Haz clic y selecciona una imagen
5. La imagen se sube automáticamente
6. Haz clic en **"Guardar Cambios"**

### Especificaciones de Imagen:

- ✅ **Formatos:** JPG, PNG, WEBP
- ✅ **Tamaño máximo:** 5 MB
- ✅ **Resolución recomendada:** 1200 x 675 px (16:9)
- ✅ **Compresión:** Automática

---

## 📁 Archivos Importantes

### Scripts SQL (Ejecutar en Supabase):
1. `supabase/ADD_COURSE_COVER_IMAGE.sql` - Agregar columna
2. `supabase/POLICIES_COURSE_IMAGES_BUCKET.sql` - Configurar permisos

### Documentación:
- `docs/setup/CONFIGURAR_BUCKET_COURSE_IMAGES.md` - Guía completa paso a paso
- `docs/IMPLEMENTACION_IMAGEN_PORTADA_CURSOS.md` - Detalles técnicos completos

---

## ⚠️ Solución de Problemas

### "Error al subir imagen"
→ Verifica que el bucket `course-images` existe y es **PÚBLICO**

### "new row violates row-level security policy"
→ Ejecuta el script: `supabase/POLICIES_COURSE_IMAGES_BUCKET.sql`

### "La imagen no se muestra en /cursos"
→ Verifica que el bucket esté marcado como **PÚBLICO** en Storage

---

## 🎯 ¿Es Obligatorio?

**NO.** La funcionalidad es completamente opcional:
- Los cursos funcionan perfectamente sin imagen
- Si no hay imagen, se muestra el diseño anterior
- Puedes agregar imágenes gradualmente a los cursos existentes

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema:
1. Lee `docs/setup/CONFIGURAR_BUCKET_COURSE_IMAGES.md` (solución de problemas)
2. Verifica que ejecutaste los 3 pasos de configuración
3. Revisa la consola del navegador para ver errores específicos

---

**¡Listo!** 🎉 Una vez completados los 3 pasos de configuración, ya puedes empezar a subir imágenes de portada a tus cursos.
