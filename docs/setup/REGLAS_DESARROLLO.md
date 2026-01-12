# Reglas de Desarrollo - Hakadogs

## 🚨 REGLA CRÍTICA: Verificación Obligatoria Antes de Deploy

### ⚠️ NUNCA hacer commit/push sin verificar compilación

**SIEMPRE** antes de hacer `git commit` y `git push`, se debe:

1. ✅ **Compilar el proyecto completo**
   ```bash
   npm run build
   ```

2. ✅ **Verificar que NO haya errores de compilación**
   - Solo se permiten warnings (advertencias)
   - Los errores (Error:) bloquean el commit

3. ✅ **Solo entonces hacer commit y push**
   ```bash
   git add .
   git commit -m "mensaje"
   git push origin main
   ```

### 🎯 Objetivo

- **Ahorrar deploys en Vercel**: Cada push a `main` genera un deploy
- **Evitar builds fallidos**: Los errores se detectan localmente
- **Tiempo de desarrollo**: No esperar a que Vercel falle para ver errores

### 📋 Checklist Pre-Commit

Antes de cada commit, verificar:

- [ ] `npm run build` ejecutado correctamente
- [ ] Exit code = 0 (compilación exitosa)
- [ ] Solo warnings permitidos, sin errores
- [ ] Archivos modificados testeados localmente
- [ ] TypeScript sin errores críticos

### 🔧 Automatización

Este proyecto incluye un pre-commit hook que:
- Se ejecuta automáticamente antes de cada commit
- Compila el proyecto
- Bloquea el commit si hay errores
- Permite el commit solo si la compilación es exitosa

### ❌ Errores Comunes a Evitar

1. **Variables reservadas de Next.js**
   - ❌ No usar `module` como nombre de variable
   - ✅ Usar `courseModule`, `blogModule`, etc.

2. **Imports faltantes**
   - Verificar que todos los imports estén correctos
   - Verificar que los componentes existan

3. **Props de TypeScript**
   - Verificar tipos correctos
   - No usar `any` sin necesidad

4. **JSX/TSX mal cerrado**
   - Verificar que todos los tags estén cerrados
   - Verificar indentación correcta

### 🚀 Workflow Correcto

```bash
# 1. Hacer cambios en archivos
# 2. Verificar compilación
npm run build

# 3. Si compila OK (Exit code: 0)
git add .
git commit -m "Feature: descripción del cambio"
git push origin main

# 4. Vercel desplegará automáticamente
```

### ⏱️ Beneficios

- ✅ **Ahorro de tiempo**: No esperar a que Vercel compile para ver errores
- ✅ **Ahorro de costos**: Menos deploys fallidos en Vercel
- ✅ **Código de calidad**: Errores detectados antes de push
- ✅ **Historial limpio**: Solo commits que funcionan

### 📝 Notas

- Los **warnings** (advertencias) están permitidos
- Solo los **errors** (errores) bloquean el commit
- Esta regla aplica para **TODOS** los desarrolladores del proyecto
- No hacer push directo sin verificar compilación

---

**Última actualización**: 11 de Enero de 2026  
**Versión**: 1.0
