# 🔒 Políticas RLS - Referencia Rápida

**Versión:** 1.0 DEFINITIVA  
**Fecha:** 15 Enero 2026  
**Estado:** ✅ En producción

---

## 📊 Configuración Actual

### Tablas por Estado

```
🔓 SIN RLS (10 tablas) - Contenido público/admin
├─ courses
├─ course_lessons
├─ course_modules
├─ course_resources
├─ module_tests
├─ badges
├─ blog_posts
├─ blog_categories
├─ blog_tags
└─ blog_post_tags

🔒 CON RLS (8 tablas) - Datos personales
├─ user_lesson_progress (1 política)
├─ user_course_progress (1 política)
├─ course_purchases (1 política)
├─ user_test_attempts (1 política)
├─ user_badges (2 políticas)
├─ user_roles (1 política)
├─ blog_comments (2 políticas)
└─ contacts (1 política)

Total: 11 políticas
```

---

## ⚡ Comandos Rápidos

### Verificar Estado de RLS

```sql
-- Ver todas las tablas y su estado de RLS
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 RLS ON' ELSE '🔓 RLS OFF' END as estado
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity DESC, tablename;
```

### Ver Políticas Activas

```sql
-- Contar políticas por tabla
SELECT 
  tablename,
  COUNT(*) as total_politicas
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY total_politicas DESC;

-- Ver detalle de políticas
SELECT 
  tablename,
  policyname,
  cmd as operacion
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Limpiar Todas las Políticas

```sql
-- Ejecutar solo si necesitas resetear todo
DO $$ 
DECLARE
    pol RECORD;
    tabla TEXT;
BEGIN
    FOR tabla IN 
        SELECT DISTINCT tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = tabla
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, tabla);
        END LOOP;
    END LOOP;
END $$;
```

---

## 🎯 Uso Común

### Aplicar Configuración Completa

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta `POLITICAS_RLS_DEFINITIVAS.sql`
3. Verifica resultado al final del script

### Verificar que Funciona

```javascript
// En la consola del navegador (F12)
const { data: { session } } = await supabase.auth.getSession()
console.log('User ID:', session?.user?.id)

// Probar ver cursos comprados
const { data, error } = await supabase
  .from('course_purchases')
  .select('*, courses(*)')
  
console.log('Compras:', data)
console.log('Error:', error) // Debe ser null
```

---

## 🚨 Solución Rápida de Problemas

### Error 403 Forbidden

```sql
-- Verificar si tabla tiene RLS sin políticas
SELECT 
  t.tablename,
  t.rowsecurity as rls_on,
  COUNT(p.policyname) as num_policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename = 'nombre_tabla'
GROUP BY t.tablename, t.rowsecurity;

-- Si RLS = true y num_policies = 0 → Ejecutar script completo
```

### Error 500 en JOINs

```sql
-- Verificar estado de ambas tablas en el JOIN
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('course_purchases', 'courses');

-- Solución: Ejecutar POLITICAS_RLS_DEFINITIVAS.sql
```

---

## 📋 Checklist de Verificación

Después de aplicar políticas:

- [ ] Ejecutado `POLITICAS_RLS_DEFINITIVAS.sql` completo
- [ ] Verificado: 10 tablas con RLS OFF
- [ ] Verificado: 8 tablas con RLS ON
- [ ] Verificado: Total de 11 políticas activas
- [ ] Probado: Usuario ve sus cursos en `/cursos/mi-escuela`
- [ ] Probado: Admin puede editar en `/administrator/cursos`
- [ ] Sin errores 403, 406 o 500 en consola

---

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| `POLITICAS_RLS_DEFINITIVAS.sql` | Script SQL completo con comentarios |
| `POLITICAS_RLS_EXPLICADAS.md` | Guía detallada con casos de uso |
| `/docs/POLITICAS_RLS_RESUMEN.md` | Resumen ejecutivo |
| `README.md` | Documentación general Supabase |

---

## 🔑 Reglas de Oro

1. **Contenido público** → SIN RLS
2. **Datos personales** → CON RLS
3. **Duda?** → Ver `POLITICAS_RLS_EXPLICADAS.md`
4. **Problema?** → Ejecutar script completo de nuevo

---

**Última actualización:** 15 Enero 2026  
**Versión:** 1.0 DEFINITIVA
