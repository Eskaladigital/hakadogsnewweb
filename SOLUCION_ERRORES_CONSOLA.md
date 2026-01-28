# 🔴 SOLUCIÓN ERRORES DE CONSOLA - HAKADOGS

**Fecha:** 12 Enero 2026  
**Estado:** 🔴 CRÍTICO - Sistema de progreso bloqueado  
**Prioridad:** ALTA

---

## 📋 RESUMEN DE ERRORES

| Error | Tipo | Impacto | Prioridad |
|-------|------|---------|-----------|
| **403 Forbidden** en `user_lesson_progress` | RLS Security | 🔴 CRÍTICO | ⚡ INMEDIATA |
| **406 Not Acceptable** en `user_course_progress` | RLS + Datos | 🔴 CRÍTICO | ⚡ INMEDIATA |
| **404 Not Found** en `icon-144x144.png` | PWA Cache | 🟡 MENOR | 🔵 BAJA |

---

## 🔴 ERROR 1: 403 FORBIDDEN (CRÍTICO)

### **Síntoma**
```
pfmqkioftagjnxqyrngk.supabase.co/rest/v1/user_lesson_progress?select=*
Failed to load resource: 403 (Forbidden)
```

**Ocurrencias:** 8 veces en la consola

### **Causa**
Las políticas RLS (Row Level Security) de Supabase están **habilitadas pero sin políticas configuradas**, bloqueando el acceso a la tabla `user_lesson_progress`.

### **Impacto**
- ❌ Los estudiantes **NO pueden ver su progreso**
- ❌ Los estudiantes **NO pueden marcar lecciones como completadas**
- ❌ El sistema de desbloqueo progresivo **NO funciona**
- ❌ Los badges de gamificación **NO se otorgan**

### **¿Por qué ocurre?**
Cuando RLS está habilitado en Supabase pero no hay políticas que permitan el acceso:
```sql
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
-- ⚠️ Sin políticas = NADIE puede acceder
```

---

## 🔴 ERROR 2: 406 NOT ACCEPTABLE (CRÍTICO)

### **Síntoma**
```
pfmqkioftagjnxqyrngk.supabase.co/rest/v1/user_course_progress?select=*&user_id=eq.af798264...
Failed to load resource: 406 (Not Acceptable)
```

### **Causa**
Supabase no puede retornar datos porque:
1. **RLS bloquea la query** (sin políticas configuradas)
2. **No existe registro** en `user_course_progress` para ese usuario/curso

### **Impacto**
- ❌ No se muestra el **porcentaje de progreso del curso**
- ❌ No se actualiza la **barra de progreso**
- ❌ La app intenta calcular dinámicamente pero falla por el error 403 previo

---

## 🟡 ERROR 3: 404 ICON (MENOR)

### **Síntoma**
```
/icon-144x144.png: Failed to load resource: 404
Error: https://www.hakadogs.com/icon-144x144.png (Download error or resource isn't a valid image)
```

### **Causa**
El navegador busca el icono PWA pero:
- ✅ El archivo **SÍ existe** en `/public/icon-144x144.png`
- ❌ Posible problema de **caché del navegador**
- ❌ Posible problema de **configuración de manifest.json**

### **Impacto**
⚠️ Bajo:
- Solo afecta a PWA (Progressive Web App)
- Solo se nota al "Agregar a pantalla de inicio"
- No afecta funcionalidad principal

---

## ✅ SOLUCIÓN PASO A PASO

### **PASO 1: Verificar Estado Actual de RLS**

1. **Ir a Supabase Dashboard:**
   - https://supabase.com/dashboard/project/pfmqkioftagjnxqyrngk

2. **Abrir SQL Editor** (icono de base de datos en menú izquierdo)

3. **Ejecutar script de verificación:**

```sql
-- Copiar y pegar el contenido de: supabase/check_current_policies.sql
-- Ver si RLS está habilitado en las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress',
  'courses',
  'course_lessons'
)
ORDER BY tablename;

-- Ver todas las políticas RLS existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress'
)
ORDER BY tablename, policyname;
```

4. **Interpretar resultados:**

**Si ves:**
```
tablename               | rls_enabled
user_lesson_progress    | true
user_course_progress    | true
```

**Y la segunda query está VACÍA** → ✅ Confirma el problema

---

### **PASO 2: Aplicar Políticas RLS (SOLUCIÓN)**

1. **En Supabase SQL Editor**, ejecutar:

