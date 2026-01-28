# 🚀 FIX URGENTE: Deployment para Corregir Compras de Stripe

## 🔴 PROBLEMA CRÍTICO RESUELTO

**Antes:** Los pagos se procesaban en Stripe pero NO se registraban en Supabase  
**Después:** Los pagos se registran correctamente usando SERVICE_ROLE para bypass de RLS

---

## ⚡ Cambios Realizados

### Archivo Modificado

**`app/api/stripe/webhook/route.ts`**

#### Cambio 1: Cliente Admin de Supabase

```typescript
// ✅ NUEVO: Cliente con SERVICE_ROLE para bypass de RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← Usa SERVICE_ROLE
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

#### Cambio 2: Inserción Directa sin RLS

```typescript
// ❌ ANTES: Usaba función que requería autenticación
await createPurchase({ ... })

// ✅ AHORA: Inserción directa con SERVICE_ROLE
const { data: purchase, error: dbError } = await supabaseAdmin
  .from('course_purchases')
  .insert([{ ... }])
  .select()
  .single()
```

---

## 🔧 PASOS PARA DEPLOYMENT

### 📍 PASO 1: Obtener la Clave SERVICE_ROLE

1. Ve a **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. En la sección **Project API keys**, busca:
   - `service_role` secret (con el icono de ojo)
5. Haz clic en el ojo para revelar la clave
6. Copia toda la clave (empieza con `eyJhbG...`)

**⚠️ IMPORTANTE:** Esta clave es SECRETA, nunca la compartas públicamente.

### 📍 PASO 2: Añadir Variable de Entorno en Vercel

1. Ve a **Vercel Dashboard**: https://vercel.com/dashboard
2. Selecciona tu proyecto (hakadogsnewweb)
3. Ve a **Settings → Environment Variables**
4. Haz clic en **Add New**
5. Configura:
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [Pega la clave copiada en el Paso 1]
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```
6. Haz clic en **Save**

### 📍 PASO 3: Verificar Variables de Entorno

Asegúrate de que estén configuradas todas estas variables en Vercel:

```bash
# Variables Públicas
NEXT_PUBLIC_SUPABASE_URL=https://znrqkstdngvopozuiraf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Variables Secretas
SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← NUEVA
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 📍 PASO 4: Commit y Push de los Cambios

```bash
# Desde tu directorio del proyecto
git add .
git commit -m "Fix: Usar SERVICE_ROLE en webhook de Stripe para registrar compras"
git push origin main
```

### 📍 PASO 5: Esperar el Deploy Automático

1. El push a `main` dispara un deploy automático en Vercel
2. Ve a **Vercel Dashboard → Deployments**
3. Espera a que el deploy termine (2-3 minutos)
4. Verifica que el status sea **Ready**

### 📍 PASO 6: Verificar que Funciona

#### Opción A: Prueba Real (RECOMENDADO)

1. Ve a: https://www.hakadogs.com/cursos
2. Selecciona un curso de pago
3. Haz clic en "Comprar Curso"
4. Completa el pago con una tarjeta real
5. **Verifica que:**
   - ✅ Redirige a página de éxito
   - ✅ El curso aparece en "Mi Escuela"
   - ✅ La compra aparece en el dashboard de admin

#### Opción B: Ver Logs en Tiempo Real

Durante la prueba, abre otra pestaña con:

1. **Logs de Vercel**: https://vercel.com/[tu-usuario]/hakadogsnewweb/logs
2. **Eventos de Stripe**: https://dashboard.stripe.com/webhooks/[webhook-id]

Busca este mensaje en los logs:

```
✅ Compra registrada exitosamente en BD: {
  purchaseId: "...",
  userId: "...",
  courseId: "...",
  price: "49.99",
  paymentId: "pi_..."
}
```

Si ves este mensaje → **¡FUNCIONA! ✅**

#### Opción C: Verificar en Supabase

```sql
-- En Supabase SQL Editor
SELECT 
  id,
  user_id,
  course_id,
  price_paid,
  payment_status,
  payment_method,
  payment_id,
  purchase_date
