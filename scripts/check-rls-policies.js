/**
 * Script de Verificación Rápida de RLS
 * 
 * Este script verifica si las políticas RLS están correctamente configuradas
 * sin necesidad de autenticación.
 * 
 * USO: node scripts/check-rls-policies.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfmqkioftagjnxqyrngk.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no encontrada')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

async function checkRLS() {
  console.log(`\n${colors.bright}${colors.cyan}🔍 Verificador de Políticas RLS${colors.reset}\n`)
  
  let allGood = true

  // Verificar tablas necesarias
  const tables = [
    'courses',
    'course_lessons',
    'user_lesson_progress',
    'user_course_progress',
    'course_purchases'
  ]

  console.log('📊 Verificando existencia de tablas...\n')

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1)
      
      if (error) {
        if (error.code === '42P01') {
          console.log(`${colors.red}✗${colors.reset} Tabla "${table}" NO EXISTE`)
          console.log(`  → Ejecuta: supabase/setup_completo.sql\n`)
          allGood = false
        } else if (error.code === 'PGRST301') {
          console.log(`${colors.yellow}⚠${colors.reset} Tabla "${table}" existe pero sin políticas RLS`)
          console.log(`  → Ejecuta: supabase/fix_rls_policies.sql\n`)
          allGood = false
        } else {
          console.log(`${colors.green}✓${colors.reset} Tabla "${table}" accesible`)
        }
      } else {
        console.log(`${colors.green}✓${colors.reset} Tabla "${table}" accesible`)
      }
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} Error verificando "${table}": ${error.message}\n`)
      allGood = false
    }
  }

  // Verificar funciones RPC (opcional)
  console.log('\n🔧 Verificando funciones RPC (opcional)...\n')
  
  try {
    const { error } = await supabase.rpc('get_recent_sales', { limit_count: 1 })
    
    if (error) {
      if (error.code === '42883') {
        console.log(`${colors.yellow}⚠${colors.reset} Función "get_recent_sales" NO EXISTE`)
        console.log(`  → Solo necesaria para dashboard admin\n`)
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Función "get_recent_sales" con error: ${error.message}\n`)
      }
    } else {
      console.log(`${colors.green}✓${colors.reset} Función "get_recent_sales" disponible`)
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠${colors.reset} No se pudo verificar get_recent_sales (no crítico)\n`)
  }

  // Resumen final
  console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
  
  if (allGood) {
    console.log(`${colors.green}${colors.bright}✅ Todo configurado correctamente!${colors.reset}\n`)
    console.log('Puedes proceder a probar la funcionalidad de marcar lecciones como completadas.\n')
  } else {
    console.log(`${colors.red}${colors.bright}❌ Se encontraron problemas de configuración${colors.reset}\n`)
    console.log('PASOS SIGUIENTES:\n')
    console.log('1. Ve a Supabase Dashboard → SQL Editor')
    console.log('2. Ejecuta el script: supabase/fix_rls_policies.sql')
    console.log('3. Vuelve a ejecutar este script para verificar\n')
    console.log('📚 Más info: ERRORES_Y_SOLUCIONES.md\n')
  }
}

checkRLS().catch((error) => {
  console.error(`\n${colors.red}Error inesperado:${colors.reset}`, error.message)
  process.exit(1)
})