```sql
-- =============================================
-- FIX COMPLETO: POLÍTICAS RLS
-- =============================================

-- 1. POLÍTICAS PARA user_lesson_progress
-- =============================================

-- Leer: Los usuarios pueden ver su propio progreso
DROP POLICY IF EXISTS "users_can_view_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_view_own_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insertar: Los usuarios pueden crear su propio progreso
DROP POLICY IF EXISTS "users_can_insert_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_insert_own_lesson_progress"
ON user_lesson_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Actualizar: Los usuarios pueden actualizar su propio progreso
DROP POLICY IF EXISTS "users_can_update_own_lesson_progress" ON user_lesson_progress;
CREATE POLICY "users_can_update_own_lesson_progress"
ON user_lesson_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todo
DROP POLICY IF EXISTS "admins_can_view_all_lesson_progress" ON user_lesson_progress;
CREATE POLICY "admins_can_view_all_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =============================================
-- 2. POLÍTICAS PARA user_course_progress
-- =============================================

-- Leer: Los usuarios pueden ver su propio progreso
DROP POLICY IF EXISTS "users_can_view_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_view_own_course_progress"
ON user_course_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insertar: Los usuarios pueden crear su propio progreso
DROP POLICY IF EXISTS "users_can_insert_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_insert_own_course_progress"
ON user_course_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Actualizar: Los usuarios pueden actualizar su propio progreso
DROP POLICY IF EXISTS "users_can_update_own_course_progress" ON user_course_progress;
CREATE POLICY "users_can_update_own_course_progress"
ON user_course_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todo
DROP POLICY IF EXISTS "admins_can_view_all_course_progress" ON user_course_progress;
CREATE POLICY "admins_can_view_all_course_progress"
ON user_course_progress
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

2. **Hacer click en "Run" (F5)**

3. **Verificar éxito:**
   - Si ves: `Success. No rows returned` → ✅ Correcto
   - Si ves errores → ⚠️ Copiar error y reportar

---

### **PASO 3: Verificar Solución**

1. **Re-ejecutar script de verificación:**

```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, policyname;
```

2. **Deberías ver 8 políticas:**

```
tablename               | policyname                               | cmd
user_course_progress    | admins_can_view_all_course_progress      | SELECT
user_course_progress    | users_can_insert_own_course_progress     | INSERT
user_course_progress    | users_can_update_own_course_progress     | UPDATE
user_course_progress    | users_can_view_own_course_progress       | SELECT
user_lesson_progress    | admins_can_view_all_lesson_progress      | SELECT
user_lesson_progress    | users_can_insert_own_lesson_progress     | INSERT
user_lesson_progress    | users_can_update_own_lesson_progress     | UPDATE
user_lesson_progress    | users_can_view_own_lesson_progress       | SELECT
```

✅ Si ves las 8 políticas → **SOLUCIÓN APLICADA CORRECTAMENTE**

---

### **PASO 4: Probar en la Aplicación**

1. **Ir a:** https://www.hakadogs.com/cursos/mi-escuela

2. **Abrir DevTools** (F12) → Pestaña **Console**

3. **Limpiar consola** (Ctrl+L)

4. **Recargar página** (Ctrl+R)

5. **Hacer click en un curso**

6. **Intentar marcar una lección como completada**

7. **Verificar consola:**

**ANTES (con error):**
```
❌ 403 (Forbidden) user_lesson_progress?select=*
❌ 406 (Not Acceptable) user_course_progress?select=*
```

**DESPUÉS (correcto):**
```
✅ 200 (OK) user_lesson_progress?select=*
✅ 200 (OK) user_course_progress?select=*
```

---

## 🔧 SOLUCIÓN ALTERNATIVA: Script Completo

Si prefieres ejecutar TODO de una vez, usa el archivo completo:

```bash
# En Supabase SQL Editor, copiar y pegar:
supabase/POLITICAS_RLS_DEFINITIVAS.sql  ⭐ v2.7.0
```

Este archivo incluye políticas para **TODAS** las tablas de cursos:
- ✅ `user_lesson_progress`
- ✅ `user_course_progress`
- ✅ `courses`
- ✅ `course_lessons`
- ✅ `course_modules`
- ✅ `course_resources`
- ✅ `course_purchases`

---

## 🟡 SOLUCIÓN: Error 404 Icono PWA (Opcional)

### **Opción 1: Limpiar Caché del Navegador**

1. **Chrome/Edge:**
   - F12 → Application → Storage → Clear site data
   - O: Settings → Privacy → Clear browsing data

2. **Firefox:**
   - F12 → Storage → Clear All

3. **Recargar con cache limpio:** Ctrl+Shift+R

### **Opción 2: Verificar Manifest.json**

```bash
# Leer archivo
cat public/manifest.json
```

Verificar que contenga:
```json
{
  "icons": [
    {
      "src": "/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    }
  ]
}
```

### **Opción 3: Regenerar Icono (si está corrupto)**

```bash
# Verificar que el archivo existe y no está corrupto
ls -lh public/icon-144x144.png

# Si está corrupto, regenerar desde el logo principal
# (requiere ImageMagick o herramienta similar)
```

---

## 📊 VERIFICACIÓN FINAL

### **Checklist de Resolución**

- [ ] **Paso 1:** Script de verificación ejecutado
- [ ] **Paso 2:** 8 políticas RLS creadas
- [ ] **Paso 3:** Consola sin errores 403/406
- [ ] **Paso 4:** Lección marcada como completada exitosamente
- [ ] **Paso 5:** Progreso visible en dashboard
- [ ] **Paso 6:** Barra de progreso actualizada
- [ ] **Paso 7:** Siguiente lección desbloqueada

### **Cómo Probar el Flujo Completo**

1. ✅ Entrar a un curso
2. ✅ Ver primera lección (desbloqueada)
3. ✅ Ver segunda lección (bloqueada con 🔒)
4. ✅ Completar primera lección
5. ✅ Verificar que segunda lección se desbloquea (🔒 → ▶️)
6. ✅ Ver barra de progreso: 1/10 lecciones (10%)
7. ✅ Ver en /cursos/mi-escuela el progreso actualizado
8. ✅ Verificar que badges se otorgan (si aplica)

---

## 🚨 SI PERSISTEN LOS ERRORES

### **Error 403 aún presente:**

1. **Verificar autenticación:**
```javascript
// En consola del navegador
const { data: { session } } = await supabase.auth.getSession()
console.log('User ID:', session?.user?.id)
```

2. **Verificar políticas aplicadas:**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'user_lesson_progress';
```

3. **Verificar que RLS sigue habilitado:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_lesson_progress';
```

### **Error 406 aún presente:**

1. **Crear registro inicial de progreso:**
```sql
-- Sustituir USER_ID y COURSE_ID por valores reales
INSERT INTO user_course_progress (user_id, course_id)
VALUES ('af798264-9d1b-403d-8990-b68584bebcdd', 'ab9e47b6-8230-4d5f-ad8b-9c4548c198ce')
ON CONFLICT (user_id, course_id) DO NOTHING;
```

2. **Verificar triggers funcionando:**
```sql
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trigger_update_course_progress';
```

---

## 📞 SOPORTE

Si los errores persisten después de aplicar estas soluciones:

1. **Exportar estado actual:**
```bash
node scripts/check-rls-policies.js > rls-state.log
```

2. **Capturar errores de consola:**
   - F12 → Console → Click derecho → Save as...

3. **Reportar con:**
   - Archivo `rls-state.log`
   - Screenshot de errores de consola
   - User ID del usuario con problemas
   - Curso ID donde ocurre el error

---

## ✅ RESULTADO ESPERADO

### **Antes (con errores):**
```
❌ 403 Forbidden × 8
❌ 406 Not Acceptable × 1
❌ 404 Not Found × 1
🔴 Progreso NO se guarda
🔴 Lecciones NO se desbloquean
🔴 Badges NO se otorgan
```

### **Después (correcto):**
```
✅ 200 OK en todas las peticiones
✅ Progreso se guarda automáticamente
✅ Lecciones se desbloquean secuencialmente
✅ Badges se otorgan al cumplir requisitos
✅ Dashboard muestra progreso actualizado
✅ Trigger actualiza user_course_progress
✅ Gamificación funciona correctamente
```

---

## 🎯 PRIORIDAD DE SOLUCIÓN

| Orden | Acción | Tiempo | Impacto |
|-------|--------|--------|---------|
| **1** | Aplicar políticas RLS (Paso 2) | 2 min | 🔴 CRÍTICO |
| **2** | Verificar en aplicación (Paso 4) | 3 min | 🔴 CRÍTICO |
| **3** | Limpiar caché PWA (Opcional) | 1 min | 🟡 MENOR |

**Tiempo total estimado:** 5-10 minutos

---

## 📝 NOTAS TÉCNICAS

### **¿Por qué ocurrió este error?**

Probablemente en algún momento se ejecutó:
```sql
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
```

Pero **NO** se ejecutó el resto del script que crea las políticas.

### **¿Cómo prevenir en el futuro?**

1. Siempre ejecutar `setup_completo.sql` COMPLETO
2. Usar el script `check-rls-policies.js` antes de deploy
3. Añadir verificación en CI/CD

### **¿Es seguro ejecutar múltiples veces?**

✅ SÍ - El script usa `DROP POLICY IF EXISTS`, por lo que:
- No da error si ya existe
- Reemplaza políticas antiguas
- Es idempotente (mismo resultado siempre)

---

**¡Aplica el Paso 2 en Supabase y los errores desaparecerán inmediatamente!** 🚀
