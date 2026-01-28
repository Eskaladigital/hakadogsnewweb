# 🚨 GUÍA RÁPIDA: Error "Usuario no existe" al hacer Login

## ⚡ Solución en 3 Pasos

### 📍 **PASO 1: Confirmar el email del usuario**

1. Abre **Supabase Dashboard → SQL Editor**
2. Ejecuta este comando (cambia el email):

```sql
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE 
  email = 'CAMBIAR_POR_EMAIL_DEL_USUARIO@gmail.com';
```

### 📍 **PASO 2: Verificar que tiene rol asignado**

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id, 
  'user' as role
FROM auth.users
WHERE 
  email = 'CAMBIAR_POR_EMAIL_DEL_USUARIO@gmail.com'
  AND id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;
```

### 📍 **PASO 3: Verificar que todo está OK**

```sql
SELECT 
  u.email,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status,
  COALESCE(ur.role, '❌ Sin rol') as role_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'CAMBIAR_POR_EMAIL_DEL_USUARIO@gmail.com';
```

**Resultado esperado:**
```
email_status: ✅ Email confirmado
role_status: user
```

---

## 🔍 Diagnóstico Completo

Si los 3 pasos anteriores no funcionan, usa el script completo:

1. Abre: `supabase/FIX_ERROR_USUARIO_NO_EXISTE.sql`
2. Reemplaza **TODAS** las ocurrencias de `'email@usuario.com'` por el email real
3. Ejecuta el script completo en Supabase SQL Editor

---

## 📋 Causas Más Comunes

| Problema | Solución Rápida |
|----------|-----------------|
| 🔴 Email no confirmado | PASO 1 ↑ |
| 🔴 Sin rol asignado | PASO 2 ↑ |
| 🔴 Usuario eliminado | Ejecutar script completo |
| 🔴 Usuario baneado | Ejecutar script completo |

---

## ⚙️ Alternativa: Desde Supabase Dashboard

### Opción A: Confirmar email desde la UI

1. Ve a **Authentication → Users**
2. Busca el usuario por email
3. Si dice "Not confirmed":
   - Click en el usuario
   - Click en "Confirm user"

### Opción B: Enviar email de confirmación

1. Ve a **Authentication → Users**
2. Busca el usuario
3. Click en **Actions → Send Magic Link**
4. El usuario recibirá un email para confirmar

---

## 🐛 Errores Conocidos

### "Invalid login credentials"
➡️ **Solución:** Ejecutar PASO 1 (confirmar email)

### "User not found"
➡️ **Solución:** Usuario eliminado, ejecutar script completo

### "Email not confirmed"
➡️ **Solución:** Ejecutar PASO 1 (confirmar email)

### "Too many requests"
➡️ **Solución:** Esperar 5 minutos e intentar de nuevo (rate limiting)

---

## 📞 Si Nada Funciona

1. **Verificar que el usuario existe:**
   ```sql
   SELECT * FROM auth.users WHERE email = 'email@usuario.com';
   ```
   - Si devuelve 0 resultados → El usuario NO existe, debe registrarse
   - Si devuelve 1 resultado → Continuar con diagnóstico

2. **Resetear la contraseña:**
   - Dashboard → Authentication → Users
   - Buscar usuario → Actions → Send Password Reset

3. **Última opción - Crear nuevo usuario:**
   - Si nada funciona, pedir al usuario que se registre de nuevo
   - Borrar usuario antiguo si es necesario:
     ```sql
     DELETE FROM auth.users WHERE email = 'email@usuario.com';
     ```

---

## ✅ Checklist Post-Solución

Después de aplicar la solución, verificar:

- [ ] Usuario puede acceder a `/cursos/auth/login`
- [ ] Usuario puede introducir email y contraseña
- [ ] Login exitoso sin errores
- [ ] Redirige a `/cursos/mi-escuela`
- [ ] Usuario puede ver sus cursos

---

## 📁 Documentación Completa

- **Script SQL completo:** `supabase/FIX_ERROR_USUARIO_NO_EXISTE.sql`
- **Guía detallada:** `SOLUCION_ERROR_USUARIO_NO_EXISTE.md`
- **Índice de scripts:** `supabase/INDICE_ARCHIVOS.md`

---

**Creado:** 28 Enero 2026  
**Tiempo estimado:** 2-5 minutos  
**Nivel:** ⭐ Fácil
