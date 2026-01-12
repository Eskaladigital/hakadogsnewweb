# 🚀 Guía Rápida de Instalación - Hakadogs

**Versión:** 2.6.0 GAMIFICATION SYSTEM  
**Actualizado:** 12 Enero 2026

---

## 🌐 APLICACIÓN EN PRODUCCIÓN

### URL Oficial:
**https://www.hakadogs.com**

La aplicación está desplegada en **Vercel** con dominio propio y se actualiza automáticamente con cada push a GitHub.

---

## 💻 DESARROLLO LOCAL

### 1. Clonar Repositorio
```bash
git clone https://github.com/Eskaladigital/hakadogsnewweb.git
cd hakadogs-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz con:

```bash
# Supabase (Base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI (Generación de contenido con IA)
OPENAI_API_KEY=sk-proj-...

# TinyMCE (Editor de contenido)
NEXT_PUBLIC_TINYMCE_API_KEY=tu_tinymce_key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-NXPT2KNYGJ

# URL de la aplicación
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**📍 Obtener credenciales:**
- **Supabase:** https://supabase.com/dashboard → Settings → API
- **OpenAI:** https://platform.openai.com/api-keys
- **TinyMCE:** https://www.tiny.cloud/auth/signup/ (gratis hasta 1000 cargas/mes)

### 4. Configurar Base de Datos
Ejecuta los scripts SQL en Supabase Dashboard → SQL Editor:

```bash
# Scripts en orden:
1. supabase/schema_cursos.sql
2. supabase/user_roles_table.sql  
3. supabase/contacts_table.sql
4. supabase/dashboard_functions.sql
5. supabase/gamification_system.sql
```

Ver [`docs/setup/INSTALACION_RAPIDA_GAMIFICACION.md`](./docs/setup/INSTALACION_RAPIDA_GAMIFICACION.md) para más detalles.

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

---

## 🚀 DESPLIEGUE EN PRODUCCIÓN

### Deploy Automático con Vercel

1. **Fork o clona** el repositorio en tu cuenta de GitHub
2. Importa el proyecto en **Vercel**: https://vercel.com/new
3. Configura las **variables de entorno** en Vercel
4. Click **Deploy**

Cada push a `main` dispara un deploy automático.

Ver [`docs/setup/DEPLOY_VERCEL.md`](./docs/setup/DEPLOY_VERCEL.md) para la guía completa.

---

## 🔐 AUTENTICACIÓN Y ROLES

### Crear Usuario Admin

1. Registra un usuario en `/cursos/auth/registro`
2. Ve a **Supabase Dashboard** → Authentication → Users
3. Ejecuta en SQL Editor:

```sql
-- Reemplaza con el email del usuario
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users 
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

4. Accede al panel admin en `/administrator`

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Guías de Setup:
- [`docs/setup/DEPLOY_VERCEL.md`](./docs/setup/DEPLOY_VERCEL.md) - Deploy en producción
- [`docs/setup/CONFIGURAR_SUPABASE_VERCEL.md`](./docs/setup/CONFIGURAR_SUPABASE_VERCEL.md) - Variables de entorno
- [`docs/setup/INSTRUCCIONES_SEGURIDAD.md`](./docs/setup/INSTRUCCIONES_SEGURIDAD.md) - Seguridad RLS
- [`docs/setup/INSTALACION_RAPIDA_GAMIFICACION.md`](./docs/setup/INSTALACION_RAPIDA_GAMIFICACION.md) - Sistema gamificación

### Documentación Completa:
Ver **[`/docs/README.md`](./docs/README.md)** para índice completo de documentación técnica.

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error de Autenticación
- Verifica que las credenciales de Supabase sean correctas
- Confirma que el usuario existe en Supabase Dashboard
- Verifica que las variables de entorno estén configuradas

### Error de Build
```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

### Error en Producción
1. Revisa **Vercel Dashboard** → Deployments → Logs
2. Verifica que todas las variables de entorno estén configuradas
3. Comprueba que el último deployment fue exitoso

---

## 📞 SOPORTE

- **Email:** contacto@hakadogs.com
- **GitHub:** https://github.com/Eskaladigital/hakadogsnewweb
- **Documentación:** [`/docs`](./docs/README.md)

---

**Última actualización:** 12 Enero 2026  
**Versión:** 2.6.0 GAMIFICATION SYSTEM  
**Estado:** ✅ Desplegado en hakadogs.com
