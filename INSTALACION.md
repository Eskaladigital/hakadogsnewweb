# 📦 INFORMACIÓN DEL PROYECTO - HAKADOGS

**⚠️ IMPORTANTE:** Esta aplicación está desplegada en producción en **Vercel**.

---

## 🌐 ACCESO A LA APLICACIÓN

### URL de Producción
**https://[tu-dominio].vercel.app**

La aplicación está desplegada en Vercel y se actualiza automáticamente con cada push a GitHub.

---

## 👥 USUARIOS DE PRUEBA

Ver archivo `USUARIOS_PRUEBA.md` para credenciales completas.

### Login Rápido
- **Admin:** narciso.pardo@outlook.com / Hacka2016@
- **Usuario:** user@hakadogs.com / Hacka2016@

---

## 🔧 CONFIGURACIÓN TÉCNICA (Solo para Desarrolladores)

### Repositorio GitHub
```bash
git clone https://github.com/Eskaladigital/HACKADOGS.git
```

### Stack Tecnológico
- **Frontend:** Next.js 14, React 18, TypeScript 5.3
- **Estilos:** Tailwind CSS 3.4
- **Base de Datos:** Supabase
- **Editor:** TinyMCE
- **Deploy:** Vercel
- **CI/CD:** Automático desde GitHub

### Variables de Entorno (Configuradas en Vercel)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key

# TinyMCE
NEXT_PUBLIC_TINYMCE_API_KEY=tu_api_key

# App URL (opcional)
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

---

## 📝 REALIZAR CAMBIOS

### Workflow de Desarrollo

1. **Clonar repositorio**
```bash
git clone https://github.com/Eskaladigital/HACKADOGS.git
cd hakadogs-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables locales** (opcional para desarrollo local)
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Probar localmente** (opcional)
```bash
npm run dev
# Abre http://localhost:3000
```

5. **Hacer cambios en el código**
```bash
# Edita los archivos que necesites
```

6. **Subir cambios a GitHub**
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

7. **Deploy automático**
```
Vercel detecta el push
  ↓
Build automático (~2 minutos)
  ↓
Deploy automático
  ↓
✅ Cambios LIVE en producción
```

---

## 🚀 DEPLOY Y CI/CD

### Estado Actual
- ✅ Repositorio en GitHub: https://github.com/Eskaladigital/HACKADOGS.git
- ✅ Deploy automático en Vercel configurado
- ✅ CI/CD activo
- ✅ SSL/HTTPS automático
- ✅ Preview deployments para PRs

### Monitoreo
1. Ve a Vercel Dashboard
2. Selecciona el proyecto HACKADOGS
3. Revisa logs, analytics y estado del build

---

## 📚 DOCUMENTACIÓN

### Archivos Principales
- `README.md` - Documentación general
- `DEPLOY_VERCEL.md` - Guía completa de deploy en Vercel
- `USUARIOS_PRUEBA.md` - Credenciales de acceso
- `CONTENIDO_UNICO_COMPLETO.md` - SEO local
- `supabase/schema_cursos.sql` - Schema de base de datos

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### La app no carga
1. Verifica que Vercel esté desplegado
2. Revisa los logs en Vercel Dashboard
3. Verifica el último build fue exitoso

### Cambios no se reflejan
1. Verifica que el push a GitHub fue exitoso
2. Ve a Vercel y revisa el estado del deployment
3. Espera ~2 minutos para que complete el deploy
4. Limpia caché del navegador (Ctrl+Shift+Delete)

### Error al hacer push
```bash
# Si hay conflictos:
git pull origin main
git push origin main
```

### Error de build en Vercel
1. Ve a Vercel Dashboard → Deployments
2. Click en el deployment fallido
3. Revisa los logs de error
4. Verifica que todas las variables de entorno estén configuradas

---

## 🔒 SEGURIDAD

### Archivos Protegidos
- `.env.local` - NO está en GitHub (ignorado)
- Credenciales de Supabase - Solo en Vercel
- API Keys - Solo en Variables de Entorno de Vercel

### Buenas Prácticas
- ✅ Nunca subir credenciales a GitHub
- ✅ Usar variables de entorno en Vercel
- ✅ Mantener `.gitignore` actualizado
- ✅ Rotar API keys periódicamente

---

## 📞 SOPORTE TÉCNICO

### Para Problemas de Deploy
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Logs:** Ver en Vercel → tu proyecto → Deployments → Logs
- **Documentación:** https://vercel.com/docs

### Para Cambios en el Código
- **GitHub:** https://github.com/Eskaladigital/HACKADOGS
- **Issues:** Crear issue en GitHub si necesario

### Para Base de Datos
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Documentación:** https://supabase.com/docs

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Después de Cambios
- [ ] Código commiteado a GitHub
- [ ] Push exitoso a rama main
- [ ] Build completado en Vercel
- [ ] Deploy exitoso
- [ ] Cambios visibles en producción
- [ ] Funcionalidad probada en navegador
- [ ] Sin errores en consola

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0 PRODUCTION  
**Plataforma:** Vercel  
**Repositorio:** https://github.com/Eskaladigital/HACKADOGS.git  
**Estado:** ✅ Desplegado y funcionando  
**Lanzamiento:** Versión 1.0 - Enero 2026
