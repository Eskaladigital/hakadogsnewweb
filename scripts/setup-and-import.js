/**
 * Script interactivo para configurar variables e importar blog
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('================================')
  console.log('  CONFIGURAR E IMPORTAR BLOG')
  console.log('================================\n')
  
  console.log('📋 Necesitas obtener 2 variables de Vercel:')
  console.log('   https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables\n')
  
  const supabaseUrl = await question('1. NEXT_PUBLIC_SUPABASE_URL: ')
  const serviceRoleKey = await question('2. SUPABASE_SERVICE_ROLE_KEY: ')
  
  rl.close()
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('\n❌ Debes proporcionar ambas variables')
    process.exit(1)
  }
  
  // Crear .env.local
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.trim()}
`
  
  const envPath = path.join(__dirname, '..', '.env.local')
  fs.writeFileSync(envPath, envContent, 'utf-8')
  
  console.log('\n✅ Archivo .env.local creado\n')
  console.log('🚀 Ejecutando importación...\n')
  
  // Establecer variables de entorno y ejecutar importación
  process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl.trim()
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey.trim()
  
  require('./import-blog-posts.js')
}

main().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
