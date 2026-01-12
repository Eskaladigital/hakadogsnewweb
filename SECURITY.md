# Política de Seguridad

## 🔒 Divulgación Responsable de Vulnerabilidades

En HakaDogs nos tomamos la seguridad muy en serio. Agradecemos la ayuda de investigadores de seguridad y usuarios que nos ayudan a mantener nuestra plataforma segura.

## 📢 Cómo Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en hakadogs.com o cualquiera de nuestras aplicaciones, por favor repórtala de forma responsable:

### Contacto Prioritario

**Email de Seguridad:** security@hakadogs.com

**Asunto del email:** `[SECURITY] Descripción breve de la vulnerabilidad`

### Información a Incluir

Para ayudarnos a entender y resolver el problema rápidamente, por favor incluye:

1. **Descripción de la vulnerabilidad**
   - Tipo de vulnerabilidad (XSS, SQLi, CSRF, etc.)
   - Impacto potencial
   - Severidad estimada (Crítica/Alta/Media/Baja)

2. **Pasos para reproducir**
   - URL(s) afectada(s)
   - Datos de prueba usados
   - Capturas de pantalla o videos (si aplica)
   - Código de prueba de concepto (PoC)

3. **Impacto**
   - ¿Qué datos o funcionalidades se ven afectadas?
   - ¿Cuál es el riesgo para los usuarios?

4. **Información del investigador** (opcional)
   - Nombre o alias
   - Perfil de Twitter/LinkedIn
   - Si deseas ser mencionado en los créditos

### Ejemplo de Reporte

```
Asunto: [SECURITY] Posible XSS almacenado en formulario de comentarios

Descripción:
Encontré una vulnerabilidad XSS almacenado en el sistema de comentarios del blog
que permite la ejecución de JavaScript arbitrario.

Pasos para reproducir:
1. Ir a https://hakadogs.com/blog/post-ejemplo
2. En el campo de comentarios, insertar: <script>alert('XSS')</script>
3. Enviar el comentario
4. El script se ejecuta al cargar la página para cualquier usuario

Impacto:
- Robo potencial de cookies de sesión
- Phishing dirigido a usuarios
- Defacement del sitio

Severidad: Alta

Investigador: Juan Pérez (@juanperez_sec)
```

## ⏱️ Tiempo de Respuesta

Nos comprometemos a:

- **Confirmación inicial:** Dentro de 48 horas
- **Evaluación preliminar:** Dentro de 5 días hábiles
- **Actualización de estado:** Cada 7 días hasta la resolución
- **Resolución objetivo:** Según severidad
  - Crítica: 7 días
  - Alta: 14 días
  - Media: 30 días
  - Baja: 60 días

## ✅ Reglas de Compromiso

Para proteger a nuestros usuarios y sistemas, solicitamos que:

### ✓ Permitido

- Probar en entornos de prueba cuando estén disponibles
- Usar cuentas de prueba creadas por ti mismo
- Realizar pruebas que no afecten la disponibilidad del servicio
- Realizar escaneos automatizados con rate limiting razonable
- Probar vulnerabilidades en ámbitos específicos después de notificarnos

### ✗ No Permitido

- Acceder a datos de otros usuarios sin permiso
- Ejecutar ataques de denegación de servicio (DoS/DDoS)
- Realizar ingeniería social contra empleados o usuarios
- Destruir o corromper datos
- Spamming o flooding de servicios
- Probar en infraestructura de terceros que usamos
- Divulgar públicamente la vulnerabilidad antes de que sea corregida

## 🎁 Programa de Reconocimiento

Aunque actualmente no ofrecemos recompensas monetarias, sí reconocemos públicamente a los investigadores que nos ayudan:

### Hall of Fame de Seguridad

Los investigadores que reporten vulnerabilidades válidas serán incluidos en nuestro "Security Hall of Fame" (con su consentimiento) en:
- Nuestra página de créditos de seguridad
- Notas de la versión cuando se corrija la vulnerabilidad
- Redes sociales (si el investigador lo desea)

### Criterios para Reconocimiento

- La vulnerabilidad debe ser original (no reportada previamente)
- Debe tener un impacto real en la seguridad
- Debe seguirse el proceso de divulgación responsable
- El reporte debe ser claro y reproducible

## 🚫 Exclusiones de Alcance

Las siguientes áreas están fuera del alcance de nuestro programa:

### Vulnerabilidades No Elegibles

