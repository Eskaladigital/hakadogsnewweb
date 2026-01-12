/**
 * Script para revisar el contenido generado en Supabase
 * y verificar la calidad y detalle de la información
 */

const fetch = require('node-fetch');

const SUPABASE_URL = 'https://pfmqkioftagjnxqyrngk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ypGcZOFZ0sj5IEy2WEwurA_rHyxuUwq';

async function checkContent() {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🔍 VERIFICANDO CONTENIDO GENERADO EN SUPABASE');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  try {
    // Obtener contenido de Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/city_content_cache?select=*&order=generated_at.desc&limit=3`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const cities = await response.json();

    if (cities.length === 0) {
      console.log('⚠️  No hay contenido generado aún en Supabase');
      return;
    }

    console.log(`✅ Encontradas ${cities.length} ciudades con contenido generado\n`);

    // Analizar cada ciudad
    cities.forEach((city, index) => {
      console.log(`\n${'━'.repeat(55)}`);
      console.log(`📍 CIUDAD ${index + 1}: ${city.city_name.toUpperCase()} (${city.province})`);
      console.log(`${'━'.repeat(55)}`);
      console.log(`🗓️  Generado: ${new Date(city.generated_at).toLocaleString('es-ES')}`);
      console.log(`🔄 Versión: ${city.version}`);
      
      console.log('\n📝 INTRO TEXT:');
      console.log(`   Longitud: ${city.intro_text.length} caracteres`);
      console.log(`   Contenido: ${city.intro_text.substring(0, 150)}...`);

      console.log('\n✅ LOCAL BENEFITS:');
      if (Array.isArray(city.local_benefits)) {
        console.log(`   Total: ${city.local_benefits.length} beneficios`);
        city.local_benefits.forEach((benefit, i) => {
          console.log(`   ${i + 1}. ${benefit.substring(0, 80)}...`);
        });
      }

      console.log('\n📍 LOCAL INFO:');
      if (city.local_info) {
        console.log(`   📌 Pipicanes (${city.local_info.pipicanes?.length || 0} chars):`);
        console.log(`      ${(city.local_info.pipicanes || 'No disponible').substring(0, 120)}...`);
        
        console.log(`   📜 Normativas (${city.local_info.normativas?.length || 0} chars):`);
        console.log(`      ${(city.local_info.normativas || 'No disponible').substring(0, 120)}...`);
        
        console.log(`   🌡️  Clima (${city.local_info.clima?.length || 0} chars):`);
        console.log(`      ${(city.local_info.clima || 'No disponible').substring(0, 120)}...`);
        
        console.log(`   🏖️  Playas (${city.local_info.playas?.length || 0} chars):`);
        console.log(`      ${(city.local_info.playas || 'No disponible').substring(0, 120)}...`);
      }

      console.log('\n⚠️  CHALLENGES:');
      if (Array.isArray(city.challenges)) {
        console.log(`   Total: ${city.challenges.length} desafíos`);
        city.challenges.forEach((challenge, i) => {
          console.log(`   ${i + 1}. ${challenge}`);
        });
      }

      console.log('\n💬 TESTIMONIAL:');
      if (city.testimonial) {
        console.log(`   Autor: ${city.testimonial.author}`);
        console.log(`   Barrio: ${city.testimonial.neighborhood}`);
        console.log(`   Texto (${city.testimonial.text?.length || 0} chars): ${city.testimonial.text?.substring(0, 100)}...`);
      }

      console.log('\n❓ FAQs:');
      if (Array.isArray(city.faqs)) {
        console.log(`   Total: ${city.faqs.length} preguntas`);
        city.faqs.forEach((faq, i) => {
          console.log(`   ${i + 1}. ${faq.question}`);
          console.log(`      R: ${faq.answer?.substring(0, 80)}...`);
        });
      }

      // Análisis de calidad
      console.log('\n📊 ANÁLISIS DE CALIDAD:');
      const quality = {
        introOk: city.intro_text.length > 200,
        benefitsOk: city.local_benefits?.length >= 4,
        pipicansOk: city.local_info?.pipicanes?.length > 100,
        normativasOk: city.local_info?.normativas?.length > 100,
        climaOk: city.local_info?.clima?.length > 80,
        playasOk: city.local_info?.playas?.length > 80,
        challengesOk: city.challenges?.length >= 3,
        testimonialOk: city.testimonial?.text?.length > 120,
        faqsOk: city.faqs?.length >= 3,
      };

      const score = Object.values(quality).filter(v => v).length;
      const total = Object.keys(quality).length;
      const percentage = Math.round((score / total) * 100);

      console.log(`   ✅ Intro Text: ${quality.introOk ? '✓' : '✗'} (${city.intro_text.length} chars)`);
      console.log(`   ✅ Benefits: ${quality.benefitsOk ? '✓' : '✗'} (${city.local_benefits?.length || 0}/4)`);
      console.log(`   ✅ Pipicanes Info: ${quality.pipicansOk ? '✓' : '✗'} (${city.local_info?.pipicanes?.length || 0} chars)`);
      console.log(`   ✅ Normativas Info: ${quality.normativasOk ? '✓' : '✗'} (${city.local_info?.normativas?.length || 0} chars)`);
      console.log(`   ✅ Clima Info: ${quality.climaOk ? '✓' : '✗'} (${city.local_info?.clima?.length || 0} chars)`);
      console.log(`   ✅ Playas Info: ${quality.playasOk ? '✓' : '✗'} (${city.local_info?.playas?.length || 0} chars)`);
      console.log(`   ✅ Challenges: ${quality.challengesOk ? '✓' : '✗'} (${city.challenges?.length || 0}/3)`);
      console.log(`   ✅ Testimonial: ${quality.testimonialOk ? '✓' : '✗'} (${city.testimonial?.text?.length || 0} chars)`);
      console.log(`   ✅ FAQs: ${quality.faqsOk ? '✓' : '✗'} (${city.faqs?.length || 0}/3)`);
      
      console.log(`\n   🎯 PUNTUACIÓN TOTAL: ${score}/${total} (${percentage}%)`);
      
      if (percentage >= 80) {
        console.log('   ✅ CALIDAD: EXCELENTE');
      } else if (percentage >= 60) {
        console.log('   ⚠️  CALIDAD: BUENA (mejorable)');
      } else {
        console.log('   ❌ CALIDAD: INSUFICIENTE (necesita mejora)');
      }
    });

    console.log('\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ VERIFICACIÓN COMPLETADA');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkContent();
