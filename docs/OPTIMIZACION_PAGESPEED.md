# 🚀 Optimización de PageSpeed - Hakadogs

## 📊 Problemas Detectados Iniciales

### Móvil (Score: 81)
- **LCP (Largest Contentful Paint)**: 5.0s ⚠️ CRÍTICO
- **Speed Index**: 1.5s ⚠️ Necesita mejora
- **JavaScript no usado**: 140 KiB (ahorro estimado)
- **Solicitudes que bloquean renderizado**: 120ms
- **JavaScript antiguo**: 12 KiB de polyfills

### Desktop (Score: 99)
- Rendimiento excelente pero Speed Index mejorable

---

## ✅ Optimizaciones Implementadas

### 1. **Next.js Configuration** (`next.config.js`)

#### Optimizaciones CSS
```javascript
experimental: {
  optimizeCss: true,
  optimizePackageImports: ['lucide-react', 'framer-motion'],
  optimisticClientCache: true,
}
```
**Impacto**: Reduce CSS bloqueante y mejora caché del cliente

#### Imágenes
```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  unoptimized: false,
}
```
**Impacto**: Prioriza formatos modernos (AVIF/WebP) que reducen tamaño 30-50%

---

### 2. **Layout Optimizations** (`app/layout.tsx`)

#### Preconnect y DNS Prefetch
```html
<link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
```
**Impacto**: Reduce latencia de conexión en ~200-300ms

#### Preload de Imágenes Críticas
```html
<link rel="preload" as="image" href="/images/hakadogs_educacion_canina_home_2.png" 
      type="image/png" fetchPriority="high" />
<link rel="preload" as="image" href="/images/logo_definitivo_hakadogs.webp" 
      type="image/webp" fetchPriority="high" />
```
**Impacto**: Mejora LCP en ~1-2 segundos al cargar imagen Hero antes

#### Google Analytics Optimizado
```javascript
// Cambiado de 'lazyOnload' a 'afterInteractive'
<Script src="https://www.googletagmanager.com/gtag/js?id=G-NXPT2KNYGJ"
        strategy="afterInteractive" async />
```
**Impacto**: Balance entre tracking y rendimiento

---

### 3. **Hero Component** (`components/Hero.tsx`)

#### Eliminación de Framer Motion
**ANTES**: Usaba `framer-motion` (bundle size: ~60KB)
```javascript
import { motion } from 'framer-motion'
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

**DESPUÉS**: CSS Animations nativas
```javascript
<div className="animate-fade-in-up">
```
**Impacto**: Ahorro de ~60KB de JavaScript, mejora Speed Index

#### Optimización de Imágenes Hero
```javascript
<Image
  src={image}
  alt="Educación Canina Hakadogs"
  fill
  className="object-cover"
  priority
  loading="eager"           // Carga inmediata
  fetchPriority="high"      // Máxima prioridad
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={85}              // Balance calidad/tamaño
/>
```
**Impacto**: LCP mejorado significativamente

---

### 4. **Navigation Component** (`components/Navigation.tsx`)

#### Optimización de Logo
```javascript
// Calidad reducida de 95 a 80
quality={80}
// Sizes específicos para responsive
sizes="(max-width: 640px) 210px, 280px"
```
**Impacto**: Reduce tamaño de logo en ~30-40%

---

### 5. **CSS Animations** (`app/globals.css`)

Agregadas animaciones CSS nativas que reemplazan framer-motion:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-fade-in-scale {
  animation: fadeInScale 0.5s ease-out 0.1s both;
}
```
**Impacto**: Animaciones más eficientes, sin dependencias JavaScript

---

## 📈 Resultados Esperados

### Móvil
- **LCP**: 5.0s → ~2.5s ✅ (mejora 50%)
- **Speed Index**: 1.5s → ~1.0s ✅
- **JavaScript**: -140 KiB ✅
- **Score**: 81 → **90-95** ✅

