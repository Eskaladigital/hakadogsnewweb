# ✅ Implementación de Imagen de Portada para Cursos

## 📝 Resumen

Se ha implementado completamente la funcionalidad de **imagen de portada** para cada curso. Los administradores pueden ahora subir imágenes que se mostrarán en:
- La lista pública de cursos (`/cursos`)
- El panel de administración de cursos (`/administrator/cursos`)

Las imágenes se almacenan en el bucket `course-images` de Supabase Storage.

---

## 🚀 Cambios Implementados

### 1. Base de Datos

**Archivo:** `supabase/ADD_COURSE_COVER_IMAGE.sql`

Se agregó la columna `cover_image_url` a la tabla `courses`:

```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

Esta columna almacena la URL pública de la imagen de portada almacenada en Storage.

---

### 2. TypeScript - Interfaz Course

**Archivo:** `lib/supabase/courses.ts`

Se actualizó la interfaz `Course` para incluir el nuevo campo:

```typescript
export interface Course {
  // ... campos existentes
  cover_image_url: string | null
  // ... otros campos
}
```

---

### 3. Función de Storage para Subir Imágenes

**Archivo:** `lib/storage.ts`

Se agregó la función `uploadCourseCoverImage`:

```typescript
export async function uploadCourseCoverImage(file: File, courseId: string) {
  return uploadFile(file, 'course-images', `covers/${courseId}`)
}
```

Esta función:
- Sube la imagen al bucket `course-images`
- Organiza las imágenes en la carpeta `covers/`
- Genera nombres únicos para evitar conflictos
- Retorna la URL pública de la imagen

---

### 4. Panel de Administración - Editar Curso

**Archivo:** `app/administrator/cursos/editar/[cursoId]/page.tsx`

#### Cambios Realizados:

1. **Importaciones:**
   ```typescript
   import ImageUpload from '@/components/ui/ImageUpload'
   import { uploadCourseCoverImage } from '@/lib/storage'
   ```

2. **Estado del formulario:**
   ```typescript
   const [formData, setFormData] = useState({
     // ... campos existentes
     coverImageUrl: '',
   })
   ```

3. **Función para manejar la subida:**
   ```typescript
   const handleCoverImageUpload = async (file: File) => {
     try {
       setToast({ message: 'Subiendo imagen...', type: 'info' })
       const { url, error } = await uploadCourseCoverImage(file, cursoId)
       
       if (error || !url) throw error || new Error('Error al subir la imagen')
       
       setFormData(prev => ({ ...prev, coverImageUrl: url }))
       setToast({ message: 'Imagen de portada subida exitosamente', type: 'success' })
     } catch (error) {
       setToast({ message: 'Error al subir la imagen. Inténtalo de nuevo.', type: 'error' })
       throw error
     }
   }
   ```

4. **Componente en la UI:**
   ```tsx
   <ImageUpload
     onUpload={handleCoverImageUpload}
     currentImage={formData.coverImageUrl}
     label="Imagen de portada del curso"
     maxSize={5}
     compress={true}
   />
   ```

5. **Guardar en base de datos:**
   ```typescript
   await updateCourse(cursoId, {
     // ... otros campos
     cover_image_url: formData.coverImageUrl || null,
   })
   ```

---

### 5. Vista Pública de Cursos

**Archivo:** `app/cursos/page.tsx`

Se actualizó el grid de cursos para mostrar las imágenes de portada:

```tsx
{/* Imagen de portada */}
{curso.cover_image_url && (
  <Link href={`/cursos/${curso.slug}`} className="block">
    <div className="relative w-full h-48 overflow-hidden bg-gray-100">
      <img 
        src={curso.cover_image_url} 
        alt={curso.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 right-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor} bg-opacity-90 backdrop-blur-sm`}>
          {difficultyLabel}
        </span>
      </div>
    </div>
  </Link>
)}
```

**Características:**
- Muestra la imagen en formato 16:9 (1200x675px recomendado)
- Efecto hover con zoom suave
- Badge de dificultad sobre la imagen
- Si no hay imagen, muestra el diseño anterior

---

### 6. Panel de Administración - Lista de Cursos

**Archivo:** `app/administrator/cursos/page.tsx`

Se actualizó la tabla para mostrar thumbnails:

```tsx
<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    {course.cover_image_url && (
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={course.cover_image_url} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-gray-900">{course.title}</p>
      <p className="text-xs text-gray-500">{course.slug}</p>
    </div>
  </div>
</td>
```

---

### 7. Documentación

Se crearon dos archivos de documentación:

1. **`docs/setup/CONFIGURAR_BUCKET_COURSE_IMAGES.md`**
   - Guía completa paso a paso
   - Configuración del bucket en Supabase
   - Políticas RLS
   - Solución de problemas

2. **`supabase/POLICIES_COURSE_IMAGES_BUCKET.sql`**
   - Script SQL para configurar políticas RLS
   - Listo para copiar y pegar en SQL Editor

---

## 🔧 Configuración Necesaria en Supabase

### Paso 1: Crear el Bucket

1. Ve a **Storage** en Supabase Dashboard
2. Crea un nuevo bucket llamado `course-images`
3. **Importante:** Marca el bucket como **PÚBLICO**

### Paso 2: Agregar la Columna a la Base de Datos

Ejecuta en SQL Editor:

```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

### Paso 3: Configurar Políticas RLS

Ejecuta el script completo en `supabase/POLICIES_COURSE_IMAGES_BUCKET.sql`

O configura manualmente 4 políticas:
- ✅ **SELECT:** Acceso público (todos pueden ver)
- 🔒 **INSERT:** Solo administradores pueden subir
- 🔒 **UPDATE:** Solo administradores pueden actualizar
- 🔒 **DELETE:** Solo administradores pueden eliminar

---

## 📐 Especificaciones de Imagen

### Recomendaciones:
- **Resolución:** 1200 x 675 px (ratio 16:9)
- **Formato:** WEBP, JPG o PNG
- **Peso máximo:** 5 MB
- **Compresión:** Automática (calidad 80%)

### El componente `ImageUpload`:
- ✅ Valida tipo de archivo (solo imágenes)
- ✅ Valida tamaño máximo (5MB)
- ✅ Comprime automáticamente las imágenes grandes
- ✅ Redimensiona a máximo 1200px de ancho
- ✅ Muestra preview en tiempo real
- ✅ Permite eliminar y cambiar la imagen

---

## 🎨 Flujo de Uso

### Para el Administrador:

1. Ir a `/administrator/cursos`
2. Hacer clic en **Editar** en cualquier curso
3. En la pestaña **"1. Información del Curso"**
4. Verás el componente **"Imagen de Portada"** en la parte superior
5. Hacer clic para seleccionar una imagen desde tu ordenador
6. La imagen se subirá automáticamente y se mostrará un preview
7. Hacer clic en **"Guardar Cambios"** para guardar el curso

### Para el Usuario Final:

Las imágenes se mostrarán automáticamente en:
- `/cursos` - Cada curso mostrará su imagen de portada en la tarjeta
- La imagen será clickeable y llevará a la página de detalles del curso

---

## ✅ Ventajas de esta Implementación

1. **Seguridad:** Solo administradores pueden subir/modificar imágenes
2. **Rendimiento:** Imágenes comprimidas automáticamente
3. **UX Mejorada:** Preview en tiempo real, drag & drop
4. **SEO Friendly:** Alt tags y URLs descriptivas
5. **Responsive:** Las imágenes se adaptan a todos los dispositivos
6. **Fallback:** Si no hay imagen, se muestra el diseño anterior

---

## 🚨 Solución de Problemas Comunes

### Error: "new row violates row-level security policy"
**Causa:** El usuario no tiene permisos para subir archivos  
**Solución:** 
- Verifica que el usuario sea admin en `user_roles`
- Verifica que el rol 'admin' esté también en `user_metadata`
- Ejecuta el script `supabase/FIX_ADMIN_METADATA_URGENTE.sql`

### Error: "Bucket not found"
**Causa:** El bucket no existe o tiene un nombre diferente  
**Solución:**
- Verifica en Storage que existe el bucket `course-images`
- El nombre debe ser exacto, en minúsculas, con guion

### Las imágenes no se muestran en el frontend
**Causa:** El bucket no es público  
**Solución:**
- Ve a Storage > course-images > Configuration
- Marca el bucket como **PUBLIC**

### Error: "File type not allowed"
**Causa:** El archivo no es una imagen válida  
**Solución:**
- Solo se permiten: JPG, JPEG, PNG, WEBP
- Verifica la extensión del archivo

---

## 📊 Archivos Modificados/Creados

### Archivos Nuevos:
- ✅ `supabase/ADD_COURSE_COVER_IMAGE.sql`
- ✅ `supabase/POLICIES_COURSE_IMAGES_BUCKET.sql`
- ✅ `docs/setup/CONFIGURAR_BUCKET_COURSE_IMAGES.md`
- ✅ `docs/IMPLEMENTACION_IMAGEN_PORTADA_CURSOS.md` (este archivo)

### Archivos Modificados:
- ✅ `lib/supabase/courses.ts` - Interfaz Course
- ✅ `lib/storage.ts` - Función uploadCourseCoverImage
- ✅ `app/administrator/cursos/editar/[cursoId]/page.tsx` - Editor de cursos
- ✅ `app/administrator/cursos/page.tsx` - Lista admin con thumbnails
- ✅ `app/cursos/page.tsx` - Vista pública con imágenes

---

## 🎯 Próximos Pasos Opcionales

### Mejoras Futuras Posibles:
1. **Crop de imagen:** Permitir recortar la imagen antes de subir
2. **Múltiples formatos:** Generar automáticamente diferentes tamaños
3. **CDN:** Integrar con CDN para mejor rendimiento global
4. **Lazy loading:** Cargar imágenes solo cuando sean visibles
5. **Placeholder:** Mostrar blur hash mientras carga la imagen

---

## 📝 Notas Finales

- Esta implementación está **lista para producción**
- Todas las imágenes se almacenan de forma segura en Supabase Storage
- El componente `ImageUpload` es reutilizable para otros casos de uso
- La funcionalidad es **completamente opcional** - los cursos funcionan con o sin imagen

---

**Fecha de implementación:** 28 de enero de 2026  
**Versión:** 1.0  
**Estado:** ✅ Completado y funcional
