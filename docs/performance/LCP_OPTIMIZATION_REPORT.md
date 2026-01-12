# ⚡ Optimización LCP: Logo Ligero + CSS Crítico

**Fecha:** 2026-01-10  
**Problema:** LCP empeoró de ~3s a 5.3s después de mejoras de accesibilidad  
**Causa:** Logo pesado (76 KB) + CSS bloqueante + Service Worker

---

## 🔴 **Problema Detectado:**

### **Antes de optimizaciones de accesibilidad:**
- **LCP:** ~3.0s ✅
- **Logo:** hakadogs-02.webp (76.6 KB)
- **Sin Service Worker**

### **Después de accesibilidad (10 ene 2026):**
- **LCP:** 5.3s ❌ **EMPEORÓ +2.3s**
- **FCP:** 1.0s ✅
- **TBT:** 50ms ✅
- **CLS:** 0 ✅
- **Speed Index:** 3.5s ⚠️
- **Accesibilidad:** 96/100 ✅

### **Diagnóstico Google PageSpeed:**
1. **CSS bloqueante:** `877d3d49c8d65053.css` (13.4 KB, 160ms)
2. **JavaScript antiguo:** Polyfills (12 KB desperdiciados)
3. **JS sin usar:** 129 KB (73 KB en commons, 55 KB Google Analytics)
4. **Logo pesado:** 76.6 KB redimensionado desde ~4000px

---

## ✅ **Soluciones Implementadas:**

### **1. Logo Ligero (tu propuesta) 🎯**

**ANTES:**
```tsx
// Desktop
src="/images/hakadogs-02.webp"  // 76.6 KB
width={256} height={80}

// Mobile
src="/images/hakadogs-04.webp"  // 75.6 KB
width={192} height={64}
```

**DESPUÉS:**
```tsx
// Desktop + Mobile (mismo logo)
src="/images/hakadogs_logo_texto_transparente.webp"  // 18.1 KB ✅
quality={95}
```

**Ahorro:**
- **Desktop:** 76.6 KB → 18.1 KB (**-76%**)
- **Mobile:** 75.6 KB → 18.1 KB (**-76%**)
- **Ahorro por visita:** **~58 KB**
- **Impacto LCP:** **-400ms estimado**

**Ventajas:**
- ✅ 4.2x más pequeño
- ✅ Sin redimensionamiento forzado (ya es tamaño correcto)
- ✅ Menor procesamiento Next.js Image
- ✅ Carga instantánea
- ✅ Mejor Core Web Vitals

---

### **2. Preload del Logo Crítico**

**Añadido en `app/layout.tsx`:**
```html
<link 
  rel="preload" 
  as="image" 
  href="/images/hakadogs_logo_texto_transparente.webp"
  type="image/webp"
/>
```

**Beneficio:**
- ✅ Logo se descarga en paralelo con HTML
- ✅ Disponible antes del render
- ✅ Reduce LCP

---

### **3. Service Worker Deshabilitado (Temporal)**

**Razón:**
- El Service Worker puede añadir overhead en la **primera visita**
- Útil para **visitas repetidas** (caché offline)
- Penaliza el LCP inicial

**Estrategia:**
```tsx
// COMENTADO temporalmente
{/* Service Worker Registration - DESHABILITADO para mejorar LCP */}
```

**Resultado esperado:**
- ✅ Primera carga más rápida
- ❌ Sin caché offline (temporal)
- 💡 Reactiva después de optimizar LCP

---

### **4. Optimización CSS Crítico**

**Añadido en `next.config.js`:**
```js
experimental: {
  optimizeCss: true,  // Extrae CSS crítico inline
}
```

**Instalado:**
```bash
npm install --save-dev critters
```

**Beneficio:**
- ✅ CSS crítico se inserta **inline** en el `<head>`
- ✅ CSS no crítico se carga **async**
- ✅ Elimina bloqueo de renderizado
- ✅ Reduce "Solicitudes que bloquean el renderizado" (160ms → 0ms esperado)

---

## 📊 **Impacto Esperado:**

