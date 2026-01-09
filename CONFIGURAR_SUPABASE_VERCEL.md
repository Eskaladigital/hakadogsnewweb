# 🔧 CONFIGURAR SUPABASE EN VERCEL - GUÍA URGENTE

## ⚠️ PROBLEMA ACTUAL

El error **400 Bad Request** en el login significa que **las variables de entorno de Supabase NO están configuradas en Vercel**.

---

## ✅ SOLUCIÓN PASO A PASO

### 1️⃣ **Obtener Credenciales de Supabase**

1. Ve a tu **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto: **HAKADOGS new web**
3. Click en **Settings** (⚙️) en el menú lateral
4. Click en **API** en el submenú
5. Copia estos valores:

   - **Project URL** → Este será tu `NEXT_PUBLIC_SUPABASE_URL`
     ```
     https://pfmqkioftagjnxqyrngk.supabase.co
     ```

   - **anon public** key → Este será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (tu key completa)
     ```

---

### 2️⃣ **Configurar en Vercel**

1. Ve a **Vercel Dashboard**: https://vercel.com/dashboard
2. Selecciona tu proyecto: **hakadogsnewweb**
3. Click en **Settings** (⚙️)
4. Click en **Environment Variables** en el menú lateral
5. Agrega estas **2 variables**:

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://pfmqkioftagjnxqyrngk.supabase.co`
   - Marca: ✅ **Production**
   - Marca: ✅ **Preview**
   - Marca: ✅ **Development**
   - Click **Save**

   **Variable 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu key completa)
   - Marca: ✅ **Production**
   - Marca: ✅ **Preview**
   - Marca: ✅ **Development**
   - Click **Save**

---

### 3️⃣ **Redeploy**

**IMPORTANTE:** Después de agregar las variables, DEBES hacer un redeploy:

1. Ve a **Deployments** en Vercel
2. Click en el último deployment
3. Click en los **"..."** (tres puntos)
4. Click en **"Redeploy"**
5. Confirma el redeploy

**O simplemente:**
- Haz un pequeño cambio en cualquier archivo
- Commit y push a GitHub
- Vercel hará deploy automático con las nuevas variables

---

### 4️⃣ **Verificar que Funciona**

1. Espera 2-3 minutos a que termine el deploy
2. Ve a tu sitio: https://hakadogsnewweb.vercel.app
3. Intenta hacer login con:
   - **Email:** `contacto@eskaladigital.com`
   - **Password:** (la que configuraste en Supabase)

---

## 🔍 VERIFICAR QUE EL USUARIO ESTÁ CORRECTO

En Supabase Dashboard:

1. **Authentication** → **Users**
2. Busca tu usuario: `contacto@eskaladigital.com`
3. Verifica:
   - ✅ **Email Confirmed At:** Debe tener una fecha
   - ✅ **User Metadata:** Debe tener `{"role": "admin"}` si es admin

Si **Email Confirmed At** está vacío:
- Click en **"..."** → **"Confirm email"**

---

## 🚨 SI SIGUE SIN FUNCIONAR

### Verificar Variables en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Verifica que ambas variables estén ahí
3. Verifica que estén marcadas para **Production**
4. Verifica que los valores sean correctos (sin espacios extra)

### Verificar en Consola del Navegador:

1. Abre las **DevTools** (F12)
2. Ve a **Console**
3. Busca mensajes que digan:
   - `⚠️ ERROR: Variables de entorno de Supabase no configuradas`
   - Si ves esto, las variables NO están configuradas correctamente

---

## 📞 CONTACTO

Si después de seguir estos pasos sigue sin funcionar:
- Verifica que el usuario existe en Supabase
- Verifica que el email está confirmado
- Verifica que la contraseña es correcta
- Verifica que las variables están en Vercel y marcadas para Production

---

**Última actualización:** Enero 2026
