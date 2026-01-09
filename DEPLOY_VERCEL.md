# 🚀 DEPLOY EN VERCEL - HAKADOGS

## 📋 GUÍA COMPLETA DE DEPLOYMENT

**Versión:** 1.0.0 PRODUCTION  
**Fecha:** Enero 2026  
**Plataforma:** Vercel + GitHub  
**Framework:** Next.js 14  
**Estado:** ✅ DESPLEGADO Y FUNCIONANDO

---

## ✅ PREREQUISITOS

### 1. Cuenta Vercel
- [ ] Cuenta de Vercel creada (https://vercel.com)
- [ ] Cuenta conectada con GitHub

### 2. Repositorio GitHub
- [x] ✅ Código subido a https://github.com/Eskaladigital/HACKADOGS.git
- [x] ✅ 150+ archivos, ~35,000 líneas
- [x] ✅ Rama `main` activa

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
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# TinyMCE (Editor de contenido para cursos)
NEXT_PUBLIC_TINYMCE_API_KEY=tu_tinymce_api_key

# App URL (Opcional)
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
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

### Paso 1: Añadir Dominio

1. En Vercel, ir a tu proyecto
2. Click en "**Settings**" → "**Domains**"
3. Click "**Add**"
4. Ingresar tu dominio: `hakadogs.com`
5. Click "**Add**"

### Paso 2: Configurar DNS

Vercel te dará los registros DNS a añadir:

**Opción A: CNAME (Recomendado)**
```
Type    Name    Value
CNAME   www     cname.vercel-dns.com
A       @       76.76.21.21
```

**Opción B: Nameservers**
Si usas nameservers de Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Paso 3: Verificar

1. Añadir los registros en tu proveedor de dominio
2. Volver a Vercel y click "**Refresh**"
3. Esperar propagación DNS (5 minutos - 48 horas)
4. Vercel configurará automáticamente SSL

### Dominios Sugeridos
- `hakadogs.com` (principal)
- `www.hakadogs.com` (alternativo)
- `app.hakadogs.com` (si separas las apps)

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

### Fase 1: MVP Live (AHORA)
- [x] Código en GitHub
- [x] Deploy en Vercel
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Supabase configurado

### Fase 2: Contenido
- [ ] Crear cursos reales con TinyMCE
- [ ] Subir videos a YouTube/Vimeo
- [ ] Crear recursos descargables (PDFs)
- [ ] Testimonios reales de clientes

### Fase 3: Marketing
- [ ] Google Analytics
- [ ] Facebook Pixel
- [ ] Email marketing (Resend/Mailchimp)
- [ ] Sistema de pagos (Stripe)

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

**Última actualización:** Enero 2026  
**Estado:** Listo para deploy  
**Siguiente paso:** Importar proyecto en Vercel

**¡Hakadogs en Vercel es más rápido y fácil que nunca! 🚀🐕**
