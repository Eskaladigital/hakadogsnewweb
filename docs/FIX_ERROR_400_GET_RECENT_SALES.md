# 🚨 FIX: Error 400 en get_recent_sales

## Problema
```
POST https://pfmqkioftagjnxqyrngk.supabase.co/rest/v1/rpc/get_recent_sales 400 (Bad Request)
```

Este error aparece en el panel de administrador al intentar cargar las ventas recientes.

---

## ✅ SOLUCIÓN RÁPIDA (5 minutos)

### Paso 1: Ir a Supabase SQL Editor
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**

### Paso 2: Ejecutar el Script de Fix
Copia y pega el contenido del archivo `supabase/FIX_GET_RECENT_SALES.sql` y ejecútalo:

```sql
-- Ver contenido de: supabase/FIX_GET_RECENT_SALES.sql
```

### Paso 3: Verificar que Funcionó
Ejecuta esta consulta para probar la función:

```sql
SELECT * FROM get_recent_sales(5);
```

**Resultado esperado**: Debe devolver las 5 ventas más recientes (o una tabla vacía si no hay ventas).

**Si hay error**: Copia el mensaje de error completo.

---

## 🔍 ¿Por qué ocurre este error?

El error 400 generalmente ocurre por:

1. **La función no existe**: No se ejecutó el script `dashboard_functions.sql`
2. **Problemas de permisos**: La función existe pero no tiene los permisos correctos
3. **Formato de retorno incorrecto**: El tipo de datos devuelto no coincide con lo esperado
4. **Conflicto con versión anterior**: Hay múltiples versiones de la función

---

## 🛠️ SOLUCIÓN ALTERNATIVA (Temporal)

Si el error persiste después de ejecutar el fix, puedes comentar temporalmente la llamada a esta función:

### Archivo: `app/administrator/page.tsx`

Buscar la sección donde se cargan las ventas recientes y agregar un try-catch:

```typescript
// Cargar datos del dashboard
const loadData = async () => {
  try {
    setLoading(true)
    
    const [stats, users, sales, contacts] = await Promise.all([
      getDashboardStats(),
      getRecentUsers(5),
      getRecentSales(10).catch(() => []), // ← Agregar .catch(() => [])
      getRecentContacts(5)
    ])
    
    setDashboardData({ stats, users, sales, contacts })
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    setLoading(false)
  }
}
```

Esto permitirá que el dashboard cargue aunque falle la función de ventas recientes.

---

## 📋 Verificar Todas las Funciones RPC

Ejecuta esta consulta para ver todas las funciones del dashboard:

```sql
SELECT 
  routine_name, 
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'get_%'
ORDER BY routine_name;
```

**Funciones requeridas**:
- ✅ `get_dashboard_stats`
- ✅ `get_recent_users`
- ✅ `get_recent_sales` ← **Esta está fallando**
- ✅ `get_recent_contacts`
- ✅ `get_sales_chart_data`
- ✅ `get_top_selling_courses`
- ✅ `get_conversion_metrics`

---

## 🆘 Si Sigue el Error

Si después de ejecutar el fix sigue apareciendo el error:

1. **Captura el error completo de la consola del navegador**
2. **Ejecuta en Supabase SQL Editor**:
   ```sql
   SELECT * FROM get_recent_sales(10);
   ```
3. **Verifica si hay datos en `user_courses`**:
   ```sql
   SELECT COUNT(*) FROM user_courses WHERE purchase_date IS NOT NULL;
   ```
4. **Comparte los resultados** para diagnosticar mejor el problema

---

## 📝 Documentación Relacionada

- `supabase/dashboard_functions.sql` - Funciones originales del dashboard
- `docs/audits/ADMIN_PANEL_COMPLETE.md` - Documentación del panel admin
- `ERRORES_Y_SOLUCIONES.md` - Listado completo de errores conocidos
