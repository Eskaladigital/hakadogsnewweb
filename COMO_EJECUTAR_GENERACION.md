# 🔧 GUÍA: Ejecutar Script de Generación de Contenido

## ⚠️ El script falló porque faltan las API keys en local

### 📝 Solución:

1. **Crea/edita el archivo `.env.local`** en la raíz del proyecto:

```bash
# APIs para generación de contenido
OPENAI_API_KEY=tu_openai_key_aqui
SERPAPI_API_KEY=c35780c715f23ed8718c6cb9fca5f74a98ba20b5eb97f88988102181ba1230b9

# Supabase (ya las tienes)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

2. **Reinicia el servidor**:
```bash
# Detén el servidor (Ctrl+C en la terminal)
npm run dev
```

3. **Ejecuta el script**:
```bash
# Prueba con 3 ciudades primero
npm run generate-cities-test

# O todas las ciudades (20+)
npm run generate-cities
```

---

## 🎯 Alternativa: Ejecutar DESPUÉS del Deploy

**Opción más simple:**

1. Haz commit y push de todo
2. Espera a que Vercel despliegue (con las APIs configuradas)
3. Ejecuta el script apuntando a producción:

```bash
NEXT_PUBLIC_SITE_URL=https://www.hakadogs.com npm run generate-cities
```

Esto usará las APIs configuradas en Vercel y generará el contenido directamente en producción.

---

## 💡 ¿Qué Prefieres?

**A)** Configurar APIs en `.env.local` y generar ahora
**B)** Commit + Push + Deploy, y generar después en producción
**C)** Crear panel admin web para generar (clic en botón, no script)

**Opción B es la más rápida si ya tienes las APIs en Vercel** ✅
