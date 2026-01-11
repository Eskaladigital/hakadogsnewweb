# 📰 BLOG PROFESIONAL - HAKADOGS

**Versión**: 2.1.0  
**Fecha**: Enero 2026  
**Estado**: ✅ **COMPLETADO Y DESPLEGADO**

---

## 🎯 RESUMEN

Sistema completo de blog profesional con diseño tipo marketing digital, gestión avanzada de contenido y Media Library integrada.

---

## 🎨 DISEÑO FRONTEND

### Layout Profesional de 2 Columnas

#### **Página Principal** (`/blog`)

**Hero Compacto:**
- Título: "Blog de Educación Canina"
- Subtítulo descriptivo
- Sin ocupar mucho espacio vertical

**Artículo Destacado Principal:**
- Card grande con diseño 2 columnas (imagen izquierda, contenido derecha)
- Badge "Artículo Destacado" con estrella dorada
- Imagen destacada con hover zoom effect
- Título grande (H2)
- Excerpt de 3 líneas
- Metadata completa: fecha, tiempo lectura, vistas
- Botón "Leer artículo completo" con flecha animada

**Layout 2 Columnas:**

```
┌──────────────────────────────────────────────────────────────┐
│                     HERO COMPACTO                            │
├──────────────────────────────────────────────────────────────┤
│              ARTÍCULO DESTACADO PRINCIPAL                    │
├────────────────────────────────┬─────────────────────────────┤
│   COLUMNA PRINCIPAL (66%)      │   SIDEBAR (33%) - STICKY    │
│                                │                             │
│   ┌─────────────────────────┐  │  ┌──────────────────────┐  │
│   │  Artículo 1             │  │  │ 🔍 BÚSQUEDA          │  │
│   │  [Imagen | Contenido]   │  │  └──────────────────────┘  │
│   └─────────────────────────┘  │                             │
│                                │  ┌──────────────────────┐  │
│   ┌─────────────────────────┐  │  │ 🏷️ CATEGORÍAS       │  │
│   │  Artículo 2             │  │  │  Todas (12)          │  │
│   │  [Imagen | Contenido]   │  │  │  Educación (5)       │  │
│   └─────────────────────────┘  │  │  Salud (3)           │  │
│                                │  │  Nutrición (2)       │  │
│   ┌─────────────────────────┐  │  │  Comportamiento (2)  │  │
│   │  Artículo 3             │  │  └──────────────────────┘  │
│   │  [Imagen | Contenido]   │  │                             │
│   └─────────────────────────┘  │  ┌──────────────────────┐  │
│                                │  │ 📈 MÁS POPULARES     │  │
│   ... más artículos ...        │  │  1. Artículo X       │  │
│                                │  │  2. Artículo Y       │  │
│                                │  │  3. Artículo Z       │  │
│                                │  │  4. Artículo W       │  │
│                                │  │  5. Artículo V       │  │
│                                │  └──────────────────────┘  │
│                                │                             │
│                                │  ┌──────────────────────┐  │
│                                │  │ 💚 CTA CURSOS        │  │
│                                │  │  "¿Quieres aprender  │  │
│                                │  │   más?"              │  │
│                                │  └──────────────────────┘  │
└────────────────────────────────┴─────────────────────────────┘
```

### **Columna Principal (Izquierda - 66%)**

**Cards de Artículos:**
- Formato horizontal: Imagen (256px ancho) + Contenido (derecha)
- Imagen con aspect ratio mantenido y overflow hidden
- Hover: zoom de imagen (scale 1.05) + sombra más pronunciada
- Categoría: badge de color con texto blanco
- Título: H3 en negro, hover cambia a color forest
- Excerpt: 2-3 líneas con line-clamp
- Metadata: fecha + tiempo lectura + vistas (iconos lucide)
- Border gris claro (border-gray-100)
- Rounded corners (rounded-xl)

**Responsive:**
- Desktop: imagen izquierda
- Móvil: imagen arriba (vertical stack)

### **Sidebar Derecha (33% - STICKY)**

El sidebar tiene `sticky top-24` para quedarse visible al hacer scroll.

#### **1. Widget Búsqueda** 🔍
```tsx
- Input grande con placeholder "¿Qué buscas?"
- Botón con gradiente forest-sage
- Icono de búsqueda
- Loading spinner cuando busca
- Botón "Limpiar búsqueda" (cuando hay filtros activos)
```

#### **2. Widget Categorías** 🏷️
```tsx
- Título "Categorías" con icono Tag
- Botón "Todas las categorías" con contador total
- Lista de categorías:
  * Fondo gris claro (hover: más oscuro)
  * Seleccionada: color de la categoría + texto blanco
  * Contador de posts a la derecha (badge redondeado)
  * Colores personalizados por categoría
```

