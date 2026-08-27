import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendContactEmails } from '@/lib/email'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const message = String(body.message || '').trim()
    const phone = String(body.phone || '').trim()
    const dogName = String(body.dog_name || body.dogName || '').trim()
    const service = String(body.service || '').trim()
    const referralSource = String(body.referral_source || '').trim()
    const gdprConsent = Boolean(body.gdpr_consent || body.privacy)

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }
    if (!gdprConsent) {
      return NextResponse.json({ error: 'Debes aceptar la política de privacidad' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    const supabase = getServiceClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
    }

    const { error } = await supabase.from('contacts').insert({
      name,
      email,
      phone: phone || null,
      subject: service || 'Consulta web',
      message,
      source: 'web_form',
      dog_name: dogName || null,
      service: service || null,
      referral_source: referralSource || null,
      gdpr_consent: gdprConsent,
    })

    if (error) {
      console.error('Contact insert error:', error)
      return NextResponse.json({ error: 'No se pudo guardar la consulta' }, { status: 500 })
    }

    try {
      await sendContactEmails({
        name,
        email,
        phone,
        dogName,
        service,
        referralSource,
        message,
      })
    } catch (mailError) {
      console.error('Contact email error:', mailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
