-- =====================================================
-- SCRIPT: Limpiar Slugs de Artículos del Blog
-- Descripción: Elimina números innecesarios de los slugs
-- =====================================================

-- IMPORTANTE: Este script actualiza SOLO los slugs que comienzan con números
-- seguidos de guión (ej: "5-ejercicios..." → "ejercicios...")

-- =====================================================
-- PASO 1: Ver slugs actuales que serían afectados
-- =====================================================

SELECT 
  id,
  title,
  slug as slug_actual,
  regexp_replace(slug, '^[0-9]+-', '') as slug_nuevo
FROM blog_posts
WHERE slug ~ '^[0-9]+-'
ORDER BY created_at DESC;

-- =====================================================
-- PASO 2: Backup de seguridad (EJECUTAR PRIMERO)
-- =====================================================

-- Crear tabla temporal con backup
CREATE TEMP TABLE blog_posts_backup_slugs AS
SELECT id, slug, updated_at
FROM blog_posts
WHERE slug ~ '^[0-9]+-';

-- Verificar backup
SELECT COUNT(*) as posts_en_backup FROM blog_posts_backup_slugs;

-- =====================================================
-- PASO 3: Actualizar slugs (REVISAR ANTES DE EJECUTAR)
-- =====================================================

-- ⚠️ ADVERTENCIA: Esto modificará los slugs permanentemente
-- Asegúrate de haber creado el backup primero

UPDATE blog_posts
SET 
  slug = regexp_replace(slug, '^[0-9]+-', ''),
  updated_at = NOW()
WHERE slug ~ '^[0-9]+-';

-- =====================================================
-- PASO 4: Verificar cambios
-- =====================================================

SELECT 
  bp.id,
  bp.title,
  bpb.slug as slug_anterior,
  bp.slug as slug_nuevo,
  bp.updated_at
FROM blog_posts bp
JOIN blog_posts_backup_slugs bpb ON bp.id = bpb.id
ORDER BY bp.updated_at DESC;

-- =====================================================
-- PASO 5: Restaurar si hay problemas (SOLO EN CASO DE ERROR)
-- =====================================================

-- Si algo salió mal, restaurar desde el backup:
-- UPDATE blog_posts bp
-- SET 
--   slug = bpb.slug,
--   updated_at = bpb.updated_at
-- FROM blog_posts_backup_slugs bpb
-- WHERE bp.id = bpb.id;

-- =====================================================
-- CASOS ESPECIALES: Números que SÍ deben mantenerse
-- =====================================================

-- Si algunos slugs con números son válidos (ej: "top-10-razas"),
-- puedes restaurarlos individualmente:

-- UPDATE blog_posts
-- SET slug = 'top-10-razas-mas-inteligentes'
-- WHERE id = 'ID_DEL_POST';

-- =====================================================
-- ESTADÍSTICAS POST-MIGRACIÓN
-- =====================================================

SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN slug ~ '^[0-9]+-' THEN 1 END) as con_numero_inicio,
  COUNT(CASE WHEN slug !~ '^[0-9]+-' THEN 1 END) as sin_numero_inicio
FROM blog_posts
WHERE status = 'published';

-- =====================================================
-- REDIRECCIONES: Generar código Next.js
-- =====================================================

-- Este query genera el código de redirecciones para middleware.ts
-- Copia el resultado y pégalo en tu archivo middleware.ts

SELECT 
  '  { source: "/blog/' || bpb.slug || '", destination: "/blog/' || bp.slug || '", permanent: true },' as redirect_rule
FROM blog_posts bp
JOIN blog_posts_backup_slugs bpb ON bp.id = bpb.id
WHERE bp.slug != bpb.slug
ORDER BY bp.created_at DESC;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. EJECUTA ESTE SCRIPT EN ESTE ORDEN:
   - Paso 1: Ver cambios propuestos
   - Paso 2: Crear backup
   - Paso 3: Actualizar slugs
   - Paso 4: Verificar que todo está bien
   - Paso 5: Solo si hay problemas

2. REDIRECCIONES 301:
   - Si tus artículos ya están publicados y tienen tráfico
   - DEBES crear redirecciones 301
   - Usa el query final para generar el código

3. CASOS ESPECIALES:
   - Si el número es parte del contenido ("10 mandamientos")
   - Restaura manualmente esos slugs específicos
   - O exclúyelos del WHERE con: AND slug NOT LIKE 'top-10-%'

4. ALTERNATIVA SEGURA:
   - Si prefieres hacerlo manualmente, usa el Paso 1
   - Y actualiza uno por uno desde el panel de administración
   - /administrator/blog

5. SITEMAP:
   - Después de actualizar, regenera tu sitemap.xml
   - Para que los buscadores indexen las nuevas URLs
*/

-- =====================================================
-- EJEMPLO DE MIDDLEWARE.TS CON REDIRECCIONES
-- =====================================================

/*
// En tu archivo middleware.ts, añade:

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirecciones de slugs antiguos a nuevos
  const blogRedirects: Record<string, string> = {
    '/blog/5-ejercicios-basicos-cachorro': '/blog/ejercicios-basicos-cachorro',
    '/blog/10-consejos-adiestramiento': '/blog/consejos-adiestramiento',
    // ... más redirecciones generadas por el query
  }

  if (blogRedirects[pathname]) {
    return NextResponse.redirect(
      new URL(blogRedirects[pathname], request.url),
      { status: 301 } // 301 = Permanent redirect (preserva SEO)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/blog/:path*',
}
*/
