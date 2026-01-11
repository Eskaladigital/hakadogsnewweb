# 📦 CONFIGURACIÓN DEL BUCKET BLOG-IMAGES

## ⚠️ IMPORTANTE: El bucket NO se puede crear con SQL

El error `must be owner of table buckets` es porque necesitas permisos de superadmin para crear buckets. **Debes crearlo manualmente desde el Dashboard de Supabase**.

---

## 🔧 PASO 1: Crear el bucket manualmente

1. Ve a tu proyecto en **Supabase Dashboard**: https://supabase.com/dashboard
2. Navega a **Storage** en el menú lateral izquierdo
3. Haz clic en **"New bucket"** (o "Crear nuevo bucket")
4. Configura el bucket con estos valores:

```
Nombre del bucket: blog-images
Público: ✅ SÍ (público para lectura)
File size limit: 5 MB (5242880 bytes)
Allowed MIME types: 
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp
  - image/gif
  - image/svg+xml
```

5. Haz clic en **"Create bucket"** o "Guardar"

---

## 🔒 PASO 2: Aplicar políticas RLS con SQL

Una vez creado el bucket manualmente, ejecuta el archivo SQL:

📄 **Archivo**: `supabase/blog_storage_SOLO_RLS.sql`

1. Ve a **SQL Editor** en Supabase Dashboard
2. Copia y pega el contenido del archivo `blog_storage_SOLO_RLS.sql`
3. Ejecuta el SQL
4. Verifica que aparezcan 4 políticas creadas

---

## ✅ PASO 3: Verificar

Ve a **Storage** → **blog-images** → **Policies** y deberías ver:

- ✅ `Blog images public read` - Lectura pública
- ✅ `Blog images admin insert` - Solo admins suben
- ✅ `Blog images admin update` - Solo admins actualizan
- ✅ `Blog images admin delete` - Solo admins eliminan

---

## 🧪 PASO 4: Probar

Una vez configurado:

1. Ve a `/administrator/blog/nuevo`
2. Haz clic en **"Seleccionar Imagen"**
3. Sube una imagen de prueba
4. Verifica que aparece en la galería
5. Selecciónala y verifica que se asigna correctamente

---

## 🆘 Si sigue sin funcionar

Verifica en la consola del navegador (F12) si hay errores. Los errores comunes son:

- **"new row violates row-level security policy"**: Las políticas RLS no se aplicaron correctamente
- **"The resource already exists"**: El archivo ya existe, cambia el nombre
- **"File size exceeds the maximum allowed"**: La imagen es mayor a 5MB

Si aparecen errores de RLS, asegúrate de que tu usuario tiene el rol `admin` en la tabla `user_roles`.
