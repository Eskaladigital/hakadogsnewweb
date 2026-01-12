# 🚀 DEPLOY EN VERCEL - HAKADOGS

## 📋 GUÍA COMPLETA DE DEPLOYMENT

**Versión:** 1.0.5 PRODUCTION  
**Fecha Inicial:** Enero 2026  
**Última Actualización:** 9 Enero 2026  
**Plataforma:** Vercel + GitHub  
**Framework:** Next.js 14  
**Estado:** ✅ DESPLEGADO EN HAKADOGS.COM

**🎉 DOMINIO PROPIO CONFIGURADO Y FUNCIONANDO**

---

## 🌐 URLs EN PRODUCCIÓN

### URLs Oficiales:
- **Principal:** https://www.hakadogs.com 🎯
- **Sin www:** https://hakadogs.com (redirige a www)
- **Vercel (backup):** https://hakadogsnewweb.vercel.app

### URLs Administrativas:
- **Panel Admin:** https://www.hakadogs.com/administrator
- **Login:** https://www.hakadogs.com/cursos/auth/login
- **Mi Escuela:** https://www.hakadogs.com/cursos/mi-escuela

---

## ✅ PREREQUISITOS

### 1. Cuenta Vercel
- [x] ✅ Cuenta de Vercel creada (https://vercel.com)
- [x] ✅ Cuenta conectada con GitHub

### 2. Repositorio GitHub
- [x] ✅ Código subido a https://github.com/Eskaladigital/hakadogsnewweb.git
- [x] ✅ 160+ archivos, ~40,000 líneas
- [x] ✅ Rama `main` activa

### 3. Dominio Configurado
- [x] ✅ hakadogs.com adquirido en OVH
- [x] ✅ DNS configurados correctamente
- [x] ✅ SSL activo (HTTPS)
- [x] ✅ Correo funcionando sin interrupciones

---

## 🎯 DEPLOYMENT EN VERCEL (RECOMENDADO)

### Ventajas
✅ Despliegue automático desde GitHub  
✅ CI/CD integrado  
✅ Dominio SSL gratis  
✅ Escalado automático  
✅ Edge Network global  
✅ Soporte Next.js nativo y optimizado  
✅ Preview deployments automáticos para PRs  
✅ Analytics incluido  
✅ Zero configuration

### Paso 1: Importar Proyecto

1. Ir a **Vercel Dashboard**: https://vercel.com/dashboard
2. Click en "**Add New**" → "**Project**"
3. Click en "**Import Git Repository**"
4. Autorizar Vercel a acceder a GitHub (si no lo has hecho)
5. Buscar y seleccionar: `Eskaladigital/HACKADOGS`
6. Click "**Import**"

### Paso 2: Configurar Proyecto

Vercel detectará automáticamente que es Next.js.

**Verificar configuración:**
- **Framework Preset:** Next.js
- **Root Directory:** `./` (raíz)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Paso 3: Variables de Entorno

**CRÍTICO:** Añadir estas variables en la sección "Environment Variables":

```bash
# Supabase (Base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://jfmqkjoffagjmavmgk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configurada]
SUPABASE_SERVICE_ROLE_KEY=[configurada]

# TinyMCE (Editor de contenido para cursos)
NEXT_PUBLIC_TINYMCE_API_KEY=[configurada]

# OpenAI (Generación de descripciones con IA)
OPENAI_API_KEY=[configurada]

# Google Analytics
NEXT_PUBLIC_GA_ID=G-NXPT2KNYGJ

# App URL (Dominio propio)
NEXT_PUBLIC_SITE_URL=https://www.hakadogs.com
```

**Dónde obtener las API keys:**
- **Supabase:** https://supabase.com/dashboard → Project Settings → API
- **TinyMCE:** https://www.tiny.cloud/my-account/dashboard/ (Plan gratuito disponible)

### Paso 4: Deploy

1. Click "**Deploy**"
2. **Esperar 2-3 minutos** mientras se despliega
3. ¡Listo! Tu app estará en: `https://tu-proyecto.vercel.app`

---

## 🌐 CONFIGURAR DOMINIO PERSONALIZADO

### ✅ DOMINIO YA CONFIGURADO

**Dominio:** hakadogs.com  
**Proveedor DNS:** OVH  
**Estado:** 🟢 ACTIVO Y FUNCIONANDO

### Configuración DNS aplicada:

```dns
# Registro A para dominio raíz
hakadogs.com          A      216.198.7.91

# Registro CNAME para www
www.hakadogs.com      CNAME  8e570a4155edc2da.vercel-dns-017.com.
```

### ✅ Verificación completada:
- [x] DNS propagados correctamente
- [x] SSL activo (certificado automático de Vercel)
- [x] HTTPS forzado en todas las páginas
- [x] Redirecciones funcionando (http→https, no-www→www)
- [x] Correo electrónico funcionando (registros MX intactos)

### 📧 Correo electrónico protegido:

Los siguientes registros **NO fueron modificados** y el correo sigue funcionando:
- ✅ MX records (mx1, mx2, mx3.mail.ovh.net)
- ✅ SPF record (v=spf1 include:mx.ovh.com ~all)
- ✅ DKIM records (ovhmo4473789-selector)
- ✅ Autoconfig/autodiscover

**El cambio de DNS solo afectó al sitio web, no al correo.** ✅

---

## 🔄 CI/CD AUTOMÁTICO

Una vez configurado, **cada push a GitHub** disparará:

1. ✅ Build automático
2. ✅ Tests automáticos
3. ✅ Deploy automático
4. ✅ Invalidación de caché
5. ✅ Notificación por email/Slack

### Preview Deployments

**Cada PR** crea un deploy de preview:
- URL única por PR
- Perfecto para testing
- No afecta a producción

### Workflow
```
git add .
git commit -m "Nuevas funcionalidades"
git push origin main
→ Vercel detecta cambios
→ Build automático (~2 min)
→ Deploy automático
→ ✅ Live en producción
```

---

## 💰 COSTOS

### Vercel Hobby (Gratis)
- ✅ Proyectos ilimitados
- ✅ Deploys ilimitados
- ✅ 100 GB bandwidth/mes
- ✅ SSL automático
- ✅ Preview deployments
- ✅ Analytics básico
- ✅ Soporte comunidad

### Vercel Pro ($20/mes)
- Todo lo de Hobby +
- 1 TB bandwidth
- Prioridad en builds
- Analytics avanzado
- Soporte por email
- Remover branding de Vercel

**Para Hakadogs:** El plan gratuito es suficiente para empezar 🎉

---

## 📊 CONFIGURACIÓN DE SUPABASE

### Paso 1: Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Click "**New project**"
3. Nombre: `hakadogs`
4. Password seguro (guárdalo)
5. Región: `West Europe` (más cercano a España)

### Paso 2: Ejecutar Schema

1. En Supabase, ir a "**SQL Editor**"
2. Click "**New query**"
3. Copiar y pegar el contenido de `supabase/schema_cursos.sql`
4. Click "**Run**"
5. Verificar que las tablas se crearon correctamente

### Paso 3: Obtener Credenciales

1. Ir a "**Settings**" → "**API**"
2. Copiar:
   - **Project URL:** `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 4: Añadir a Vercel

1. Volver a Vercel
2. Ir a "**Settings**" → "**Environment Variables**"
3. Añadir las 2 variables
4. Hacer **Redeploy** para que tome efecto

---

## 📈 ANALYTICS Y MONITOREO

### Vercel Analytics (Incluido)

1. En tu proyecto, ir a "**Analytics**"
2. Ver métricas en tiempo real:
   - Visitantes
   - Páginas más vistas
   - Países
   - Dispositivos

### Vercel Speed Insights

1. Instalar: `npm install @vercel/speed-insights`
2. En `app/layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Logs en Tiempo Real

1. Ir a "**Deployments**"
2. Click en el deploy activo
3. Ver logs en tiempo real

---

## ✅ CHECKLIST POST-DEPLOY

### Funcionalidad
- [ ] Home page carga correctamente
- [ ] Navegación funciona
- [ ] Páginas de servicios accesibles
- [ ] Login/Registro funcionan
- [ ] Sistema de cursos funcional
- [ ] Panel admin accesible
- [ ] Responsive en móvil

### SEO
- [ ] Sitemap accesible: `/sitemap.xml`
- [ ] Robots.txt accesible: `/robots.txt`
- [ ] Metadata en todas las páginas
- [ ] Open Graph tags

### Performance
- [ ] Lighthouse score > 90
- [ ] Imágenes optimizadas
- [ ] Caché configurado
- [ ] First Contentful Paint < 1.5s

### Seguridad
- [ ] HTTPS activo (SSL automático)
- [ ] Headers de seguridad configurados
- [ ] Variables de entorno ocultas
- [ ] `.env.local` no subido a Git

---

## 🐛 TROUBLESHOOTING

### Error: "Build failed"
```bash
# Ver logs en Vercel
# Verificar que el build funciona localmente
npm run build

# Si falla, revisar errores TypeScript
npm run type-check
```

### Error: Variables de entorno no funcionan
- Verificar que las variables empiecen con `NEXT_PUBLIC_`
- Hacer **Redeploy** después de añadir variables
- Verificar que no hay espacios en los valores

### Error: Supabase connection failed
- Verificar que las credenciales sean correctas
- Verificar que el schema SQL se ejecutó correctamente
- Revisar los logs de Vercel

### Performance lenta
- Activar Edge Functions en Vercel
- Optimizar imágenes (usar `next/image`)
- Activar ISR (Incremental Static Regeneration) donde sea posible

---

## 🔒 SEGURIDAD

### Recomendaciones
1. ✅ Nunca commitear `.env.local`
2. ✅ Usar variables de entorno para API keys
3. ✅ Activar RLS en Supabase
4. ✅ Configurar CORS correctamente
5. ✅ Habilitar rate limiting en Supabase

### Headers de Seguridad

Añadir en `next.config.js`:
```js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
}
```

---

## 📈 PRÓXIMOS PASOS

### ✅ FASE 1: MVP LIVE - COMPLETADO
- [x] ✅ Código en GitHub
- [x] ✅ Deploy en Vercel
- [x] ✅ Dominio hakadogs.com configurado
- [x] ✅ SSL activo
- [x] ✅ Supabase configurado
- [x] ✅ Google Analytics implementado
- [x] ✅ Sistema de seguridad RLS activado

### Fase 2: Contenido (ACTUAL)
- [ ] Crear cursos reales con TinyMCE
- [ ] Subir videos a YouTube/Vimeo
- [ ] Crear recursos descargables (PDFs)
- [ ] Testimonios reales de clientes
- [ ] Completar artículos de blog

### Fase 3: Marketing
- [x] ✅ Google Analytics (G-NXPT2KNYGJ)
- [ ] Facebook Pixel
- [ ] Email marketing (Resend/Mailchimp)
- [ ] Sistema de pagos real (Stripe/Redsys)
- [ ] Campañas de publicidad

---

## 📞 SOPORTE

**Documentación:**
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs

**Comunidad:**
- Vercel Discord: https://vercel.com/discord
- Stack Overflow: `[vercel] [next.js]`
- Supabase Discord: https://discord.supabase.com

---

## 🎉 CONCLUSIÓN

### Tu Ruta Recomendada:

**AHORA (10 minutos):**
1. ✅ Importar proyecto en Vercel
2. ✅ Añadir variables de entorno básicas
3. ✅ Deploy
4. ✅ Verificar que funciona

**ESTA SEMANA:**
1. Configurar dominio `hakadogs.com`
2. Crear proyecto en Supabase
3. Ejecutar schema SQL
4. Añadir credenciales a Vercel
5. Probar todas las funcionalidades

**PRÓXIMO MES:**
1. Crear cursos reales
2. Sistema de pagos
3. Email marketing
4. Optimizaciones de performance

---

**Última actualización:** 6 Enero 2026  
**Estado:** ✅ LIVE EN HAKADOGS.COM  
**Siguiente paso:** Crear contenido real de cursos

**🎉 ¡Hakadogs en producción con dominio propio! 🚀🐕**
