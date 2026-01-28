# 🔴 RESUMEN EJECUTIVO: Fix Crítico de Stripe

## 📋 Problema Identificado

**CRÍTICO:** Un pago se procesaba en Stripe pero **NO se registraba en Supabase**.

- ✅ Stripe procesaba el pago correctamente
- ❌ El webhook ejecutaba pero fallaba al insertar en la BD
- ❌ El curso NO aparecía en "Mi Escuela" del usuario
- ❌ La venta NO aparecía en el dashboard de admin

## 🔍 Causa Raíz

El webhook de Stripe usaba el cliente de Supabase con **clave ANON**, que requiere autenticación de usuario. Como el webhook se ejecuta desde los servidores de Stripe (sin sesión de usuario), las políticas RLS rechazaban la inserción porque `auth.uid()` era `NULL`.

## ✅ Solución Implementada

### 1. Archivo Modificado: `app/api/stripe/webhook/route.ts`

**Cambio Principal:**
```typescript
// ✅ ANTES: Importaba createPurchase que usaba cliente ANON
import { createPurchase } from '@/lib/supabase/courses'

// ✅ AHORA: Usa cliente con SERVICE_ROLE para bypass de RLS
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← SERVICE_ROLE
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

**Inserción Directa:**
```typescript
// ✅ AHORA: Inserción directa sin restricciones RLS
const { data: purchase, error: dbError } = await supabaseAdmin
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
  .select()
  .single()
```

## 📁 Archivos Creados

### 1. **DIAGNOSTICO_CRITICO_STRIPE.md**
- Análisis completo del problema
- Explicación técnica de la causa
- 2 opciones de solución (elegimos la Opción 1)

### 2. **DEPLOYMENT_FIX_STRIPE.md** ⭐ (MÁS IMPORTANTE)
- **Guía paso a paso para el deployment**
- Cómo obtener la clave SERVICE_ROLE
- Cómo configurar en Vercel
- Cómo verificar que funciona
- Troubleshooting completo

### 3. **supabase/VERIFICAR_COMPRAS_STRIPE.sql**
- Script SQL con 10 consultas de verificación
- Función `check_stripe_payment()` para diagnóstico rápido
- Estadísticas de ventas
- Top cursos vendidos

### 4. **STRIPE_INTEGRATION.md** (Actualizado)
- Añadida variable `SUPABASE_SERVICE_ROLE_KEY`
- Actualizada sección de troubleshooting
- Actualizado checklist final

## 🚀 Próximos Pasos URGENTES

### PASO 1: Obtener SERVICE_ROLE Key
1. Ve a Supabase Dashboard
2. Settings → API → Project API keys
3. Copia `service_role` secret (empieza con `eyJhbG...`)

### PASO 2: Añadir en Vercel
1. Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Añadir:
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [pegar clave copiada]
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

### PASO 3: Deploy
```bash
git add .
git commit -m "Fix crítico: Usar SERVICE_ROLE en webhook de Stripe"
git push origin main
```

### PASO 4: Verificar
1. Esperar deploy (2-3 min)
2. Hacer compra de prueba
3. Ver logs de Vercel
4. Buscar: `✅ Compra registrada exitosamente en BD`
5. Verificar en Supabase con el script SQL

## 🔍 Cómo Verificar que Funciona

### Opción 1: Ver Logs de Vercel (Tiempo Real)
```
https://vercel.com/[tu-usuario]/hakadogsnewweb/logs
```

Busca este mensaje después de una compra:
```
✅ Compra registrada exitosamente en BD: {
  purchaseId: "...",
  userId: "...",
  courseId: "...",
  price: "49.99",
  paymentId: "pi_..."
}
```

### Opción 2: Ejecutar Script SQL en Supabase

Abre el archivo `supabase/VERIFICAR_COMPRAS_STRIPE.sql` y ejecuta:

```sql
-- Ver últimas compras
SELECT 
  cp.id,
  u.email as usuario,
  c.title as curso,
  cp.price_paid,
  cp.payment_id,
  cp.purchase_date
