# Solución de Errores de Progreso de Cursos

## 📋 Problemas Identificados

### Errores en Consola

```
❌ 403 Forbidden - /rest/v1/user_lesson_progress?select=*
❌ 406 Not Acceptable - /rest/v1/user_course_progress?select=*
❌ 400 Bad Request - /rest/v1/rpc/get_recent_sales
❌ 404 Not Found - /icon-144x144.png
```

### Causas Raíz

1. **Error 403 en `user_lesson_progress`**: Falta configurar políticas RLS (Row Level Security)
2. **Error 406 en `user_course_progress`**: Falta configurar políticas RLS
3. **Error 400 en `get_recent_sales`**: La función RPC no existe o tiene errores
4. **Error 404 en `icon-144x144.png`**: Falta generar los iconos PWA

## 🔧 Soluciones

### 1. Configurar Políticas RLS (CRÍTICO)

**Problema**: Las tablas de progreso tienen RLS habilitado pero sin políticas, bloqueando todo acceso.

**Solución**: Ejecutar el script SQL que configura las políticas correctamente.

#### Pasos:

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo `supabase/fix_rls_policies.sql`
3. Copia y pega todo el contenido
4. Haz clic en **Run**
5. Verifica que se ejecutó sin errores

#### ¿Qué hace este script?

- Habilita RLS en todas las tablas de cursos
- Crea políticas para que:
  - ✅ Usuarios puedan ver y actualizar **su propio progreso**
  - ✅ Usuarios puedan leer cursos y lecciones publicadas
  - ✅ Usuarios puedan crear registros de progreso
  - ✅ Admins puedan ver y editar todo

### 2. Verificar la Funcionalidad

Usa el script de diagnóstico para probar:

```bash
node scripts/test-lesson-completion.js
```

Este script:
1. ✅ Verifica conexión a Supabase
2. 🔐 Te pide autenticarte
3. 📚 Lista todos los cursos
4. 📖 Lista lecciones del curso seleccionado
5. ✅ Intenta marcar una lección como completada
6. 📊 Verifica que el progreso se guardó correctamente

### 3. Generar Iconos PWA (Opcional)

El error 404 de `icon-144x144.png` se debe a que faltan los iconos de la PWA.

```bash
node scripts/generate-pwa-icons.js
```

### 4. Función get_recent_sales (Dashboard Admin)

Si eres admin y necesitas el dashboard, crea la función RPC:

```sql
-- En Supabase SQL Editor
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

-- Dar permisos a usuarios autenticados
GRANT EXECUTE ON FUNCTION get_recent_sales TO authenticated;
```

## 🧪 Cómo Probar la Solución

### Escenario 1: Usuario Normal

1. **Inicia sesión** como usuario normal
2. Ve a **Mi Escuela** → Selecciona un curso
3. Abre una lección
4. Haz clic en **"Marcar como Completada"**
5. ✅ Debería guardar sin errores
6. ✅ La lección debe aparecer con un ✓
7. ✅ El progreso del curso debe actualizarse

### Escenario 2: Admin Añade Nueva Sección

1. **Inicia sesión** como admin
2. Ve a **/admin/cursos**
3. Edita un curso existente
4. Añade una nueva lección/sección
5. Guarda los cambios
6. **Cierra sesión** e inicia como usuario normal
7. Ve al curso y verifica que la nueva lección aparece
8. Intenta marcarla como completada
9. ✅ Debería funcionar sin errores

## 🔍 Diagnóstico de Errores

### Error: "new row violates row-level security policy"

**Causa**: El usuario no tiene permisos para insertar en la tabla.

**Solución**: Verifica que las políticas RLS estén correctamente configuradas:

```sql
-- Verifica las políticas
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_lesson_progress';
```

Deberías ver al menos estas políticas:
- `users_can_view_own_lesson_progress` (SELECT)
- `users_can_insert_own_lesson_progress` (INSERT)
- `users_can_update_own_lesson_progress` (UPDATE)

### Error: "permission denied for table"

**Causa**: RLS está habilitado pero no hay políticas.

**Solución**: Ejecuta `fix_rls_policies.sql`

### Error: "relation does not exist"

**Causa**: La tabla no fue creada.

**Solución**: Ejecuta `supabase/setup_completo.sql`

## 📊 Verificar Estado Actual

Ejecuta este query en Supabase SQL Editor:

```sql
-- Ver tablas y su estado de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress',
  'courses',
  'course_lessons'
)
ORDER BY tablename;

-- Ver políticas existentes
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN (
  'user_lesson_progress',
  'user_course_progress'
)
ORDER BY tablename, policyname;
```

**Resultado esperado**:
- `rowsecurity` = `t` (true) para todas las tablas
- Al menos 3-4 políticas por tabla

## ✅ Checklist de Verificación

Antes de considerar el problema resuelto, verifica:

- [ ] RLS habilitado en `user_lesson_progress`
- [ ] RLS habilitado en `user_course_progress`
- [ ] Políticas de SELECT creadas
- [ ] Políticas de INSERT creadas
- [ ] Políticas de UPDATE creadas
- [ ] Script de prueba ejecutado exitosamente
- [ ] Usuario normal puede marcar lecciones como completadas
- [ ] Progreso se guarda correctamente
- [ ] No hay errores 403/406 en consola del navegador
- [ ] Admin puede añadir nuevas lecciones
- [ ] Usuarios pueden completar nuevas lecciones añadidas por admin

## 🆘 Soporte

Si después de seguir estos pasos sigues teniendo problemas:

1. Copia los errores exactos de la consola del navegador (F12)
2. Ejecuta el script de diagnóstico y copia el output
3. Copia el resultado de los queries de verificación
4. Revisa los logs de Supabase Dashboard → Logs

## 📚 Referencias

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
