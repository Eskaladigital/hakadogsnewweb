# 🚨 PROBLEMA: Marcar Lección Como Completada NO Funciona

## TL;DR (Resumen Ultra Rápido)

**Problema**: Añadiste una nueva sección en un curso como admin, pero cuando un usuario intenta marcarla como completada, no pasa nada.

**Causa**: Las tablas de progreso tienen seguridad (RLS) activada pero sin políticas configuradas.

**Solución**: Ejecutar 1 script SQL en Supabase (2 minutos)

---

## 🎯 SOLUCIÓN RÁPIDA (5 minutos)

### Paso 1: Ejecutar Script SQL

1. Abre **Supabase Dashboard**: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (icono terminal en el menú izquierdo)
4. Haz clic en **"New Query"**
5. Abre el archivo `supabase/POLITICAS_RLS_DEFINITIVAS.sql` (v2.7.0) de este proyecto

⚠️ **Nota:** El script anterior `fix_rls_policies.sql` está obsoleto (ver `_archivos_antiguos_rls/`)
6. Copia TODO el contenido y pégalo en Supabase
7. Haz clic en **"Run"** (botón verde) o presiona `Ctrl+Enter`
8. ✅ Debe decir: "Success. No rows returned"

### Paso 2: Verificar

Ejecuta en tu terminal:

```bash
# Windows
check-rls.bat

# Mac/Linux
./check-rls.sh
```

O manualmente:
```bash
node scripts/check-rls-policies.js
```

### Paso 3: Probar

1. **Limpia caché del navegador** (Ctrl+Shift+R)
2. Inicia sesión como usuario
3. Ve a Mi Escuela → Selecciona un curso
4. Abre una lección
5. Haz clic en **"Marcar como Completada"**
6. ✅ Debe funcionar ahora

---

## 🔍 ¿Qué Errores Estabas Viendo?

En la consola del navegador (F12):

```
❌ 403 Forbidden - /rest/v1/user_lesson_progress?select=*
❌ 406 Not Acceptable - /rest/v1/user_course_progress?select=*
❌ 400 Bad Request - /rest/v1/rpc/get_recent_sales
❌ 404 Not Found - /icon-144x144.png (múltiples veces)
```

### Explicación de Cada Error

| Error | Qué significa | Criticidad | Solución |
|-------|---------------|------------|----------|
| **403 user_lesson_progress** | No hay permisos para guardar progreso | 🔴 CRÍTICO | `POLITICAS_RLS_DEFINITIVAS.sql` |
| **406 user_course_progress** | No hay permisos para leer progreso | 🔴 CRÍTICO | `POLITICAS_RLS_DEFINITIVAS.sql` |
| **400 get_recent_sales** | Función RPC no existe (dashboard admin) | 🟡 Media | Ver sección "Bonus" |
| **404 icon-144x144.png** | Faltan iconos PWA | 🟢 Baja | `node scripts/generate-pwa-icons.js` |

---

## 🧪 Script de Prueba Completo (Opcional)

Si quieres hacer una prueba más exhaustiva:

```bash
node scripts/test-lesson-completion.js
```

Este script interactivo:
- 🔐 Te pide tus credenciales
- 📚 Lista todos los cursos
- 📖 Te deja elegir una lección
- ✅ Intenta marcarla como completada
- 📊 Verifica que se guardó correctamente
- 💬 Te dice exactamente qué falló (si algo falla)

---

## 📊 ¿Por Qué Pasó Esto?

### El Contexto

Supabase usa **Row Level Security (RLS)** para controlar quién puede acceder a qué datos.

### El Problema

Tu archivo `setup_completo.sql` crea las tablas pero **NO** configura las políticas RLS:

```sql
-- ✅ Tabla creada
CREATE TABLE user_lesson_progress (...);

-- ❌ Pero falta esto:
-- ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "users_can_insert..." ...
```

### Analogía

Es como construir una casa con puerta pero sin dar llaves a nadie:
- 🏠 Casa = Tabla de base de datos
- 🔒 Puerta con cerradura = RLS habilitado
- 🔑 Llaves = Políticas RLS

