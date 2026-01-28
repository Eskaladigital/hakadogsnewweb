# Guía de Integración de Stripe para Pagos de Cursos

## 📝 Resumen

Se ha implementado Stripe como sistema de pagos para los cursos de HakaDogs. Esta integración permite procesar pagos con tarjeta de crédito/débito de forma segura.

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos

1. **`app/api/stripe/create-checkout-session/route.ts`**
   - API route para crear sesiones de Stripe Checkout
   - Recibe courseId y crea una sesión de pago
   - Retorna sessionId y URL para redirigir al usuario

2. **`app/api/stripe/webhook/route.ts`**
   - Webhook para procesar eventos de Stripe
   - Escucha el evento `checkout.session.completed`
   - Registra automáticamente las compras en la base de datos cuando el pago se completa

3. **`app/cursos/comprar/[cursoId]/success/page.tsx`**
   - Página de éxito mostrada después de completar el pago
   - Verifica la sesión y muestra confirmación
   - Proporciona enlaces para acceder al curso

### Archivos Modificados

1. **`app/cursos/comprar/[cursoId]/page.tsx`**
   - Eliminado el flujo de pago simulado
   - Integrada redirección a Stripe Checkout
   - Simplificado el flujo de compra

2. **`package.json`**
   - Agregadas dependencias: `stripe` y `@stripe/stripe-js`

## 🔑 Variables de Entorno Necesarias

### Para Vercel (Producción)

Debes agregar las siguientes variables de entorno en Vercel:

#### 1. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
pk_live_51SrLFBLNDfpodT5TimW6Igt0eYYxSQacj0ytP33Z2WpTkgvMts3RzR2NvgdJ3n3aL4D4yWKqTKUKGFA30X9Hw2Jf00ephSAFgi
```
- **Tipo:** Variable pública (NEXT_PUBLIC_*)
- **Uso:** Se usa en el cliente para inicializar Stripe
- **Visible:** Sí, se expone al navegador

#### 2. STRIPE_SECRET_KEY
```
[Tu clave secreta de Stripe - sk_live_...]
```
- **Tipo:** Variable secreta
- **Uso:** Se usa en el servidor para crear sesiones y verificar webhooks
- **Visible:** NO, solo en el servidor
- ⚠️ **IMPORTANTE:** Esta clave NO debe compartirse públicamente

#### 3. STRIPE_WEBHOOK_SECRET
```
[Se generará después de configurar el webhook - whsec_...]
```
- **Tipo:** Variable secreta
- **Uso:** Se usa para verificar que los webhooks provienen realmente de Stripe
- **Visible:** NO, solo en el servidor

## 🔗 Configuración del Webhook en Stripe

### Paso 1: Acceder al Dashboard de Stripe

1. Ve a https://dashboard.stripe.com/webhooks
2. Haz clic en "Add endpoint" o "Agregar endpoint"

### Paso 2: Configurar el Endpoint

**URL del webhook:**
```
https://www.hakadogs.com/api/stripe/webhook
```

**Eventos a escuchar:**
- ✅ `checkout.session.completed` (OBLIGATORIO)
- ✅ `payment_intent.payment_failed` (RECOMENDADO)

### Paso 3: Obtener el Signing Secret

Después de crear el webhook:
1. Haz clic en el webhook recién creado
2. Copia el "Signing secret" (empieza con `whsec_...`)
3. Añádelo como variable de entorno `STRIPE_WEBHOOK_SECRET` en Vercel

### Paso 4: Verificar el Webhook

1. Stripe te permite enviar eventos de prueba desde el dashboard
2. Verifica que el webhook responde correctamente con status 200
3. Revisa los logs en Vercel para confirmar que se procesan correctamente

## 📋 Pasos para Configurar en Vercel

### 1. Añadir Variables de Entorno

```bash
# En el dashboard de Vercel:
# Settings > Environment Variables

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SrLFBLNDfpodT5TimW6Igt0eYYxSQacj0ytP33Z2WpTkgvMts3RzR2NvgdJ3n3aL4D4yWKqTKUKGFA30X9Hw2Jf00ephSAFgi
STRIPE_SECRET_KEY=sk_live_[TU_CLAVE_SECRETA]
STRIPE_WEBHOOK_SECRET=whsec_[SE_GENERA_AL_CREAR_WEBHOOK]
```

### 2. Redesplegar

Después de añadir las variables:
```bash
# Opción 1: Redesplegar desde Vercel dashboard
# Deployments > [último deployment] > Redeploy

