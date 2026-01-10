# 📸 IMAGEN OPEN GRAPH PARA REDES SOCIALES

## 🎯 NECESIDAD

Cuando se comparte www.hakadogs.com en redes sociales (WhatsApp, Facebook, Twitter, LinkedIn), debe mostrarse una imagen atractiva con:
- Logo de Hakadogs
- Texto: "Educación Canina Profesional"
- Subtexto: "BE HAKA | +8 años | +500 perros"

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Dimensiones Open Graph
- **Tamaño:** 1200 x 630 píxeles (ratio 1.91:1)
- **Formato:** JPG (optimizado para web, < 300KB)
- **Nombre archivo:** `hakadogs-og-image.jpg`
- **Ubicación:** `/public/images/hakadogs-og-image.jpg`

### Dimensiones Alternativas (Opcionales)
- **Twitter:** 1200 x 675 píxeles
- **LinkedIn:** 1200 x 627 píxeles
- **Facebook:** 1200 x 630 píxeles (igual que OG)

---

## 🎨 DISEÑO RECOMENDADO

### Contenido Visual

```
┌────────────────────────────────────────────────────┐
│                                                    │
│         [LOGO HAKADOGS - Centrado]                 │
│                                                    │
│         Educación Canina Profesional               │
│              Metodología BE HAKA                   │
│                                                    │
│         +8 años  |  +500 perros  |  100%          │
│                                                    │
│         www.hakadogs.com                           │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Colores Corporativos
- **Verde Forest:** #4A7C59
- **Verde Forest Dark:** #2C5530
- **Sage:** #8FBC8F
- **Gold:** #D4AF37
- **Cream:** #FAF6F1

### Tipografía
- **Título:** Bold, 72px
- **Subtítulo:** Semibold, 48px
- **Stats:** Regular, 36px
- **URL:** Regular, 32px

---

## 🛠️ CREACIÓN DE LA IMAGEN

### Opción 1: Herraientas Online
- **Canva:** https://www.canva.com
  - Template: "Open Graph Image"
  - Tamaño personalizado: 1200 x 630 px

- **Figma:** https://www.figma.com
  - Frame: 1200 x 630 px
  - Export: JPG 80% quality

### Opción 2: Photoshop / GIMP
1. Crear nuevo documento: 1200 x 630 px, 72 DPI, RGB
2. Fondo: Gradiente verde (forest → sage)
3. Añadir logo Hakadogs (usar `hakadogs_logo_cara_transparente.png`)
4. Añadir textos con tipografía corporativa
5. Exportar como JPG (calidad 80%, optimizado para web)

### Opción 3: Código (Node.js + Sharp/Canvas)
```javascript
// Generar imagen OG con código
// Ver script en: scripts/generate-og-image.js
```

---

## 📝 CONTENIDO DE TEXTO

### Texto Principal
```
Hakadogs
Educación Canina Profesional
```

### Subtexto
```
Metodología BE HAKA
Servicios Presenciales | Cursos Online
```

### Stats
```
+8 años experiencia  •  +500 perros educados  •  100% positivo
```

### URL
```
www.hakadogs.com
```

---

## ✅ IMPLEMENTACIÓN ACTUAL

### Estado: ⚠️ TEMPORAL
Actualmente se usa: `hakadogs_logo_fondo_color_2.jpg`  
**Problema:** No tiene las dimensiones correctas (1200x630)

### Metadatos Configurados en `app/layout.tsx`:
```typescript
openGraph: {
  images: [
    {
      url: '/images/hakadogs-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Hakadogs - Educación Canina Profesional',
    }
  ],
}
```

---

## 🚀 PRÓXIMOS PASOS

### 1. Crear la imagen
- [ ] Diseñar imagen 1200x630 según especificaciones
- [ ] Incluir logo, textos y stats
- [ ] Optimizar tamaño (< 300KB)
- [ ] Nombrar como `hakadogs-og-image.jpg`

### 2. Subir al proyecto
- [ ] Ubicar en `/public/images/hakadogs-og-image.jpg`
- [ ] Verificar que existe en esa ruta exacta

### 3. Verificar funcionamiento
- [ ] Compartir URL en WhatsApp → Ver preview
- [ ] Usar Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Usar LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- [ ] Usar Twitter Card Validator: https://cards-dev.twitter.com/validator

---

## 🔗 HERRAMIENTAS DE VERIFICACIÓN

### Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

**Uso:**
1. Pegar URL: https://www.hakadogs.com
2. Click "Debug"
3. Verificar que imagen se muestra correctamente
4. Si hay caché antiguo, click "Scrape Again"

### LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

**Uso:**
1. Pegar URL: https://www.hakadogs.com
2. Click "Inspect"
3. Verificar preview

### Twitter Card Validator
https://cards-dev.twitter.com/validator

**Uso:**
1. Pegar URL: https://www.hakadogs.com
2. Ver preview de card
3. Verificar imagen y textos

---

## 📋 CHECKLIST FINAL

- [x] Metadatos Open Graph añadidos en `app/layout.tsx`
- [x] URL base configurada (`metadataBase`)
- [x] Título y descripción OG
- [x] Twitter Card configurada
- [ ] **Imagen OG creada (1200x630)**
- [ ] Imagen subida a `/public/images/hakadogs-og-image.jpg`
- [ ] Verificado en Facebook Debugger
- [ ] Verificado en WhatsApp
- [ ] Verificado en LinkedIn
- [ ] Verificado en Twitter

---

## 🎯 RESULTADO ESPERADO

Al compartir www.hakadogs.com en redes sociales:

**WhatsApp:**
```
┌─────────────────────────────────┐
│  [Imagen 1200x630]              │
│                                 │
│  Hakadogs - Educación Canina... │
│  Educación canina profesional...│
│  www.hakadogs.com               │
└─────────────────────────────────┘
```

**Facebook/LinkedIn:**
- Imagen grande destacada
- Título completo
- Descripción
- URL visible

---

**Fecha:** 9 Enero 2026  
**Estado:** Metadatos configurados, falta crear imagen OG
