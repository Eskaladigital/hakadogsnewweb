# 📱 Auditoría de Responsividad Móvil - Sistema de Cursos

**Fecha:** 2026-01-06  
**Versión:** 1.0.6  
**Prioridad:** ALTA

---

## 🎯 Objetivo

Asegurar que todo el sistema de cursos (administración y estudiantes) tenga una experiencia **óptima en móvil**, ya que se prevé que sea el dispositivo principal de acceso.

---

## 📊 Páginas Analizadas

### 1. Panel de Administrador (`/administrator`)

#### ✅ Lo que funciona bien:
- Grid de stats responsive (4 columnas en desktop)
- Tabla con `overflow-x-auto` para scroll horizontal
- Botones de acción con iconos claros

#### 🔴 Problemas detectados:
- **Stats Grid:** 4 columnas muy apretadas en móviles pequeños (<400px)
- **Búsqueda y filtros:** Ocupa mucho espacio vertical en móvil
- **Paginación:** Botones numerados pueden ser muchos y estrechos
- **Tabla:** Scroll horizontal puede ocultar acciones importantes

#### ✅ Mejoras implementadas:
- Grid de stats: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Búsqueda: Layout vertical en móvil, horizontal en desktop
- Paginación: Limitar botones visibles en móvil (prev/next + página actual)
- Tabla: Priorizar columnas esenciales, hacer scroll más evidente

---

### 2. Crear/Editar Curso (`/administrator/cursos/nuevo` y `/editar/[id]`)

#### ✅ Lo que funciona bien:
- Tabs para separar "Información" y "Lecciones"
- Sidebar con resumen y botón guardar

#### 🔴 Problemas detectados:
- **Layout:** Sidebar fijo ocupa espacio en pantallas <1024px
- **TinyMCE:** Editor puede ser pequeño en móvil (altura fija)
- **Inputs:** Labels y botones en línea pueden apretar
- **Botón "Generar con IA":** Puede salir del contenedor en móviles estrechos

#### ✅ Mejoras implementadas:
- Layout: Sidebar debajo del contenido en móvil (`lg:grid-cols-4` mantiene, pero col-span ajustado)
- Sidebar sticky solo en desktop (`lg:sticky top-24`)
- TinyMCE: Altura dinámica en móvil (min 200px)
- Botones: Full-width en móvil, inline en desktop

---

### 3. Gestor de Lecciones (`LessonsManager`)

#### ✅ Lo que funciona bien:
- Acordeones para expandir/colapsar lecciones
- Iconos claros para acciones

#### 🔴 Problemas detectados:
- **Header de lección:** Muchos elementos en una sola fila (grip, título, duración, badges, flechas, delete)
- **Grid de duración:** 2 columnas puede ser estrecho en móvil
- **Video/Audio inputs:** Grid de 4 columnas (select + input 3 cols) puede desbordar
- **Recursos:** Inputs en fila horizontal pueden ser estrechos

#### ✅ Mejoras implementadas:
- Header: Layout flexible con wrap, priorizar título
- Grid de duración: `grid-cols-1 sm:grid-cols-2`
- Video/Audio: Layout vertical en móvil (`grid-cols-1 sm:grid-cols-4`)
- Recursos: Layout vertical en móvil, horizontal en desktop
- Input de título: `text-sm sm:text-base` para mejor legibilidad

---

### 4. Página de Curso (Estudiante) (`/cursos/mi-escuela/[cursoId]`)

#### ✅ Lo que funciona bien:
- Header con progreso
- Video responsive con `aspect-video`
- Tabs para contenido

#### 🔴 Problemas detectados:
- **Layout:** Sidebar de lecciones puede ser difícil de acceder en móvil (scroll vertical largo)
- **Sidebar sticky:** Ocupa espacio y puede cubrir contenido
- **Tabs:** 4 tabs horizontales pueden ser estrechos (<350px)
- **Tooltip de lecciones bloqueadas:** Sale fuera de pantalla en móvil (usa `left-full`)
- **Botón "Marcar como completada":** Puede ser pequeño en móvil
- **Header:** Muchos elementos en una sola línea puede apretar

