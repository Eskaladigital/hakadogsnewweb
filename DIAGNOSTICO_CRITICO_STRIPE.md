# 🔴 DIAGNÓSTICO CRÍTICO: Compras de Stripe no se Registran en Supabase

## 🚨 Problema Identificado

**CRÍTICO:** Un pago se procesa correctamente en Stripe, pero **la compra NO se registra en Supabase**.

- ✅ El pago llega a Stripe y se procesa
- ❌ El webhook se ejecuta pero falla al insertar en la BD
- ❌ El curso NO aparece en "Mi Escuela" del usuario
- ❌ El admin NO ve la venta en el dashboard

## 🔍 Causa Raíz

### Problema Principal: Cliente de Supabase Incorrecto en el Webhook

El archivo `lib/supabase/courses.ts` tiene la función `createPurchase`:

```typescript
// ❌ PROBLEMA: Usa el cliente normal que requiere autenticación
export async function createPurchase(purchaseData: Partial<CoursePurchase>) {
  const { data, error } = await supabase  // ← Cliente ANON
    .from('course_purchases')
    .insert([purchaseData])
    .select()
    .single()

  if (error) throw error
  return data as CoursePurchase
}
```

**El webhook** (`app/api/stripe/webhook/route.ts` línea 61) llama a esta función:

```typescript
await createPurchase({
  user_id: userId,
  course_id: courseId,
  price_paid: parseFloat(priceEuros),
  payment_status: 'completed',
  payment_method: 'stripe',
  payment_id: session.payment_intent as string || session.id,
  purchase_date: new Date().toISOString()
})
```

### ¿Por qué falla?

1. **El webhook se ejecuta desde los servidores de Stripe** (no hay usuario autenticado)
2. **El cliente de Supabase en `courses.ts`** usa `supabase` (cliente ANON)
3. **Las políticas RLS** requieren que `user_id = auth.uid()`
4. **`auth.uid()` es NULL** en el webhook (no hay sesión)
5. **La inserción falla silenciosamente** o con error de permisos

### Evidencia en las Políticas RLS

Archivo `supabase/FIX_COURSE_PURCHASES_RLS.sql`:

```sql
-- Esta política solo permite INSERT si user_id = auth.uid()
CREATE POLICY "Users can insert their own purchases"
ON course_purchases
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());  -- ❌ auth.uid() es NULL en webhook
```

**PERO** hay una política para `service_role`:

```sql
-- Esta política permite TODO al service_role
CREATE POLICY "Service role can do everything"
ON course_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);  -- ✅ Esto funcionaría
```

### El Problema Real

El cliente de Supabase en `lib/supabase/client.ts` usa la clave **ANON**, no **SERVICE_ROLE**.

Cuando el webhook llama a `createPurchase()`, usa el cliente ANON que:
- No tiene sesión de usuario
- No puede insertar porque `auth.uid()` es NULL
- La política RLS rechaza la inserción

## ✅ Solución

### Opción 1: Usar SERVICE_ROLE en el Webhook (RECOMENDADO)

Modificar el webhook para que use directamente el cliente con SERVICE_ROLE:

```typescript
// En app/api/stripe/webhook/route.ts
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← Clave SERVICE ROLE
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Usar supabaseAdmin directamente
await supabaseAdmin
  .from('course_purchases')
  .insert([{
    user_id: userId,
    course_id: courseId,
    price_paid: parseFloat(priceEuros),
    payment_status: 'completed',
    payment_method: 'stripe',
    payment_id: session.payment_intent as string || session.id,
    purchase_date: new Date().toISOString()
  }])
```

### Opción 2: Crear Función RPC Bypass (ALTERNATIVA)

Crear una función SQL que ignore RLS:

```sql
CREATE OR REPLACE FUNCTION create_purchase_from_webhook(
  p_user_id UUID,
  p_course_id UUID,
  p_price_paid NUMERIC,
  p_payment_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER  -- ← Ignora RLS
SET search_path = public
AS $$
DECLARE
  purchase_id UUID;
BEGIN
  INSERT INTO course_purchases (
    user_id,
    course_id,
    price_paid,
    payment_status,
    payment_method,
    payment_id,
    purchase_date
  ) VALUES (
    p_user_id,
    p_course_id,
    p_price_paid,
    'completed',
    'stripe',
    p_payment_id,
    NOW()
  )
  RETURNING id INTO purchase_id;
  
  RETURN purchase_id;
END;
$$;
```

Luego llamarla desde el webhook:

```typescript
const { data, error } = await supabase.rpc('create_purchase_from_webhook', {
  p_user_id: userId,
  p_course_id: courseId,
  p_price_paid: parseFloat(priceEuros),
  p_payment_id: session.payment_intent as string || session.id
})
```

