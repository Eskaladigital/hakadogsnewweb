# 🔧 Solución Completa: Errores de Imágenes y TinyMCE

## 📋 Resumen de Errores Encontrados

### 1. ❌ Imágenes de Pexels (400 Bad Request)
**Causa**: Intentas usar imágenes externas de Pexels, pero Next.js no puede optimizarlas.

### 2. ⚠️ Permissions-Policy Header Warning
**Causa**: El header incluía `ambient-light-sensor` que algunos navegadores no reconocen.

### 3. ❌ TinyMCE CORS Error (502 Bad Gateway)
**Causa**: TinyMCE CDN tiene problemas temporales de conexión o CORS.

---

## ✅ SOLUCIÓN 1: Configurar next.config.js

### ¿Qué hice?

Actualicé `next.config.js` para:

1. **Permitir imágenes de Supabase Storage** (tu bucket `blog-images` y `course-images`)
2. **Quitar `ambient-light-sensor`** del Permissions-Policy
3. **Usar `remotePatterns`** (método moderno) en lugar de `domains` (obsoleto)

### Cambios aplicados:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pfmqkioftagjnxqyrngk.supabase.co', // Tu Supabase Storage
      port: '',
      pathname: '/storage/v1/object/public/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com', // Unsplash (backup)
      port: '',
      pathname: '/**',
    },
  ],
  // ... resto de config
}
```

---

## ✅ SOLUCIÓN 2: Usar Imágenes de Supabase Storage

### ¿Por qué?

- ✅ **Curso images**: Ya funcionan porque están en Supabase Storage
- ❌ **Blog images**: Usan URLs externas (Pexels) → Error 400
- 🎯 **Solución**: Subir todas las imágenes del blog a Supabase Storage

### Pasos a seguir:

#### 1. Ejecutar el script SQL para crear el bucket

Ya tienes el archivo `supabase/setup_blog_images_bucket.sql`. Ejecútalo en Supabase SQL Editor:

```sql
-- Este script crea el bucket 'blog-images' con las políticas correctas
```

#### 2. Subir imágenes manualmente desde el administrador

1. Ve a: `https://www.hakadogs.com/administrator/blog/nuevo`
2. Haz clic en **"Seleccionar Imagen"**
3. Se abre la **Biblioteca de Medios**
4. Haz clic en **"Subir Imágenes"**
5. Selecciona una imagen desde tu PC
6. La imagen se sube a `blog-images` en Supabase Storage
7. URL resultante: `https://pfmqkioftagjnxqyrngk.supabase.co/storage/v1/object/public/blog-images/[nombre].jpg`

#### 3. Editar artículos existentes

Para cada artículo del blog que tiene imágenes de Pexels:

1. Ve a `/administrator/blog` → Lista de artículos
2. Haz clic en **Editar** en cada artículo
3. En la sección **"Imagen Destacada"**:
   - Si hay una imagen de Pexels → Haz clic en la **X roja** para eliminarla
   - Haz clic en **"Seleccionar Imagen"**
   - Sube una nueva imagen o selecciona una existente
4. Guarda los cambios

---

## ✅ SOLUCIÓN 3: Error de TinyMCE (502 Bad Gateway)

### ¿Qué es?

TinyMCE es el editor de texto enriquecido que usas en el blog para escribir artículos.

### Causa del Error

El CDN de TinyMCE (`cdn.tiny.cloud`) está teniendo problemas temporales:
- **502 Bad Gateway** → El servidor CDN no responde
- **CORS Error** → Falta el header `Access-Control-Allow-Origin`

### Soluciones:

#### Opción A: Esperar (Temporal)
El CDN de TinyMCE a veces tiene problemas temporales. Espera 5-10 minutos y recarga la página.

#### Opción B: Verificar tu API Key
Tu API key de TinyMCE es: `zrk3s1w79rec2a3r59r0li1sejv9ou010c726epw91pen7kc`

1. Ve a: https://www.tiny.cloud/my-account/dashboard/
2. Verifica que tu dominio esté autorizado:
   - `https://www.hakadogs.com`
   - `http://localhost:3000` (para desarrollo)

#### Opción C: Cambiar a TinyMCE Self-Hosted (Avanzado)
Si el problema persiste, puedes instalar TinyMCE localmente:

```bash
npm install tinymce
```

Y cambiar el componente `TinyMCEEditor` para usar la versión local en lugar del CDN.

