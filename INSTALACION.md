# 📦 INFORMACIÓN DEL PROYECTO - HAKADOGS

**⚠️ IMPORTANTE:** Esta aplicación **NO se ejecuta en local**. Está desplegada en producción en AWS Amplify.

---

## 🌐 ACCESO A LA APLICACIÓN

### URL de Producción
**https://[tu-app].amplifyapp.com**

La aplicación está desplegada en AWS Amplify y se actualiza automáticamente con cada push a GitHub.

---

## 👥 USUARIOS DE PRUEBA

Ver archivo `USUARIOS_PRUEBA.md` para credenciales completas.

### Login Rápido
- **Admin:** narciso.pardo@outlook.com / 14356830Np
- **Usuario:** user@hakadogs.com / hakadogs2024

---

## 🔧 CONFIGURACIÓN TÉCNICA (Solo para Desarrolladores)

### Repositorio GitHub
```bash
git clone https://github.com/ActtaxIA/HACKADOGS.git
```

### Stack Tecnológico
- **Frontend:** Next.js 14, React 18, TypeScript 5.3
- **Estilos:** Tailwind CSS 3.4
- **Deploy:** AWS Amplify
- **CI/CD:** Automático desde GitHub

### Variables de Entorno (Configuradas en AWS)
```bash
NEXT_PUBLIC_APP_URL=https://tu-app.amplifyapp.com
# Supabase (opcional - futuro)
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

---

## 📝 REALIZAR CAMBIOS

### Workflow de Desarrollo

1. **Clonar repositorio**
```bash
git clone https://github.com/ActtaxIA/HACKADOGS.git
cd hakadogs-app
```

2. **Instalar dependencias** (si necesitas probar localmente)
```bash
npm install
```

3. **Hacer cambios en el código**
```bash
# Edita los archivos que necesites
```

4. **Probar localmente** (opcional, solo si necesitas)
```bash
npm run dev
# Abre http://localhost:3000
```

5. **Subir cambios a GitHub**
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

6. **Deploy automático**
```
AWS Amplify detecta el push
  ↓
Build automático (~5 minutos)
  ↓
Deploy automático
  ↓
✅ Cambios LIVE en producción
```

---

## 🚀 DEPLOY Y CI/CD

### Estado Actual
- ✅ Repositorio en GitHub
- ✅ Deploy automático configurado
- ✅ CI/CD activo
- ✅ SSL/HTTPS configurado

### Monitoreo
1. Ve a AWS Amplify Console
2. Selecciona la app HACKADOGS
3. Revisa logs y estado del build

---

## 📚 DOCUMENTACIÓN

### Archivos Principales
- `README.md` - Documentación general
- `DEPLOY_AWS.md` - Guía completa de deploy
- `USUARIOS_PRUEBA.md` - Credenciales de acceso
- `CONTENIDO_UNICO_COMPLETO.md` - SEO local
- `PROYECTO_DEFINITIVO_FINAL.md` - Resumen ejecutivo

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### La app no carga
1. Verifica que AWS Amplify esté desplegado
2. Revisa los logs en AWS Console
3. Verifica el último build fue exitoso

### Cambios no se reflejan
1. Verifica que el push a GitHub fue exitoso
2. Ve a AWS Amplify y revisa el estado del build
3. Espera ~5 minutos para que complete el deploy
4. Limpia caché del navegador (Ctrl+Shift+Delete)

### Error al hacer push
```bash
# Si hay conflictos:
git pull origin main
git push origin main
```

---

## 🔒 SEGURIDAD

### Archivos Protegidos
- `.env.local` - NO está en GitHub (ignorado)
- Credenciales de AWS - Solo en AWS Console
- Variables de entorno - Solo en AWS Amplify

### Buenas Prácticas
- ✅ Nunca subir credenciales a GitHub
- ✅ Usar variables de entorno en AWS
- ✅ Mantener `.gitignore` actualizado

---

## 📞 SOPORTE TÉCNICO

### Para Problemas de Deploy
- **AWS Amplify Console:** https://console.aws.amazon.com/amplify
- **Logs:** Ver en AWS Amplify → tu-app → Logs

### Para Cambios en el Código
- **GitHub:** https://github.com/ActtaxIA/HACKADOGS
- **Issues:** Crear issue en GitHub si necesario

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Después de Cambios
- [ ] Código commiteado a GitHub
- [ ] Push exitoso a rama main
- [ ] Build completado en AWS Amplify
- [ ] Deploy exitoso
- [ ] Cambios visibles en producción
- [ ] Funcionalidad probada en navegador

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0 PRODUCTION  
**Plataforma:** AWS Amplify  
**Estado:** ✅ Desplegado y funcionando  
**Lanzamiento:** Versión 1.0 - Enero 2026
