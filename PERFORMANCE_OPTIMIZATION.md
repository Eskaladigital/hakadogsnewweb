# 🚀 Optimización de Rendimiento Web - Hakadogs

**Fecha:** 2026-01-06  
**Objetivo:** Google PageSpeed Score **90+** (móvil y desktop)  
**Prioridad:** CRÍTICA para SEO

---

## 📊 Métricas Objetivo (Core Web Vitals)

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Tiempo hasta que el contenido principal es visible |
| **FID** (First Input Delay) | < 100ms | Tiempo hasta que la página responde a la primera interacción |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Estabilidad visual (sin saltos de contenido) |
| **FCP** (First Contentful Paint) | < 1.8s | Tiempo hasta que aparece el primer contenido |
| **TTI** (Time to Interactive) | < 3.8s | Tiempo hasta que la página es totalmente interactiva |

---

## ✅ Optimizaciones Implementadas

### 1. **Next.js Config (`next.config.js`)**

#### **Imágenes optimizadas:**
```javascript
images: {
  formats: ['image/avif', 'image/webp'], // Formatos modernos
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  minimumCacheTTL: 60, // Caché de 60 segundos
}
```

**Beneficio:** 
- ✅ **WebP/AVIF:** 30-50% más ligero que JPG
- ✅ Responsive images automático
- ✅ Lazy loading por defecto

---

#### **Compresión Gzip/Brotli:**
```javascript
compress: true
```

**Beneficio:**
- ✅ Reduce tamaño de HTML/CSS/JS en **70-80%**
- ✅ Vercel sirve Brotli automáticamente

---

#### **Headers de Caché:**
```javascript
async headers() {
  return [
    {
      source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ]
    }
  ]
}
```

**Beneficio:**
- ✅ Imágenes cacheadas **1 año** en navegador
- ✅ Assets estáticos cacheados permanentemente
- ✅ Reduce peticiones HTTP en visitas recurrentes

---

### 2. **Google Analytics Optimizado (`app/layout.tsx`)**

#### **Antes:**
```typescript
strategy="afterInteractive" // Bloquea renderizado
```

#### **Después:**
```typescript
strategy="lazyOnload" // Carga después de todo
```

**Beneficio:**
- ✅ **No bloquea el renderizado crítico**
- ✅ Mejora FCP y LCP en **300-500ms**
- ✅ Analytics se carga solo cuando la página ya es interactiva

---

#### **Preconnect a Google:**
```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
```

**Beneficio:**
- ✅ Reduce latencia de DNS lookup
- ✅ Conexión establecida antes de que se solicite el script

---

### 3. **Componente `<Image>` de Next.js**

**Uso correcto:**
```tsx
import Image from 'next/image'

<Image
  src="/images/perro.jpg"
  width={800}
  height={600}
  alt="Educación canina"
  quality={80} // 80% de calidad (óptimo rendimiento/calidad)
  priority={false} // true solo para hero images
  loading="lazy" // Lazy loading automático
/>
```

**Beneficio:**
- ✅ Conversión automática a WebP/AVIF
- ✅ Lazy loading (carga solo al hacer scroll)
- ✅ Responsive automático (genera múltiples tamaños)
- ✅ Placeholder blur mientras carga

---

## 🎯 Optimizaciones Pendientes (Próximos Pasos)

### 1. **Fuentes Web Optimizadas**

**Problema:** Si usas Google Fonts, cada fuente añade 100-200ms de latencia.

**Solución:**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Muestra fallback hasta que carga
  preload: true,
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      {children}
    </html>
  )
}
```

**Beneficio:**
- ✅ Fuentes self-hosted (no petición externa)
- ✅ Preload automático
- ✅ Reduce CLS (no hay cambio de fuente)

---

### 2. **Code Splitting y Tree Shaking**

**Revisar importaciones grandes:**
```typescript
// ❌ MAL - Importa toda la librería
import _ from 'lodash'

