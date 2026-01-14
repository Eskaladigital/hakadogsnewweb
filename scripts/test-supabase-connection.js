/**
 * Script de diagnóstico para verificar conexión a Supabase
 */

const { createClient } = require('@supabase/supabase-js')

async function testConnection() {
  console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A SUPABASE\n')
  console.log('='.repeat(60))
  
  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log('\n1️⃣ VARIABLES DE ENTORNO')
  console.log('-'.repeat(60))
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Falta'}`)
  if (supabaseUrl) {
    console.log(`   Valor: ${supabaseUrl}`)
  }
  
  console.log(`\nSUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Configurada' : '❌ Falta'}`)
  if (serviceRoleKey) {
    console.log(`   Longitud: ${serviceRoleKey.length} caracteres`)
    console.log(`   Comienza con: ${serviceRoleKey.substring(0, 20)}...`)
  }
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('\n❌ Faltan variables de entorno')
    process.exit(1)
  }
  
  // Intentar crear cliente
  console.log('\n\n2️⃣ CREAR CLIENTE DE SUPABASE')
  console.log('-'.repeat(60))
  
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('✅ Cliente de Supabase creado correctamente')
    
    // Probar consulta simple
    console.log('\n\n3️⃣ PROBAR CONSULTA A BASE DE DATOS')
    console.log('-'.repeat(60))
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title')
      .limit(1)
    
    if (error) {
      console.error('❌ Error en consulta:', error.message)
      console.error('   Código:', error.code)
      console.error('   Detalles:', error.details)
      console.error('   Hint:', error.hint)
      
      if (error.message.includes('Invalid API key')) {
        console.log('\n⚠️  LA SERVICE_ROLE_KEY ES INCORRECTA O INVÁLIDA')
        console.log('   Verifica que copiaste la key completa desde Supabase')
        console.log('   Panel → Settings → API → service_role key (secret)')
      }
      
      process.exit(1)
    }
    
    console.log('✅ Consulta exitosa')
    console.log(`   Artículos en BD: ${data ? data.length : 0}`)
    if (data && data.length > 0) {
      console.log(`   Ejemplo: "${data[0].title}"`)
    }
    
    // Verificar permisos de admin
    console.log('\n\n4️⃣ VERIFICAR USUARIOS ADMIN')
    console.log('-'.repeat(60))
    
    const { data: adminData, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin')
    
    if (adminError) {
      console.log('⚠️  No se pudo verificar usuarios admin:', adminError.message)
    } else {
      console.log(`✅ Usuarios admin encontrados: ${adminData.length}`)
    }
    
    console.log('\n\n' + '='.repeat(60))
    console.log('✅ DIAGNÓSTICO COMPLETADO - TODO OK')
    console.log('='.repeat(60))
    console.log('\nPuedes ejecutar la importación con:')
    console.log('  node scripts/import-blog-posts.js')
    
  } catch (error) {
    console.error('\n❌ Error creando cliente:', error.message)
    process.exit(1)
  }
}

testConnection().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
