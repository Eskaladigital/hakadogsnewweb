# 🚀 Guía de Deployment - Optimización PageSpeed

## ✅ Cambios Realizados

### 1. **Archivos Modificados**

#### Configuración
- ✅ `next.config.js` - Optimización CSS, imágenes, caché
- ✅ `package.json` - Nuevo script `optimize-images`

#### Componentes
- ✅ `app/layout.tsx` - Preload recursos, optimización Analytics
- ✅ `app/page.tsx` - Suspense boundaries para lazy loading
- ✅ `components/Hero.tsx` - Eliminado framer-motion, CSS animations
- ✅ `components/Navigation.tsx` - Imágenes optimizadas

#### Estilos
- ✅ `app/globals.css` - Nuevas animaciones CSS nativas

#### Nuevos Archivos
- ✅ `components/ui/LoadingSkeleton.tsx` - Skeletons para lazy loading
- ✅ `scripts/optimize-images.js` - Script de optimización automática
- ✅ `docs/OPTIMIZACION_PAGESPEED.md` - Documentación completa

---

## 📋 Checklist Pre-Deploy

### 1. Verificar Build
```bash
# Limpiar caché
rm -rf .next

# Build de producción
npm run build

# Verificar que no hay errores
```

### 2. Probar Localmente
```bash
# Iniciar en producción
npm run start

# Abrir http://localhost:3000
# Verificar que todo funciona
```

### 3. Test de Rendimiento Local
```bash
# Lighthouse local
npx lighthouse http://localhost:3000 --view --preset=desktop
npx lighthouse http://localhost:3000 --view --preset=mobile
```

---

## 🎯 Deploy a Producción

### Opción A: Amplify (Recomendado)

```bash
# 1. Commit cambios
git add .
git commit -m "feat: Optimización PageSpeed - LCP, Speed Index, JavaScript

- Eliminado framer-motion de Hero (ahorro 60KB)
- Agregado preload imágenes críticas
- Optimizado Google Analytics (afterInteractive)
- CSS animations nativas
- Suspense boundaries para lazy loading
- Reducida calidad imágenes no críticas (95→80)
- Preconnect dominios externos
- Loading skeletons para mejor UX"

# 2. Push a repositorio
git push origin main

# 3. Amplify detectará cambios y hará auto-deploy
# Monitorear en https://console.aws.amazon.com/amplify/
```

### Opción B: Vercel

```bash
# 1. Install Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Verificar deployment
```

---

## 🧪 Verificación Post-Deploy

### 1. PageSpeed Insights
```
https://pagespeed.web.dev/analysis?url=https://www.hakadogs.com
```

**Métricas a verificar:**
- ✅ LCP < 2.5s (antes: 5.0s)
- ✅ Speed Index < 3.4s (antes: 1.5s → mejorar)
- ✅ FCP < 1.8s
- ✅ TTI < 3.8s
- ✅ Score Móvil > 90 (antes: 81)

### 2. WebPageTest
```
https://www.webpagetest.org/
URL: https://www.hakadogs.com
Location: Madrid, Spain
Connection: 4G
```

### 3. Chrome DevTools
1. Abrir DevTools (F12)
2. Performance Tab
3. Click "Record" y recargar página
4. Verificar:
   - Layout shifts (CLS)
   - Long tasks
   - Main thread blocking

---

## 📊 Resultados Esperados

### Antes vs Después

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Móvil Score** | 81 | 90-95 | +11% |
| **Desktop Score** | 99 | 99-100 | - |
| **LCP** | 5.0s | ~2.5s | -50% |
| **Speed Index** | 1.5s | ~1.0s | -33% |
| **JS Bundle** | +140KB | Normal | -140KB |
| **Blocking Time** | 120ms | <50ms | -58% |

---

## 🔄 Optimizaciones Adicionales Opcionales

### 1. Optimizar Imágenes (Recomendado)
```bash
# Ejecutar script de optimización
npm run optimize-images

# Revisar reporte
cat scripts/image-optimization-report.json

# Commit imágenes optimizadas
git add public/images/
git commit -m "chore: Optimización automática de imágenes WebP/AVIF"
git push
```

### 2. Generar Blur Placeholders
```bash
# Instalar plaiceholder
npm install plaiceholder

# Usar en componentes
import { getPlaiceholder } from 'plaiceholder'
```

### 3. Habilitar Service Worker
Descomentar código en `app/layout.tsx` líneas 163-179

### 4. Comprimir Build
```bash
# En next.config.js ya está habilitado:
compress: true
```

---

## 🚨 Troubleshooting

### Build falla
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar caché Next.js
rm -rf .next
npm run build
```

### Imágenes no cargan
- Verificar rutas en `/public/images/`
- Verificar configuración `next.config.js` > `images.domains`

### Analytics no funciona
- Verificar ID: `G-NXPT2KNYGJ`
- Comprobar en Google Analytics Real-Time

### Skeletons no aparecen
- Verificar que componente está wrapeado en `<Suspense>`
- Verificar import de `LoadingSkeleton`

---

## 📱 Testing en Dispositivos Reales

### iOS Safari
1. Abrir https://www.hakadogs.com
2. Inspector Web (conectar Mac)
3. Verificar console errors
4. Test LCP visual

### Android Chrome
1. Chrome DevTools Remote Debugging
2. Lighthouse on device
3. Network throttling 3G/4G

---

## 📈 Monitoreo Continuo

### Google Analytics
- Configurar alertas para métricas Web Vitals
- Dashboard: Site Speed

### Sentry (Opcional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### New Relic (Opcional)
Para monitoreo real-time de rendimiento

---

## 🎉 Checklist Final

Antes de cerrar el ticket:

- [ ] Build exitoso sin errores
- [ ] Deploy a producción completado
- [ ] PageSpeed score móvil > 90
- [ ] LCP < 2.5s en móvil
- [ ] Sin errores en consola
- [ ] Navegación funciona correctamente
- [ ] Login/Registro funciona
- [ ] Imágenes cargan correctamente
- [ ] Analytics tracking funciona
- [ ] SEO metadata intacto
- [ ] Documentación actualizada

---

## 📞 Contacto

Si encuentras problemas durante el deployment:

1. Revisar logs en Amplify/Vercel
2. Comprobar `docs/OPTIMIZACION_PAGESPEED.md`
3. Rollback si es necesario: `git revert HEAD`

---

**Creado**: 12 Enero 2026  
**Última actualización**: 12 Enero 2026  
**Versión**: 1.0.0