- Clickjacking en páginas sin información sensible
- Falta de headers de seguridad sin explotación demostrable
- SPF/DMARC/DKIM sin evidencia de impacto real
- Información obtenida mediante ingeniería social
- Ataques de fuerza bruta sin credenciales reales comprometidas
- Divulgación de versiones de software sin vulnerabilidad conocida
- Problemas en servicios de terceros (reportar al proveedor)
- Auto-XSS (requiere que la víctima pegue código)

### Dominios/Servicios Fuera de Alcance

- Servicios de terceros (Google Analytics, CDNs, etc.)
- Subdominios de desarrollo/staging no listados públicamente
- Infraestructura de proveedores cloud (AWS, Vercel, etc.)

## 🔐 Versiones y Componentes Soportados

Mantenemos actualizaciones de seguridad para:

| Versión | Soporte de Seguridad |
|---------|---------------------|
| 1.x (actual) | ✅ Soporte completo |
| 0.x (legacy) | ⚠️ Solo críticas |

### Componentes Principales

- **Frontend:** Next.js 14+
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Hosting:** Vercel

## 📋 Proceso de Divulgación

### 1. Recepción del Reporte
- Confirmamos recepción en 48 horas
- Asignamos ID único al reporte

### 2. Evaluación
- Validamos la vulnerabilidad
- Clasificamos severidad (CVSS score)
- Estimamos tiempo de corrección

### 3. Desarrollo de Parche
- Creamos corrección en ambiente privado
- Realizamos pruebas internas
- Preparamos comunicación

### 4. Despliegue
- Aplicamos parche en producción
- Verificamos corrección efectiva
- Actualizamos dependencias si es necesario

### 5. Divulgación Coordinada
- Informamos al investigador de la corrección
- Publicamos notas de seguridad
- Añadimos al Hall of Fame (si aplica)
- Notificamos a usuarios si hay impacto en datos

## 🔍 Clasificación de Severidad

Usamos el sistema CVSS 3.1 para clasificar vulnerabilidades:

| Severidad | Score CVSS | Ejemplos |
|-----------|------------|----------|
| **Crítica** | 9.0-10.0 | RCE, SQLi con acceso a BD, Auth bypass completo |
| **Alta** | 7.0-8.9 | XSS almacenado, CSRF en acciones críticas, IDOR con datos sensibles |
| **Media** | 4.0-6.9 | XSS reflejado, CSRF en acciones no críticas, exposición de info no sensible |
| **Baja** | 0.1-3.9 | Info disclosure menor, problemas de configuración sin explotación clara |

## 📜 Términos Legales

### Safe Harbor

HakaDogs se compromete a:

- No emprender acciones legales contra investigadores que sigan esta política
- Considerar la actividad de investigación autorizada bajo estas directrices
- Trabajar con investigadores para entender y resolver problemas
- Reconocer públicamente contribuciones (con consentimiento)

### Condiciones

El investigador debe:

- Actuar de buena fe
- No acceder/modificar/destruir datos de otros usuarios
- No publicar detalles antes de la corrección
- Mantener confidencialidad de hallazgos
- Reportar de forma oportuna y responsable

## 🌍 Mejores Prácticas OWASP

Nuestra aplicación implementa:

- ✅ Validación y sanitización de inputs
- ✅ Autenticación y gestión de sesiones seguras
- ✅ Control de acceso robusto
- ✅ Protección contra CSRF
- ✅ Headers de seguridad HTTP
- ✅ Rate limiting y protección contra brute force
- ✅ Logging y monitoreo de seguridad
- ✅ Cifrado de datos sensibles
- ✅ Actualizaciones regulares de dependencias

Ver [SEGURIDAD.md](./SEGURIDAD.md) para detalles técnicos completos.

## 📞 Contacto

**Email de Seguridad:** security@hakadogs.com  
**Sitio Web:** https://www.hakadogs.com  
**PGP Key:** [Publicar key PGP aquí si se implementa]

**Tiempo de respuesta esperado:** 48 horas (días hábiles)

## 📝 Changelog de Seguridad

### 2026-01-12
- ✅ Implementación de protección CSRF
- ✅ Configuración de headers de seguridad
- ✅ Sistema de rate limiting
- ✅ Validación y sanitización de inputs
- ✅ Gestión segura de cookies

---

## Agradecimientos

Queremos agradecer a la comunidad de seguridad por su trabajo continuo en hacer de Internet un lugar más seguro. Cada reporte responsable nos ayuda a proteger mejor a nuestros usuarios y sus mascotas.

**Última actualización:** Enero 2026  
**Versión de política:** 1.0.0
