# 🚨 INSTRUCCIONES URGENTES - ERROR 403 NO SE PUEDE MARCAR LECCIÓN COMO COMPLETADA

## ⚠️ EL PROBLEMA

Usuario intenta marcar lección como completada → **403 Forbidden**

```
POST https://pfmqkioftagjnxqyrngk.supabase.co/rest/v1/user_lesson_progress?select=* 403 (Forbidden)
```

## ✅ LA SOLUCIÓN (5 minutos)

### ⚠️ IMPORTANTE - SCRIPT ACTUALIZADO

**Usar:** `supabase/POLITICAS_RLS_DEFINITIVAS.sql` (versión 2.7.0)

El script anterior (`fix_rls_policies.sql`) ha sido reemplazado por una versión optimizada.

**Ubicación del script antiguo:** `supabase/_archivos_antiguos_rls/fix_rls_policies.sql` (no usar)

### PASO 1: Verificar Estado Actual en Supabase ⭐

1. **Abre tu navegador** y ve a: https://app.supabase.com
2. **Inicia sesión** en tu cuenta
3. **Selecciona tu proyecto**: `pfmqkioftagjnxqyrngk`
4. En el menú izquierdo, haz clic en **SQL Editor** (icono 🔧)
5. Haz clic en el botón **"New Query"** (arriba a la derecha)
6. **Copia y pega** el siguiente SQL:

```sql
-- Ver políticas actuales
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'user_lesson_progress'
ORDER BY policyname;
```

7. Haz clic en **RUN** (botón verde) o presiona `Ctrl+Enter`

#### 🔍 INTERPRETACIÓN DEL RESULTADO:

**CASO A**: Si ves **0 rows** o la tabla está vacía:
→ ❌ **NO HAY POLÍTICAS CONFIGURADAS** → Pasa al PASO 2

**CASO B**: Si ves políticas como:
```
users_can_insert_own_lesson_progress
users_can_update_own_lesson_progress
users_can_view_own_lesson_progress
```
→ ✅ Las políticas YA ESTÁN → Pasa al PASO 3 (problema diferente)

---

### PASO 2: Aplicar Políticas RLS (SOLO si CASO A)

1. **Mantén abierto** el SQL Editor de Supabase
2. Haz clic en **"New Query"** de nuevo
3. **Abre el archivo** `supabase/POLITICAS_RLS_DEFINITIVAS.sql` en VS Code o tu editor
4. **Selecciona TODO** el contenido (Ctrl+A)
5. **Copia** (Ctrl+C)
6. **Vuelve a Supabase SQL Editor**
7. **Pega** el contenido completo (Ctrl+V)
8. **Verifica** que se pegó todo (debe haber ~269 líneas)
9. Haz clic en **RUN** (botón verde)
10. **ESPERA** a que termine (puede tardar 5-10 segundos)

#### ✅ RESULTADO ESPERADO:

Deberías ver:
```
Success. No rows returned
```

O una tabla con las políticas creadas.

⚠️ **SI VES UN ERROR**:
- Copia el mensaje de error completo
- Busca en el error si dice "already exists" → Entonces las políticas YA ESTÁN (ve al PASO 3)
- Si dice otro error, envíame el mensaje completo

---

### PASO 3: Verificar que Funcionó

1. **En Supabase SQL Editor**, ejecuta de nuevo:

```sql
-- Contar políticas
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE tablename = 'user_lesson_progress';
```

**Resultado esperado**: `total_policies = 4` (o más)

2. **Ver detalles de las políticas**:

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'user_lesson_progress'
ORDER BY policyname;
```

**Debes ver**:
```
policyname                              | cmd
----------------------------------------|--------
admins_can_view_all_lesson_progress     | SELECT
users_can_insert_own_lesson_progress    | INSERT
users_can_update_own_lesson_progress    | UPDATE
users_can_view_own_lesson_progress      | SELECT
```

---

### PASO 4: Probar en la Aplicación

1. **Abre tu sitio**: https://www.hakadogs.com
2. **IMPORTANTE**: Limpia la caché presionando `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
3. **Inicia sesión** con tu usuario
4. Ve a **Mi Escuela**
5. **Selecciona un curso**
6. **Abre una lección**
7. Presiona **F12** para abrir la consola del navegador
8. Ve a la pestaña **Console**
9. Haz clic en **"Marcar como Completada"**
10. **Observa la consola**:

#### ✅ SI FUNCIONA:
```
POST .../user_lesson_progress 201 Created
✓ La lección se marca con check verde
✓ El progreso se actualiza
```

#### ❌ SI SIGUE FALLANDO:
```
POST .../user_lesson_progress 403 Forbidden
```

