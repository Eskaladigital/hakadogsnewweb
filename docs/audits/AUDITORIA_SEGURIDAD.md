# 🔒 AUDITORÍA DE SEGURIDAD - HAKADOGS

**Fecha:** 2026-01-06  
**Objetivo:** Proteger el contenido de los cursos contra acceso no autorizado

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### ❌ **CRÍTICO 1: NO HAY ROW LEVEL SECURITY (RLS) EN LAS TABLAS**

**Estado actual:** ❌ **VULNERABLE**

Las siguientes tablas NO tienen RLS activado:
- `courses` - Cualquiera puede leer/modificar
- `course_lessons` - **EL CONTENIDO ESTÁ EXPUESTO**
- `course_resources` - Recursos descargables accesibles
- `user_lesson_progress` - Cualquiera puede ver progreso de otros
- `course_purchases` - Cualquiera puede ver compras
- `user_course_progress` - Progreso expuesto

**Impacto:**
```javascript
// Un hacker puede hacer esto desde la consola:
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('TU_URL', 'TU_ANON_KEY')

// ¡ROBAR TODO EL CONTENIDO!
const { data } = await supabase
  .from('course_lessons')
  .select('*')
// ¡Tiene acceso a TODAS las lecciones, videos, contenido HTML!

const { data: resources } = await supabase
  .from('course_resources')
  .select('*')
// ¡Puede descargar TODOS los PDFs y recursos!
```

---

### ❌ **CRÍTICO 2: API ROUTES SIN PROTECCIÓN**

**Archivos en riesgo:**
- `app/api/generate-description/route.ts` - Usa OpenAI, expone API key

**Problema:**
```bash
# Cualquiera puede hacer esto:
curl -X POST https://hakadogsnewweb.vercel.app/api/generate-description \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","whatYouLearn":[]}'

# ¡Gastará tu cuenta de OpenAI!
```

---

### ❌ **CRÍTICO 3: FUNCIONES DE SUPABASE SIN VERIFICACIÓN DE ROL**

**Archivo:** `lib/supabase/courses.ts`

Todas estas funciones NO verifican permisos:
- `createCourse()` - ❌ No verifica si es admin
- `updateCourse()` - ❌ No verifica si es admin  
- `deleteCourse()` - ❌ No verifica si es admin
- `createLesson()` - ❌ No verifica si es admin
- `updateLesson()` - ❌ No verifica si es admin
- `deleteLesson()` - ❌ No verifica si es admin
- `getCourseLessons()` - ❌ Devuelve TODO el contenido sin verificar si lo compró

**Un usuario normal puede hacer:**
```javascript
import { deleteCourse } from '@/lib/supabase/courses'
await deleteCourse('cualquier-id') // ¡BOOM! Curso eliminado
```

---

### ⚠️ **MEDIO 4: MIDDLEWARE INÚTIL**

**Archivo:** `middleware.ts`

El middleware actual NO hace NADA:
```typescript
export async function middleware(req: NextRequest) {
  // Solo deja pasar, NO verifica nada
  return NextResponse.next()
}
```

**Debería:**
- Verificar sesión válida
- Verificar rol de admin para `/administrator`
- Bloquear acceso a cursos no comprados

---

### ⚠️ **MEDIO 5: CONTENIDO HTML ALMACENADO EN TEXTO PLANO**

Las lecciones guardan HTML en `content` (TEXT):
- ✅ Bueno: TinyMCE permite formato rico
- ❌ Malo: El contenido está en claro en la base de datos
- ❌ Peor: Sin RLS, cualquiera lo puede leer

---

## ✅ ASPECTOS POSITIVOS (LO QUE SÍ ESTÁ BIEN)

1. ✅ **Autenticación de Supabase** - Usa `auth.users` correctamente
2. ✅ **Storage con políticas** - `course-resources` requiere compra para leer
3. ✅ **Verificación en componentes** - Las páginas verifican `getSession()`
4. ✅ **Cascading deletes** - `ON DELETE CASCADE` protege integridad
5. ✅ **No hay datos sensibles en client-side** - API keys en variables de entorno
6. ✅ **HTTPS en producción** - Vercel usa SSL automático