# Opción 2: Hacer un nuevo commit y push
git add .
git commit -m "Add Stripe environment variables"
git push
```

### 3. Configurar el Webhook (ver sección anterior)

## 🔒 Seguridad

### Variables Públicas vs Secretas

- ✅ **Públicas (NEXT_PUBLIC_*)**: Pueden verse en el código del navegador
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  
- 🔒 **Secretas**: Solo accesibles en el servidor
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

### Protección de API Routes

Las rutas `/api/stripe/create-checkout-session` verifican:
- ✅ Usuario autenticado con Supabase
- ✅ Curso existe y no es gratuito
- ✅ Precio correcto del curso

El webhook `/api/stripe/webhook` verifica:
- ✅ Firma de Stripe válida
- ✅ Evento proviene de Stripe
- ✅ Metadata completa

## 🧪 Testing en Producción

### 1. Probar Flujo de Compra

1. Accede a https://www.hakadogs.com/cursos
2. Selecciona un curso de pago
3. Haz clic en "Comprar Curso"
4. Serás redirigido a Stripe Checkout
5. Completa el pago (con tarjeta real en producción)
6. Serás redirigido a la página de éxito

### 2. Verificar Registro de Compra

1. Ve al dashboard de admin: https://www.hakadogs.com/administrator
2. Verifica que aparezca la nueva venta
3. Verifica que el usuario tenga acceso al curso en "Mi Escuela"

### 3. Revisar Logs

En caso de problemas:
1. Logs de Vercel: https://vercel.com/[tu-proyecto]/logs
2. Logs de Stripe: https://dashboard.stripe.com/logs
3. Eventos del webhook: https://dashboard.stripe.com/webhooks/[webhook-id]

## 🛠️ Solución de Problemas

### Error: "No se puede cargar Stripe"

**Causa:** La clave publicable no está configurada
**Solución:** Verifica que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` esté en Vercel

### Error: "Webhook signature verification failed"

**Causa:** El secret del webhook es incorrecto
**Solución:** 
1. Ve al dashboard de Stripe
2. Copia el signing secret del webhook
3. Actualiza `STRIPE_WEBHOOK_SECRET` en Vercel

### Error: "Error registrando compra en BD"

**Causa:** Problema con las políticas RLS de Supabase
**Solución:** Verifica que la tabla `course_purchases` permita INSERT para usuarios autenticados

### La compra no se registra

**Causa:** El webhook no se está ejecutando
**Solución:**
1. Verifica que el endpoint del webhook esté correcto
2. Revisa los logs del webhook en Stripe
3. Confirma que el evento `checkout.session.completed` esté seleccionado

## 📊 Datos que se Registran

Cuando un pago se completa, se crea un registro en `course_purchases`:

```sql
{
  user_id: string,           -- ID del usuario en Supabase
  course_id: string,          -- ID del curso comprado
  price_paid: number,         -- Precio pagado (en euros)
  payment_status: 'completed',
  payment_method: 'stripe',
  payment_id: string,         -- ID del PaymentIntent de Stripe
  purchase_date: timestamp
}
```

## 🔄 Flujo Completo

```
1. Usuario hace clic en "Proceder al Pago"
   ↓
2. Frontend llama a /api/stripe/create-checkout-session
   ↓
3. Backend crea sesión de Stripe y retorna URL
   ↓
4. Usuario es redirigido a Stripe Checkout
   ↓
5. Usuario completa el pago en Stripe
   ↓
6. Stripe envía evento a /api/stripe/webhook
   ↓
7. Webhook registra la compra en la BD
   ↓
8. Usuario es redirigido a /cursos/comprar/[slug]/success
   ↓
9. Usuario puede acceder al curso en Mi Escuela
```

## ✅ Checklist Final

- [ ] Variables de entorno añadidas en Vercel
- [ ] Webhook configurado en Stripe Dashboard
- [ ] STRIPE_WEBHOOK_SECRET actualizado en Vercel
- [ ] Redespliegue de Vercel realizado
- [ ] Prueba de compra completada exitosamente
- [ ] Compra visible en dashboard de admin
- [ ] Usuario tiene acceso al curso

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel
2. Revisa los eventos y logs en Stripe Dashboard
3. Verifica las variables de entorno
4. Confirma que el webhook esté recibiendo eventos

## 📚 Recursos Adicionales

- [Documentación de Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)
- [Testing en Stripe](https://stripe.com/docs/testing)
