#!/usr/bin/env node

/**
 * Pre-Deploy Verification Script
 * Verifica que todo está listo para deploy
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' })
  } catch (error) {
    return null
  }
}

async function main() {
  log('\n🚀 PRE-DEPLOY VERIFICATION - Hakadogs PageSpeed Optimization\n', 'blue')
  log('═'.repeat(70), 'blue')
  
  let passed = 0
  let failed = 0
  let warnings = 0
  
  // 1. Check Node version
  log('\n📦 1. Verificando Node.js...', 'bold')
  const nodeVersion = process.version
  if (nodeVersion) {
    log(`   ✅ Node version: ${nodeVersion}`, 'green')
    passed++
  } else {
    log('   ❌ Node.js no encontrado', 'red')
    failed++
  }
  
  // 2. Check dependencies
  log('\n📚 2. Verificando dependencias...', 'bold')
  if (fs.existsSync('node_modules')) {
    log('   ✅ node_modules existe', 'green')
    passed++
  } else {
    log('   ❌ node_modules no encontrado. Ejecuta: npm install', 'red')
    failed++
  }
  
  // 3. Check critical files
  log('\n📄 3. Verificando archivos críticos...', 'bold')
  const criticalFiles = [
    'next.config.js',
    'app/layout.tsx',
    'app/page.tsx',
    'components/Hero.tsx',
    'components/Navigation.tsx',
    'components/ui/LoadingSkeleton.tsx',
    'public/images/hakadogs_educacion_canina_home_2.png',
    'public/images/logo_definitivo_hakadogs.webp'
  ]
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`   ✅ ${file}`, 'green')
      passed++
    } else {
      log(`   ❌ ${file} NO ENCONTRADO`, 'red')
      failed++
    }
  })
  
  // 4. Run linter
  log('\n🔍 4. Ejecutando linter...', 'bold')
  const lintResult = exec('npm run lint')
  if (lintResult !== null && !lintResult.includes('Error')) {
    log('   ✅ Lint passed', 'green')
    passed++
  } else {
    log('   ⚠️  Lint warnings (revisar)', 'yellow')
    warnings++
  }
  
  // 5. Try build
  log('\n🏗️  5. Intentando build de producción...', 'bold')
  log('   (Esto puede tomar 1-2 minutos)\n', 'yellow')
  
  const buildResult = exec('npm run build')
  if (buildResult !== null) {
    log('   ✅ Build exitoso', 'green')
    passed++
    
    // Check bundle size
    if (fs.existsSync('.next')) {
      log('\n📊 6. Análisis de bundle...', 'bold')
      const buildManifest = path.join('.next', 'build-manifest.json')
      if (fs.existsSync(buildManifest)) {
        const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
        log('   ✅ Build manifest generado', 'green')
        passed++
      }
    }
  } else {
    log('   ❌ Build FALLÓ - Revisar errores arriba', 'red')
    failed++
  }
  
  // 7. Check environment variables
  log('\n🔐 7. Verificando variables de entorno...', 'bold')
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      log(`   ✅ ${envVar} está configurada`, 'green')
      passed++
    } else {
      log(`   ⚠️  ${envVar} no encontrada en .env.local`, 'yellow')
      warnings++
    }
  })
  
  // 8. Git status
  log('\n🔀 8. Verificando Git status...', 'bold')
  const gitStatus = exec('git status --porcelain')
  if (gitStatus) {
    const changes = gitStatus.split('\n').filter(line => line.trim())
    if (changes.length === 0) {
      log('   ✅ No hay cambios sin commitear', 'green')
      passed++
    } else {
      log(`   ⚠️  ${changes.length} archivos con cambios sin commitear`, 'yellow')
      warnings++
      log('   Cambios pendientes:', 'yellow')
      changes.slice(0, 5).forEach(change => {
        log(`     ${change}`, 'yellow')
      })
      if (changes.length > 5) {
        log(`     ... y ${changes.length - 5} más`, 'yellow')
      }
    }
  }
  
  // 9. Check documentation
  log('\n📖 9. Verificando documentación...', 'bold')
  const docs = [
    'docs/OPTIMIZACION_PAGESPEED.md',
    'docs/DEPLOY_PAGESPEED_OPTIMIZATION.md',
    'docs/RESUMEN_EJECUTIVO_PAGESPEED.md'
  ]
  
  docs.forEach(doc => {
    if (fs.existsSync(doc)) {
      log(`   ✅ ${doc}`, 'green')
      passed++
    } else {
      log(`   ⚠️  ${doc} no encontrado`, 'yellow')
      warnings++
    }
  })
  
  // 10. Final recommendations
  log('\n💡 10. Recomendaciones finales...', 'bold')
  log('   ℹ️  Ejecutar test manual: npm run start', 'blue')
  log('   ℹ️  Abrir http://localhost:3000', 'blue')
  log('   ℹ️  Verificar que Hero carga correctamente', 'blue')
  log('   ℹ️  Verificar animaciones CSS funcionan', 'blue')
  log('   ℹ️  Test en Chrome DevTools: Performance tab', 'blue')
  
  // Summary
  log('\n' + '═'.repeat(70), 'blue')
  log('📊 RESUMEN DE VERIFICACIÓN', 'bold')
  log('═'.repeat(70), 'blue')
  log(`✅ Checks pasados: ${passed}`, 'green')
  log(`⚠️  Warnings: ${warnings}`, 'yellow')
  log(`❌ Checks fallidos: ${failed}`, 'red')
  
  if (failed > 0) {
    log('\n❌ DEPLOY NO RECOMENDADO - Resolver errores primero', 'red')
    process.exit(1)
  } else if (warnings > 0) {
    log('\n⚠️  DEPLOY CON PRECAUCIÓN - Revisar warnings', 'yellow')
    process.exit(0)
  } else {
    log('\n✅ TODO LISTO PARA DEPLOY! 🚀', 'green')
    log('\nPróximos pasos:', 'blue')
    log('  1. git add .', 'blue')
    log('  2. git commit -m "feat: PageSpeed optimization"', 'blue')
    log('  3. git push origin main', 'blue')
    log('  4. Monitorear deployment en Amplify/Vercel', 'blue')
    log('  5. Verificar PageSpeed Insights después de deploy\n', 'blue')
    process.exit(0)
  }
}

main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
