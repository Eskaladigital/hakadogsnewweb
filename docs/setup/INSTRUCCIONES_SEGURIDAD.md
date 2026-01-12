# 🔐 INSTRUCCIONES PARA IMPLEMENTAR SEGURIDAD

## ⚠️ ESTADO ACTUAL
Tu aplicación tiene **vulnerabilidades críticas** que permiten a cualquier persona:
- ❌ Leer TODAS las lecciones de los cursos sin comprarlos
- ❌ Robar el contenido completo (HTML, videos, recursos)
- ❌ Ver información privada de otros usuarios
- ❌ Usar tu API de OpenAI gratuitamente

## ✅ PASOS PARA ASEGURAR LA APLICACIÓN

### PASO 1: Ejecutar políticas RLS en Supabase (CRÍTICO)

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo `supabase/security_policies.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **"Run"** (ejecutar)
6. Verifica que aparezcan resultados exitosos

**¿Qué hace esto?**
- Activa Row Level Security (RLS) en todas las tablas
- Solo el admin puede crear/editar/eliminar cursos
- Solo usuarios que compraron un curso pueden ver sus lecciones
- Cada usuario solo ve su propio progreso y compras

**Verificación:**
```sql
-- Ejecuta esto en Supabase SQL Editor para verificar:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'course%';

-- Todas las tablas deben mostrar: rowsecurity = true
```

---

### PASO 2: Actualizar el código (YA HECHO)

✅ **API de OpenAI protegida** - `app/api/generate-description/route.ts`
- Ahora verifica autenticación
- Solo admin puede usar la API
- Logs de auditoría

✅ **Frontend actualizado** - Envía token de autenticación
- `app/administrator/cursos/editar/[cursoId]/page.tsx`
- `app/administrator/cursos/nuevo/page.tsx`

---

### PASO 3: Hacer commit y deploy

```bash
git add .
git commit -m "Security: Implementar RLS y proteger API de OpenAI

- Añadir políticas RLS en todas las tablas de cursos
- Proteger API de OpenAI con autenticación admin
- Actualizar frontend para enviar tokens
- Documentación de seguridad"

git push origin main
```

---

### PASO 4: Verificar que funciona

#### Test 1: Usuario anónimo NO puede ver lecciones
1. Abre **Supabase Dashboard** → **Table Editor** → `course_lessons`
2. Intenta ver las lecciones
3. ❌ Debería mostrar **0 registros** (aunque haya lecciones creadas)
4. ✅ Si muestra lecciones, RLS NO está activado correctamente

#### Test 2: Usuario normal NO puede ver contenido sin comprar
1. Crea un usuario de prueba (no admin)
2. Inicia sesión
3. Intenta acceder a `/cursos/mi-escuela/[id-curso-pago]`
4. ✅ Debería redirigir a la página de compra

#### Test 3: Solo admin puede generar descripciones
1. Inicia sesión como usuario normal
2. Intenta usar el botón "Generar con IA"
3. ✅ Debería mostrar error "Prohibido"

#### Test 4: Admin puede hacer TODO
1. Inicia sesión como admin
2. Crea, edita, elimina cursos ✅
3. Genera descripciones con IA ✅
4. Ve todos los cursos y progreso ✅

---

## 🔍 CÓMO FUNCIONA LA SEGURIDAD AHORA

### Para courses (tabla de cursos):
```
👥 PÚBLICO (no autenticado):
  ✅ Puede ver cursos PUBLICADOS
  ❌ No puede crear/editar/eliminar

🔐 AUTENTICADO (usuario normal):
  ✅ Puede ver cursos publicados
  ❌ No puede crear/editar/eliminar

👑 ADMIN:
  ✅ Puede ver TODOS los cursos (publicados y borradores)
  ✅ Puede crear/editar/eliminar cursos
```

### Para course_lessons (contenido crítico):
```
👥 PÚBLICO:
  ✅ Puede ver lecciones marcadas como "preview gratuita"
  ❌ NO puede ver el contenido completo

🔐 AUTENTICADO:
  ✅ Puede ver lecciones SI:
    - Compró el curso (payment_status = 'completed')
    - O el curso es gratuito (is_free = true)
    - O es una preview gratuita
  ❌ Si no, redirige a comprar

