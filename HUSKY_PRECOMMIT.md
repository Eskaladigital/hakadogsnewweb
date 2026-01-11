# 🛡️ Sistema de Verificación Automática Pre-Commit

## ¿Qué es esto?

Este proyecto incluye un **sistema automático de verificación** que se ejecuta antes de cada commit para asegurar que el código compile correctamente antes de subirlo a Vercel.

## 🎯 Objetivo

**Ahorrar deploys en Vercel** verificando que el código compile localmente antes de hacer push.

## ⚙️ Cómo Funciona

### 1. Pre-Commit Hook Automático

Cuando ejecutas `git commit`, automáticamente:

```
🔍 Verificando compilación antes del commit...
⏳ Ejecutando: npm run build

[... salida de compilación ...]

✅ Compilación exitosa
✅ Commit permitido
```

Si hay errores:

```
❌ ERROR: La compilación falló
⛔ COMMIT BLOQUEADO

📋 Por favor:
   1. Revisa los errores arriba
   2. Corrige los errores en el código
   3. Ejecuta 'npm run build' manualmente
   4. Cuando compile sin errores, intenta el commit de nuevo
```

### 2. Configuración Incluida

El proyecto ya está configurado con:
- ✅ **Husky** instalado (`package.json`)
- ✅ **Pre-commit hook** configurado (`.husky/pre-commit`)
- ✅ **Script prepare** en package.json
- ✅ **Documentación** de reglas (`REGLAS_DESARROLLO.md`)

## 🚀 Uso Normal

```bash
# 1. Hacer cambios en archivos
# (editar código normalmente)

# 2. Agregar archivos al stage
git add .

# 3. Hacer commit (verificación automática)
git commit -m "Feature: mi cambio"

# Si compila OK:
✅ Commit creado exitosamente

# 4. Push a repositorio
git push origin main
```

## ❌ Si el Commit es Bloqueado

```bash
# 1. Revisar los errores mostrados en consola
# 2. Corregir los errores en el código
# 3. Ejecutar build manualmente para verificar
npm run build

# 4. Si compila OK, volver a intentar commit
git add .
git commit -m "Feature: mi cambio"
```

## 🔧 Instalación/Reinstalación

Si por alguna razón los hooks no funcionan:

```bash
# Reinstalar Husky
npm install

# Esto ejecutará automáticamente 'npm run prepare'
# que configura los hooks
```

## 📋 Verificación Manual

Siempre puedes verificar manualmente antes de commit:

```bash
# Compilar proyecto
npm run build

# Ver si hay errores
# Exit code 0 = OK
# Exit code 1 = Error
echo $?  # Linux/Mac
echo $LASTEXITCODE  # Windows PowerShell
```

## 🎛️ Bypass del Hook (NO RECOMENDADO)

En casos excepcionales donde necesites hacer commit sin verificar:

```bash
git commit -m "mensaje" --no-verify
```

**⚠️ ADVERTENCIA**: Esto saltará la verificación y puede causar un deploy fallido en Vercel.

## 📊 Beneficios

1. ✅ **Ahorro de deploys**: No gastas deploys de Vercel en código que no compila
2. ✅ **Detección temprana**: Los errores se encuentran localmente
3. ✅ **Código limpio**: Solo se sube código que funciona
4. ✅ **Ahorro de tiempo**: No esperas a que Vercel falle para ver errores
5. ✅ **Historial limpio**: Git solo tiene commits funcionales

## 🔍 Qué se Verifica

El pre-commit hook ejecuta:
- `npm run build` = `next build`

Esto verifica:
- ✅ Compilación de TypeScript
- ✅ Compilación de React/Next.js
- ✅ Imports correctos
- ✅ Sintaxis JSX/TSX
- ✅ Variables y tipos
- ✅ Build de producción

## ⚙️ Archivos del Sistema

```
proyecto/
├── .husky/
│   └── pre-commit          # Script que se ejecuta antes de commit
├── package.json            # Incluye "prepare": "husky"
├── REGLAS_DESARROLLO.md    # Reglas completas del proyecto
└── HUSKY_PRECOMMIT.md      # Este archivo (documentación)
```

## 🐛 Troubleshooting

### El hook no se ejecuta

```bash
# Reinstalar hooks
npm install
npx husky install
```

### Permisos en Linux/Mac

```bash
# Dar permisos de ejecución
chmod +x .husky/pre-commit
```

### Quiero deshabilitar temporalmente

```bash
# Opción 1: Usar --no-verify
git commit -m "mensaje" --no-verify

# Opción 2: Desinstalar Husky
npm uninstall husky

# Opción 3: Renombrar el archivo
mv .husky/pre-commit .husky/pre-commit.disabled
```

## 📝 Notas

- Los **warnings** (advertencias) NO bloquean el commit
- Solo los **errors** (errores) bloquean el commit
- El hook se ejecuta **antes** de crear el commit
- Si el build tarda mucho, se puede optimizar con caché

## 🤝 Para Colaboradores

Si trabajas en este proyecto:
1. Clona el repositorio
2. Ejecuta `npm install` (configura hooks automáticamente)
3. Los hooks ya funcionarán en tu máquina
4. Cada commit verificará compilación automáticamente

## 📚 Más Información

- **Husky**: https://typicode.github.io/husky/
- **Git Hooks**: https://git-scm.com/docs/githooks
- **Reglas del proyecto**: Ver `REGLAS_DESARROLLO.md`

---

**Configurado**: 11 de Enero de 2026  
**Versión**: 1.0  
**Tecnología**: Husky v9 + Git Hooks
