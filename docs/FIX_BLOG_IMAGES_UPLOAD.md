# 🔧 Solución: Error al Subir Imágenes de Portada del Blog

## 📋 Problema

Las imágenes de portada de los artículos del blog no se pueden subir correctamente desde el panel de administración (`/administrator/blog/nuevo` y `/administrator/blog/editar/[postId]`).

## 🔍 Causa

El componente `MediaLibrary` intenta subir imágenes al bucket `blog-images` en Supabase Storage, pero:

1. **El bucket no existe**, o
2. **Las políticas RLS no están configuradas correctamente** para permitir que los administradores suban imágenes

## ✅ Solución

### Paso 1: Ejecutar Script SQL

1. Ve al **Dashboard de Supabase**: https://supabase.com/dashboard/project/[TU_PROJECT_ID]
2. Navega a **SQL Editor** en el menú lateral
3. Abre el archivo `supabase/setup_blog_images_bucket.sql`
4. Copia todo el contenido del script
5. Pégalo en el SQL Editor
6. Haz clic en **Run** (Ejecutar)

### Paso 2: Verificar la Configuración

Después de ejecutar el script, verifica que todo está correcto:

#### 2.1. Verificar el Bucket

1. Ve a **Storage** en el menú lateral de Supabase
2. Deberías ver un bucket llamado `blog-images`
3. Haz clic en él para abrirlo
4. Verifica que esté marcado como **Público**

#### 2.2. Verificar las Políticas

1. En el bucket `blog-images`, ve a la pestaña **Policies**
2. Deberías ver 4 políticas:
   - ✅ `Admins can upload blog images` (INSERT)
   - ✅ `Admins can update blog images` (UPDATE)
   - ✅ `Admins can delete blog images` (DELETE)
   - ✅ `Everyone can view blog images` (SELECT)

### Paso 3: Probar la Subida de Imágenes

1. Ve a `/administrator/blog/nuevo` o edita un artículo existente
2. Haz clic en el botón **"Seleccionar Imagen"** en la sección "Imagen Destacada"
3. Se abrirá la **Biblioteca de Medios**
4. Haz clic en el botón **"Subir Imágenes"**
5. Selecciona una o varias imágenes (máx. 10MB cada una)
6. Deberías ver el mensaje: **"✅ Imágenes subidas correctamente"**
7. Selecciona la imagen que deseas usar
8. Haz clic en **"Usar esta imagen"**

## 🔍 Diagnóstico de Errores

### Error 1: "Bucket no existe"

**Síntoma**: Al ejecutar el script SQL, ves un error relacionado con el bucket.

**Solución**:
- El script usa `INSERT ... ON CONFLICT DO UPDATE`, por lo que debería crear el bucket automáticamente
- Si aún falla, ve a **Storage** > **Create a new bucket** y créalo manualmente con el nombre `blog-images`
- Marca la opción **Public bucket**
- Luego ejecuta solo las secciones 2, 3 y 4 del script (políticas)

### Error 2: "No tienes permisos"

**Síntoma**: Al intentar subir una imagen, ves un error de permisos.

**Solución**:
1. Verifica que tu usuario tiene el rol de `admin` en la tabla `user_roles`:
   ```sql
   SELECT * FROM user_roles WHERE user_id = auth.uid();
   ```
2. Si no tienes el rol, agrégalo:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES (auth.uid(), 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```

### Error 3: "Tipo de archivo no válido"

**Síntoma**: Al subir una imagen, ves un error sobre el tipo de archivo.

**Solución**:
- Solo se permiten: **JPEG, JPG, PNG, WEBP, GIF**
- Verifica que tu archivo sea uno de estos tipos
- El tamaño máximo es **10MB**

### Error 4: Las imágenes se suben pero no se ven

**Síntoma**: Las imágenes se suben correctamente, pero no se muestran en el artículo.

**Solución**:
1. Verifica que el bucket `blog-images` esté marcado como **Público**
2. Ejecuta este SQL para asegurarte:
   ```sql
   UPDATE storage.buckets 
   SET public = true 
   WHERE id = 'blog-images';
   ```
3. Limpia la caché del navegador (Ctrl+Shift+R / Cmd+Shift+R)

## 🎯 Diferencia con las Imágenes de Cursos

### Cursos (Funciona Bien)
- Usa el componente `ImageUpload`
- Sube directamente a Supabase Storage bucket `course-images`
- Comprime imágenes antes de subir
- Incluye validación y preview

### Blog (Problema a Resolver)
- Usa el componente `MediaLibrary`
- Biblioteca de medios reutilizable
- Sube al bucket `blog-images`
- Permite seleccionar de imágenes ya subidas

## 📝 Configuración del Script

El script `setup_blog_images_bucket.sql` hace lo siguiente:

1. **Crea el bucket `blog-images`** con estas características:
   - Público (para que las imágenes sean accesibles)
   - Límite de 10MB por archivo
   - Solo imágenes: JPEG, PNG, WEBP, GIF

2. **Configura 4 políticas RLS**:
   - **INSERT**: Solo admins pueden subir
   - **UPDATE**: Solo admins pueden actualizar
   - **DELETE**: Solo admins pueden eliminar
   - **SELECT**: Cualquiera puede ver (público)

3. **Verifica la configuración**:
   - Lista el bucket creado
   - Lista las políticas aplicadas

## 🔒 Seguridad

- ✅ Solo usuarios con rol `admin` pueden subir, modificar o eliminar imágenes
- ✅ Las imágenes son públicas para que se puedan ver en los artículos
- ✅ Validación de tipo de archivo en el cliente
- ✅ Límite de tamaño de 10MB por archivo
- ✅ Políticas RLS activas en el bucket

## 📚 Archivos Relacionados

- `supabase/setup_blog_images_bucket.sql` - Script de configuración
- `components/admin/MediaLibrary.tsx` - Componente que sube las imágenes
- `app/administrator/blog/nuevo/page.tsx` - Página de nuevo artículo
- `app/administrator/blog/editar/[postId]/page.tsx` - Página de edición

## ✅ Checklist de Verificación

Después de aplicar la solución, verifica:

- [ ] El bucket `blog-images` existe en Supabase Storage
- [ ] El bucket está marcado como Público
- [ ] Las 4 políticas RLS están activas
- [ ] Tu usuario tiene rol de `admin` en `user_roles`
- [ ] Puedes abrir la Biblioteca de Medios sin errores
- [ ] Puedes subir una imagen de prueba
- [ ] La imagen aparece en la biblioteca
- [ ] Puedes seleccionar y usar la imagen
- [ ] La imagen se muestra correctamente en el artículo

## 🆘 Si Nada Funciona

Si después de seguir todos los pasos aún tienes problemas:

1. **Revisa la consola del navegador** (F12) para ver errores específicos
2. **Revisa los logs de Supabase**: Dashboard > Logs
3. **Verifica la conexión**: Dashboard > Settings > API
4. **Comprueba las variables de entorno**: `.env.local`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

**Última actualización**: 28 de enero de 2026
