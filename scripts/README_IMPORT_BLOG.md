# Importar Artículos del Blog desde CSV

Este script importa los artículos del archivo CSV `Table 1-Grid view (1).csv` a la tabla `blog_posts` de Supabase.

## 📋 Requisitos Previos

1. **Node.js** instalado (v16 o superior)
2. **Variables de entorno** configuradas en `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```
   
   ⚠️ **IMPORTANTE**: Necesitas la `service_role_key`, NO la `anon` key. La encuentras en:
   - Panel de Supabase → Settings → API → Project API keys → `service_role` key

3. **Paquete @supabase/supabase-js** instalado (ya lo tienes en el proyecto)

## 🚀 Cómo Ejecutar

### Opción 1: Ejecución directa

```bash
# Desde la raíz del proyecto
node scripts/import-blog-posts.js
```

### Opción 2: Dry run (ver qué se insertaría sin hacerlo)

Edita el script `import-blog-posts.js` y cambia:
```javascript
const DRY_RUN = true  // Cambiar a true
```

Luego ejecuta:
```bash
node scripts/import-blog-posts.js
```

## 📊 Mapeo de Columnas CSV → Supabase

El script mapea automáticamente:

| CSV Column | Supabase Column | Notas |
|------------|----------------|-------|
| `Titulo` | `title` | Título del artículo |
| `Articulo` | `content` | Contenido completo (HTML) |
| `Titulo` (generado) | `slug` | Slug auto-generado del título |
| `Articulo` (extracto) | `excerpt` | Primeros 200 caracteres |
| `Imagen creada` | `featured_image_url` | URL de imagen destacada |
| `Publicado` | `status` | "published" si checked, sino "draft" |
| `Publicado` (fecha) | `published_at` | Fecha de publicación |
| `Creacion` | `created_at` | Fecha de creación |
| `Modificado` | `updated_at` | Fecha de modificación |
| (calculado) | `reading_time_minutes` | Basado en cantidad de palabras |
| (admin) | `author_id` | ID del primer usuario admin |

## 🔧 Configuración del Script

Puedes ajustar estas variables en el script:

```javascript
const BATCH_SIZE = 50      // Número de artículos por lote
const DRY_RUN = false      // true = no insertar, solo mostrar
```

## ✅ Qué Hace el Script

1. ✓ Lee el archivo CSV y parsea filas multilínea
2. ✓ Genera slugs automáticos a partir de los títulos
3. ✓ Calcula tiempo de lectura (200 palabras/min)
4. ✓ Extrae excerpts del contenido
5. ✓ Determina status (published/draft) según columnas
6. ✓ Parsea fechas en formato MM/DD/YYYY HH:MMam/pm
7. ✓ Inserta en lotes de 50 para eficiencia
8. ✓ Usa **UPSERT** por slug (actualiza si existe, inserta si no)
9. ✓ Maneja errores por lote

## 🎯 Después de la Importación

Una vez ejecutado, deberías:

1. **Revisar en el panel admin** (`/administrator/blog`)
2. **Asignar categorías** a los posts si es necesario
3. **Verificar imágenes** destacadas (URLs)
4. **Ajustar SEO** si hace falta (títulos, descripciones)
5. **Publicar** los que estén como draft

## 🐛 Solución de Problemas

### Error: "supabaseUrl is required"

- Falta la variable `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`
- Asegúrate de cargar las variables: `export $(cat .env.local | xargs)` (Linux/Mac)

### Error: "No se encontró ningún usuario admin"

- Crea un usuario admin primero en tu base de datos
- O modifica el script para usar otro `user_id` fijo

### Error: "Cannot read property 'split' of undefined"

- El CSV tiene un formato inesperado
- Revisa que las columnas coincidan con el header

### Duplicados por slug

- El script usa UPSERT, así que actualizará posts existentes con el mismo slug
- Si quieres ignorar duplicados, cambia `ignoreDuplicates: true`

## 📝 Notas Importantes

- **Service Role Key**: Este script usa la service_role key que bypasea RLS. Úsala solo en scripts de servidor, NUNCA en el cliente.
- **Backup**: Haz un backup de la tabla antes de ejecutar por primera vez
- **Categorías**: Los posts se insertarán sin categoría (`category_id: null`), asígnalas manualmente después
- **Imágenes**: Las URLs de `Imagen creada` deben ser válidas y accesibles

## 🔐 Seguridad

⚠️ **NUNCA** commits el `.env.local` con las keys de Supabase al repositorio.

El archivo ya está en `.gitignore`, pero verifica antes de hacer commit.

## 📞 Soporte

Si algo falla, revisa:
1. Los logs del script (son muy descriptivos)
2. La consola de Supabase → Database → Logs
3. Que las políticas RLS permitan insertar con service_role

---

**Última actualización**: Enero 2026