FROM course_purchases cp
LEFT JOIN auth.users u ON cp.user_id = u.id
LEFT JOIN courses c ON cp.course_id = c.id
ORDER BY cp.purchase_date DESC
LIMIT 10;
```

### Opción 3: Buscar un Pago Específico

Si tienes el Payment Intent ID de Stripe:

```sql
-- Reemplaza con el ID real de Stripe
SELECT * FROM check_stripe_payment('pi_xxxxxxxxxxxxx');
```

## 📊 Estado Actual

### Código
- ✅ Webhook modificado para usar SERVICE_ROLE
- ✅ Inserción directa sin dependencia de RLS
- ✅ Logs mejorados para diagnóstico
- ✅ Manejo de errores completo

### Documentación
- ✅ Diagnóstico técnico completo
- ✅ Guía de deployment paso a paso
- ✅ Scripts SQL de verificación
- ✅ Troubleshooting exhaustivo

### Pendiente
- ⏳ Obtener SERVICE_ROLE key de Supabase
- ⏳ Añadir variable en Vercel
- ⏳ Deploy a producción
- ⏳ Prueba de compra real
- ⏳ Verificación final

## ⚠️ MUY IMPORTANTE

### ¿Por qué usar SERVICE_ROLE?

**Es 100% seguro porque:**
1. ✅ El webhook **solo** se ejecuta en el servidor (nunca en el cliente)
2. ✅ Stripe **verifica** la firma del webhook (imposible falsificar)
3. ✅ Solo se usa para **insertar** compras verificadas por Stripe
4. ✅ La clave **nunca** se expone al navegador

**Verificación de Seguridad:**
```typescript
// El webhook verifica la firma ANTES de insertar
event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
// Si la firma es incorrecta → Error 400 → Petición rechazada
```

## 🐛 Troubleshooting

### Si después del deploy sigue sin funcionar:

1. **Verifica la variable de entorno:**
   ```bash
   # En Vercel Dashboard → Settings → Environment Variables
   # Debe existir: SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Verifica que el código nuevo se deployó:**
   - Ve a Vercel → Deployments → [último] → View Logs
   - Busca el commit message con "SERVICE_ROLE"

3. **Ver logs del webhook en Stripe:**
   - Dashboard → Webhooks → [tu webhook] → Event logs
   - Busca eventos `checkout.session.completed`
   - Si status es 500 → Hay error en el webhook
   - Si status es 200 → El webhook ejecutó correctamente

4. **Ver logs detallados en Vercel:**
   - Filtra por "webhook"
   - Busca errores con "❌" en rojo
   - Copia el error exacto y busca en troubleshooting

5. **Verificar políticas RLS:**
   ```sql
   SELECT policyname, roles
   FROM pg_policies
   WHERE tablename = 'course_purchases'
   AND policyname ILIKE '%service%role%';
   ```
   Debe mostrar: `Service role can do everything`

## 📞 Archivos de Referencia

| Archivo | Para qué |
|---------|----------|
| `DEPLOYMENT_FIX_STRIPE.md` | ⭐ **GUÍA PRINCIPAL** de deployment |
| `DIAGNOSTICO_CRITICO_STRIPE.md` | Análisis técnico del problema |
| `supabase/VERIFICAR_COMPRAS_STRIPE.sql` | Scripts de verificación SQL |
| `STRIPE_INTEGRATION.md` | Documentación general de Stripe |
| `app/api/stripe/webhook/route.ts` | Código modificado del webhook |

## ✅ Checklist Final

Marca cuando completes cada paso:

- [ ] Leído `DEPLOYMENT_FIX_STRIPE.md` completo
- [ ] Obtenida clave SERVICE_ROLE de Supabase
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` añadida en Vercel
- [ ] Código committeado y pusheado a GitHub
- [ ] Deploy completado en Vercel
- [ ] Compra de prueba realizada
- [ ] Logs muestran: "✅ Compra registrada exitosamente"
- [ ] Compra verificada en Supabase con SQL
- [ ] Usuario puede acceder al curso en "Mi Escuela"
- [ ] Venta aparece en dashboard de admin

## 🎯 Tiempo Estimado Total

- Lectura de documentación: **5 minutos**
- Obtener SERVICE_ROLE key: **2 minutos**
- Configurar Vercel: **3 minutos**
- Git commit & push: **2 minutos**
- Esperar deploy: **3 minutos**
- Prueba de compra: **5 minutos**
- Verificación: **5 minutos**

**TOTAL: ~25 minutos**

## 🚀 Estado del Fix

- **Código:** ✅ MODIFICADO Y LISTO
- **Documentación:** ✅ COMPLETA
- **Testing:** ⏳ PENDIENTE DEPLOYMENT
- **Producción:** ⏳ PENDIENTE DEPLOYMENT

---

## 📌 ACCIÓN INMEDIATA

**Siguiente paso:** Abre `DEPLOYMENT_FIX_STRIPE.md` y sigue los pasos 1-6.

---

**Creado:** 28 Enero 2026  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ✅ FIX IMPLEMENTADO - PENDIENTE DEPLOYMENT  
**Autor:** Asistente IA Cursor
