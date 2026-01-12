# 🔴 PROBLEMA: ESTUDIANTE NO PUEDE MARCAR LECCIONES COMO COMPLETADAS

## 📋 DIAGNÓSTICO PASO A PASO

### **PASO 1: Ejecutar Diagnóstico Completo**

1. **Ir a Supabase:**
   - https://supabase.com/dashboard/project/pfmqkioftagjnxqyrngk
   - SQL Editor

2. **Copiar y pegar:**
   - Archivo: `supabase/DIAGNOSTICO_COMPLETO.sql`
   - Ejecutar TODO

3. **Copiar resultados y pegar aquí:**

```
RESULTADO SECCIÓN 1 (RLS Habilitado):
[Pegar aquí]

RESULTADO SECCIÓN 2 (Políticas existentes):
[Pegar aquí]

RESULTADO SECCIÓN 5 (auth.uid()):
[Pegar aquí]
```

---

### **PASO 2: Verificar Autenticación en la App**

1. **Abrir consola del navegador** (F12)

2. **En la pestaña Console, pegar esto:**

```javascript
// Verificar sesión actual
const { data: { session }, error } = await supabase.auth.getSession()

if (session) {
  console.log('✅ Usuario autenticado')
  console.log('User ID:', session.user.id)
  console.log('Email:', session.user.email)
  console.log('Role:', session.user.user_metadata?.role)
} else {
  console.log('❌ NO hay sesión activa')
  console.log('Error:', error)
}
```

3. **Copiar resultado aquí:**
```
[Pegar resultado]
```

---

### **PASO 3: Probar Inserción Manual en Supabase**

1. **En Supabase SQL Editor:**

```sql
-- Obtener tu user_id
SELECT auth.uid() as mi_user_id;
```

**¿Qué retorna?** (Marca con X)
- [ ] Un UUID (ejemplo: af798264-9d1b-403d-8990-b68584bebcdd)
- [ ] NULL
- [ ] Error

---

2. **Si retorna UUID, ejecuta esto:**

```sql
-- Obtener una lección del primer curso
SELECT 
  cl.id as lesson_id,
  cl.title as lesson_title,
  c.title as course_title
FROM course_lessons cl
JOIN courses c ON c.id = cl.course_id
LIMIT 1;
```

**Copia el lesson_id aquí:**
```
lesson_id: [PEGAR_AQUI]
```

---

3. **Intentar insertar progreso manualmente:**

```sql
-- ⚠️ REEMPLAZA 'PEGAR_LESSON_ID_AQUI' con el lesson_id del paso anterior
INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
VALUES (
  auth.uid(),
  'PEGAR_LESSON_ID_AQUI', 
  true,
  NOW()
)
ON CONFLICT (user_id, lesson_id) 
DO UPDATE SET 
  completed = true,
  completed_at = NOW();
```

**¿Qué resultado da?** (Marca con X)
- [ ] Success (funciona)
- [ ] Error 403 Forbidden
- [ ] Error 42501 (insufficient_privilege)
- [ ] Otro error: [describir]

---

### **PASO 4: Probar Solución Permisiva**

Si los pasos anteriores fallan, ejecuta:

1. **En Supabase SQL Editor:**
   - Copiar TODO el contenido de: `supabase/FIX_ALTERNATIVO_PERMISIVO.sql`
   - Ejecutar

2. **Ir a la app:**
   - https://www.hakadogs.com/cursos/mi-escuela
   - Intentar marcar lección como completada

**¿Funciona ahora?** (Marca con X)
- [ ] ✅ SÍ funciona (el problema era auth.uid())
- [ ] ❌ NO funciona (el problema es otro)

---

## 🔍 ANÁLISIS DE POSIBLES CAUSAS

### **CAUSA 1: auth.uid() retorna NULL**

**Síntoma:** La query `SELECT auth.uid()` retorna NULL

**Solución:**

```sql
-- Verificar si estás usando la sesión correcta
SELECT 
  current_user as usuario_actual,
  session_user as sesion_actual;

-- Si ves 'anon' o 'postgres', NO estás autenticado correctamente
```

**Fix:** Necesitas ejecutar las queries desde el contexto de la app, no desde SQL Editor.

---

### **CAUSA 2: user_id en la tabla no es UUID**

