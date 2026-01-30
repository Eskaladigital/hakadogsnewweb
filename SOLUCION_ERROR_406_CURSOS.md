# ✅ SOLUCIÓN ERROR 406: Actualización de Cursos

## 🎯 **PROBLEMA IDENTIFICADO**

Error **406 (Not Acceptable)** al intentar guardar cambios en cursos desde la página de administración:

```
Failed to load resource: the server responded with a status of 406 ()
pfmqkioftagjnxqyrngk.supabase.co/rest/v1/courses?id=eq.8493dbc8-4176-471a-8e07-ec4183e24b4e&select=*
```

### **Causa del Problema**

El error 406 ocurre cuando:
1. **Políticas RLS activas** bloquean la lectura después de un `UPDATE` con `.select()`
2. Aunque RLS esté deshabilitado en la tabla `courses`, pueden quedar políticas antiguas activas
3. Supabase necesita leer el registro actualizado después del `UPDATE`, y las políticas RLS bloquean esta lectura

---

## 🔧 **SOLUCIÓN APLICADA**

### **PASO 1: Ejecutar Script SQL en Supabase**

Ejecuta el script `FIX_ERROR_406_COURSES.sql` en el **Supabase SQL Editor**:

1. Ve a tu proyecto en Supabase Dashboard
2. Click en **SQL Editor** en el menú lateral
3. Abre el archivo `supabase/FIX_ERROR_406_COURSES.sql`
4. Copia y pega el contenido completo
5. Click en **Run** (o presiona `Ctrl+Enter`)

**Este script:**
- ✅ Elimina TODAS las políticas RLS de la tabla `courses`
- ✅ Asegura que RLS esté DESHABILITADO
- ✅ Verifica que no queden políticas activas

### **PASO 2: Mejora en el Código**

Se ha mejorado la función `updateCourse` en `lib/supabase/courses.ts` para:
- ✅ Manejar mejor el error 406
- ✅ Intentar actualizar sin `.select()` si falla
- ✅ Leer el registro actualizado por separado si es necesario
- ✅ Proporcionar mejor información de errores

---

## 📋 **VERIFICACIÓN**

Después de ejecutar el script SQL, verifica que:

1. **RLS está deshabilitado:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'courses';
   ```
   Debe mostrar `rowsecurity = false`

2. **No hay políticas activas:**
   ```sql
   SELECT COUNT(*) 
   FROM pg_policies 
   WHERE tablename = 'courses';
   ```
   Debe mostrar `0`

3. **Prueba actualizar un curso:**
   - Ve a `/administrator/cursos/editar/[cursoId]`
   - Haz un cambio pequeño (ej: cambiar el título)
   - Click en "Guardar Cambios"
   - ✅ No debe aparecer error 406 en la consola

---

## 🚀 **RESULTADO ESPERADO**

Después de aplicar la solución:

- ✅ **Error 406 eliminado** - Los cursos se actualizan correctamente
- ✅ **RLS deshabilitado** - Sin restricciones en la tabla `courses`
- ✅ **Sin políticas bloqueantes** - Tabla completamente accesible para admins
- ✅ **Mejor manejo de errores** - El código maneja mejor los errores de actualización

---

## 🔍 **SI EL PROBLEMA PERSISTE**

Si después de ejecutar el script SQL aún aparece el error 406:

1. **Verifica que el usuario esté autenticado:**
   - Abre la consola del navegador
   - Verifica que hay una sesión activa
   - El usuario debe tener `role: 'admin'` en `user_metadata`

2. **Verifica las variables de entorno:**
   - `NEXT_PUBLIC_SUPABASE_URL` está configurada
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` está configurada

3. **Limpia la caché del navegador:**
   - Presiona `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
   - O limpia la caché manualmente

4. **Verifica en Supabase Dashboard:**
   - Ve a **Authentication** → **Users**
   - Verifica que tu usuario tiene `role: 'admin'` en metadata

---

## 📝 **ARCHIVOS MODIFICADOS**

1. ✅ `supabase/FIX_ERROR_406_COURSES.sql` - Script SQL para eliminar políticas RLS
2. ✅ `lib/supabase/courses.ts` - Mejora en función `updateCourse` para manejar errores 406

---

## ✅ **ESTADO**

- [x] Script SQL creado
- [x] Función `updateCourse` mejorada
- [x] Documentación creada
- [ ] Script SQL ejecutado en Supabase (pendiente de ejecutar)
- [ ] Verificación en producción (pendiente)

---

**Fecha:** 30 Enero 2026  
**Versión:** 1.0
