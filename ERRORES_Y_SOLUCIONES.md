# 🚨 Diagnóstico de Errores - Sistema de Cursos

## 📊 Resumen de Errores Detectados

| Error | Código | URL | Causa | Prioridad |
|-------|--------|-----|-------|-----------|
| 403 Forbidden | 403 | `/rest/v1/user_lesson_progress` | ❌ Sin políticas RLS | 🔴 CRÍTICO |
| 406 Not Acceptable | 406 | `/rest/v1/user_course_progress` | ❌ Sin políticas RLS | 🔴 CRÍTICO |
| 400 Bad Request | 400 | `/rest/v1/rpc/get_recent_sales` | ⚠️ Función RPC no existe | 🟡 Media |
| 404 Not Found | 404 | `/icon-144x144.png` | ℹ️ Iconos PWA faltantes | 🟢 Baja |

---

## 🔴 PROBLEMA CRÍTICO: Marcar Lección Como Completada NO Funciona

### Síntomas
```javascript
// El usuario hace clic en "Marcar como Completada"
// ❌ No pasa nada
// ❌ Consola muestra: 403 Forbidden
```

### Causa Raíz
Las tablas `user_lesson_progress` y `user_course_progress` tienen **Row Level Security (RLS) habilitado** pero **SIN POLÍTICAS configuradas**.

Esto significa:
- ✅ La tabla existe
- ✅ La estructura es correcta
- ❌ **PERO nadie puede leer/escribir** (ni siquiera usuarios autenticados)

### ¿Por qué sucede esto?

```sql
-- Estado actual:
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
-- ⚠️ RLS habilitado pero sin políticas = BLOQUEA TODO
```

Es como poner un candado en la puerta sin darle llaves a nadie.

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Ejecutar Script SQL de Corrección

**Archivo**: `supabase/POLITICAS_RLS_DEFINITIVAS.sql` (v2.7.0)

⚠️ **Nota:** El script anterior `fix_rls_policies.sql` está obsoleto.

1. Abre **Supabase Dashboard**
2. Ve a **SQL Editor** (icono de terminal)
3. Haz clic en **"New Query"**
4. Copia y pega **TODO** el contenido de `POLITICAS_RLS_DEFINITIVAS.sql`
5. Haz clic en **"Run"** (o presiona Ctrl+Enter)
6. ✅ Verifica que diga: "Success. No rows returned"

#### ¿Qué hace este script?

```sql
-- 1. Habilita RLS en todas las tablas
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- 2. Crea política para que usuarios lean SU PROPIO progreso
CREATE POLICY "users_can_view_own_lesson_progress"
ON user_lesson_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Permite que usuarios CREEN su propio progreso
CREATE POLICY "users_can_insert_own_lesson_progress"
ON user_lesson_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Permite ACTUALIZAR su propio progreso
CREATE POLICY "users_can_update_own_lesson_progress"
ON user_lesson_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
```

### Paso 2: Verificar que Funcionó

**Opción A - Verificación Manual** (en Supabase SQL Editor):

```sql
-- Ver políticas creadas
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, policyname;
```

**Resultado esperado**:
```
tablename              | policyname                              | cmd
-----------------------|----------------------------------------|--------
user_lesson_progress   | users_can_view_own_lesson_progress     | SELECT
user_lesson_progress   | users_can_insert_own_lesson_progress   | INSERT
user_lesson_progress   | users_can_update_own_lesson_progress   | UPDATE
user_lesson_progress   | admins_can_view_all_lesson_progress    | SELECT
user_course_progress   | users_can_view_own_course_progress     | SELECT
user_course_progress   | users_can_insert_own_course_progress   | INSERT
user_course_progress   | users_can_update_own_course_progress   | UPDATE
...
```

**Opción B - Script Automatizado**:

```bash
node scripts/test-lesson-completion.js
```

Este script interactivo:
1. ✅ Se conecta a Supabase
2. 🔐 Te pide tus credenciales
3. 📚 Lista todos los cursos
4. 📖 Lista lecciones del curso que elijas
5. ✅ Intenta marcar una como completada
6. 📊 Verifica que se guardó correctamente

### Paso 3: Probar en la Aplicación

1. **Limpia la caché del navegador** (Ctrl+Shift+R o Cmd+Shift+R)
2. Inicia sesión como **usuario normal**
3. Ve a **Mi Escuela**
4. Selecciona un curso
5. Abre una lección
6. Haz clic en **"Marcar como Completada"**
7. ✅ Debería aparecer:
   - Spinner de carga ("Guardando...")
   - Mensaje de éxito con check verde
   - La lección marcada con ✓
   - Progreso del curso actualizado

### Paso 4: Verificar Consola del Navegador

Presiona **F12** y ve a la pestaña **Console**:

**ANTES** (con error):
```
❌ GET .../user_lesson_progress?select=* 403 (Forbidden)
❌ POST .../user_lesson_progress 403 (Forbidden)
```

**DESPUÉS** (correcto):
```
✅ GET .../user_lesson_progress?select=* 200 OK
✅ POST .../user_lesson_progress 201 Created
✅ Progreso del curso obtenido desde tabla: {...}
```

---

## 🧪 CASO DE PRUEBA: Admin Añade Nueva Sección

### Escenario
1. Admin añade una nueva lección en `/admin/cursos`
2. Usuario intenta marcarla como completada
3. ❌ **ANTES**: No funciona (403)
4. ✅ **DESPUÉS**: Funciona correctamente

