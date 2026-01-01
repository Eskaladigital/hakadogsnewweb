# 👥 USUARIOS DE PRUEBA - HAKADOGS

## 🔐 Sistema de Autenticación Local (Mock)

**Hakadogs utiliza un sistema de autenticación local en memoria** (sin Supabase) para desarrollo y producción inicial.

---

## 🎯 Credenciales de Acceso

### 👨‍💼 Usuario ADMIN
- **Email:** narciso.pardo@outlook.com
- **Password:** Hacka2016@
- **Rol:** Administrador
- **Permisos:** Acceso completo al sistema, panel admin
- **URL Admin:** `https://tu-app.amplifyapp.com/admin/dashboard`

### 👤 Usuario REGULAR
- **Email:** user@hakadogs.com
- **Password:** Hacka2016@
- **Rol:** Cliente estándar
- **Permisos:** Acceso a apps y funcionalidades de cliente
- **URL Perfil:** `https://tu-app.amplifyapp.com/cliente/perfil`

---

## 🚀 Cómo Iniciar Sesión

### 1. Acceder a la Aplicación
Ve a la URL de producción en tu navegador: **https://tu-app.amplifyapp.com**

### 2. Ir a Login
Click en "Iniciar Sesión" o ve directamente a:
**https://tu-app.amplifyapp.com/auth/login**

### 3. Usar Credenciales
Usa cualquiera de las dos credenciales de arriba para iniciar sesión.

---

## 📝 Sistema de Autenticación Mock

### Ubicación del Código
- **Archivo principal:** `lib/auth/mockAuth.ts`
- **Hook de React:** `hooks/useAuth.ts`
- **Componente menú:** `components/ui/UserMenu.tsx`

### Cómo Funciona
1. Los usuarios están pre-creados en `mockAuth.ts`
2. Las sesiones se guardan en `localStorage` del navegador
3. No requiere backend ni Supabase
4. Funciona en producción sin configuración adicional

### Crear Nuevos Usuarios de Prueba
Para añadir más usuarios, edita `lib/auth/mockAuth.ts`:

```typescript
const MOCK_USERS = [
  {
    id: '3',
    email: 'nuevo@ejemplo.com',
    user_metadata: {
      name: 'Nuevo Usuario',
      role: 'user'
    }
  }
]

const MOCK_PASSWORDS = {
  'nuevo@ejemplo.com': 'password123'
}
```

Luego commit y push a GitHub para que se despliegue automáticamente.

---

## 🔗 URLs Importantes (Producción)

**⚠️ Reemplaza `tu-app.amplifyapp.com` con tu URL real de AWS Amplify**

### Autenticación
- **Login:** https://tu-app.amplifyapp.com/auth/login
- **Registro:** https://tu-app.amplifyapp.com/auth/registro

### Área Cliente
- **Dashboard:** https://tu-app.amplifyapp.com/cliente/perfil
- **Mascotas:** https://tu-app.amplifyapp.com/cliente/mascotas

### Área Admin (solo admin)
- **Panel Admin:** https://tu-app.amplifyapp.com/admin/dashboard

### Apps
- **HakaHealth:** https://tu-app.amplifyapp.com/apps/hakahealth
- **HakaTrainer:** https://tu-app.amplifyapp.com/apps/hakatrainer
- **HakaCommunity:** https://tu-app.amplifyapp.com/apps/hakacommunity

---

## 🐛 Solución de Problemas

### No puedo iniciar sesión
1. Verifica que estás usando las credenciales exactas
2. Limpia caché del navegador: `Ctrl+Shift+Delete`
3. Abre modo incógnito e intenta de nuevo

### "Mi Perfil" me redirige a login
1. Limpia localStorage del sitio:
   - F12 → Application → Local Storage → Borrar todo
2. Vuelve a iniciar sesión

### El admin login falla
- Usa exactamente: `narciso.pardo@outlook.com` / `Hacka2016@`
- El email debe coincidir exactamente (mayúsculas/minúsculas)

### Quiero limpiar la sesión
```javascript
// En la consola del navegador (F12):
localStorage.removeItem('hakadogs_session')
location.reload()
```

---

## 📊 Datos de Prueba

### Usuarios Pre-creados
- **Total:** 2 usuarios
- **Admin:** 1
- **Clientes:** 1

### Funcionalidades Disponibles

**Como Admin:**
- ✅ Ver panel de administración
- ✅ Ver estadísticas (mock data)
- ✅ Gestionar ejercicios
- ✅ Gestionar usuarios

**Como Cliente:**
- ✅ Ver perfil personal con dashboard visual
- ✅ Gestionar mascotas (añadir, editar, eliminar)
- ✅ Subir fotos de mascotas (Base64 en localStorage)
- ✅ Acceder a las 3 apps
- ✅ Ver estadísticas personales

---

## 🔄 Migración a Supabase (Futuro)

Cuando se configure Supabase, estos usuarios mock se reemplazarán por usuarios reales en la base de datos.

**Pasos para migrar:**
1. Configurar Supabase Auth
2. Añadir variables de entorno en AWS Amplify
3. Descomentar código en `middleware.ts`
4. Actualizar `lib/supabase/client.ts`
5. Push a GitHub → Deploy automático

---

## ⚠️ IMPORTANTE

### Seguridad
- ⚠️ **NO uses estos usuarios en producción final**
- ⚠️ Cambia las contraseñas cuando añadas usuarios reales
- ⚠️ Son para demo y pruebas iniciales

### LocalStorage
- Las sesiones se guardan en `localStorage` del navegador
- Se pierden al limpiar caché del navegador
- Son específicas por navegador y dispositivo

### En Producción (AWS)
- ✅ El sistema funciona igual que en local
- ✅ Las sesiones persisten entre recargas
- ✅ No requiere configuración adicional
- ⚠️ Considera migrar a Supabase para múltiples usuarios reales

---

## ✅ Checklist de Testing en Producción

- [ ] Login con usuario admin funciona
- [ ] Login con usuario regular funciona
- [ ] Admin puede acceder a `/admin/dashboard`
- [ ] Usuario regular puede acceder a `/cliente/perfil`
- [ ] Usuario regular puede gestionar mascotas
- [ ] Logout funciona correctamente
- [ ] Sesión persiste al recargar página
- [ ] Rutas protegidas redirigen a login
- [ ] Subir foto de mascota funciona
- [ ] Dashboard visual de perfil se carga correctamente

---

## 📞 Soporte

Si tienes problemas con la autenticación en producción:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console" y busca errores en rojo
3. Ve a "Application" → "Local Storage" y verifica `hakadogs_session`
4. Prueba en modo incógnito para descartar problemas de caché

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0 PRODUCTION  
**Proyecto:** HakaDogs - Educación Canina Profesional  
**Sistema:** Autenticación Mock Local (sin backend)  
**Plataforma:** AWS Amplify (Producción)  
**Lanzamiento:** Versión 1.0 - Enero 2026
