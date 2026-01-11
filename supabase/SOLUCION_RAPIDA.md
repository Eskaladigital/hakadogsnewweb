# ⚡ SOLUCIÓN RÁPIDA - Error 500 al Subir Imágenes

## 🎯 Problema
```
Error 500 al subir imágenes al blog
```

## ✅ Solución en 3 Pasos

### 1️⃣ **Ir a Supabase Dashboard**
👉 https://app.supabase.com (tu proyecto)

---

### 2️⃣ **Crear el Bucket**

Ve a **Storage** → **New Bucket**:
- Nombre: `blog-images`
- ✅ **Marcar "Public bucket"** (MUY IMPORTANTE)
- Crear

---

### 3️⃣ **Ejecutar SQL**

Ve a **SQL Editor** y ejecuta COMPLETO el archivo:
```
📁 supabase/DIAGNOSTICO_STORAGE.sql
```

Este script:
- ✅ Verifica que todo esté bien
- ✅ Crea/arregla las políticas RLS
- ✅ Configura los permisos correctos

---

### 4️⃣ **Asignar rol Admin**

En **SQL Editor**, ejecuta (reemplaza el email):

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'TU_EMAIL_AQUI'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

### 5️⃣ **Reiniciar sesión**

1. Cierra sesión en tu app
2. Vuelve a iniciar sesión
3. Intenta subir una imagen ✅

---

## 🔍 ¿Sigue sin funcionar?

Ejecuta esto en SQL Editor:

```sql
-- Ver tu rol actual
SELECT 
  auth.uid() as user_id,
  auth.email() as email,
  ur.role
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();
```

Si NO sale nada = tu usuario no tiene rol admin. Repite el paso 4️⃣.

---

## 📝 Documentación Completa

Para más detalles: `SOLUCION_ERROR_500_STORAGE.md`
