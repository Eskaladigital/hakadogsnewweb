const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Leer .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

let SUPABASE_URL = ''
let SUPABASE_ANON_KEY = ''

envContent.split('\n').forEach(line => {
  line = line.trim()
  if (!line || line.startsWith('#')) return
  
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim().replace(/^["']|["']$/g, '')
    
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') SUPABASE_URL = value
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') SUPABASE_ANON_KEY = value
  }
})

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkCity(slug) {
  console.log(`\n🔍 Verificando: ${slug}`)
  
  const { data, error } = await supabase
    .from('city_content_cache')
    .select('city_slug, city_name, intro_text')
    .eq('city_slug', slug)
    .maybeSingle()
  
  if (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
  
  if (!data) {
    console.log(`❌ No hay datos`)
    return false
  }
  
  console.log(`✅ Datos encontrados:`)
  console.log(`   - city_name: ${data.city_name}`)
  console.log(`   - intro_text: ${data.intro_text ? data.intro_text.substring(0, 80) + '...' : 'VACÍO'}`)
  return true
}

async function main() {
  const citiesToCheck = ['alicante', 'san-javier', 'gijon', 'yecla', 'torrevieja']
  
  console.log('🚀 Verificando datos en Supabase...\n')
  console.log(`URL: ${SUPABASE_URL}`)
  console.log(`Key: ${SUPABASE_ANON_KEY.substring(0, 30)}...`)
  
  let found = 0
  let missing = 0
  
  for (const city of citiesToCheck) {
    const exists = await checkCity(city)
    if (exists) found++
    else missing++
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 RESUMEN:`)
  console.log(`✅ Con datos: ${found}`)
  console.log(`❌ Sin datos: ${missing}`)
  console.log(`${'='.repeat(60)}`)
}

main().then(() => process.exit(0)).catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
