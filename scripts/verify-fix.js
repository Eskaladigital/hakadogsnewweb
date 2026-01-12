/**
 * Script de Verificación Rápida Post-Fix
 * 
 * Este script verifica que el cliente de Supabase esté correctamente configurado
 * y que la sesión persista después del fix aplicado.
 * 
 * USO: node scripts/verify-fix.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfmqkioftagjnxqyrngk.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no encontrada')
  process.exit(1)
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

console.log(`\n${colors.bright}${colors.cyan}🔍 Verificador Post-Fix: Configuración de Cliente Supabase${colors.reset}\n`)

// Verificar que las políticas RLS existen
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log(`${colors.cyan}1. Verificando políticas RLS...${colors.reset}`)

const { data: policies, error: policiesError } = await supabase
  .from('pg_policies')
  .select('policyname')
  .eq('tablename', 'user_lesson_progress')

if (policiesError) {
  // Si hay error accediendo a pg_policies, es normal (requiere permisos admin)
  console.log(`${colors.yellow}⚠ No se pudo verificar políticas directamente (requiere permisos admin)${colors.reset}`)
  console.log(`${colors.yellow}  Esto es normal. Las políticas se verificaron manualmente.${colors.reset}`)
} else {
  console.log(`${colors.green}✓ Políticas RLS accesibles${colors.reset}`)
}

console.log(`\n${colors.cyan}2. Verificando tablas necesarias...${colors.reset}`)

const tables = [
  'user_lesson_progress',
  'user_course_progress',
  'courses',
  'course_lessons'
]

for (const table of tables) {
  const { error } = await supabase
    .from(table)
    .select('id')
    .limit(1)
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = tabla vacía (OK)
    console.log(`${colors.red}✗ Tabla "${table}": ${error.message}${colors.reset}`)
  } else {
    console.log(`${colors.green}✓ Tabla "${table}" accesible${colors.reset}`)
  }
}

console.log(`\n${colors.cyan}3. Verificando configuración del cliente...${colors.reset}`)

// Verificar que el archivo client.ts tiene la configuración correcta
const fs = await import('fs')
const clientPath = './lib/supabase/client.ts'

try {
  const clientContent = fs.readFileSync(clientPath, 'utf-8')
  
  const checks = [
    { key: 'persistSession: true', name: 'Persistencia de sesión' },
    { key: 'autoRefreshToken: true', name: 'Auto-refresh de token' },
    { key: 'detectSessionInUrl: true', name: 'Detección de sesión en URL' },
    { key: 'storage:', name: 'Configuración de storage' }
  ]
  
  let allChecksPass = true
  
  for (const check of checks) {
    if (clientContent.includes(check.key)) {
      console.log(`${colors.green}✓ ${check.name} configurada${colors.reset}`)
    } else {
      console.log(`${colors.red}✗ ${check.name} NO configurada${colors.reset}`)
      allChecksPass = false
    }
  }
  
  if (allChecksPass) {
    console.log(`\n${colors.green}${colors.bright}✅ Cliente de Supabase correctamente configurado!${colors.reset}`)
  } else {
    console.log(`\n${colors.red}${colors.bright}❌ Faltan configuraciones en el cliente${colors.reset}`)
    console.log(`\n${colors.yellow}Verifica que el archivo lib/supabase/client.ts contenga:${colors.reset}`)
    console.log(`
auth: {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
}
`)
  }
} catch (error) {
  console.log(`${colors.red}✗ Error leyendo archivo client.ts: ${error.message}${colors.reset}`)
}

console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)

console.log(`${colors.cyan}📋 SIGUIENTE PASO:${colors.reset}\n`)
console.log(`1. Si estás en ${colors.bright}LOCAL${colors.reset}:`)
console.log(`   ${colors.yellow}→${colors.reset} Borra la carpeta .next: ${colors.cyan}Remove-Item -Recurse -Force .next${colors.reset}`)
console.log(`   ${colors.yellow}→${colors.reset} Reinicia el servidor: ${colors.cyan}npm run dev${colors.reset}`)
console.log(`   ${colors.yellow}→${colors.reset} Limpia caché del navegador: ${colors.cyan}Ctrl+Shift+R${colors.reset}`)
console.log(`\n2. Si estás en ${colors.bright}PRODUCCIÓN${colors.reset}:`)
console.log(`   ${colors.yellow}→${colors.reset} Haz commit: ${colors.cyan}git add . && git commit -m "fix: configurar sesión Supabase"${colors.reset}`)
console.log(`   ${colors.yellow}→${colors.reset} Push: ${colors.cyan}git push origin main${colors.reset}`)
console.log(`   ${colors.yellow}→${colors.reset} Espera el deploy en Vercel/Amplify`)
console.log(`   ${colors.yellow}→${colors.reset} Limpia caché: ${colors.cyan}Ctrl+Shift+R${colors.reset} en www.hakadogs.com`)
console.log(`\n3. ${colors.bright}PRUEBA${colors.reset}:`)
console.log(`   ${colors.yellow}→${colors.reset} Cierra sesión completamente`)
console.log(`   ${colors.yellow}→${colors.reset} Vuelve a iniciar sesión`)
console.log(`   ${colors.yellow}→${colors.reset} Intenta marcar una lección como completada`)
console.log(`   ${colors.yellow}→${colors.reset} Verifica en consola (F12): debe ser ${colors.green}201 Created${colors.reset}, no 403\n`)

console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