**Síntoma:** Error de tipo de dato

**Verificación:**

```sql
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'user_lesson_progress'
  AND column_name = 'user_id';
```

**Debe retornar:** data_type = 'uuid'

---

### **CAUSA 3: Foreign Key mal configurado**

**Síntoma:** Error al insertar

**Verificación:**

```sql
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'user_lesson_progress'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'user_id';
```

**Debe retornar:** foreign_table = 'users', foreign_column = 'id'

---

### **CAUSA 4: RLS habilitado pero sin políticas**

**Síntoma:** Ejecutaste el script pero sigue con error 403

**Verificación:**

```sql
-- Contar políticas
SELECT 
  tablename,
  COUNT(*) as num_politicas
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
GROUP BY tablename;
```

**Debe retornar:**
```
user_lesson_progress  | 3 o 4
user_course_progress  | 3 o 4
```

Si retorna 0, las políticas NO se crearon.

---

### **CAUSA 5: Role metadata no existe**

**Síntoma:** Las políticas que usan `user_metadata` fallan

**Verificación en consola del navegador:**

```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Metadata:', session.user.user_metadata)
console.log('Role:', session.user.user_metadata?.role)
```

**Si retorna undefined:** El usuario no tiene `role` en metadata.

**Fix:**

```sql
-- En Supabase SQL Editor
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "user"}'::jsonb
WHERE id = 'TU_USER_ID_AQUI';
```

---

## ⚡ SOLUCIÓN RÁPIDA (NUCLEAR)

Si NADA funciona, ejecuta esto:

```sql
-- DESHABILITAR RLS TEMPORALMENTE (⚠️ INSEGURO)
ALTER TABLE user_lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress DISABLE ROW LEVEL SECURITY;

-- Probar si funciona ahora
-- Si funciona, el problema definitivamente es RLS
-- Si NO funciona, el problema es otro (frontend, triggers, etc.)
```

**IMPORTANTE:** Después de probar, volver a habilitar:

```sql
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
```

---

## 📊 CHECKLIST DE DEPURACIÓN

Marca con X lo que has verificado:

- [ ] RLS está habilitado (Sección 1)
- [ ] Existen 8 políticas (Sección 2)
- [ ] `auth.uid()` retorna un UUID (Sección 5)
- [ ] Usuario autenticado en la app (consola navegador)
- [ ] user_id es tipo UUID (verificación de columna)
- [ ] Foreign key apunta a auth.users
- [ ] Inserción manual funciona
- [ ] Triggers existen y están activos
- [ ] Solución permisiva funciona
- [ ] Deshabilitar RLS funciona

---

## 📞 REPORTAR RESULTADOS

Para que pueda ayudarte mejor, necesito:

1. **Resultado de Sección 1 del diagnóstico:**
```
[Pegar aquí]
```

2. **Resultado de Sección 2 del diagnóstico:**
```
[Pegar aquí]
```

3. **Resultado de Sección 5 del diagnóstico:**
```
[Pegar aquí]
```

4. **Resultado de `auth.uid()` en SQL Editor:**
```
[Pegar aquí]
```

5. **Resultado de verificación de sesión en navegador:**
```javascript
[Pegar aquí]
```

6. **¿La solución permisiva funciona?**
- [ ] SÍ
- [ ] NO

7. **Screenshot del error en consola del navegador** (F12)

---

## 🎯 PRÓXIMOS PASOS SEGÚN RESULTADOS

### **Si auth.uid() retorna NULL:**
→ Problema de autenticación de Supabase
→ Solución: Revisar configuración de JWT y cookies

### **Si las políticas no existen:**
→ El script no se ejecutó correctamente
→ Solución: Ejecutar script de nuevo con más detalle

### **Si la solución permisiva funciona:**
→ El problema es auth.uid() específicamente
→ Solución: Usar una alternativa a auth.uid()

### **Si deshabilitar RLS funciona:**
→ El problema son las políticas específicas
→ Solución: Reescribir políticas con sintaxis diferente

### **Si NADA funciona:**
→ El problema es en el frontend, no en la base de datos
→ Solución: Revisar código de `markLessonComplete()`

---

**Ejecuta el PASO 1 completo y reporta los resultados para que pueda identificar el problema exacto.**
