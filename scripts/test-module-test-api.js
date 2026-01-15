/**
 * Script de verificación de API de generación de tests
 * Comprueba configuración y permisos
 */

// Cargar variables de entorno manualmente si dotenv no está disponible
const fs = require('fs')
const path = require('path')

try {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        process.env[key] = value
      }
    })
  }
} catch (e) {
  console.log('⚠️ No se pudo cargar .env.local, usando variables del sistema')
}

async function checkConfiguration() {
  console.log('🔍 Verificando configuración para generación de tests...\n')

  // 1. Variables de entorno
  console.log('📋 Variables de entorno:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`)
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ (recomendado)' : '⚠️ No configurada (usará anon key)'}`)
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}\n`)

  // 2. Verificar conexión a Supabase
  const { createClient } = require('@supabase/supabase-js')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno de Supabase')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔄 Probando conexión a Supabase...')
  
  try {
    // Intentar leer módulos
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('id, title')
      .limit(5)

    if (modulesError) {
      console.error('❌ Error leyendo módulos:', modulesError.message)
    } else {
      console.log(`✅ Conexión OK - ${modules.length} módulos encontrados\n`)
      if (modules.length > 0) {
        console.log('📚 Primeros módulos:')
        modules.forEach(m => console.log(`   - ${m.title} (${m.id})`))
        console.log('')
      }
    }

    // Intentar leer tests existentes
    const { data: tests, error: testsError } = await supabase
      .from('module_tests')
      .select('id, title, module_id')
      .limit(5)

    if (testsError) {
      console.error('❌ Error leyendo tests:', testsError.message)
    } else {
      console.log(`✅ Tests - ${tests.length} tests encontrados`)
      if (tests.length > 0) {
        console.log('📝 Tests existentes:')
        tests.forEach(t => console.log(`   - ${t.title}`))
      }
      console.log('')
    }

    // Intentar insertar un test de prueba (y eliminarlo inmediatamente)
    console.log('🧪 Probando permisos de escritura...')
    const testModuleId = modules.length > 0 ? modules[0].id : null
    
    if (testModuleId) {
      const { data: insertTest, error: insertError } = await supabase
        .from('module_tests')
        .insert({
          module_id: testModuleId,
          title: 'TEST_VERIFICACION_TEMPORAL',
          description: 'Este es un test temporal de verificación',
          passing_score: 70,
          questions: [
            {
              id: 'q1',
              question: '¿Pregunta de prueba?',
              options: ['A', 'B', 'C', 'D'],
              correct_answer: 0,
              explanation: 'Test'
            }
          ],
          is_generated: true,
          is_published: false
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Error al insertar test de prueba:', insertError.message)
        console.error('   Código:', insertError.code)
        console.error('   Detalles:', insertError.details)
        
        if (insertError.message.includes('duplicate') || insertError.code === '23505') {
          console.log('\n⚠️ El módulo ya tiene un test. Intentando actualizar...')
          
          const { data: updateTest, error: updateError } = await supabase
            .from('module_tests')
            .update({
              title: 'TEST_VERIFICACION_TEMPORAL',
              updated_at: new Date().toISOString()
            })
            .eq('module_id', testModuleId)
            .select()
            .single()

          if (updateError) {
            console.error('❌ Error al actualizar:', updateError.message)
          } else {
            console.log('✅ Actualización OK')
            // Limpiar
            await supabase.from('module_tests').delete().eq('id', updateTest.id)
            console.log('🧹 Test de prueba eliminado')
          }
        }
      } else {
        console.log('✅ Inserción OK')
        // Limpiar
        await supabase.from('module_tests').delete().eq('id', insertTest.id)
        console.log('🧹 Test de prueba eliminado')
      }
    }

    console.log('\n✅ Verificación completada')
    console.log('\n💡 Si la API sigue fallando:')
    console.log('   1. Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada en Vercel/producción')
    console.log('   2. Revisa las políticas RLS en Supabase para la tabla module_tests')
    console.log('   3. Comprueba los logs del servidor en tiempo real al generar el test')
    console.log('   4. Asegúrate de que OPENAI_API_KEY es válida y tiene crédito')

  } catch (error) {
    console.error('❌ Error inesperado:', error.message)
  }
}

checkConfiguration()