#### ✅ Mejoras implementadas:
- Layout: Sidebar debajo del contenido principal en móvil (`lg:grid-cols-3`)
- Sidebar: No sticky en móvil, sticky solo en desktop (`lg:sticky`)
- Tabs: Scroll horizontal en móvil si son muchos
- Tooltip: Posición adaptativa (abajo en móvil, lateral en desktop)
- Botón completar: `py-3 sm:py-4`, texto `text-sm sm:text-base`
- Header: Layout flexible con wrap para estadísticas

---

## 🛠️ Clases Tailwind CSS Clave para Móvil

### Breakpoints de Tailwind:
```
sm: 640px   (móviles grandes, tablets pequeñas)
md: 768px   (tablets)
lg: 1024px  (desktop pequeño)
xl: 1280px  (desktop grande)
```

### Patrones Comunes:

#### Grid Responsivo:
```jsx
// Móvil: 1 columna, Desktop: 4 columnas
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

#### Padding/Spacing Responsivo:
```jsx
// Menos padding en móvil, más en desktop
className="p-4 sm:p-6 lg:p-8"
```

#### Texto Responsivo:
```jsx
// Texto más pequeño en móvil
className="text-sm sm:text-base lg:text-lg"
```

#### Flex con Wrap:
```jsx
// Items en fila en desktop, apilados en móvil
className="flex flex-col sm:flex-row gap-4"
```

#### Sticky Condicional:
```jsx
// Sticky solo en desktop
className="lg:sticky lg:top-24"
```

#### Overflow Horizontal con Indicador:
```jsx
<div className="overflow-x-auto">
  <div className="min-w-max">
    {/* Contenido ancho */}
  </div>
</div>
```

---

## ✅ Checklist de Testing Móvil

### Dispositivos a testear:
- [ ] iPhone SE (375x667) - Móvil pequeño
- [ ] iPhone 12/13 (390x844) - Móvil estándar
- [ ] iPhone 14 Pro Max (430x932) - Móvil grande
- [ ] iPad Mini (768x1024) - Tablet pequeña
- [ ] iPad Pro (1024x1366) - Tablet grande

### Funcionalidades críticas:
- [ ] **Admin:** Crear curso completo desde móvil
- [ ] **Admin:** Editar lecciones con TinyMCE en móvil
- [ ] **Admin:** Reordenar lecciones (táctil)
- [ ] **Admin:** Ver tabla de cursos y usar filtros
- [ ] **Estudiante:** Ver lección con video en móvil
- [ ] **Estudiante:** Marcar lección como completada
- [ ] **Estudiante:** Navegar entre lecciones
- [ ] **Estudiante:** Ver tooltip de lecciones bloqueadas

### Aspectos UX:
- [ ] Botones táctiles (min 44x44px)
- [ ] Inputs legibles (font-size ≥ 16px para evitar zoom iOS)
- [ ] Sin scroll horizontal involuntario
- [ ] Modals y tooltips visibles en viewport
- [ ] Tiempos de carga razonables (<3s en 3G)

---

## 🚀 Próximos Pasos

1. **Implementar mejoras en archivos clave**
2. **Testear en dispositivos reales**
3. **Optimizar imágenes y assets para móvil**
4. **Considerar gestos táctiles** (swipe para cambiar lección, pull-to-refresh, etc.)
5. **Progressive Web App (PWA)** - Permitir instalación en home screen

---

## 📝 Notas Técnicas

### Consideraciones iOS:
- Inputs con `font-size < 16px` causan auto-zoom → usar `text-base` (16px) mínimo
- Safari móvil tiene barra de herramientas que cambia altura del viewport → usar `dvh` en lugar de `vh` cuando esté disponible
- Sticky positioning puede ser buggy en Safari < 14

### Consideraciones Android:
- Chrome móvil tiene mejor soporte de CSS moderno
- Teclado virtual puede cubrir inputs → asegurar scroll automático
- Algunos dispositivos tienen densidad de píxeles muy alta → optimizar assets

### Herramientas de Testing:
- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- BrowserStack / LambdaTest (testing real)
- Lighthouse (performance móvil)

---

**Última actualización:** 2026-01-06  
**Estado:** En implementación  
**Responsable:** Sistema de Cursos Hakadogs