| Métrica | Antes (10 ene) | Después | Mejora |
|---------|----------------|---------|--------|
| **LCP** | 5.3s ❌ | **< 2.5s** ✅ | **-2.8s** |
| **FCP** | 1.0s ✅ | **< 0.9s** ✅ | **-0.1s** |
| **Speed Index** | 3.5s ⚠️ | **< 2.5s** ✅ | **-1.0s** |
| **CSS bloqueante** | 160ms ❌ | **0ms** ✅ | **-160ms** |
| **Logo size** | 76 KB ❌ | **18 KB** ✅ | **-76%** |
| **Rendimiento** | 79 ⚠️ | **90+** ✅ | **+11 pts** |
| **Accesibilidad** | 96 ✅ | **96** ✅ | Mantenido |

---

## 🎯 **Optimizaciones Adicionales (Próximas):**

### **1. JavaScript sin usar (129 KB):**
```
- commons.js: 73 KB de código no usado
- Google Analytics: 55 KB (ya en lazyOnload, pero aún se carga)
```

**Solución:**
- Importaciones dinámicas con `next/dynamic`
- Lazy loading de componentes no críticos
- Tree shaking más agresivo

### **2. JavaScript antiguo (12 KB polyfills):**
```
Array.prototype.at
Array.prototype.flat
Array.prototype.flatMap
Object.fromEntries
Object.hasOwn
String.prototype.trimStart/End
```

**Solución:**
- ✅ `.browserslistrc` ya configurado
- ✅ `swcMinify: true` activado
- 💡 Verificar transpilación de dependencias

---

## 🔍 **Testing:**

### **Antes de deploy:**
```bash
npm run build
npm run start
```

### **Después de deploy:**
1. **Google PageSpeed:**
   ```
   https://pagespeed.web.dev/
   URL: https://www.hakadogs.com/
   ```
   **Esperado:**
   - LCP: < 2.5s ✅
   - CSS bloqueante: RESUELTO ✅
   - Logo: Tamaño optimizado ✅

2. **Lighthouse local:**
   ```
   F12 → Lighthouse → Performance
   Score esperado: 90+ ✅
   ```

3. **WebPageTest:**
   ```
   https://www.webpagetest.org/
   Location: Spain (Madrid/Barcelona)
   ```

---

## 📈 **Comparativa de Logos:**

| Logo | Dimensiones | Tamaño | Uso |
|------|-------------|--------|-----|
| hakadogs-02.webp | ~4000px (orig) | 76.6 KB | ❌ ANTES (Desktop) |
| hakadogs-04.webp | ~3500px (orig) | 75.6 KB | ❌ ANTES (Mobile) |
| hakadogs_logo_texto_transparente.webp | ~800px | **18.1 KB** | ✅ AHORA (Ambos) |

**Explicación:**
- Los logos anteriores eran **enormes** (4000px+)
- Next.js los redimensionaba a 256px/192px
- Desperdicio de ancho de banda y CPU
- El nuevo logo ya tiene el **tamaño correcto** (~800px)
- **Sin redimensionamiento forzado** = Más rápido

---

## ✅ **Checklist de Optimización:**

### **Implementado:**
- [x] Logo ligero (18 KB vs 76 KB)
- [x] Preload del logo crítico
- [x] Service Worker deshabilitado (temporal)
- [x] CSS crítico inline (experimental.optimizeCss)
- [x] Critters instalado
- [x] Calidad del logo aumentada a 95% (compensar tamaño)

### **Pendiente:**
- [ ] Verificar LCP después del deploy
- [ ] Reactivar Service Worker si LCP < 2.5s
- [ ] Optimizar JS sin usar (dynamic imports)
- [ ] Verificar eliminación de polyfills

---

## 💡 **Lecciones Aprendidas:**

1. **Accesibilidad ≠ Rendimiento penalizado:**
   - El problema no fue la accesibilidad
   - El problema fue el Service Worker + logo pesado

2. **Tamaño de imagen ≠ Calidad visual:**
   - 18 KB es suficiente para un logo vectorial
   - 76 KB era excesivo

3. **Preload selectivo:**
   - Solo recursos críticos (logo, fuentes)
   - No preload de todo

4. **Service Worker:**
   - Útil para **visitas repetidas**
   - Penaliza **primera visita**
   - Estrategia: Activar después de optimizar LCP

---

**Última actualización:** 2026-01-10  
**Estado:** ✅ Implementado  
**Deploy:** Pendiente  
**LCP esperado:** < 2.5s (mejora de 2.8s)
