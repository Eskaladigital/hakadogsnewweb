# 🔍 VERIFICAR CONFIGURACIÓN DE SUPABASE AUTH

## ⚠️ ERROR 400 Bad Request - Posibles Causas

El error **400 Bad Request** en `/auth/v1/token` puede deberse a:

1. ❌ **Email no confirmado** (más común)
2. ❌ **Confirmación de email habilitada** cuando debería estar deshabilitada
3. ❌ **Usuario no existe** o credenciales incorrectas
4. ❌ **Configuración de Auth incorrecta**

---

## ✅ VERIFICACIÓN PASO A PASO

### 1️⃣ **Verificar Usuario en Supabase**

1. Ve a **Supabase Dashboard**: https://supabase.com/dashboard
2. Tu proyecto → **Authentication** → **Users**
3. Busca tu usuario: `contacto@eskaladigital.com`
4. **VERIFICA estos campos:**

   **✅ Email Confirmed At:**
   - Debe tener una **fecha** (ej: `2026-01-09 18:26:38`)
   - Si está **vacío** o dice `null` → **PROBLEMA ENCONTRADO**

   **✅ Last Sign In At:**
   - Puede estar vacío si nunca has iniciado sesión
   - No es crítico

   **✅ User Metadata:**
   - Debe tener: `{"name": "...", "role": "admin"}` o similar
   - Verifica que el JSON sea válido

---

### 2️⃣ **Confirmar Email Manualmente (SI ESTÁ VACÍO)**

Si **Email Confirmed At** está vacío:

1. En la lista de usuarios, click en los **"..."** (tres puntos) del usuario
2. Click en **"Confirm email"** o **"Send confirmation email"**
3. Si hay opción de **"Confirm email"** directamente → úsala
4. Si solo hay **"Send confirmation email"** → envíalo y luego confirma desde el email

**O mejor aún:**
1. Click en los **"..."** → **"Edit user"**
2. Busca **"Email Confirmed"** o **"Auto Confirm User"**
3. Actívalo/Confírmalo manualmente
4. Guarda los cambios

---

### 3️⃣ **DESACTIVAR Confirmación de Email (RECOMENDADO)**

Para evitar problemas futuros, **desactiva la confirmación de email**:

1. Ve a **Authentication** → **Providers**
2. Click en **"Email"**
3. Busca la opción **"Confirm email"** o **"Enable email confirmations"**
4. **DESACTÍVALA** (toggle a OFF)
5. Click en **"Save"**

**⚠️ IMPORTANTE:** Esto permitirá que los usuarios inicien sesión inmediatamente después de registrarse, sin necesidad de confirmar email.

---

### 4️⃣ **Verificar Configuración de Auth**

1. Ve a **Authentication** → **URL Configuration**
2. Verifica que:
   - **Site URL** esté configurada: `https://hakadogsnewweb.vercel.app`
   - **Redirect URLs** incluya: `https://hakadogsnewweb.vercel.app/**`

---

### 5️⃣ **Verificar que el Usuario Existe y la Contraseña es Correcta**

Si el usuario fue creado manualmente:

1. Ve a **Authentication** → **Users**
2. Click en los **"..."** del usuario
3. Click en **"Reset password"** o **"Send password recovery email"**
4. Establece una contraseña nueva y simple (ej: `Password123!`)
5. Intenta login con esa contraseña

---

## 🔧 SOLUCIÓN RÁPIDA (SI NADA FUNCIONA)

### Eliminar y Recrear el Usuario:

1. **Eliminar usuario actual:**
   - Authentication → Users
   - Click en **"..."** → **"Delete user"**
   - Confirma la eliminación

2. **Crear usuario nuevo:**
   - Click en **"Add user"** → **"Create new user"**
   - **Email:** `contacto@eskaladigital.com`
   - **Password:** `Password123!` (o la que prefieras)
   - **✅ MARCA:** "Auto Confirm User" (MUY IMPORTANTE)
   - **User Metadata:**
     ```json
     {
       "name": "Admin Hakadogs",
       "role": "admin"
     }
     ```
   - Click **"Create user"**

3. **Intentar login:**
   - Email: `contacto@eskaladigital.com`
   - Password: `Password123!` (la que pusiste)

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Usuario existe en Supabase
- [ ] Email Confirmed At tiene fecha (NO está vacío)
- [ ] Confirmación de email está DESACTIVADA en Providers
- [ ] User Metadata tiene `{"role": "admin"}` si es admin
- [ ] Contraseña es correcta
- [ ] Variables de entorno están en Vercel
- [ ] Se hizo REDEPLOY después de configurar variables

---

## 🚨 SI SIGUE SIN FUNCIONAR

1. **Verifica en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Busca el mensaje: `🔴 Error de Supabase Auth:`
   - Copia el objeto completo del error

2. **Verifica en Network:**
   - DevTools → Network
   - Intenta login
   - Click en la petición `token?grant_type=password`
   - Ve a la pestaña "Response"
   - Copia el mensaje de error completo

3. **Comparte esa información** para diagnóstico más preciso

---

**Última actualización:** Enero 2026