---

## 📊 Comparación: URLs Externas vs Supabase Storage

| Aspecto | URLs Externas (Pexels/Unsplash) | Supabase Storage |
|---------|----------------------------------|------------------|
| **Velocidad** | ❌ Lento (depende de CDN externo) | ✅ Rápido (tu infraestructura) |
| **Optimización Next.js** | ❌ Puede fallar (400 errors) | ✅ Funciona perfectamente |
| **Control** | ❌ Depende del servicio externo | ✅ Control total |
| **Costos** | ✅ Gratis | 💰 Según plan Supabase |
| **Caché** | ❌ Complejo | ✅ Next.js lo maneja |
| **CORS** | ❌ Puede dar problemas | ✅ Sin problemas |

---

## 🎯 Plan de Acción Inmediato

### 1. ✅ Ya hecho:
- [x] Actualizado `next.config.js` para permitir Supabase Storage
- [x] Eliminado `ambient-light-sensor` del Permissions-Policy
- [x] Creado script SQL para bucket `blog-images`

### 2. 🔄 Debes hacer tú:

#### A. Ejecutar SQL (5 minutos)
1. Ir a Supabase Dashboard → SQL Editor
2. Copiar contenido de `supabase/setup_blog_images_bucket.sql`
3. Ejecutar el script
4. Verificar que el bucket `blog-images` existe en **Storage**

#### B. Desplegar cambios de next.config.js (Automático)
1. Los cambios ya están en el código
2. Al hacer commit y push, Vercel redesplega automáticamente
3. Los errores 400 de Pexels desaparecerán para nuevas imágenes

#### C. Reemplazar imágenes de Pexels (10-30 minutos)
Para cada artículo del blog:
1. Ir a `/administrator/blog`
2. Editar artículo
3. Eliminar imagen de Pexels
4. Subir nueva imagen desde tu PC
5. Guardar

---

## 🔍 Verificación

### Después de aplicar la solución, verifica:

1. **No más errores 400**:
   - Abre la consola del navegador (F12)
   - Navega al blog: `https://www.hakadogs.com/blog`
   - No deberías ver errores `GET /_next/image?url=https://images.pexels.com...`

2. **No más warning de Permissions-Policy**:
   - En la consola, no debería aparecer: `Unrecognized feature: 'ambient-light-sensor'`

3. **TinyMCE funciona**:
   - Ve a `/administrator/blog/nuevo`
   - El editor de texto enriquecido debe cargar sin errores 502

4. **Imágenes se optimizan correctamente**:
   - Las imágenes del blog cargan rápido
   - Next.js las optimiza automáticamente (AVIF/WebP)
   - URLs son del tipo: `https://pfmqkioftagjnxqyrngk.supabase.co/storage/...`

---

## 📝 Resumen de Archivos Modificados

### Archivos modificados en este commit:
- ✅ `next.config.js` → Configuración de imágenes actualizada
- ✅ `supabase/setup_blog_images_bucket.sql` → Script para bucket (ya existía)
- ✅ `docs/FIX_BLOG_IMAGES_UPLOAD.md` → Guía de configuración (ya existía)

### Scripts disponibles:
- `scripts/fix-pexels-images.js` → Script para reemplazar Pexels con Unsplash (opcional, mejor subir a Supabase)

---

## 🆘 Troubleshooting

### Error persiste después de desplegar

1. **Limpia la caché del navegador**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. **Verifica que Vercel redesplego**: Ve a Vercel Dashboard → Deployments
3. **Espera 2-3 minutos**: A veces Vercel tarda en propagar cambios

### TinyMCE sigue con error 502

1. **Verifica tu conexión a internet**: El CDN requiere conexión estable
2. **Prueba en incógnito**: Puede ser un problema de caché
3. **Espera 10 minutos**: El CDN a veces tiene caídas temporales

### Las imágenes no se suben al bucket

1. **Verifica que ejecutaste el SQL**: Ve a Storage → Debería existir `blog-images`
2. **Verifica tus permisos**: Asegúrate de tener rol `admin` en `user_roles`
3. **Revisa las políticas RLS**: Deben existir 4 políticas (INSERT, UPDATE, DELETE, SELECT)

---

**Última actualización**: 28 de enero de 2026  
**Estado**: ✅ Configuración aplicada, pendiente deploy + configuración SQL
