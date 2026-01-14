# ✅ SCRIPT DE IMPORTACIÓN DE BLOG CREADO

## 📦 Qué se ha creado:

1. **`scripts/import-blog-posts.js`** - Script principal de Node.js
2. **`scripts/README_IMPORT_BLOG.md`** - Documentación completa
3. **`scripts/import-blog.bat`** - Script de Windows para ejecución fácil
4. **`.gitignore`** actualizado - Para no subir CSVs al repositorio

## 🚀 CÓMO EJECUTAR (3 pasos)

### 1️⃣ Preparación (solo la primera vez)

Asegúrate de tener en tu `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Usa la `service_role` key, NO la `anon` key.  
La encuentras en: **Supabase Panel → Settings → API → service_role**

### 2️⃣ Ejecutar

**Opción A - Windows (doble clic):**
```
scripts\import-blog.bat
```

**Opción B - Línea de comandos:**
```bash
node scripts/import-blog-posts.js
```

### 3️⃣ Verificar

1. Ve a `/administrator/blog` en tu app
2. Deberías ver todos los artículos importados
3. Los que tenían "Publicado = checked" están con `status: published`
4. Los demás están como `status: draft`

## 📊 Qué hace el script:

✅ Lee el CSV `Table 1-Grid view (1).csv`  
✅ Parsea artículos con contenido multilínea  
✅ Genera slugs automáticos  
✅ Calcula tiempo de lectura  
✅ Extrae excerpts  
✅ Parsea fechas del CSV  
✅ Inserta en lotes de 50  
✅ Usa UPSERT (actualiza si existe el slug)  
✅ Asigna el primer admin como autor  

## 🎯 Después de importar:

1. **Revisar artículos** en el panel de administración
2. **Asignar categorías** (ahora están sin categoría)
3. **Verificar imágenes** destacadas
4. **Publicar drafts** si están listos
5. **Ajustar SEO** si es necesario

## 📝 Notas:

- El script NO borra artículos existentes
- Si un artículo tiene el mismo slug, se actualiza
- El CSV NO se sube a GitHub (está en .gitignore)
- Los artículos se insertan con `author_id` del primer admin

## 🐛 Si algo falla:

Lee el archivo completo: **`scripts/README_IMPORT_BLOG.md`**  
Tiene troubleshooting detallado.

---

**Commits realizados:**
- `8a2ba54` - feat: script para importar articulos del blog desde CSV a Supabase
- `339e745` - chore: ignorar archivos CSV de imports en git

✅ Todo listo para ejecutar cuando quieras!