### Desktop
- **Speed Index**: Mejorado
- **Score**: 99 → **99-100** ✅

---

## 🔄 Próximas Recomendaciones

### 1. **Imágenes**
- [ ] Convertir TODAS las imágenes `.png` a `.webp`
- [ ] Generar versiones responsivas (320w, 640w, 1024w, 1920w)
- [ ] Usar `placeholder="blur"` con `blurDataURL` en imágenes importantes

**Herramienta recomendada**:
```bash
# Convertir a WebP
npx @squoosh/cli --webp auto **/*.png

# O usar sharp (ya instalado)
npm run optimize-images  # (crear script)
```

### 2. **Lazy Loading Mejorado**
```javascript
// En page.tsx, agregar Suspense boundaries
import { Suspense } from 'react'

<Suspense fallback={<LoadingSkeleton />}>
  <ServicesSection />
</Suspense>
```

### 3. **Code Splitting Adicional**
```javascript
// Separar rutas de admin
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

### 4. **Service Worker para Caché**
Reactivar Service Worker con estrategia inteligente:
```javascript
// Cachear assets estáticos
// Estrategia Network-First para HTML
// Cache-First para imágenes/CSS/JS
```

### 5. **Google Tag Manager - Container Modificado**
Cargar GTM de forma condicional (solo después de interacción):
```javascript
// Cargar GTM solo después del primer scroll o click
useEffect(() => {
  const loadGTM = () => {
    // Código GTM aquí
  }
  
  const events = ['scroll', 'click', 'mousemove']
  events.forEach(event => {
    window.addEventListener(event, loadGTM, { once: true })
  })
}, [])
```

### 6. **Font Optimization**
Agregar preload de fonts si usas custom fonts:
```html
<link rel="preload" href="/fonts/font.woff2" as="font" 
      type="font/woff2" crossorigin />
```

### 7. **Critical CSS**
Extraer CSS crítico inline en el `<head>`:
```bash
npm install critters --save-dev
# Ya está instalado, configurar en next.config.js
```

---

## 🧪 Testing

### Herramientas
1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **Lighthouse CI**: Para automatizar tests en CI/CD
3. **WebPageTest**: Análisis detallado
4. **Chrome DevTools**: Performance tab

### Comandos
```bash
# Build de producción
npm run build

# Analizar bundle
npm run build && npx @next/bundle-analyzer

# Lighthouse local
npx lighthouse https://hakadogs.com --view
```

---

## 📝 Checklist de Verificación

- [x] Eliminar JavaScript no usado (framer-motion en Hero)
- [x] Preload de imágenes críticas (Hero, Logo)
- [x] Optimizar Google Analytics (afterInteractive + async)
- [x] Reducir calidad de imágenes no críticas (80 vs 95)
- [x] Agregar sizes específicos para responsive
- [x] Preconnect a dominios externos
- [x] CSS animations nativas vs JavaScript
- [x] Habilitar optimizeCss experimental
- [ ] Convertir todas las imágenes a WebP/AVIF
- [ ] Implementar blur placeholders
- [ ] Configurar Service Worker
- [ ] Lazy load mejorado con Suspense
- [ ] Critical CSS inline

---

## 💡 Mejores Prácticas a Seguir

### Para Nuevas Imágenes
```javascript
// ✅ BIEN
<Image
  src="/images/foto.webp"
  alt="Descripción"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// ❌ MAL
<img src="/images/foto.png" />
```

### Para Componentes Pesados
```javascript
// ✅ BIEN - Lazy load con loading
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
  ssr: false // Si no es crítico para SEO
})

// ❌ MAL - Import directo
import HeavyComponent from './Heavy'
```

### Para Animaciones
```css
/* ✅ BIEN - CSS animations */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.slide-in { animation: slideIn 0.3s ease-out; }

/* ❌ MAL - JavaScript animations para elementos simples */
```

---

## 📚 Referencias

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Última actualización**: 12 Enero 2026
**Próxima revisión**: Después del deploy y testing en producción
