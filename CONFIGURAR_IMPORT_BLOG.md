# ⚠️ CONFIGURACIÓN NECESARIA PARA IMPORTAR BLOG

El script de importación necesita las credenciales de Supabase.

## 📋 Pasos para Configurar

### Opción 1: Crear archivo `.env.local` (RECOMENDADO)

Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**¿Dónde encontrar las keys?**
1. Ve a tu panel de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **URL**: Project URL
   - **service_role key**: (NO la anon key)

### Opción 2: Variables de entorno del sistema

En PowerShell (Windows):
```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Luego ejecuta:
```powershell
node scripts/run-import.js
```

### Opción 3: Crear desde el script

Si prefieres, puedo crear un script que te pida las credenciales de forma interactiva.

---

## ⚠️ IMPORTANTE: Seguridad

- **NUNCA** hagas commit del `.env.local` con las keys reales
- El `.env.local` ya está en `.gitignore`
- La `service_role_key` tiene permisos totales - úsala solo en scripts de servidor
- Después de importar, puedes eliminar el `.env.local` si quieres

---

## 🚀 Una vez configurado:

Ejecuta:
```bash
node scripts/run-import.js
```

O simplemente:
```bash
scripts\import-blog.bat
```

---

**Estado actual**: ❌ Sin configurar  
**Siguiente paso**: Crear `.env.local` con las credenciales
