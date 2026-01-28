# 🔄 RECUPERACIÓN DESDE AIRTABLE

## ✅ ¡EXCELENTE! Tienes backup en Airtable

## 📋 Pasos para Recuperar (10 minutos)

### 1️⃣ Exportar desde Airtable (2 min)

1. Abre tu base de Airtable con los artículos del blog
2. Ve a la vista de **Grid** (tabla)
3. Haz clic en el botón **"..."** (tres puntos) en la esquina superior derecha
4. Selecciona **"Download CSV"**
5. Guarda el archivo como: `blog_articles_backup.csv`
6. Mueve el archivo a la raíz de tu proyecto: `E:\Acttax Dropbox\...\hakadogsnewweb\blog_articles_backup.csv`

### 2️⃣ Instalar dependencia (30 seg)

```bash
cd "E:\Acttax Dropbox\Narciso Pardo\Eskala IA\W - HAKADOGS\hakadogsnewweb"
npm install csv-parser
```

### 3️⃣ Ajustar nombres de columnas (1 min)

Abre el archivo `scripts/import-from-airtable.js` y verifica las líneas 68-73:

```javascript
const title = article['Title'] || article['Título'] || article['title']
const content = article['Content'] || article['Contenido'] || article['content']
const excerpt = article['Excerpt'] || article['Extracto'] || article['excerpt']
const status = article['Status'] || article['Estado'] || article['status'] || 'published'
const categoryName = article['Category'] || article['Categoría'] || article['category']
const featuredImage = article['Featured Image'] || article['Imagen Destacada'] || article['featured_image']
```

**Ajusta los nombres según las columnas de tu Airtable**. Por ejemplo:
- Si tu columna se llama "Titulo" → agrega `|| article['Titulo']`
- Si tu columna se llama "Texto" → cambia `'Content'` por `'Texto'`

### 4️⃣ Ejecutar importación (5 min)

```bash
node scripts/import-from-airtable.js
```

Verás algo como:
```
📂 Leyendo archivo CSV...
✅ Encontrados 15 artículos en CSV
📝 Importando a Supabase...
   ✅ 1/15 - Cómo enseñar a tu perro a caminar sin tirar...
   ✅ 2/15 - Los 5 errores más comunes en la educación...
   ...
🎉 IMPORTACIÓN COMPLETADA
✅ Importados: 15
❌ Errores: 0
```

### 5️⃣ Verificar (1 min)

1. Ve a: https://www.hakadogs.com/administrator/blog
2. Deberías ver todos tus artículos restaurados
3. Verifica que los títulos, contenido y categorías estén correctos

---

## 🔧 Mapeo de Campos

El script asume estas columnas de Airtable:

| Campo Airtable | Campo Supabase | Requerido |
|---------------|----------------|-----------|
| Title / Título | title | ✅ Sí |
| Content / Contenido | content | ✅ Sí |
| Excerpt / Extracto | excerpt | ❌ No |
| Status / Estado | status | ❌ No (default: published) |
| Category / Categoría | category_id | ❌ No |
| Featured Image / Imagen Destacada | featured_image_url | ❌ No |

### Campos Generados Automáticamente:

- **slug**: Se genera desde el título
- **reading_time_minutes**: Se calcula desde el contenido
- **seo_title**: Primeros 60 caracteres del título
- **seo_description**: Primeros 160 caracteres del excerpt o contenido
- **created_at / updated_at**: Fecha actual

---

## ⚠️ Troubleshooting

### Error: "Cannot find module 'csv-parser'"

```bash
npm install csv-parser
```

### Error: "No such file or directory 'blog_articles_backup.csv'"

El archivo CSV debe estar en la raíz del proyecto:
```
hakadogsnewweb/
  ├── blog_articles_backup.csv  ← Aquí
  ├── scripts/
  ├── app/
  └── ...
```

### Columnas no se encuentran

Abre el CSV con un editor de texto y verifica los nombres exactos de las columnas en la primera línea.

Ejemplo de CSV:
```
Title,Content,Category,Status
"Primer artículo","Este es el contenido...","Educación","published"
```

Luego actualiza el script:
```javascript
const title = article['Title']        // Nombre exacto
const content = article['Content']    // Nombre exacto
const categoryName = article['Category']  // Nombre exacto
```

### Artículos duplicados

Si ejecutas el script varias veces, podrías crear duplicados. El script agrega un timestamp al slug para evitarlo, pero puedes limpiar primero:

```sql
-- SOLO si quieres empezar de cero (¡CUIDADO!)
DELETE FROM blog_posts;
```

---

## 🎯 Después de Importar

### 1. Verificar imágenes

Si tus artículos tienen imágenes de Airtable, probablemente necesites:
- Descargar las imágenes de Airtable
- Subirlas a Supabase Storage (`blog-images` bucket)
- Actualizar las URLs en los artículos

### 2. Revisar fechas

El script usa la fecha actual para `created_at`. Si necesitas las fechas originales:
1. Exporta también la columna de fecha desde Airtable
2. Ajusta el script para usar esa fecha

### 3. Revisar SEO

El script genera SEO automático. Revisa que:
- Los títulos SEO sean apropiados
- Las descripciones SEO sean relevantes
- Las keywords estén completas

---

## 📝 Notas Importantes

1. **El script NO borra artículos existentes** - Solo inserta nuevos
2. **Crea categorías automáticamente** si no existen
3. **Genera slugs únicos** para evitar duplicados
4. **Status por defecto**: `published` (todos los artículos estarán visibles)

---

## 🚀 ¡Listo para Ejecutar!

```bash
# 1. Instalar dependencia
npm install csv-parser

# 2. Colocar CSV en la raíz
# blog_articles_backup.csv

# 3. Ejecutar importación
node scripts/import-from-airtable.js

# 4. Verificar
# https://www.hakadogs.com/administrator/blog
```

---

**Última actualización**: 28 de enero de 2026  
**Estado**: ✅ Solución lista para ejecutar