#### **3. Widget Artículos Populares** 📈
```tsx
- Título "Más Populares" con icono TrendingUp
- Top 5 artículos ordenados por vistas:
  * Número (1-5) en círculo verde
  * Título (line-clamp-2)
  * Contador de vistas con icono Eye
  * Hover: fondo gris claro
```

#### **4. Widget CTA** 💚
```tsx
- Fondo gradiente forest-sage
- Título "¿Quieres aprender más?"
- Descripción breve
- Botón blanco "Ver Cursos"
- Sombra pronunciada (shadow-lg)
```

---

## 🔧 GESTIÓN DE CONTENIDO (Panel Admin)

### Sistema de Gestión Completo

#### **Arquitectura de Páginas Dedicadas** (estilo WordPress/Joomla)

**Antes** ❌:
```
/administrator/blog
  └─ Modal para crear/editar (limitado, incómodo)
```

**Ahora** ✅:
```
/administrator/blog
  ├─ página principal (tabla de artículos)
  ├─ /nuevo (página completa para crear)
  └─ /editar/[postId] (página completa para editar)
```

### **Página Principal** (`/administrator/blog`)

**Tabla de Artículos:**
- Columnas: Título, Categoría, Estado, Fecha, Vistas
- Búsqueda por título
- Filtros por:
  * Estado (Todos, Publicado, Borrador)
  * Categoría
- Acciones por fila:
  * Botón "Editar" → Link a `/administrator/blog/editar/[postId]`
  * Botón "Ver" (solo si publicado)
  * Botón "Eliminar"
- Botón destacado "Crear Nuevo Artículo" → Link a `/administrator/blog/nuevo`
- Paginación
- Estadísticas: total artículos, publicados, borradores

### **Crear Nuevo Artículo** (`/administrator/blog/nuevo`)

**Formulario Completo:**

```tsx
┌────────────────────────────────────────────┐
│  CREAR NUEVO ARTÍCULO                      │
├────────────────────────────────────────────┤
│                                            │
│  📝 Título *                               │
│  [input text]                              │
│                                            │
│  🔗 Slug (generado automáticamente)        │
│  [input text - readonly al escribir título]│
│                                            │
│  🏷️ Categoría *                            │
│  [select con colores]                      │
│                                            │
│  ✍️ Excerpt / Descripción Corta *          │
│  [textarea 2-3 líneas]                     │
│                                            │
│  🖼️ Imagen Destacada                       │
│  [Botón "Seleccionar desde Galería"]      │
│  [Preview de imagen seleccionada]         │
│                                            │
│  📄 Contenido *                            │
│  [Editor TinyMCE - pantalla completa]     │
│                                            │
│  📊 Configuración SEO                      │
│  [input] Meta Description                 │
│  [input] Meta Keywords                     │
│                                            │
│  ⚙️ Opciones                               │
│  [checkbox] Destacar artículo              │
│  [checkbox] Publicar inmediatamente        │
│  [input number] Tiempo lectura (min)       │
│                                            │
│  [Botón "Guardar Borrador"]               │
│  [Botón "Publicar Artículo"]              │
│                                            │
└────────────────────────────────────────────┘
```

**Características:**
- Editor TinyMCE con todas las opciones
- **Media Library integrada** (modal con galería de imágenes)
- Generación automática de slug desde título
- Preview en tiempo real del excerpt
- Validación de campos requeridos
- Toast notifications en guardado
- Auto-save cada 2 minutos (opcional)

### **Editar Artículo** (`/administrator/blog/editar/[postId]`)

**Idéntico a crear, pero:**
- Título: "Editar Artículo"
- Campos pre-rellenados con datos existentes
- Botón adicional "Ver Artículo Publicado" (si está publicado)
- Historial de cambios (opcional, futuro)
- Última modificación: fecha y usuario

---

## 🖼️ MEDIA LIBRARY

### **Modal de Biblioteca de Medios**

**Activación:**
- Desde campo "Imagen Destacada"
- Click en "Seleccionar desde Galería"
- Abre modal fullscreen

**Características:**