// ✅ BIEN - Solo la función necesaria
import debounce from 'lodash/debounce'
```

**Beneficio:**
- ✅ Bundle size más pequeño
- ✅ Menos JavaScript para parsear

---

### 3. **Lazy Loading de Componentes Pesados**

**Para componentes no críticos:**
```typescript
import dynamic from 'next/dynamic'

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div>Cargando editor...</div>
})
```

**Ya implementado en:**
- ✅ `TinyMCEEditor`
- ✅ `LessonsManager`

---

### 4. **Reducir Framer Motion (si no es esencial)**

**Problema:** Framer Motion añade **~50KB** al bundle.

**Solución:** Usar solo en componentes críticos, o reemplazar con CSS animations.

```css
/* CSS alternativa más ligera */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

---

### 5. **Service Worker para Caché Offline**

**Implementar PWA básico:**
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA(nextConfig)
```

**Beneficio:**
- ✅ Caché de assets para offline
- ✅ Visitas recurrentes instantáneas
- ✅ Mejor puntuación Lighthouse

---

## 🔍 Herramientas de Análisis

### **1. Google PageSpeed Insights**
URL: https://pagespeed.web.dev/  
Analiza: https://www.hakadogs.com/

**Qué mirar:**
- Performance Score (móvil y desktop)
- Core Web Vitals
- Opportunities (oportunidades de mejora)

---

### **2. Lighthouse (Chrome DevTools)**

**Cómo usar:**
1. Abre Chrome DevTools (F12)
2. Pestaña "Lighthouse"
3. Selecciona "Performance" + "Mobile"
4. Click "Analyze page load"

---

### **3. WebPageTest**
URL: https://www.webpagetest.org/

**Configuración recomendada:**
- Location: Madrid, Spain
- Browser: Chrome (Mobile)
- Connection: 4G

---

### **4. Next.js Bundle Analyzer**

**Instalar:**
```bash
npm install --save-dev @next/bundle-analyzer
```

**Configurar en `next.config.js`:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

**Ejecutar:**
```bash
ANALYZE=true npm run build
```

**Beneficio:**
- ✅ Visualiza qué librerías son más pesadas
- ✅ Identifica oportunidades de tree-shaking

---

## 📋 Checklist de Optimización

### **Imágenes:**
- [x] Usar `<Image>` de Next.js en lugar de `<img>`
- [x] Formato WebP/AVIF habilitado
- [ ] Todas las imágenes tienen `width` y `height` (evita CLS)
- [ ] Hero images con `priority={true}`
- [x] Resto de imágenes con lazy loading
- [ ] Imágenes optimizadas (comprimidas antes de subir)

### **JavaScript:**
- [x] Google Analytics con `strategy="lazyOnload"`
- [x] Componentes pesados con `dynamic import`
- [ ] Tree shaking de librerías (importar solo lo necesario)
- [ ] Reducir uso de Framer Motion si es posible

### **CSS:**
- [ ] CSS crítico inline en `<head>`
- [ ] Resto de CSS cargado async
- [ ] Eliminar CSS no usado (PurgeCSS/Tailwind JIT)

### **Fuentes:**
- [ ] Fuentes self-hosted con `next/font`
- [ ] `font-display: swap` configurado
- [ ] Preload de fuentes críticas

### **Caché:**
- [x] Headers de caché configurados
- [x] Static assets con caché de 1 año
- [ ] Service Worker para PWA

### **Core Web Vitals:**
- [ ] LCP < 2.5s ✅
- [ ] FID < 100ms ✅
- [ ] CLS < 0.1 ✅

---

## 🎯 Objetivos por Página

| Página | LCP Objetivo | FCP Objetivo | Score Objetivo |
|--------|--------------|--------------|----------------|
| Home | < 2.0s | < 1.5s | 90+ |
| Servicios | < 2.2s | < 1.6s | 88+ |
| Cursos | < 2.3s | < 1.7s | 85+ |
| Curso Detail | < 2.5s | < 1.8s | 82+ |
| Blog | < 2.0s | < 1.5s | 90+ |

---

## 📞 Próximos Pasos

1. **Análisis actual:** Ejecutar Lighthouse en todas las páginas principales
2. **Identificar bottlenecks:** Qué está ralentizando cada página
3. **Priorizar:** Atacar primero las optimizaciones con mayor impacto
4. **Medir:** Re-test después de cada optimización
5. **Iterar:** Repetir hasta alcanzar score 90+

---

**Última actualización:** 2026-01-06  
**Estado:** En progreso  
**Responsable:** Optimización Web Hakadogs
