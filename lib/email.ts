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

export async function sendContactEmails(lead: {
  name: string
  email: string
  phone?: string
  contactType?: string
  company?: string
  dogName?: string
  service?: string
  referralSource?: string
  message: string
}) {
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const phone = lead.phone ? escapeHtml(lead.phone) : ''
  const company = lead.company ? escapeHtml(lead.company) : ''
  const dogName = lead.dogName ? escapeHtml(lead.dogName) : ''
  const service = lead.service ? escapeHtml(lead.service) : ''
  const referral = lead.referralSource ? escapeHtml(lead.referralSource) : ''
  const contactType = lead.contactType === 'professional' ? 'Profesional' : 'Particular'
  const message = escapeHtml(lead.message)

  const adminHtml = `
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
    <p><strong>Tipo:</strong> ${contactType}</p>
    ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
    ${dogName ? `<p><strong>Perro:</strong> ${dogName}</p>` : ''}
    ${service ? `<p><strong>Servicio:</strong> ${service}</p>` : ''}
    ${referral ? `<p><strong>Origen:</strong> ${referral}</p>` : ''}
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${message}</p>
  `

  const clientHtml = `
    <p>Hola ${name},</p>
    <p>Hemos recibido tu consulta. Te responderemos en menos de 24 horas.</p>
    <p>Hakadogs · 685 64 82 41 · info@hakadogs.com</p>
  `

  const admin = await sendSmtpEmail({
    from: FROM,
    to: ADMIN,
    subject: `Nueva consulta web de ${lead.name}`,
    html: adminHtml,
    replyTo: lead.email,
  })
  const client = await sendSmtpEmail({
    from: FROM,
    to: lead.email,
    subject: 'Hemos recibido tu consulta — Hakadogs',
    html: clientHtml,
  })
  return { admin, client }
}