### Prueba Paso a Paso

**Como Admin**:
```
1. Login como admin
2. Ve a /admin/cursos
3. Selecciona un curso
4. Añade una nueva lección:
   - Título: "Test - Nueva Lección"
   - Slug: "test-nueva-leccion"
   - Contenido: (cualquier texto)
   - Order: (último número + 1)
5. Guarda
6. Logout
```

**Como Usuario**:
```
1. Login como usuario normal
2. Ve a Mi Escuela
3. Abre el curso modificado
4. Verifica que aparece la nueva lección
5. Ábrela
6. Haz clic en "Marcar como Completada"
7. ✅ Debe funcionar sin errores
```

---

## 🔍 Otros Errores Encontrados

### 400 Bad Request - get_recent_sales

**Síntoma**: Dashboard de admin muestra error al cargar ventas recientes.

**Causa**: La función RPC `get_recent_sales` no existe en la base de datos.

**Solución**: Crear la función en Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_recent_sales(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  course_title TEXT,
  user_email TEXT,
  price_paid DECIMAL,
  purchase_date TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    c.title as course_title,
    u.email as user_email,
    cp.price_paid,
    cp.purchase_date
  FROM course_purchases cp
  JOIN courses c ON c.id = cp.course_id
  JOIN auth.users u ON u.id = cp.user_id
  WHERE cp.payment_status = 'completed'
  ORDER BY cp.purchase_date DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_recent_sales TO authenticated;
```

### 404 Not Found - icon-144x144.png

**Síntoma**: Errores 404 para iconos PWA en consola.

**Causa**: Los iconos de la Progressive Web App no fueron generados.

**Solución**: Generar iconos automáticamente:

```bash
node scripts/generate-pwa-icons.js
```

O manualmente:
1. Crea un icono 512x512 llamado `icon.png` en `/public`
2. Ejecuta el script anterior para generar todos los tamaños

**Impacto**: Bajo (solo afecta apariencia cuando se instala como PWA)

---

## 📋 Checklist Final de Verificación

Antes de considerar todo solucionado:

### Base de Datos
- [ ] Script `POLITICAS_RLS_DEFINITIVAS.sql` ejecutado sin errores
- [ ] Políticas RLS visibles en `pg_policies`
- [ ] Función `get_recent_sales` creada (si usas admin dashboard)

### Funcionalidad Usuario Normal
- [ ] Puede ver lista de cursos en Mi Escuela
- [ ] Puede abrir lecciones
- [ ] Puede marcar lecciones como completadas
- [ ] Progreso se guarda correctamente
- [ ] Progreso del curso se actualiza
- [ ] No hay errores 403/406 en consola

### Funcionalidad Admin
- [ ] Puede crear nuevos cursos
- [ ] Puede añadir lecciones a cursos existentes
- [ ] Puede editar lecciones existentes
- [ ] Dashboard muestra estadísticas correctamente

### Integración Completa
- [ ] Nuevas lecciones creadas por admin son visibles para usuarios
- [ ] Usuarios pueden completar nuevas lecciones sin problemas
- [ ] Triggers de progreso funcionan correctamente
- [ ] Módulos de cursos funcionan (si aplica)

---

## 🆘 Troubleshooting

### "Sigo viendo 403 después de ejecutar el script"

**Posibles causas**:
1. El script no se ejecutó completamente
2. Caché del navegador
3. El usuario no está autenticado correctamente

**Solución**:
```sql
-- Verificar que las políticas existen
SELECT COUNT(*) FROM pg_policies 
WHERE tablename = 'user_lesson_progress';
-- Debe retornar al menos 4

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_lesson_progress';
-- rowsecurity debe ser 't' (true)
```

### "Error: auth.uid() is null"

**Causa**: El usuario no está autenticado o el token expiró.

**Solución**:
1. Cierra sesión completamente
2. Limpia cookies del sitio
3. Vuelve a iniciar sesión

### "Error: column 'user_id' does not exist"

**Causa**: La tabla no tiene la estructura correcta.

**Solución**: Re-ejecutar `supabase/setup_completo.sql`

---

## 📚 Documentación Adicional

- 📄 **Guía completa**: `docs/SOLUCION_ERRORES_PROGRESO.md`
- 🧪 **Script de prueba**: `scripts/test-lesson-completion.js`
- 🔧 **Script SQL**: `supabase/POLITICAS_RLS_DEFINITIVAS.sql` (v2.7.0)
- 📖 **Setup inicial**: `supabase/setup_completo.sql`

---

## ✅ Resumen Ejecutivo

### El Problema
Las tablas de progreso tienen seguridad habilitada (RLS) pero sin configurar políticas de acceso, bloqueando completamente las operaciones de lectura y escritura.

### La Solución
Ejecutar `POLITICAS_RLS_DEFINITIVAS.sql` que configura las políticas correctamente, permitiendo:
- Usuarios acceder a **su propio** progreso
- Crear y actualizar sus registros de progreso
- Admins ver y gestionar todo

### Tiempo Estimado
- Ejecutar script: **2 minutos**
- Verificar: **3 minutos**
- Probar: **5 minutos**
- **Total: ~10 minutos**

### Impacto
🔴 **CRÍTICO** - Sin esto, el sistema de cursos **NO FUNCIONA** para usuarios finales.