```tsx
┌────────────────────────────────────────────────────────────┐
│  BIBLIOTECA DE MEDIOS                          [X Cerrar]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔍 Buscar imágenes... [input]      [📤 Subir Imágenes]   │
│                                                            │
│  [Grid / Lista]  📁 Filtros: Todas | Recientes | Destacadas│
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │   │
│  │ 1   │  │ 2   │  │ 3   │  │ 4   │  │ 5   │  │ 6   │   │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘   │
│                                                            │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │  │ IMG │   │
│  │ 7   │  │ 8   │  │ 9   │  │ 10  │  │ 11  │  │ 12  │   │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Imagen Seleccionada: perro-cachorro.jpg (245 KB)         │
│                                                            │
│  [Cancelar]  [Insertar Imagen]                            │
└────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

1. **Vista Grid/Lista**
   - Grid: 6 columnas, imágenes cuadradas
   - Lista: 1 columna, info detallada

2. **Búsqueda**
   - Buscar por nombre de archivo
   - Filtrado instantáneo

3. **Upload Múltiple**
   - Drag & drop
   - Selección múltiple
   - Progress bar por imagen
   - Validación: solo imágenes, max 5MB

4. **Gestión**
   - Click en imagen → Seleccionar
   - Hover: botón "Eliminar" (solo admins)
   - Info tooltip: nombre, tamaño, fecha

5. **Inserción**
   - Botón "Insertar Imagen" inserta URL en campo
   - Preview actualizado inmediatamente

### **Supabase Storage Setup**

**Bucket:** `blog-images`

**Configuración:**
```sql
-- Bucket settings
- Public: false
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
```

**RLS Policies:**
```sql
-- INSERT: Solo admins pueden subir
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- SELECT: Todos pueden ver (para mostrar en blog público)
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- DELETE: Solo admins pueden eliminar
CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);
```

**Setup Manual:**
1. Ir a Supabase Dashboard → Storage
2. Crear bucket `blog-images` manualmente
3. Configurar: público=false, límite=5MB, tipos=imágenes
4. Ejecutar SQL: `supabase/blog_storage_SOLO_RLS.sql`

---

## 📊 BASE DE DATOS

### **Tabla: blog_posts**

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID REFERENCES blog_categories(id),
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 5,
  meta_description TEXT,
  meta_keywords TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);
```

### **Tabla: blog_categories**

```sql
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#4A7C59',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorías por defecto
INSERT INTO blog_categories (name, slug, color) VALUES
  ('Educación Canina', 'educacion-canina', '#4A7C59'),
  ('Salud y Bienestar', 'salud-bienestar', '#2563EB'),
  ('Nutrición', 'nutricion', '#D97706'),
  ('Comportamiento', 'comportamiento', '#DC2626'),
  ('Razas', 'razas', '#7C3AED');
```

### **Tabla: blog_post_views**

```sql
CREATE TABLE blog_post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_views_post_id ON blog_post_views(post_id);
```

### **RLS Policies**

```sql
-- SELECT: Todos pueden ver posts publicados
CREATE POLICY "Public can view published posts"
ON blog_posts FOR SELECT
TO public
USING (status = 'published');

-- SELECT: Admins pueden ver todos
CREATE POLICY "Admins can view all posts"
ON blog_posts FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- INSERT/UPDATE/DELETE: Solo admins
CREATE POLICY "Admins can manage posts"
ON blog_posts FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);
```

---

## 🚀 FUNCIONALIDADES CLAVE

### ✅ Frontend (Página Pública)

- [x] Layout profesional 2 columnas
- [x] Sidebar sticky con widgets
- [x] Búsqueda en tiempo real
- [x] Filtros por categoría
- [x] Contador de posts por categoría
- [x] Top 5 artículos populares (por vistas)
- [x] Artículo destacado principal
- [x] Cards horizontales con imágenes
- [x] Hover effects elegantes
- [x] Metadata completa (fecha, tiempo, vistas)
- [x] Responsive 100%
- [x] CTA a cursos
- [x] Iconos descriptivos (Lucide)

### ✅ Backend (Panel Admin)

- [x] Páginas dedicadas crear/editar
- [x] Editor TinyMCE completo
- [x] Media Library integrada
- [x] Supabase Storage (`blog-images`)
- [x] Upload múltiple de imágenes
- [x] Búsqueda de imágenes
- [x] Gestión de categorías
- [x] Control publicación (draft/published)
- [x] Artículos destacados
- [x] SEO: slug, excerpt, meta
- [x] Preview antes de publicar
- [x] Auto-generación de slug
- [x] Validación de campos
- [x] Toast notifications
- [x] RLS policies configuradas

---

## 📈 MÉTRICAS Y SEGUIMIENTO

### **Contador de Vistas**

**Implementación:**
```tsx
// Incrementar vista al cargar artículo
useEffect(() => {
  incrementPostView(postId)
}, [postId])
```

**Función:**
```typescript
export async function incrementPostView(postId: string) {
  const { error: viewError } = await supabase
    .from('blog_post_views')
    .insert({
      post_id: postId,
      viewer_ip: await getClientIP(),
      user_agent: navigator.userAgent
    })

  if (!viewError) {
    await supabase.rpc('increment_post_views', { post_id: postId })
  }
}
```

### **Tiempo de Lectura**

**Cálculo automático:**
```typescript
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
```

---

## 🎨 ESTILOS Y DISEÑO

### **Paleta de Colores**

