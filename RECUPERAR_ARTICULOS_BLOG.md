# 🚨 RECUPERACIÓN DE EMERGENCIA: Artículos del Blog Borrados

## ⚡ SOLUCIÓN RÁPIDA (5 minutos)

### Opción 1: Restaurar desde Supabase (RECOMENDADO)

Supabase tiene **Point-in-Time Recovery (PITR)** si estás en el plan Pro o superior.

#### Pasos:

1. **Ve a tu Dashboard de Supabase**: https://supabase.com/dashboard/project/pfmqkioftagjnxqyrngk

2. **Navega a Database → Backups**

3. **Verifica si tienes PITR habilitado**:
   - Si lo tienes: Haz clic en **"Restore to point in time"**
   - Selecciona una fecha/hora de hace 10-15 minutos (antes de borrar)
   - Confirma la restauración

4. **Si NO tienes PITR pero tienes backups automáticos**:
   - Ve a **Database → Backups**
   - Selecciona el backup más reciente
   - Haz clic en **"Restore"**
   - ⚠️ Esto restaurará TODA la base de datos al punto del backup

### Opción 2: Recuperar desde la Papelera de Supabase

Si los artículos fueron marcados como "deleted" pero no eliminados físicamente:

```sql
-- Ejecuta esto en SQL Editor para ver si hay artículos "borrados"
SELECT id, title, status, created_at, updated_at
FROM blog_posts
WHERE status = 'deleted' OR deleted_at IS NOT NULL
ORDER BY updated_at DESC;
```

Si ves resultados, puedes restaurarlos:

```sql
-- Restaurar todos los artículos borrados
UPDATE blog_posts
SET status = 'published', deleted_at = NULL
WHERE status = 'deleted' OR deleted_at IS NOT NULL;
```

### Opción 3: Recuperar desde el Historial de Supabase

Supabase mantiene un historial de cambios recientes:

1. Ve a **Table Editor** → `blog_posts`
2. En la parte superior, busca el ícono de **"History"** (reloj)
3. Revisa los cambios recientes
4. Si ves el DELETE masivo, podrías ver los datos antes del cambio

---

## 🔍 DIAGNÓSTICO

Primero, vamos a verificar si realmente se borraron o solo cambiaron de estado:

### Script de Verificación

Ejecuta esto en **Supabase SQL Editor**:

```sql
-- 1. Contar artículos actuales
SELECT COUNT(*) as total_articulos FROM blog_posts;

-- 2. Ver artículos por estado
SELECT status, COUNT(*) as cantidad
FROM blog_posts
GROUP BY status;

-- 3. Ver últimos cambios
SELECT id, title, status, updated_at
FROM blog_posts
ORDER BY updated_at DESC
LIMIT 10;
```

---

## 💾 BACKUP MANUAL URGENTE

Si logras recuperar los artículos, haz un backup inmediato:

### Exportar a CSV

```sql
-- En SQL Editor, ejecuta esto y descarga el resultado
SELECT * FROM blog_posts ORDER BY created_at DESC;
```

Haz clic en **"Download as CSV"** para guardar una copia local.

### Exportar a JSON

```sql
-- Exportar artículos como JSON
SELECT json_agg(row_to_json(t))
FROM (
  SELECT * FROM blog_posts ORDER BY created_at DESC
) t;
```

Copia el resultado y guárdalo en un archivo `blog_posts_backup.json`.

---

## 🔧 PREVENCIÓN FUTURA

### 1. Activar Soft Delete

Modifica la tabla para no borrar físicamente:

```sql
-- Agregar columna deleted_at si no existe
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Crear función para soft delete
CREATE OR REPLACE FUNCTION soft_delete_blog_post()
RETURNS TRIGGER AS $$
BEGIN
  -- En lugar de DELETE, hacer UPDATE
  UPDATE blog_posts
  SET deleted_at = NOW(), status = 'deleted'
  WHERE id = OLD.id;
  RETURN NULL; -- Prevenir el DELETE físico
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS soft_delete_blog_posts_trigger ON blog_posts;
CREATE TRIGGER soft_delete_blog_posts_trigger
BEFORE DELETE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION soft_delete_blog_post();
```

### 2. Habilitar PITR en Supabase

1. Ve a **Settings → Billing**
2. Actualiza al plan **Pro** ($25/mes)
3. Ve a **Database → Backups**
4. Activa **Point-in-Time Recovery**

### 3. Backups Automáticos Locales

Crea un cron job o tarea programada para hacer backups diarios:

```bash
# Ejecutar diariamente
node scripts/backup-blog-posts.js
```

---

## 📞 SOPORTE URGENTE

Si nada funciona, contacta al soporte de Supabase:

1. **Discord de Supabase**: https://discord.supabase.com
2. **Email**: support@supabase.io
3. **Chat en Dashboard**: Ícono de ayuda en la esquina inferior derecha

Menciona:
- **Project ID**: pfmqkioftagjnxqyrngk
- **Tabla afectada**: blog_posts
- **Acción**: DELETE accidental masivo
- **Hora aproximada**: [hora actual]

---

## ⚡ SCRIPT DE RESTAURACIÓN (Si tienes backup)

Si tienes un backup en formato JSON o CSV:

```javascript
// scripts/restore-blog-posts.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const backupData = JSON.parse(fs.readFileSync('blog_posts_backup.json', 'utf-8'))

async function restore() {
  for (const post of backupData) {
    const { error } = await supabase
      .from('blog_posts')
      .insert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        // ... resto de campos
      })
    
    if (error) {
      console.error('Error:', post.title, error.message)
    } else {
      console.log('✅ Restaurado:', post.title)
    }
  }
}

restore()
```

---

## 🎯 ACCIÓN INMEDIATA

**AHORA MISMO**, ejecuta estos comandos en orden:

1. **Verificar estado**:
   ```sql
   SELECT COUNT(*) FROM blog_posts;
   ```

2. **Si el COUNT es 0**, verifica la papelera:
   ```sql
   SELECT * FROM blog_posts WHERE deleted_at IS NOT NULL;
   ```

3. **Contacta a Supabase Support** inmediatamente si no puedes recuperarlos.

---

**Última actualización**: 28 de enero de 2026  
**Estado**: 🚨 EMERGENCIA - Recuperación de datos
