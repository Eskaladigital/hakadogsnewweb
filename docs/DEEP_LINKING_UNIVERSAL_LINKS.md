# 📱 Deep Linking y Universal Links - Hakadogs

## 🎯 Objetivo

Cuando un usuario comparte un artículo del blog o un curso desde móvil en redes sociales (Facebook, WhatsApp, Twitter, etc.), el enlace debe:

1. **Si tiene la app instalada** → Abrir en la app nativa de Hakadogs
2. **Si NO tiene la app** → Abrir en el navegador web

Esto mejora la experiencia del usuario y aumenta el engagement con la app.

---

## ✅ Configuración Implementada

### 1. Web Share API

Se agregó soporte para **Web Share API** en dispositivos móviles que permite:
- Compartir usando el diálogo nativo del sistema operativo
- Detecta automáticamente apps instaladas (WhatsApp, Telegram, etc.)
- Fallback a compartir tradicional si no está disponible

**Archivos modificados:**
- `app/blog/[slug]/page.tsx` - Función `sharePost()` actualizada

### 2. Manifest.json Actualizado

Se configuró el `manifest.json` para declarar las aplicaciones nativas relacionadas:

```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.hakadogs.app",
    "id": "com.hakadogs.app"
  },
  {
    "platform": "itunes",
    "url": "https://apps.apple.com/app/hakadogs/id123456789"
  }
],
"prefer_related_applications": true
```

**Archivo:**
- `public/manifest.json`

### 3. Android App Links

Se creó el archivo de configuración para Android:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.hakadogs.app",
      "sha256_cert_fingerprints": [
        "REEMPLAZAR_CON_SHA256_REAL"
      ]
    }
  }
]
```

**Archivo:**
- `public/.well-known/assetlinks.json`

### 4. iOS Universal Links

Se creó el archivo de configuración para iOS:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.hakadogs.app",
        "paths": [
          "/blog/*",
          "/cursos/*",
          "/servicios/*"
        ]
      }
    ]
  }
}
```

**Archivo:**
- `public/.well-known/apple-app-site-association`

### 5. Botón de WhatsApp

Se agregó botón específico para compartir por WhatsApp que abre:
- **En móvil**: La app de WhatsApp si está instalada
- **En desktop**: WhatsApp Web

**Icono:** MessageCircle de Lucide
**Color:** Verde WhatsApp (#25D366)

---

## 🔧 Pasos Pendientes (Cuando Exista la App)

### Para Android

1. **Generar el SHA-256 del certificado de la app**:
```bash
keytool -list -v -keystore your-app-keystore.jks -alias your-key-alias
```

2. **Actualizar `assetlinks.json`**:
Reemplazar `REEMPLAZAR_CON_SHA256_REAL` con el SHA-256 real del certificado.

3. **Verificar en Google Search Console**:
https://search.google.com/test/amp

### Para iOS

1. **Obtener el Team ID**:
   - Ir a https://developer.apple.com/account
   - Copiar el Team ID (formato: ABC1234567)

2. **Actualizar `apple-app-site-association`**:
Reemplazar `TEAMID` con el Team ID real.

3. **Configurar la app iOS**:
```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:hakadogs.com</string>
</array>
```

4. **Verificar en Apple**:
https://search.developer.apple.com/appsearch-validation-tool/

### En la App Nativa

#### Android (React Native / Flutter / Kotlin):

```xml
<!-- AndroidManifest.xml -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:scheme="https"
        android:host="hakadogs.com"
        android:pathPrefix="/blog" />
    <data
        android:scheme="https"
        android:host="hakadogs.com"
        android:pathPrefix="/cursos" />
</intent-filter>
```

#### iOS (React Native / Flutter / Swift):

```swift
// AppDelegate.swift
func application(_ application: UIApplication, 
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let url = userActivity.webpageURL {
        // Manejar el deep link
        handleDeepLink(url)
        return true
    }
    return false
}
```

---

## 🧪 Cómo Probar

### Probar Web Share API (Móvil)

1. Abrir un artículo del blog en móvil
2. Tocar el botón "Compartir"
3. **Esperado**: Debería aparecer el diálogo nativo del sistema con apps disponibles
4. Seleccionar WhatsApp o cualquier app
5. **Esperado**: Se comparte el enlace correctamente

### Probar Deep Linking (Cuando exista la app)

1. **Compartir** un enlace de hakadogs.com por WhatsApp
2. **Otro usuario** con la app instalada toca el enlace
3. **Esperado**: Se abre la app, NO el navegador
4. La app navega a la sección correcta (blog/curso)

### Probar Fallback (Sin app instalada)

1. Compartir un enlace de hakadogs.com
2. Usuario **SIN la app** instalada toca el enlace
3. **Esperado**: Se abre en el navegador web normalmente

---

## 📊 Mejoras Incluidas

### Antes

```javascript
sharePost('facebook') {
  window.open(`https://facebook.com/sharer?u=${url}`)
}
```

❌ **Problemas:**
- Solo abre navegador, no detecta app nativa
- No usa Web Share API nativa de móvil
- No funciona bien en WhatsApp

### Después

```javascript
sharePost('whatsapp') {
  // Intenta Web Share API primero (detecta apps nativas)
  if (navigator.share && /Mobile/i.test(userAgent)) {
    navigator.share({ title, text, url })
      .catch(() => {
        // Fallback a WhatsApp URL
        window.open(`https://wa.me/?text=${text + url}`)
      })
  }
}
```

✅ **Beneficios:**
- Detecta automáticamente apps instaladas
- Usa diálogo nativo del sistema
- Mejor experiencia de usuario
- Funciona en todas las plataformas

---

## 🔐 Seguridad

### Verificación de Dominios

Los archivos `.well-known/` deben ser accesibles públicamente:

```
https://hakadogs.com/.well-known/assetlinks.json
https://hakadogs.com/.well-known/apple-app-site-association
```

### Content-Type Correcto

Configurar en Next.js:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ]
  },
}
```

