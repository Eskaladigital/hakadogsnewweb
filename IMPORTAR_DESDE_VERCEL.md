# 🚀 CÓMO IMPORTAR BLOG DESDE VERCEL

Tus variables están en Vercel, así que tienes 2 opciones:

---

## ✅ OPCIÓN 1: Usar CLI de Vercel (AUTOMÁTICO)

### 1. Instalar Vercel CLI (si no la tienes)
```bash
npm install -g vercel
```

### 2. Ejecutar el script automático
```bash
scripts\download-env-and-import.bat
```

Este script:
- ✅ Descarga automáticamente las variables de Vercel
- ✅ Crea el `.env.local` 
- ✅ Ejecuta la importación

---

## ✅ OPCIÓN 2: Manual (5 minutos)

### 1. Ve a tu proyecto en Vercel
https://vercel.com/dashboard → Tu proyecto → Settings → Environment Variables

### 2. Copia estas 2 variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Crea archivo `.env.local` en la raíz del proyecto

Contenido:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_valor_de_vercel
SUPABASE_SERVICE_ROLE_KEY=tu_valor_de_vercel
```

### 4. Ejecuta la importación
```bash
node scripts/run-import.js
```

---

## 🎯 ¿Cuál usar?

- **CLI de Vercel**: Más rápido, automático
- **Manual**: Si no tienes la CLI o prefieres control total

---

## ⚠️ IMPORTANTE

Después de importar, puedes:
- ✅ Eliminar el `.env.local` (no se subirá a Git, está en .gitignore)
- ✅ O dejarlo para desarrollo local

---

**¿Qué prefieres?**
1. Ejecutar `scripts\download-env-and-import.bat` (opción CLI)
2. Crear `.env.local` manual y ejecutar `node scripts/run-import.js`