→ Pasa al PASO 5 (diagnóstico avanzado)

---

### PASO 5: Diagnóstico Avanzado (Solo si sigue fallando)

Si después de ejecutar el script SQL el error persiste, el problema puede ser:

#### A) Usuario NO autenticado correctamente

Verifica en la consola del navegador (F12 → Application → Local Storage):
- Busca `supabase.auth.token`
- Si no existe o está vacío → Cierra sesión y vuelve a iniciar sesión

#### B) Token de sesión expirado

Solución:
1. Abre la consola del navegador (F12)
2. Ve a **Application** → **Storage** → **Local Storage**
3. Encuentra `supabase.auth.token` y **elimínalo**
4. **Recarga la página** (F5)
5. **Inicia sesión** de nuevo

#### C) Caché del navegador

Solución:
1. Cierra todas las pestañas de www.hakadogs.com
2. Presiona `Ctrl+Shift+Delete`
3. Selecciona "Cached images and files"
4. Haz clic en "Clear data"
5. Abre de nuevo el sitio

#### D) Verificar que el usuario está autenticado

Ejecuta esto en la consola del navegador (F12 → Console):

```javascript
// Verificar sesión
const { data: { session } } = await window.supabase.auth.getSession()
console.log('Usuario autenticado:', session?.user?.email)
console.log('User ID:', session?.user?.id)
```

Si no muestra tu email → **NO estás autenticado correctamente**

---

## 🧪 SCRIPT DE PRUEBA ALTERNATIVO

Si quieres verificar desde tu terminal local:

```bash
test-insert.bat
```

Esto te pedirá:
1. Tu email
2. Tu contraseña
3. Seleccionar un curso
4. Seleccionar una lección
5. Intentará marcarla como completada

Y te dirá **exactamente** qué está fallando.

---

## 📋 CHECKLIST DE VERIFICACIÓN

Marca cada paso cuando lo completes:

### En Supabase Dashboard
- [ ] Accedí a https://app.supabase.com
- [ ] Abrí SQL Editor
- [ ] Verifiqué políticas actuales (PASO 1)
- [ ] Ejecuté `POLITICAS_RLS_DEFINITIVAS.sql` completo (PASO 2)
- [ ] Vi "Success. No rows returned"
- [ ] Verifiqué que hay 4+ políticas (PASO 3)

### En la Aplicación
- [ ] Limpié caché del navegador (Ctrl+Shift+R)
- [ ] Inicié sesión correctamente
- [ ] Abrí una lección
- [ ] Abrí consola del navegador (F12)
- [ ] Intenté marcar como completada
- [ ] Verifiqué el resultado en la consola

### Resultado
- [ ] ✅ Funciona correctamente (201 Created)
- [ ] ❌ Sigue fallando (403 Forbidden) → Ejecutar PASO 5

---

## 🆘 SI NADA FUNCIONA

Si después de seguir TODOS los pasos anteriores sigue sin funcionar:

1. **Toma screenshots de**:
   - Resultado de la query de políticas en Supabase
   - Error en la consola del navegador (F12)
   - Pestaña Network del navegador con el error 403

2. **Ejecuta este comando** en tu terminal:

```bash
test-insert.bat
```

3. **Copia TODO el output** del script

4. **Envíame**:
   - Los screenshots
   - El output del script
   - El error exacto que ves

---

## 📚 ARCHIVOS DE REFERENCIA

- `supabase/POLITICAS_RLS_DEFINITIVAS.sql` - Script principal (v2.7.0)
- `supabase/_archivos_antiguos_rls/fix_rls_policies.sql` - ⚠️ Obsoleto, no usar
- `supabase/check_current_policies.sql` - Script de verificación rápida
- `scripts/test-insert-progress.js` - Test completo con autenticación
- `test-insert.bat` - Atajo para ejecutar el test
- `ERRORES_Y_SOLUCIONES.md` - Documentación completa
- `SOLUCION_RAPIDA.md` - Guía resumida

---

## ⏱️ TIEMPO ESTIMADO

- **PASO 1**: 2 minutos
- **PASO 2**: 3 minutos
- **PASO 3**: 2 minutos
- **PASO 4**: 3 minutos
- **Total**: ~10 minutos

---

## 🎯 RESUMEN EJECUTIVO

**Problema**: Tabla `user_lesson_progress` tiene RLS habilitado pero sin políticas.

**Solución**: Ejecutar `POLITICAS_RLS_DEFINITIVAS.sql` en Supabase Dashboard.

**Resultado**: Usuarios pueden crear/actualizar su propio progreso.

**Crítico**: Sin esto, NADIE puede marcar lecciones como completadas.
