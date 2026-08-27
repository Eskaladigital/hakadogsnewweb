import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let _transporter: Transporter | null = null
let _warned = false

function smtpPass() {
  return process.env.SMTP_PASS?.trim() || process.env.SMTP_PASSWORD?.trim() || ''
}

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter
  const host = process.env.SMTP_HOST?.trim() || 'ssl0.ovh.net'
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER?.trim()
  const pass = smtpPass()
  if (!user || !pass) {
    if (!_warned) {
      console.warn('[email] SMTP_USER / SMTP_PASS no configurados; correo omitido')
      _warned = true
    }
    return null
  }
  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  })
  return _transporter
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function referralLabel(value: string) {
  const map: Record<string, string> = {
    google: 'Búsqueda en Google',
    social: 'Redes sociales',
    referral: 'Recomendación',
    other: 'Otro',
  }
  return map[value] || value
}

function serviceLabel(value: string) {
  const map: Record<string, string> = {
    'educacion-basica': 'Educación Básica',
    'modificacion-conducta': 'Modificación de Conducta',
    cachorros: 'Educación de Cachorros',
    'clases-grupales': 'Clases Grupales',
    consulta: 'Solo Consulta',
  }
  return map[value] || value
}

const C = {
  page: '#f9f6f1',
  paper: '#ffffff',
  ink: '#1a3d23',
  muted: '#5a6f5e',
  line: '#dce6dc',
  header: '#1a3d23',
  headerFg: '#f9f6f1',
  accent: '#2d5f3a',
  box: '#eef4ef',
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hakadogs</title></head>
<body style="margin:0;padding:0;background-color:${C.page};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${C.paper};border:1px solid ${C.line};">
<tr><td style="background-color:${C.header};padding:24px 32px;text-align:center;">
<span style="font-size:20px;font-weight:bold;color:${C.headerFg};letter-spacing:2px;text-transform:uppercase;">Hakadogs</span>
<br><span style="font-size:11px;color:#c5d4c8;letter-spacing:1px;text-transform:uppercase;">Educación canina</span>
</td></tr>
<tr><td style="padding:32px;">${content}</td></tr>
<tr><td style="background-color:${C.page};padding:20px 32px;border-top:1px solid ${C.line};text-align:center;">
<p style="margin:0;font-size:12px;color:${C.muted};">Hakadogs — www.hakadogs.com</p>
<p style="margin:6px 0 0;font-size:11px;color:${C.line};">Este correo se ha enviado de forma automática.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

async function sendSmtpEmail(opts: {
  from: string
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const transporter = getTransporter()
  if (!transporter) return { ok: false, skipped: true as const }
  try {
    await transporter.sendMail({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    return { ok: true, skipped: false as const }
  } catch (err) {
    console.error('[email] SMTP error', err)
    return { ok: false, skipped: false as const }
  }
}

const FROM = process.env.SMTP_FROM?.trim() || 'Hakadogs <info@hakadogs.com>'
const ADMIN = process.env.SMTP_TO?.trim() || 'info@hakadogs.com'

function contactAdminHtml(lead: {
  name: string
  email: string
  phone?: string
  dogName?: string
  service?: string
  referralSource?: string
  message: string
}) {
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const phone = lead.phone ? escapeHtml(lead.phone) : ''
  const dogName = lead.dogName ? escapeHtml(lead.dogName) : ''
  const service = lead.service ? escapeHtml(serviceLabel(lead.service)) : ''
  const referral = lead.referralSource ? escapeHtml(referralLabel(lead.referralSource)) : ''
  const message = escapeHtml(lead.message)
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${C.ink};">Nueva consulta</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">${new Date().toLocaleDateString('es-ES')} — ${name}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 2px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Contacto</p>
<p style="margin:0;font-size:14px;font-weight:bold;">${name}</p>
${dogName ? `<p style="margin:2px 0 0;font-size:13px;color:${C.muted};">Perro: ${dogName}</p>` : ''}
<p style="margin:4px 0 0;font-size:13px;"><a href="mailto:${email}" style="color:${C.accent};">${email}</a></p>
${phone ? `<p style="margin:2px 0 0;font-size:13px;">${phone}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Consulta</p>
${service ? `<p style="margin:0;font-size:13px;"><strong>${service}</strong></p>` : ''}
${referral ? `<p style="margin:8px 0 0;font-size:13px;color:${C.muted};">Origen: ${referral}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Mensaje</p>
<p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<a href="https://www.hakadogs.com/administrator/contactos" style="display:inline-block;padding:12px 32px;background-color:${C.accent};color:#ffffff;font-size:13px;font-weight:bold;text-transform:uppercase;text-decoration:none;letter-spacing:1px;">Ver en el panel admin</a>
</td></tr></table>`)
}

function contactClientHtml(lead: { name: string; message: string }) {
  const name = escapeHtml(lead.name)
  const message = escapeHtml(lead.message)
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${C.ink};">Hemos recibido tu consulta</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">Hakadogs</p>
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">Hola <strong>${name}</strong>,</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;">Hemos recibido tu consulta. Te responderemos en menos de 24 horas.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Tu mensaje</p>
<p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;">Si necesitas añadir algo, responde a este correo o escribe a <a href="mailto:info@hakadogs.com" style="color:${C.accent};">info@hakadogs.com</a>.</p>
<p style="margin:24px 0 0;font-size:14px;line-height:1.6;">685 64 82 41 · Hakadogs · Archena</p>`)
}

export async function sendContactEmails(lead: {
  name: string
  email: string
  phone?: string
  dogName?: string
  service?: string
  referralSource?: string
  message: string
}) {
  const admin = await sendSmtpEmail({
    from: FROM,
    to: ADMIN,
    subject: `[Web] Nueva consulta de ${lead.name}`,
    html: contactAdminHtml(lead),
    replyTo: lead.email,
  })
  const client = await sendSmtpEmail({
    from: FROM,
    to: lead.email,
    subject: 'Hemos recibido tu consulta — Hakadogs',
    html: contactClientHtml(lead),
  })
  return { admin, client }
}
