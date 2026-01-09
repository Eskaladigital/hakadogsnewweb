# 🔧 SOLUCIÓN AL ERROR 400 - Usuario Confirmado

## ✅ ESTADO ACTUAL

Según la imagen de Supabase:
- ✅ **Usuario existe:** `contacto@eskaladigital.com`
- ✅ **Email confirmado:** `09 Jan, 2026 20:49`
- ✅ **Provider Email habilitado**
- ❌ **Last signed in:** Vacío (nunca ha iniciado sesión)

---

## 🔍 POSIBLES CAUSAS DEL ERROR 400

Aunque el usuario está confirmado, el error 400 puede deberse a:

### 1️⃣ **Contraseña Incorrecta**

El usuario fue creado manualmente, pero la contraseña puede no ser la que estás usando.

**SOLUCIÓN:**
1. En Supabase → Users → Tu usuario
2. Click en **"..."** → **"Reset password"**
3. Establece una contraseña nueva y simple: `Password123!`
4. Guarda
5. Intenta login con esa contraseña

---

### 2️⃣ **Configuración de Email Provider**

Aunque el provider está habilitado, puede haber un problema de configuración.

**VERIFICAR:**
1. Ve a **Authentication** → **Providers** → **Email**
2. Verifica que:
   - ✅ **Enable email provider** esté activado
   - ✅ **Confirm email** esté **DESACTIVADO** (recomendado)
   - ✅ **Secure email change** puede estar activado o no (no afecta login)

---

### 3️⃣ **Problema con la Contraseña Hasheada**

Si el usuario fue creado con SQL directo, la contraseña puede no estar hasheada correctamente.

**SOLUCIÓN DEFINITIVA:**
1. **Elimina el usuario actual:**
   - Users → Click en **"..."** → **"Delete user"**

2. **Crea el usuario desde el Dashboard:**
   - Click en **"Add user"** → **"Create new user"**
   - **Email:** `contacto@eskaladigital.com`
   - **Password:** `Password123!`
   - **✅ MARCA:** "Auto Confirm User"
   - **User Metadata:**
     ```json
     {
       "name": "Admin Hakadogs",
       "role": "admin"
     }
     ```
   - Click **"Create user"**

3. **Intenta login:**
   - Email: `contacto@eskaladigital.com`
   - Password: `Password123!`

---

### 4️⃣ **Verificar Network Response**

Para obtener el error exacto:

1. Abre **DevTools** (F12)
2. Ve a la pestaña **Network**
3. Intenta hacer login
4. Busca la petición: `token?grant_type=password`
5. Click en ella
6. Ve a la pestaña **Response**
7. Copia el mensaje de error completo

El error debería decir algo como:
- `"Invalid login credentials"` → Contraseña incorrecta
- `"Email not confirmed"` → Aunque esté confirmado, puede haber un bug
- `"User not found"` → Usuario no existe
- Otro mensaje específico

---

## 🎯 SOLUCIÓN RECOMENDADA (PASO A PASO)

### Paso 1: Resetear Contraseña

1. Supabase → Users → Tu usuario
2. **"..."** → **"Reset password"**
3. Establece: `Password123!`
4. Guarda

### Paso 2: Verificar Configuración

1. **Authentication** → **Providers** → **Email**
2. **Desactiva** "Confirm email" si está activado
3. Guarda

### Paso 3: Intentar Login

1. Ve a tu sitio: https://hakadogsnewweb.vercel.app/cursos/auth/login
2. Email: `contacto@eskaladigital.com`
3. Password: `Password123!`
4. Intenta login

### Paso 4: Si No Funciona

**Elimina y recrea el usuario** siguiendo el paso 3 de la sección anterior.

---

## 📋 VERIFICACIÓN FINAL

Después de recrear el usuario, verifica:

- [ ] Usuario creado desde Dashboard (no SQL)
- [ ] "Auto Confirm User" marcado al crear
- [ ] User Metadata tiene `{"role": "admin"}`
- [ ] "Confirm email" desactivado en Providers
- [ ] Variables de entorno en Vercel
- [ ] Redeploy realizado después de cambios

---

**Si después de todo esto sigue sin funcionar, comparte el mensaje exacto del error de la pestaña Network → Response.**