👑 ADMIN:
  ✅ Puede ver TODAS las lecciones
  ✅ Puede crear/editar/eliminar lecciones
```

### Para course_resources (PDFs, archivos):
```
👥 PÚBLICO:
  ❌ NO puede descargar recursos

🔐 AUTENTICADO:
  ✅ Puede descargar recursos SI compró el curso
  ❌ Si no, no puede

👑 ADMIN:
  ✅ Puede descargar todos los recursos
  ✅ Puede crear/editar/eliminar recursos
```

### Para user_lesson_progress (progreso):
```
🔐 AUTENTICADO:
  ✅ Solo ve SU PROPIO progreso
  ❌ No puede ver progreso de otros usuarios

👑 ADMIN:
  ✅ Puede ver el progreso de TODOS los usuarios
```

### Para course_purchases (compras):
```
🔐 AUTENTICADO:
  ✅ Solo ve SUS PROPIAS compras
  ❌ No puede ver compras de otros
  ✅ Puede crear su propia compra (al comprar)

👑 ADMIN:
  ✅ Puede ver TODAS las compras
  ✅ Puede modificar/eliminar compras
```

---

## 🚨 QUÉ PASA SI NO IMPLEMENTAS ESTO

### Sin RLS (Row Level Security):
```javascript
// Cualquier hacker puede hacer esto desde la consola del navegador:
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'TU_SUPABASE_URL',  // Pública
  'TU_ANON_KEY'       // Pública (está en el código JS)
)

// ROBAR TODO EL CONTENIDO:
const { data: lessons } = await supabase
  .from('course_lessons')
  .select('*')

// Ahora tiene:
// - Todos los videos
// - Todo el contenido HTML
// - Todos los recursos
// - ¡GRATIS!

// TAMBIÉN PUEDE:
await supabase.from('courses').delete().eq('id', 'cualquier-id')
// ¡Eliminar tus cursos!
```

### Con RLS activado:
```javascript
// El mismo código devuelve:
{ data: [], error: null }  // ✅ Vacío, no tiene acceso

// Si intenta eliminar:
{ 
  data: null, 
  error: {
    message: "new row violates row-level security policy"
  }
}
// ✅ Bloqueado por RLS
```

---

## 📋 CHECKLIST FINAL

Antes de considerar la aplicación segura, verifica:

- [ ] Ejecutado `security_policies.sql` en Supabase
- [ ] Verificado que `rowsecurity = true` en todas las tablas
- [ ] Hecho commit y push del código actualizado
- [ ] Desplegado en Vercel
- [ ] Testeado que usuario anónimo NO ve lecciones
- [ ] Testeado que usuario normal NO ve cursos sin comprar
- [ ] Testeado que admin puede hacer TODO
- [ ] API de OpenAI solo funciona para admin

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: "Usuario admin no puede ver cursos"
**Causa:** El rol 'admin' no está en `user_metadata`  
**Solución:** Ejecuta en Supabase SQL Editor:
```sql
UPDATE auth.users 
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'tu-email-admin@ejemplo.com';
```

### Problema: "Error al generar descripción con IA"
**Causa:** Token no se está enviando correctamente  
**Solución:** 
1. Verifica que `OPENAI_API_KEY` esté en Vercel
2. Cierra sesión y vuelve a iniciar sesión
3. Revisa la consola del navegador para errores

### Problema: "Usuario puede ver lecciones sin comprar"
**Causa:** RLS no está activado o las políticas no se ejecutaron  
**Solución:**
1. Ve a Supabase → Table Editor → course_lessons
2. Haz clic en "Settings" (engranaje)
3. Verifica que "Enable Row Level Security" esté activado
4. Si no, ejecuta: `ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;`

---

## 📞 SOPORTE

Si tienes problemas, revisa:
1. `AUDITORIA_SEGURIDAD.md` - Análisis completo de vulnerabilidades
2. `supabase/security_policies.sql` - Script de políticas RLS
3. Logs de Supabase Dashboard → Logs → API

---

**IMPORTANTE:** NO pongas la aplicación en producción sin ejecutar el PASO 1.  
Tus cursos estarían completamente expuestos y cualquiera podría robar el contenido.