---

## 🛡️ SOLUCIONES REQUERIDAS (PRIORIDAD ALTA)

### 1️⃣ **IMPLEMENTAR RLS EN TODAS LAS TABLAS**

**Archivo a crear:** `supabase/security_policies.sql`

```sql
-- =============================================
-- ACTIVAR RLS EN TODAS LAS TABLAS
-- =============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA: courses
-- =============================================

-- Lectura: Solo cursos publicados (público) o todos (admin)
CREATE POLICY "courses_read_published"
ON courses FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "courses_read_all_admin"
ON courses FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Escritura: Solo admin
CREATE POLICY "courses_insert_admin"
ON courses FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "courses_update_admin"
ON courses FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "courses_delete_admin"
ON courses FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- POLÍTICAS PARA: course_lessons (CRÍTICO)
-- =============================================

-- Lectura: Solo si compraste el curso O es admin O es preview gratuita
CREATE POLICY "lessons_read_purchased"
ON course_lessons FOR SELECT
TO authenticated
USING (
  -- Es admin
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  -- Es preview gratuita
  is_free_preview = true
  OR
  -- Compró el curso
  EXISTS (
    SELECT 1 FROM course_purchases cp
    WHERE cp.user_id = auth.uid()
    AND cp.course_id = course_lessons.course_id
    AND cp.payment_status = 'completed'
  )
  OR
  -- El curso es gratuito
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_lessons.course_id
    AND c.is_free = true
    AND c.is_published = true
  )
);

-- Lectura pública solo de previews gratuitas (para página de curso)
CREATE POLICY "lessons_read_free_preview_public"
ON course_lessons FOR SELECT
TO public
USING (is_free_preview = true);

-- Escritura: Solo admin
CREATE POLICY "lessons_insert_admin"
ON course_lessons FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "lessons_update_admin"
ON course_lessons FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "lessons_delete_admin"
ON course_lessons FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- POLÍTICAS PARA: course_resources
-- =============================================

-- Lectura: Solo si compraste el curso O es admin
CREATE POLICY "resources_read_purchased"
ON course_resources FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  EXISTS (
    SELECT 1 FROM course_purchases cp
    JOIN course_lessons cl ON cl.course_id = cp.course_id
    WHERE cp.user_id = auth.uid()
    AND cl.id = course_resources.lesson_id
    AND cp.payment_status = 'completed'
  )
);

-- Escritura: Solo admin
CREATE POLICY "resources_insert_admin"
ON course_resources FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "resources_update_admin"
ON course_resources FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "resources_delete_admin"
ON course_resources FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- POLÍTICAS PARA: user_lesson_progress
-- =============================================

-- Solo puedes ver/editar tu propio progreso (o admin ve todo)
CREATE POLICY "progress_read_own"
ON user_lesson_progress FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "progress_insert_own"
ON user_lesson_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_update_own"
ON user_lesson_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =============================================
-- POLÍTICAS PARA: course_purchases
-- =============================================

-- Solo puedes ver tus propias compras (o admin ve todo)
CREATE POLICY "purchases_read_own"
ON course_purchases FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "purchases_insert_own"
ON course_purchases FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Solo admin puede modificar/eliminar compras
CREATE POLICY "purchases_update_admin"
ON course_purchases FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "purchases_delete_admin"
ON course_purchases FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- POLÍTICAS PARA: user_course_progress
-- =============================================

-- Solo puedes ver tu propio progreso (o admin ve todo)
CREATE POLICY "course_progress_read_own"
ON user_course_progress FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "course_progress_insert_own"
ON user_course_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "course_progress_update_own"
ON user_course_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

### 2️⃣ **PROTEGER API ROUTE DE OPENAI**

**Modificar:** `app/api/generate-description/route.ts`

```typescript
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    // 🔒 VERIFICAR AUTENTICACIÓN
    const supabase = createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 🔒 VERIFICAR ROL DE ADMIN
    const userRole = session.user.user_metadata?.role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden generar descripciones' },
        { status: 403 }
      )
    }

    // 🔒 RATE LIMITING (opcional pero recomendado)
    // Limitar a 10 generaciones por hora por usuario
    const userId = session.user.id
    // Implementar lógica de rate limiting aquí

    const { title, whatYouLearn } = await request.json()
    
    // Resto del código...
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}
```

---

### 3️⃣ **MEJORAR MIDDLEWARE**

**Modificar:** `middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // Crear cliente de Supabase para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 🔒 PROTEGER RUTAS DE ADMINISTRADOR
  if (path.startsWith('/administrator')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/cursos/auth/login?redirect=/administrator', req.url))
    }

    const userRole = session.user.user_metadata?.role
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/cursos/mi-escuela', req.url))
    }
  }

  // 🔒 PROTEGER RUTAS DE MI ESCUELA
  if (path.startsWith('/cursos/mi-escuela')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/cursos/auth/login?redirect=/cursos/mi-escuela', req.url))
    }
  }

  // 🔒 PROTEGER RUTAS DE COMPRA
  if (path.startsWith('/cursos/comprar')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/cursos/auth/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/administrator/:path*',
    '/cursos/mi-escuela/:path*',
    '/cursos/comprar/:path*'
  ]
}
```

---

### 4️⃣ **VERIFICAR COMPRA ANTES DE MOSTRAR CONTENIDO**

**Modificar:** `app/cursos/mi-escuela/[cursoId]/page.tsx`

Añadir verificación al inicio:

```typescript
useEffect(() => {
  const loadCourse = async () => {
    try {
      // 1. Obtener sesión
      const { data: sessionData } = await getSession()
      if (!sessionData?.session) {
        router.push('/cursos/auth/login')
        return
      }

      const userId = sessionData.session.user.id

      // 2. Obtener curso
      const courseData = await getCourseById(params.cursoId)
      setCourse(courseData)

      // 3. 🔒 VERIFICAR SI LO COMPRÓ (si no es gratuito)
      if (!courseData.is_free) {
        const purchased = await hasPurchasedCourse(userId, params.cursoId)
        if (!purchased) {
          // Redirigir a página de compra
          router.push(`/cursos/comprar/${params.cursoId}`)
          return
        }
      }

      // Resto del código...
    } catch (error) {
      console.error('Error:', error)
    }
  }

  loadCourse()
}, [params.cursoId])
```

---

## 📊 RESUMEN DE VULNERABILIDADES

| Vulnerabilidad | Severidad | Impacto | Estado |
|---|---|---|---|
| Tablas sin RLS | 🔴 **CRÍTICO** | Robo total de contenido | ❌ Por resolver |
| API sin autenticación | 🔴 **CRÍTICO** | Gasto de OpenAI, spam | ❌ Por resolver |
| Middleware inútil | 🟠 **ALTO** | Acceso no autorizado | ❌ Por resolver |
| Sin verificar compra | 🟠 **ALTO** | Ver cursos sin pagar | ❌ Por resolver |
| Contenido en claro | 🟡 **MEDIO** | Fácil de leer en DB | ⚠️ Aceptable |

---

## ✅ PASOS SIGUIENTES

1. **URGENTE** - Ejecutar `security_policies.sql` en Supabase
2. **URGENTE** - Actualizar API route con autenticación
3. **IMPORTANTE** - Mejorar middleware
4. **IMPORTANTE** - Añadir verificación de compra en páginas
5. **OPCIONAL** - Implementar rate limiting
6. **OPCIONAL** - Logs de auditoría para acciones de admin

---

## 🎯 RESULTADO ESPERADO DESPUÉS DE IMPLEMENTAR

- ✅ Un usuario sin cuenta NO puede ver lecciones
- ✅ Un usuario con cuenta NO puede ver lecciones que no compró
- ✅ Un usuario NO puede usar la API de OpenAI
- ✅ Un usuario NO puede modificar/eliminar cursos
- ✅ Un usuario NO puede ver el progreso de otros
- ✅ Un usuario NO puede ver las compras de otros
- ✅ Solo el ADMIN puede crear/editar/eliminar cursos
- ✅ El contenido de las lecciones está 100% protegido

---

**Estado:** 🔴 **VULNERABLE - REQUIERE ACCIÓN INMEDIATA**