## 🔧 Variables de Entorno Necesarias

Para la Opción 1 (RECOMENDADO), necesitas añadir en Vercel:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Esta clave se encuentra en:
- Supabase Dashboard → Settings → API → Project API keys → `service_role` secret

**⚠️ IMPORTANTE:** Esta clave es SECRETA y solo debe usarse en el servidor.

## 📊 Cómo Verificar el Problema

### 1. Ver Logs del Webhook en Vercel

```bash
# Buscar errores como:
❌ Error registrando compra en BD: {...}
```

### 2. Ver Logs del Webhook en Stripe

Ve a: https://dashboard.stripe.com/webhooks/[tu-webhook-id]

Busca eventos `checkout.session.completed` y verifica:
- ✅ Status 200 = OK
- ❌ Status 500 = Error al insertar

### 3. Verificar en Supabase

```sql
-- Ver si la compra se registró
SELECT * FROM course_purchases
WHERE payment_id = 'pi_xxxxxxxxxxxxx'  -- ID del pago de Stripe
ORDER BY created_at DESC;
```

Si NO aparece → El webhook falló al insertar

### 4. Ver Políticas RLS Activas

```sql
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'course_purchases';
```

Debe mostrar:
- ✅ `Service role can do everything` → Para `service_role`
- ✅ `Users can insert their own purchases` → Para `authenticated`

## 🎯 Implementación de la Solución

### Paso 1: Añadir SERVICE_ROLE_KEY a Vercel

1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Añade:
   ```
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui
   ```
3. Redeploy la aplicación

### Paso 2: Modificar el Webhook

Ver archivo: `FIX_STRIPE_WEBHOOK.ts` (se creará después)

### Paso 3: Probar con un Pago Real

1. Hacer una compra de prueba
2. Ver logs de Vercel en tiempo real
3. Verificar que aparezca: `✅ Compra registrada exitosamente en BD`
4. Verificar en Supabase que se insertó el registro
5. Verificar que el usuario puede acceder al curso

## 📝 Checklist de Verificación

Después de aplicar la solución:

- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` añadida en Vercel
- [ ] Webhook modificado para usar `supabaseAdmin`
- [ ] Redeploy realizado en Vercel
- [ ] Prueba de compra realizada
- [ ] Logs del webhook muestran éxito
- [ ] Compra aparece en tabla `course_purchases`
- [ ] Usuario puede acceder al curso en "Mi Escuela"
- [ ] Admin ve la venta en el dashboard

## 🐛 Errores Comunes

### Error: "new row violates row-level security policy"

**Causa:** El cliente usa ANON key en lugar de SERVICE_ROLE  
**Solución:** Verificar que el webhook use `supabaseAdmin` con SERVICE_ROLE_KEY

### Error: "SUPABASE_SERVICE_ROLE_KEY is not defined"

**Causa:** Variable de entorno no configurada  
**Solución:** Añadir en Vercel y redeploy

### Error: "permission denied for table course_purchases"

**Causa:** Políticas RLS incorrectas  
**Solución:** Ejecutar `FIX_COURSE_PURCHASES_RLS.sql` de nuevo

## 🔐 Seguridad

### ¿Es Seguro Usar SERVICE_ROLE en el Webhook?

**SÍ**, porque:

1. El webhook **solo** se ejecuta en el servidor (nunca en el cliente)
2. Stripe **verifica** la firma del webhook (imposible falsificar)
3. Solo se usa para **insertar** compras verificadas por Stripe
4. La clave SERVICE_ROLE **nunca** se expone al cliente

### Verificación de Firma de Stripe

El webhook verifica que la petición proviene realmente de Stripe:

```typescript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

Si la firma es incorrecta, el webhook rechaza la petición con error 400.

## 📚 Archivos Relacionados

- `app/api/stripe/webhook/route.ts` - Webhook que recibe eventos de Stripe
- `lib/supabase/courses.ts` - Función `createPurchase` (problema aquí)
- `supabase/FIX_COURSE_PURCHASES_RLS.sql` - Políticas RLS
- `STRIPE_INTEGRATION.md` - Documentación de Stripe

## 🆘 Próximos Pasos

1. **Crear el fix**: Archivo `FIX_STRIPE_WEBHOOK.ts` con la solución
2. **Aplicar**: Modificar el webhook para usar SERVICE_ROLE
3. **Probar**: Hacer una compra de prueba
4. **Verificar**: Confirmar que se registra en Supabase

---

**Creado:** 28 Enero 2026  
**Prioridad:** 🔴 CRÍTICA  
**Impacto:** Sistema de pagos NO funciona  
**Tiempo estimado de fix:** 15-30 minutos