Sin las políticas (llaves), **NADIE** puede entrar, ni siquiera usuarios legítimos.

---

## 📁 Archivos Creados

He creado varios archivos para ayudarte:

### Scripts SQL
- `supabase/POLITICAS_RLS_DEFINITIVAS.sql` - **⭐ PRINCIPAL** - Configura todas las políticas RLS (v2.7.0)
- `supabase/_archivos_antiguos_rls/fix_rls_policies.sql` - ⚠️ Obsoleto, no usar

### Scripts de Verificación
- `scripts/check-rls-policies.js` - Verificador rápido (sin login)
- `scripts/test-lesson-completion.js` - Test completo (con login)
- `check-rls.bat` - Atajo Windows
- `check-rls.sh` - Atajo Mac/Linux

### Documentación
- `ERRORES_Y_SOLUCIONES.md` - **⭐ GUÍA COMPLETA** - Explicación detallada de todos los errores
- `docs/SOLUCION_ERRORES_PROGRESO.md` - Documentación técnica extendida

---

## ✅ Checklist de Verificación

Marca cada item cuando lo completes:

### Base de Datos
- [ ] Ejecutado `fix_rls_policies.sql` en Supabase
- [ ] Sin errores al ejecutar el script
- [ ] Verificador `check-rls-policies.js` pasa con éxito

### Navegador
- [ ] Limpiada caché del navegador
- [ ] No hay errores 403/406 en consola (F12)
- [ ] No hay errores en la pestaña Network

### Funcionalidad
- [ ] Usuario puede ver sus cursos en Mi Escuela
- [ ] Usuario puede abrir lecciones
- [ ] Botón "Marcar como Completada" funciona
- [ ] Lección se marca con ✓ después de completar
- [ ] Barra de progreso del curso se actualiza
- [ ] Nuevas lecciones añadidas por admin son visibles
- [ ] Usuarios pueden completar nuevas lecciones

---

## 🆘 Si Algo Sigue Sin Funcionar

### 1. Verifica que el script se ejecutó correctamente

En Supabase SQL Editor:

```sql
-- Debe retornar al menos 4 políticas
SELECT COUNT(*) 
FROM pg_policies 
WHERE tablename = 'user_lesson_progress';
```

### 2. Verifica que RLS está habilitado

```sql
-- rowsecurity debe ser 't' (true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_lesson_progress', 'user_course_progress');
```

### 3. Verifica las políticas creadas

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('user_lesson_progress', 'user_course_progress')
ORDER BY tablename, policyname;
```

### 4. Copia los errores exactos

1. Abre consola del navegador (F12)
2. Ve a la pestaña Console
3. Intenta marcar una lección como completada
4. Copia el error completo (texto rojo)
5. Envíamelo para ayudarte

---

## 🎁 BONUS: Arreglar Otros Errores

### Error 400: get_recent_sales (Dashboard Admin)

Si eres admin y el dashboard no carga, ejecuta esto en Supabase SQL Editor:

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

### Error 404: icon-144x144.png (Iconos PWA)

Genera los iconos automáticamente:

```bash
node scripts/generate-pwa-icons.js
```

O manualmente:
1. Crea un archivo `public/icon.png` de 512x512px
2. Ejecuta el script de arriba

---

## 📞 Contacto

Si necesitas más ayuda:
1. Lee `ERRORES_Y_SOLUCIONES.md` (documentación completa)
2. Ejecuta `node scripts/test-lesson-completion.js` (diagnóstico)
3. Copia los errores exactos de la consola

---

## ✨ Resumen Final

### Antes
```
❌ Usuario hace clic en "Marcar como Completada"
❌ No pasa nada
❌ Consola: 403 Forbidden
```

### Después (con POLITICAS_RLS_DEFINITIVAS.sql v2.7.0)
```
✅ Usuario hace clic en "Marcar como Completada"
✅ Spinner de carga
✅ Lección marcada con ✓
✅ Progreso actualizado
✅ Sin errores en consola
```

**Tiempo total**: ~5 minutos para arreglar todo 🎉
