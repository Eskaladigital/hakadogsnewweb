# 🔒 Políticas RLS - Resumen Ejecutivo

**Última actualización:** 15 Enero 2026  
**Estado:** ✅ Funcionando en producción

---

## 🎯 ¿Qué son las Políticas RLS?

**RLS (Row Level Security)** controla qué filas de una tabla puede ver/modificar cada usuario en la base de datos.

**En Hakadogs:** Usadas para evitar que un usuario vea datos personales de otro.

---

## ⚡ Configuración Actual (Simplificada)

### ✅ Lo que FUNCIONA:

- ✅ Usuarios ven sus cursos comprados en `/cursos/mi-escuela`
- ✅ Admin puede editar/borrar cursos en `/administrator`
- ✅ Un usuario NO puede ver progreso/badges de otro
- ✅ Sin errores 403, 406 o 500

### 📊 Tablas por Estado:

| Estado | Cantidad | Ejemplos |
|--------|----------|----------|
| 🔓 Sin RLS | 10 | courses, course_lessons, badges, blog_posts |
| 🔒 Con RLS | 8 | user_progress, course_purchases, user_badges |

**Total políticas activas:** 11 (reducidas de 40+ a 11)

---

## 📁 Archivos Importantes

### En `/supabase/`

1. **`POLITICAS_RLS_DEFINITIVAS.sql`** ⭐ Script SQL principal
   - Limpia todas las políticas existentes
   - Aplica configuración definitiva
   - Incluye verificación al final

2. **`POLITICAS_RLS_EXPLICADAS.md`** 📖 Guía completa
   - Explicación detallada de cada política
   - Casos de uso
   - Solución de problemas

3. **`README.md`** 📋 Documentación general de Supabase

---

## 🚀 Aplicar Políticas

### Método 1: Desde Supabase Dashboard

```bash
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. SQL Editor → New Query
4. Copia POLITICAS_RLS_DEFINITIVAS.sql
5. Run (Ctrl+Enter)
6. Verifica resultado al final
```

### Método 2: Desde código

```bash
# Si tienes Supabase CLI instalado
supabase db push
```

---

## 🔍 Verificar Estado Actual

### Desde Supabase SQL Editor:

```sql
-- Ver estado de RLS por tabla
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ON' ELSE '🔓 OFF' END as rls
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE '%course%' OR tablename LIKE '%user_%'
ORDER BY tablename;

-- Ver políticas activas
SELECT tablename, COUNT(*) as politicas
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY politicas DESC;
```

**Resultado esperado:**
- 10 tablas con RLS OFF
- 8 tablas con RLS ON
- Total de 11 políticas

---

## 🚨 Problemas Comunes

### Error 403 Forbidden

**Causa:** Tabla tiene RLS ON pero sin políticas  
**Solución:** Ejecutar `POLITICAS_RLS_DEFINITIVAS.sql`

### Error 500 en JOINs

**Causa:** JOIN entre tabla con RLS y tabla sin RLS  
**Solución:** Ya está solucionado en la configuración actual

### Usuario no ve sus cursos

**Causa:** Política no aplicada correctamente  
**Solución:** 
1. Verificar que el usuario está logueado
2. Ejecutar script completo de nuevo
3. Ver guía en `POLITICAS_RLS_EXPLICADAS.md`

---

## 📖 Leer Más

- **Guía Completa:** `/supabase/POLITICAS_RLS_EXPLICADAS.md`
- **Script SQL:** `/supabase/POLITICAS_RLS_DEFINITIVAS.sql`
- **Docs Supabase:** `/supabase/README.md`

---

## 🔑 Reglas de Oro

1. **Si es contenido público** → SIN RLS
2. **Si son datos personales** → CON RLS
3. **Simplicidad** → Menos políticas = menos problemas
4. **Siempre probar** → Verificar después de cambios

---

**¿Dudas?** Lee la guía completa en `/supabase/POLITICAS_RLS_EXPLICADAS.md`