---

## 📝 Checklist de Implementación

### Fase 1: Web (Completado ✅)

- [x] Implementar Web Share API en blog
- [x] Agregar botón de WhatsApp
- [x] Crear `manifest.json` con related_applications
- [x] Crear `assetlinks.json` (plantilla)
- [x] Crear `apple-app-site-association` (plantilla)
- [x] Documentación completa

### Fase 2: App Nativa (Pendiente)

- [ ] Desarrollar app nativa (React Native / Flutter)
- [ ] Configurar deep linking en Android
- [ ] Configurar universal links en iOS
- [ ] Obtener SHA-256 del certificado Android
- [ ] Obtener Team ID de Apple
- [ ] Actualizar archivos `.well-known/` con valores reales
- [ ] Subir app a Play Store y App Store
- [ ] Probar deep linking end-to-end

### Fase 3: Verificación (Pendiente)

- [ ] Verificar en Google Search Console
- [ ] Verificar en Apple Developer Tools
- [ ] Probar en dispositivos reales
- [ ] Monitorear analytics de deep links

---

## 📚 Recursos

### Documentación Oficial

- **Android App Links**: https://developer.android.com/training/app-links
- **iOS Universal Links**: https://developer.apple.com/ios/universal-links/
- **Web Share API**: https://web.dev/web-share/

### Herramientas de Verificación

- **Android Deep Link Tester**: https://developers.google.com/digital-asset-links/tools/generator
- **iOS Universal Link Validator**: https://branch.io/resources/aasa-validator/

### Testing

- **Android Debug**: `adb shell am start -a android.intent.action.VIEW -d "https://hakadogs.com/blog/articulo"`
- **iOS Debug**: `xcrun simctl openurl booted "https://hakadogs.com/blog/articulo"`

---

## 🎯 Resumen

**Estado Actual:**
- ✅ Web Share API implementada y funcional
- ✅ Botón de WhatsApp agregado
- ✅ Archivos de configuración creados (plantillas)
- ⏳ Esperando desarrollo de app nativa para completar

**Beneficio Inmediato:**
Los usuarios en móvil ya pueden compartir con mejor UX usando Web Share API nativa.

**Próximo Paso:**
Cuando se desarrolle la app nativa, solo falta actualizar los valores en `.well-known/` y configurar los deep links en la app.
