# 🔧 Solución Error 500 al Subir Imágenes al Blog

## 🔴 Problema
Error 500 al intentar subir imágenes a través del panel de administración del blog:
```
POST https://pfmqkioftagjnxqyrngk.supabase.co/storage/v1/object/blog-images/[filename] 500 (Internal Server Error)
```

## 🎯 Causas Posibles

### 1. **Bucket `blog-images` no existe**
- El bucket debe crearse manualmente en Supabase

### 2. **Políticas RLS incorrectas o faltantes**
- Las políticas de seguridad no están configuradas correctamente
- Falta verificación de autenticación

### 3. **Usuario no tiene rol de admin**
- El usuario autenticado no tiene el rol `admin` en la tabla `user_roles`

### 4. **Tabla `user_roles` no existe**
- La tabla que verifica roles de administrador no está creada

---

## ✅ Solución Paso a Paso

### **PASO 1: Verificar que el bucket existe**

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Storage** en el menú lateral
3. Verifica si existe un bucket llamado `blog-images`

**Si NO existe:**
- Haz clic en **"New bucket"**
- Nombre: `blog-images`
- **Importante**: Marca la casilla **"Public bucket"** ✅
- File size limit: 50 MB (o lo que prefieras)
- Allowed MIME types: `image/jpeg,image/png,image/webp,image/gif`
- Haz clic en **"Create bucket"**

---

### **PASO 2: Verificar la tabla user_roles**

Ve a **SQL Editor** en Supabase y ejecuta:

```sql
-- Verificar si existe la tabla
SELECT * FROM public.user_roles LIMIT 5;
```

**Si la tabla NO existe**, ejecuta:

```sql
-- Crear tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver su propio rol
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para que los admins puedan gestionar roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

---

### **PASO 3: Asignar rol de admin a tu usuario**

Ejecuta en **SQL Editor**:

```sql
-- Reemplaza 'TU_EMAIL_AQUI' con tu email de Supabase Auth
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'TU_EMAIL_AQUI'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verificar que se creó correctamente
SELECT 
  ur.user_id,
  ur.role,
  u.email,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'TU_EMAIL_AQUI';
```

---

### **PASO 4: Ejecutar el script de diagnóstico**

Ejecuta el archivo `DIAGNOSTICO_STORAGE.sql` en **SQL Editor**:

```sql
-- Este script verificará:
-- 1. Si el bucket existe
-- 2. Qué políticas RLS están activas
-- 3. Si tu usuario tiene rol de admin
-- 4. Recreará las políticas correctas
```

El script ya incluye la solución, así que ejecutándolo se arreglará todo.

---

### **PASO 5: Verificar las políticas creadas**

Después de ejecutar el script, verifica:

```sql
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY policyname;
```

Deberías ver **4 políticas**:
- ✅ `Blog images admin delete` (DELETE)
- ✅ `Blog images admin insert` (INSERT)
- ✅ `Blog images admin update` (UPDATE)
- ✅ `Blog images public read` (SELECT)

---

### **PASO 6: Probar la subida de imágenes**

1. Cierra sesión y vuelve a iniciar sesión en el panel de administración
2. Ve a **Administrator → Blog → Nuevo Artículo**
3. Haz clic en **"Seleccionar Imagen"**
4. Intenta subir una imagen
5. Debería funcionar correctamente ✅

---

## 🔍 Verificación Adicional

Si sigue fallando, ejecuta este query para ver qué está pasando:

```sql
-- Ver el usuario actual y su rol
SELECT 
  auth.uid() as user_id,
  auth.email() as email,
  ur.role
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();
```

Si este query NO devuelve resultados, significa que tu usuario no tiene rol asignado. Vuelve al **PASO 3**.

---

## 📋 Checklist de Verificación

- [ ] El bucket `blog-images` existe y es **público**
- [ ] La tabla `user_roles` existe
- [ ] Tu usuario tiene el rol `admin` en `user_roles`
- [ ] Las 4 políticas RLS están creadas
- [ ] Has cerrado sesión y vuelto a iniciar sesión
- [ ] La subida de imágenes funciona ✅

---

## 🚨 Problemas Comunes

### Error: "relation public.user_roles does not exist"
**Solución**: Ejecuta el PASO 2 completo para crear la tabla.

### Error: "permission denied for table user_roles"
**Solución**: Asegúrate de estar ejecutando los queries como usuario autenticado en el SQL Editor de Supabase Dashboard.

### Las imágenes se suben pero no se ven
**Solución**: Verifica que el bucket sea **público** en Storage Settings.

---

## 📞 Soporte

Si después de seguir todos los pasos el problema persiste:

1. Verifica los logs en **Logs → Postgres Logs** en Supabase
2. Revisa la consola del navegador para ver el error completo
3. Ejecuta el script de diagnóstico nuevamente

---

**✨ Última actualización**: 11 de enero de 2026
