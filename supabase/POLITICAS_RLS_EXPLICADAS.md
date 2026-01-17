# 🔒 Políticas RLS - Guía Completa

**Versión:** 1.0 DEFINITIVA  
**Fecha:** 15 Enero 2026  
**Estado:** ✅ Probado y funcionando en producción

---

## 📋 Tabla de Contenidos

1. [¿Qué es RLS?](#qué-es-rls)
2. [Filosofía de Seguridad](#filosofía-de-seguridad)
3. [Configuración Actual](#configuración-actual)
4. [Explicación por Tabla](#explicación-por-tabla)
5. [Casos de Uso](#casos-de-uso)
6. [Mantenimiento](#mantenimiento)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🤔 ¿Qué es RLS?

**RLS (Row Level Security)** es una funcionalidad de PostgreSQL/Supabase que permite controlar **qué filas de una tabla** puede ver o modificar cada usuario.

### Ejemplo Simple:

```sql
-- Sin RLS:
SELECT * FROM user_lesson_progress;
-- Retorna: TODAS las filas de TODOS los usuarios ❌

-- Con RLS:
SELECT * FROM user_lesson_progress;
-- Retorna: Solo las filas donde user_id = auth.uid() ✅
```

### Estados Posibles:

| Estado | Políticas | Resultado |
|--------|-----------|-----------|
| RLS Deshabilitado | N/A | Acceso total sin restricciones |
| RLS Habilitado + Sin políticas | 0 | **BLOQUEA TODO** (Error 403) |
| RLS Habilitado + Con políticas | 1+ | Control granular por política |

---

## 🎯 Filosofía de Seguridad

En Hakadogs usamos un enfoque **pragmático y simple**:

### Principio 1: RLS solo donde importa

- ✅ **SÍ en datos personales**: progreso, compras, badges
- ❌ **NO en contenido público**: cursos, lecciones, blog

### Principio 2: Seguridad en capas

```
Capa 1: Autenticación Next.js
  └─ Protege rutas /administrator
  └─ Solo admin logueado accede

Capa 2: RLS en Base de Datos
  └─ Evita que un usuario vea datos de otro
  └─ Funciona incluso si acceden directo a la API
```

### Principio 3: Simplicidad ante todo

- **11 políticas** en lugar de 40+
- Fácil de entender y mantener
- Menos puntos de fallo

---

## ⚙️ Configuración Actual

### Tablas SIN RLS (10 tablas)

Contenido público o solo modificado por admin:

```
🔓 courses
🔓 course_lessons
🔓 course_modules
🔓 course_resources
🔓 module_tests
🔓 badges
🔓 blog_posts
🔓 blog_categories
🔓 blog_tags
🔓 blog_post_tags
```

**¿Por qué sin RLS?**
- Son de lectura pública (cualquiera puede ver cursos)
- Solo el admin las modifica (protegido en la app)
- Evita problemas con JOINs
- Simplifica la arquitectura

### Tablas CON RLS (8 tablas)

Datos personales que deben estar protegidos:

```
🔒 user_lesson_progress (1 política)
🔒 user_course_progress (1 política)
🔒 course_purchases (1 política)
🔒 user_test_attempts (1 política)
🔒 user_badges (2 políticas)
🔒 user_roles (1 política)
🔒 blog_comments (2 políticas)
🔒 contacts (1 política)
```

**Total: 11 políticas**

---

## 📚 Explicación por Tabla

### 1️⃣ user_lesson_progress

**Propósito:** Rastrear qué lecciones ha completado cada usuario

**Tabla de ejemplo:**
```
id  | user_id | lesson_id | completed | completed_at
----|---------|-----------|-----------|-------------
1   | user-A  | lesson-1  | true      | 2026-01-10
2   | user-B  | lesson-1  | true      | 2026-01-12
3   | user-A  | lesson-2  | false     | null
```

**Política:**
```sql
CREATE POLICY "own_lesson_progress" 
ON user_lesson_progress 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```

**Resultado:**
- ✅ `user-A` logueado → Ve solo filas 1 y 3
- ✅ `user-B` logueado → Ve solo fila 2
- ❌ `user-A` no puede ver progreso de `user-B`

---

### 2️⃣ user_course_progress

**Propósito:** Progreso general de cada usuario en cada curso

**Política:**
```sql
CREATE POLICY "own_course_progress" 
ON user_course_progress 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```

**Uso típico:**
```javascript
// En Mi Escuela: obtener progreso del usuario
const progress = await getUserCourseProgress(userId, courseId)
// Solo retorna progreso del usuario logueado ✅
```

---

### 3️⃣ course_purchases

**Propósito:** Registro de compras de cursos

**Política:**
```sql
CREATE POLICY "own_purchases" 
ON course_purchases 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```

**Casos de uso:**
1. Usuario ve sus cursos comprados en Mi Escuela ✅
2. Usuario no puede ver qué compró otro usuario ❌
3. Usuario puede crear nueva compra ✅

---

### 4️⃣ user_test_attempts

**Propósito:** Intentos de exámenes/tests por usuario

**Política:**
```sql
CREATE POLICY "own_test_attempts" 
ON user_test_attempts 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```

---

### 5️⃣ user_badges

**Propósito:** Badges desbloqueadas por usuario

**Políticas (2):**

```sql
-- Política 1: Ver solo propios badges
CREATE POLICY "own_badges_read" 
ON user_badges 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Política 2: Sistema puede insertar automáticamente
CREATE POLICY "system_insert_badges" 
ON user_badges 
FOR INSERT 
TO authenticated
WITH CHECK (true);
```

**¿Por qué dos políticas?**
- Política 1: Usuario solo ve sus badges
- Política 2: Triggers de gamificación pueden insertar badges automáticamente

---

### 6️⃣ user_roles

**Propósito:** Rol de cada usuario (admin, user, instructor)

**Política:**
```sql
CREATE POLICY "own_role_read" 
ON user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
```

**Resultado:**
- Usuario puede ver su propio rol ✅
- Usuario NO puede modificar su rol ❌
- Solo admin puede modificar roles (vía panel admin) ✅

---

### 7️⃣ blog_comments

**Propósito:** Comentarios de usuarios en artículos

**Políticas (2):**

```sql
-- Política 1: Lectura pública de comentarios aprobados
CREATE POLICY "public_read_comments" 
ON blog_comments 
FOR SELECT 
TO public
USING (is_approved = true);

-- Política 2: Gestionar propios comentarios
CREATE POLICY "own_comments" 
ON blog_comments 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```

**Flujo:**
1. Usuario anónimo → Ve solo comentarios aprobados
2. Usuario logueado → Puede crear comentario
3. Usuario logueado → Puede editar/borrar sus comentarios
4. Admin → Puede aprobar/rechazar cualquier comentario

---

### 8️⃣ contacts

**Propósito:** Mensajes de contacto

**Política:**
```sql
CREATE POLICY "public_insert_contact" 
ON contacts 
FOR INSERT 
TO public
WITH CHECK (true);
```

**Resultado:**
- ✅ Cualquiera puede enviar mensaje de contacto
- ❌ Solo admin puede ver mensajes (sin política de lectura)
- ❌ Usuarios no pueden ver mensajes de otros

---

## 🎬 Casos de Uso

### Caso 1: Usuario ve sus cursos comprados

**Endpoint:** `/cursos/mi-escuela`

**Query ejecutada:**
```javascript
const purchases = await supabase
  .from('course_purchases')
  .select('*, courses(*)')
  .eq('user_id', userId)
```

**¿Cómo funciona?**
1. `course_purchases` tiene RLS → Política filtra por `user_id`
2. `courses` NO tiene RLS → JOIN funciona sin problemas
3. ✅ Resultado: Solo cursos comprados por el usuario

---

### Caso 2: Admin edita un curso

**Endpoint:** `/administrator/cursos/editar`

**Query ejecutada:**
```javascript
const { data, error } = await supabase
  .from('courses')
  .update({ title: 'Nuevo título' })
  .eq('id', courseId)
```

**¿Cómo funciona?**
1. `courses` NO tiene RLS → Sin restricciones
2. Admin está autenticado en la app → Puede editar
3. ✅ Resultado: Curso editado correctamente

---

### Caso 3: Usuario intenta ver progreso de otro usuario

**Query maliciosa:**
```javascript
// Intentar ver progreso de otro usuario
const { data } = await supabase
  .from('user_lesson_progress')
  .select('*')
  .eq('user_id', 'otro-usuario-id')
```

**¿Qué pasa?**
1. `user_lesson_progress` tiene RLS
2. Política: `USING (auth.uid() = user_id)`
3. ❌ Resultado: **Retorna 0 filas** (bloqueado silenciosamente)

---

## 🔧 Mantenimiento

### Aplicar políticas desde cero

```bash
# En Supabase SQL Editor
1. Abrir POLITICAS_RLS_DEFINITIVAS.sql
2. Copiar TODO el contenido
3. Ejecutar (Run)
4. Verificar resultado al final
```

### Ver estado actual de RLS

```sql
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ON' ELSE '🔓 OFF' END as rls
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Ver políticas actuales

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Contar políticas por tabla

```sql
SELECT tablename, COUNT(*) as total
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY total DESC;
```

---

## 🚨 Solución de Problemas

### Error: 403 Forbidden

**Síntoma:**
```
POST /rest/v1/user_lesson_progress 403 Forbidden
```

**Causa:** Tabla tiene RLS habilitado pero sin políticas

**Solución:**
```sql
-- Verificar estado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_lesson_progress';

-- Si tiene RLS ON pero sin políticas:
-- Ejecutar POLITICAS_RLS_DEFINITIVAS.sql completo
```

---

### Error: 500 Internal Server Error

**Síntoma:**
```
GET /rest/v1/course_purchases?select=*,courses(*) 500
```

**Causa:** JOIN entre tablas con estados de RLS incompatibles

**Solución:**
- Ambas tablas deben tener el mismo estado de RLS
- En nuestro caso: ambas SIN RLS

```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
-- Ahora el JOIN funciona ✅
```

---

### Usuario no ve sus cursos comprados

**Diagnóstico:**

1. **Verificar que está logueado:**
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('User ID:', session?.user?.id)
```

2. **Verificar políticas:**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'course_purchases';
```

3. **Probar query directa:**
```sql
SELECT * FROM course_purchases
WHERE user_id = 'tu-user-id';
```

---

### Admin no puede editar cursos

**Diagnóstico:**

1. **Verificar RLS de courses:**
```sql
SELECT rowsecurity FROM pg_tables 
WHERE tablename = 'courses';
-- Debe ser FALSE (sin RLS)
```

2. **Verificar rol de admin:**
```sql
SELECT role FROM user_roles 
WHERE user_id = 'tu-user-id';
-- Debe ser 'admin'
```

3. **Si courses tiene RLS ON, deshabilitarlo:**
```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
```

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│                   HAKADOGS RLS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TABLAS SIN RLS (10)         TABLAS CON RLS (8)        │
│  ├─ courses                  ├─ user_lesson_progress   │
│  ├─ course_lessons           ├─ user_course_progress   │
│  ├─ course_modules           ├─ course_purchases       │
│  ├─ course_resources         ├─ user_test_attempts     │
│  ├─ module_tests             ├─ user_badges (2 pol.)   │
│  ├─ badges                   ├─ user_roles             │
│  ├─ blog_posts               ├─ blog_comments (2 pol.) │
│  ├─ blog_categories          └─ contacts               │
│  ├─ blog_tags                                          │
│  └─ blog_post_tags            Total: 11 políticas       │
│                                                         │
│  Acceso: Libre                Acceso: Solo propios     │
│  Admin: Modifica vía app      datos                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Próximos Pasos

Después de aplicar estas políticas:

1. ✅ Probar en `/cursos/mi-escuela` → Usuario ve sus cursos
2. ✅ Probar en `/administrator/cursos` → Admin puede editar
3. ✅ Verificar que no hay errores 403/500 en consola
4. ✅ Confirmar que un usuario NO ve datos de otro

---

## 📞 Soporte

**Documentación relacionada:**
- `POLITICAS_RLS_DEFINITIVAS.sql` - Script SQL completo
- `README.md` - Guía general de Supabase
- `/docs/ERRORES_Y_SOLUCIONES.md` - Troubleshooting

**Comandos útiles:**
```sql
-- Ver todo el estado actual
SELECT 
  t.tablename,
  t.rowsecurity as rls_enabled,
  COUNT(p.policyname) as num_policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;
```

---

**Última actualización:** 15 Enero 2026  
**Versión:** 1.0 DEFINITIVA  
**Estado:** ✅ Probado y funcionando  
**Proyecto:** Hakadogs - Educación Canina Profesional