FROM course_purchases
ORDER BY purchase_date DESC
LIMIT 10;
```

Las compras nuevas deben aparecer aquí.

---

## 🐛 Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is not defined"

**Causa:** Variable no configurada en Vercel  
**Solución:**
1. Verifica que añadiste la variable en Vercel (Paso 2)
2. Verifica que el deploy se hizo DESPUÉS de añadir la variable
3. Si no, haz un redeploy manual:
   - Vercel → Deployments → [último deploy] → ⋯ → Redeploy

### Error: "Error registrando compra en BD"

**Causa:** Políticas RLS incorrectas  
**Solución:**
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver archivo: supabase/FIX_COURSE_PURCHASES_RLS.sql

ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can do everything" ON course_purchases;

CREATE POLICY "Service role can do everything"
ON course_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

### La Compra NO Aparece en Supabase

**Diagnóstico:**

1. **Ver logs del webhook en Stripe:**
   - https://dashboard.stripe.com/webhooks/[webhook-id]
   - Busca el evento `checkout.session.completed`
   - Si status es 500 → El webhook falló

2. **Ver logs en Vercel:**
   - https://vercel.com/[tu-usuario]/hakadogsnewweb/logs
   - Busca errores con "❌" en rojo
   - Copia el error exacto

3. **Verificar metadata en Stripe:**
   - Dashboard → Payments → [pago] → Metadata
   - Debe tener: `userId`, `courseId`, `priceEuros`

### Webhook Status 500 pero Variable Configurada

**Causa:** El código antiguo aún se está ejecutando  
**Solución:**
```bash
# Forzar redeploy
git commit --allow-empty -m "Redeploy: force update webhook"
git push origin main
```

---

## ✅ Checklist de Verificación Post-Deployment

- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` añadida en Vercel
- [ ] Código modificado committeado y pusheado
- [ ] Deploy completado exitosamente en Vercel
- [ ] Logs de Vercel muestran el nuevo código
- [ ] Prueba de compra realizada
- [ ] Mensaje "✅ Compra registrada exitosamente" en logs
- [ ] Compra aparece en tabla `course_purchases` de Supabase
- [ ] Usuario puede acceder al curso en "Mi Escuela"
- [ ] Admin ve la venta en el dashboard
- [ ] Webhook en Stripe muestra status 200 (OK)

---

## 📊 Monitoreo Continuo

### Ver Todas las Compras Recientes

```sql
-- Supabase SQL Editor
SELECT 
  cp.id,
  u.email as usuario,
  c.title as curso,
  cp.price_paid,
  cp.payment_status,
  cp.purchase_date
FROM course_purchases cp
LEFT JOIN auth.users u ON cp.user_id = u.id
LEFT JOIN courses c ON cp.course_id = c.id
WHERE cp.purchase_date > NOW() - INTERVAL '7 days'
ORDER BY cp.purchase_date DESC;
```

### Verificar Que el Webhook Está Activo

```bash
# Ver eventos en tiempo real
# Stripe Dashboard → Webhooks → [tu webhook] → Event logs
```

---

## 🔐 Seguridad

### ¿Por Qué Usar SERVICE_ROLE?

**ANTES (con ANON key):**
- ❌ El webhook no tiene sesión de usuario (`auth.uid()` es NULL)
- ❌ Las políticas RLS rechazan la inserción
- ❌ La compra NO se registra

**AHORA (con SERVICE_ROLE):**
- ✅ El webhook bypasea RLS (política específica para service_role)
- ✅ Stripe verifica la firma (imposible falsificar)
- ✅ La compra SÍ se registra
- ✅ La clave NUNCA se expone al cliente

### Verificación de Firma

El webhook verifica que la petición proviene realmente de Stripe:

```typescript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

Si la firma es incorrecta → Error 400 → Petición rechazada

---

## 📁 Archivos Relacionados

- ✅ **Modificado:** `app/api/stripe/webhook/route.ts`
- 📄 **Documentación:** `DIAGNOSTICO_CRITICO_STRIPE.md`
- 📄 **Integración:** `STRIPE_INTEGRATION.md`
- 🗄️ **SQL:** `supabase/FIX_COURSE_PURCHASES_RLS.sql`

---

## 🎯 Resumen Ejecutivo

### Problema
Los pagos se procesaban en Stripe pero NO se registraban en Supabase porque el webhook usaba el cliente ANON que requiere autenticación de usuario.

### Solución
Usar un cliente con SERVICE_ROLE que bypasea las políticas RLS, permitiendo al webhook insertar compras sin sesión de usuario.

### Implementación
1. Obtener clave SERVICE_ROLE de Supabase
2. Añadir como variable en Vercel
3. Modificar webhook para usar `supabaseAdmin`
4. Deploy y verificar

### Tiempo Estimado
- Configuración: 5 minutos
- Deploy: 3 minutos
- Verificación: 5 minutos
- **Total: 15 minutos**

---

**Fecha:** 28 Enero 2026  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ✅ FIX IMPLEMENTADO  
**Requiere:** Deploy a producción