```css
/* Principales */
--forest: #4A7C59       /* Primary, hover links */
--sage: #8FBC8F         /* Gradientes */
--gray-50: #F9FAFB      /* Fondos sidebar */
--gray-100: #F3F4F6     /* Hover states */
--gray-900: #111827     /* Títulos */

/* Categorías (ejemplos) */
--educacion: #4A7C59
--salud: #2563EB
--nutricion: #D97706
--comportamiento: #DC2626
--razas: #7C3AED
```

### **Componentes Clave**

**Card de Artículo:**
```css
.article-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #F3F4F6;
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

**Sidebar Sticky:**
```css
.sidebar {
  position: sticky;
  top: 96px; /* top-24 = 6rem = 96px */
}
```

---

## 🔄 FLUJO DE TRABAJO

### **Crear un Artículo**

1. Admin accede a `/administrator/blog`
2. Click en "Crear Nuevo Artículo"
3. Rellenar formulario:
   - Título (genera slug automáticamente)
   - Seleccionar categoría
   - Escribir excerpt
   - Click "Seleccionar desde Galería" → Media Library
   - Seleccionar imagen destacada
   - Escribir contenido en TinyMCE
   - Configurar opciones (destacado, publicar)
4. Click "Publicar Artículo" o "Guardar Borrador"
5. Toast de confirmación
6. Redirect a lista de artículos

### **Editar un Artículo**

1. Admin accede a `/administrator/blog`
2. Click en "Editar" en fila del artículo
3. Formulario pre-rellenado con datos existentes
4. Modificar campos necesarios
5. Click "Actualizar Artículo"
6. Toast de confirmación
7. Redirect a lista

### **Subir Imágenes**

1. Desde crear/editar artículo
2. Click "Seleccionar desde Galería"
3. Modal Media Library se abre
4. Click "Subir Imágenes"
5. Drag & drop o seleccionar archivos
6. Progress bar por cada imagen
7. Imágenes aparecen en galería
8. Seleccionar una
9. Click "Insertar Imagen"
10. Preview actualizado

---

## 🐛 DEBUGGING Y LOGS

### **Console Logs Útiles**

```typescript
// Carga de artículos
console.log('📰 Loading blog posts...')
console.log('✅ Loaded', posts.length, 'posts')

// Búsqueda
console.log('🔍 Searching for:', searchQuery)
console.log('📊 Found', results.length, 'results')

// Filtro por categoría
console.log('🏷️ Filtering by category:', categoryId)

// Upload de imagen
console.log('📤 Uploading:', file.name)
console.log('✅ Uploaded to:', publicURL)
```

---

## 📝 PRÓXIMAS MEJORAS (Opcionales)

### Fase 2
- [ ] Comentarios en artículos
- [ ] Reacciones (like, love, etc.)
- [ ] Compartir en redes (auto-post)
- [ ] Newsletter subscription
- [ ] Posts relacionados automáticos (IA)
- [ ] Editor Markdown (alternativa a TinyMCE)
- [ ] Programar publicación futura
- [ ] Co-autores múltiples
- [ ] Revisiones y versionado
- [ ] Analytics integrado (tiempo en página, scroll depth)

### Fase 3
- [ ] Multi-idioma (i18n)
- [ ] Podcast integrado (audio artículos)
- [ ] Serie de artículos
- [ ] Artículos premium (solo usuarios registrados)
- [ ] Generación automática de imágenes (DALL-E)
- [ ] Resumen con IA
- [ ] Audio narrado con IA (TTS)

---

## 🎉 ESTADO ACTUAL

### ✅ **100% COMPLETADO**

- ✅ Diseño frontend profesional
- ✅ Layout 2 columnas responsive
- ✅ Sidebar sticky con 4 widgets
- ✅ Sistema completo de gestión admin
- ✅ Páginas dedicadas crear/editar
- ✅ Media Library funcional
- ✅ Supabase Storage configurado
- ✅ Upload múltiple de imágenes
- ✅ RLS policies completas
- ✅ Base de datos optimizada
- ✅ Búsqueda en tiempo real
- ✅ Filtros por categoría
- ✅ Top artículos populares
- ✅ Contador de vistas
- ✅ SEO optimizado
- ✅ Responsive 100%

---

## 📞 SOPORTE

**Documentación relacionada:**
- `README.md` - Documentación principal
- `supabase/blog_storage_SOLO_RLS.sql` - RLS policies
- `supabase/INSTRUCCIONES_BUCKET_BLOG.md` - Setup storage

**Archivos clave:**
- `app/blog/page.tsx` - Página principal
- `app/administrator/blog/` - Gestión admin
- `components/admin/MediaLibrary.tsx` - Biblioteca medios
- `lib/supabase/blog.ts` - API del blog

---

**Versión**: 2.1.0  
**Estado**: ✅ COMPLETADO Y DESPLEGADO  
**Última actualización**: Enero 2026

---

# 📰 ¡Blog profesional listo para publicar contenido de calidad! 🚀
