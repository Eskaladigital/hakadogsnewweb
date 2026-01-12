'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Rocket, PartyPopper, DollarSign, Star, Zap, Award, TrendingUp, Target, Shield, Sparkles } from 'lucide-react';

export default function PresupuestoPage() {
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{id: number, x: number, emoji: string}>>([]);
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const emojis = ['🐕', '💰', '🚀', '⭐', '🎉', '💎', '🔥', '✨', '🏆', '💪', '🚜', '🏊‍♂️', '🤖'];
      setFloatingEmojis(prev => [
        ...prev.slice(-20), // 20 elementos (entre 15 y 25)
        {
          id: Date.now(),
          x: Math.random() * 100,
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        }
      ]);
    }, 900); // 900ms (entre 600 y 1200)

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg) scale(1); }
          50% { transform: rotate(4deg) scale(1.06); }
        }
        @keyframes bounce-medium {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.08); }
        }
        @keyframes pulse-rainbow {
          0% { box-shadow: 0 0 25px rgba(255,0,0,0.4), 0 0 50px rgba(255,0,0,0.2); }
          20% { box-shadow: 0 0 25px rgba(255,255,0,0.4), 0 0 50px rgba(255,255,0,0.2); }
          40% { box-shadow: 0 0 25px rgba(0,255,0,0.4), 0 0 50px rgba(0,255,0,0.2); }
          60% { box-shadow: 0 0 25px rgba(0,255,255,0.4), 0 0 50px rgba(0,255,255,0.2); }
          80% { box-shadow: 0 0 25px rgba(0,0,255,0.4), 0 0 50px rgba(0,0,255,0.2); }
          100% { box-shadow: 0 0 25px rgba(255,0,255,0.4), 0 0 50px rgba(255,0,255,0.2); }
        }
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(2deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.85) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.05) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-bounce-medium { animation: bounce-medium 2s ease-in-out infinite; }
        .animate-pulse-rainbow { animation: pulse-rainbow 4s ease-in-out infinite; }
        .animate-spin-medium { animation: spin-medium 7s linear infinite; }
        .animate-sway { animation: sway 1.5s ease-in-out infinite; }
        .animate-pop-in { animation: pop-in 0.7s cubic-bezier(0.68, -0.35, 0.265, 1.35); }
        .animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }
        .hover-grow {
          transition: all 0.35s cubic-bezier(0.68, -0.35, 0.265, 1.35);
        }
        .hover-grow:hover {
          transform: scale(1.08) translateY(-4px) rotate(1deg);
          box-shadow: 0 15px 30px rgba(0,0,0,0.18);
        }
        .text-shadow-glow {
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.6), 0 0 35px rgba(255, 215, 0, 0.4);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream overflow-hidden relative">
        {/* Emojis flotantes de fondo */}
        {floatingEmojis.map(emoji => (
          <div
            key={emoji.id}
            className="absolute text-5xl pointer-events-none z-0 opacity-75"
            style={{
              left: `${emoji.x}%`,
              bottom: '-50px',
              animation: `floatUp ${5 + Math.random() * 3}s linear forwards` // 5-8s (punto medio entre 4-7 y 8-12)
            }}
          >
            {emoji.emoji}
          </div>
        ))}

        {/* HEADER ÉPICO */}
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-16 md:py-24 relative overflow-hidden">
          {/* Estrellas parpadeantes */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => ( // 30 estrellas (punto medio entre 25 y 40)
              <div
                key={i}
                className="absolute text-yellow-200 opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `pulse ${1.5 + Math.random() * 2}s ease-in-out infinite`, // 1.5-3.5s (medio entre 0.5-2 y 2-5)
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${12 + Math.random() * 18}px` // 12-30px (medio)
                }}
              >
                ✨
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-6 md:px-8 text-center relative z-10">
            <div className="text-8xl mb-6 animate-bounce-medium">
              🚨💰🚨
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 animate-sway text-shadow-glow">
              ¡¡ALFREDO PAGA!!
            </h1>

            <div className="inline-block bg-black text-yellow-300 px-8 py-4 rounded-full text-3xl md:text-4xl font-black animate-pulse-rainbow mb-6 transform hover:scale-105 transition-all cursor-pointer">
              💎 ¡DICE LA IA QUE VALE 14.000€! 💎
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-pop-in text-shadow-glow">
              🚜 ¡DAME TU RANCHERA... O TU PISCINA! 🏊‍♂️
            </h2>

            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: '🏷️', value: '3.0.1', label: 'Versión' },
                { icon: '🤖', value: '40h', label: 'Con IA' },
                { icon: '⚡', value: '5 días', label: 'Entrega' },
                { icon: '🚀', value: '95/100', label: 'Performance' },
                { icon: '🎯', value: '100/100', label: 'SEO' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 hover-grow cursor-pointer animate-pop-in"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="text-5xl mb-3 animate-wiggle">{item.icon}</div>
                  <div className="text-4xl font-black text-yellow-300">{item.value}</div>
                  <div className="text-white font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESUMEN EJECUTIVO ULTRA LOCO */}
        <section className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-3xl font-black animate-bounce-medium shadow-2xl">
              🔥 ¡ESTO ES ORO PURO, ALFREDO! 🔥
            </span>
          </div>

          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-gold animate-pulse-rainbow hover-grow">
            <div className="text-7xl text-center mb-6 animate-bounce-medium">
              🎊 💎 🎊
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-forest-dark mb-8 text-center">
              ¿QUÉ INCLUYE ESTE CHOLLO?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-lg">
              {[
                { icon: '💰', text: '<strong>VENDER</strong> cursos 24/7 sin parar' },
                { icon: '📊', text: '<strong>GESTIONAR</strong> todo desde el sofá' },
                { icon: '🗺️', text: '<strong>APARECER</strong> en 54 ciudades en Google' },
                { icon: '🤑', text: '<strong>GENERAR</strong> pasta mientras duermes' },
                { icon: '⭐', text: '<strong>PRESUMIR</strong> de web profesional' },
                { icon: '🏆', text: '<strong>COMPETIR</strong> con los grandes' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white rounded-2xl p-6 hover-grow cursor-pointer shadow-lg animate-pop-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                >
                  <div className="text-6xl animate-wiggle">{item.icon}</div>
                  <div>
                    <CheckCircle className="w-6 h-6 text-green-600 inline mr-2 animate-spin-medium" />
                    <span className="text-xl" dangerouslySetInnerHTML={{ __html: item.text }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <div className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-2xl font-black animate-pulse shadow-xl">
                ⚠️ ¡LA IA DICE QUE ESTO VALE 95.000€! ⚠️
              </div>
            </div>
          </div>
        </section>

        {/* REVOLUCIÓN DE LA IA - MEGA ÉPICO */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full text-2xl font-black animate-sway shadow-2xl">
              🤖 ¡LA IA DICE QUE TE SALE REGALADO! 🤖
            </span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 rounded-3xl p-8 md:p-12 border-4 border-blue-400 hover-grow">
            <h2 className="text-5xl font-black text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 REVOLUCIÓN CON IA - 2026
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* SIN IA */}
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-8 border-4 border-red-400 transform hover:scale-105 transition-all">
                <div className="text-6xl mb-4 text-center animate-sway">❌</div>
                <h3 className="text-3xl font-black text-red-700 mb-6 text-center">
                  MÉTODO ANTIGUO (2023)
                </h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>⏱️ Tiempo:</span>
                    <span className="font-bold">4-6 meses 😴</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>⏳ Horas:</span>
                    <span className="font-bold">740 horas 🥵</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>👥 Equipo:</span>
                    <span className="font-bold">2-3 personas</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>💸 Coste:</span>
                    <span className="font-bold text-red-700">95.000€ 😱</span>
                  </div>
                </div>
              </div>

              {/* CON IA */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 border-4 border-green-500 transform hover:scale-105 transition-all animate-pulse-rainbow">
                <div className="text-6xl mb-4 text-center animate-bounce-medium">✅</div>
                <h3 className="text-3xl font-black text-green-700 mb-6 text-center">
                  MÉTODO CON IA (2026)
                </h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>⚡ Tiempo:</span>
                    <span className="font-bold text-green-700">5 días 🚀</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>✨ Horas:</span>
                    <span className="font-bold text-green-700">40 horas 😎</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>👤 Equipo:</span>
                    <span className="font-bold text-green-700">1 + IA 🤖</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                    <span>💎 Coste:</span>
                    <span className="font-bold text-green-700 text-2xl">14.000€ 🎉</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-8 text-center border-4 border-yellow-500">
              <div className="text-4xl font-black mb-4">
                🎯 ¡18.5x MÁS RÁPIDO! 🎯
              </div>
              <div className="text-2xl font-bold">
                ¡AHORRO DE 81.000€ (83%)! 💰
              </div>
              <div className="mt-4 text-xl">
                <strong className="text-red-600">¡MISMO PRODUCTO, MENOS TIEMPO!</strong>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CONTENIDO GENERADO CON IA - NUEVO VALOR AÑADIDO */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full text-2xl font-black animate-bounce-medium shadow-2xl">
              🤖 ¡BONUS: CONTENIDO PREMIUM CON N8N + ChatGPT! 🤖
            </span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border-4 border-blue-400 shadow-2xl hover-grow">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              💎 VALOR ADICIONAL INCLUIDO 💎
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Cursos Completos */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover-grow border-2 border-blue-200">
                <div className="text-6xl mb-4 text-center animate-bounce-medium">📚</div>
                <h3 className="text-2xl font-black text-blue-700 mb-4 text-center">
                  CONTENIDO DE CURSOS COMPLETO
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Alfredo solo da la metodología</p>
                      <p className="text-sm text-gray-600">Tú escribes todo el contenido</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Generado con N8N + ChatGPT</p>
                      <p className="text-sm text-gray-600">Automatización inteligente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Todos los cursos listos para publicar</p>
                      <p className="text-sm text-gray-600">Contenido profesional y estructurado</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-blue-100 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-blue-700">+15 horas</div>
                  <div className="text-sm text-gray-600">de trabajo adicional</div>
                </div>
              </div>

              {/* 50 Artículos */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover-grow border-2 border-purple-200">
                <div className="text-6xl mb-4 text-center animate-wiggle">✍️</div>
                <h3 className="text-2xl font-black text-purple-700 mb-4 text-center">
                  50 ARTÍCULOS DE BLOG
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Máxima calidad SEO</p>
                      <p className="text-sm text-gray-600">Optimizados para Google</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Generados con N8N</p>
                      <p className="text-sm text-gray-600">Sistema automatizado de contenido</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 animate-spin-medium" />
                    <div>
                      <p className="font-bold text-gray-900">Listos para publicar</p>
                      <p className="text-sm text-gray-600">Contenido evergreen de valor</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-purple-100 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-700">+20 horas</div>
                  <div className="text-sm text-gray-600">de trabajo adicional</div>
                </div>
              </div>
            </div>

            {/* Resumen del valor */}
            <div className="bg-gradient-to-r from-gold to-yellow-400 rounded-2xl p-6 text-center border-4 border-yellow-500 shadow-xl">
              <div className="text-2xl font-black text-gray-900 mb-2">
                🎁 VALOR ADICIONAL: +35 HORAS DE TRABAJO
              </div>
              <div className="text-lg font-bold text-gray-800 mb-4">
                ¡Todo el contenido generado profesionalmente con IA!
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-black text-gray-900">+10 Cursos</div>
                  <div className="text-gray-700">Contenido completo</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-black text-gray-900">+50 Artículos</div>
                  <div className="text-gray-700">Blog profesional</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="font-black text-gray-900">N8N + ChatGPT</div>
                  <div className="text-gray-700">Tecnología premium</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LO QUE INCLUYE - MÓDULOS LOCOS */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-4xl font-black animate-pulse-rainbow shadow-2xl mb-6">
              💎 ¡DAME TU RANCHERA, ALFREDO! 🚜
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-forest-dark">
              ¿QUÉ LLEVAS EN EL PACK?
            </h2>
          </div>

          {/* Módulo 1 */}
          <div className="mb-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden hover-grow animate-pop-in">
            <div className="p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Award className="w-20 h-20 animate-spin-medium" />
                  <div>
                    <h3 className="text-4xl font-black">1. ACADEMIA ONLINE COMPLETA</h3>
                    <p className="text-2xl text-yellow-300">🎓 Sistema de Venta de Cursos</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-yellow-300 animate-bounce-medium">25.000€</div>
                  <div className="text-xl">Valor de mercado</div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {[
                  { title: '📚 Cursos Ilimitados', items: ['Crear cursos sin límite', 'Videos + Audios', 'Recursos descargables', 'Precios flexibles'] },
                  { title: '🎓 Área del Alumno', items: ['Dashboard personal', 'Progreso automático', 'Acceso 24/7', 'Experiencia móvil'] },
                  { title: '💰 Sistema de Compra', items: ['Carrito profesional', 'Pago rápido', 'Registro automático', 'Control total'] },
                  { title: '🎮 Gamificación ÚNICA', items: ['15 medallas', 'Ranking en tiempo real', 'Sistema de rachas', '+40% retención'] }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all hover-grow"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                    <ul className="space-y-2">
                      {feature.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Módulo 2 */}
          <div className="mb-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl shadow-2xl overflow-hidden hover-grow">
            <div className="p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Target className="w-20 h-20 animate-wiggle" />
                  <div>
                    <h3 className="text-4xl font-black">2. PANEL ADMIN PRO</h3>
                    <p className="text-2xl text-yellow-300">🎛️ Tu Centro de Control</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-yellow-300 animate-sway">18.000€</div>
                  <div className="text-xl">Valor de mercado</div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {[
                  '📊 Dashboard con estadísticas',
                  '👥 Gestión de usuarios',
                  '📚 Cursos avanzados con IA',
                  '📰 Blog profesional integrado'
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 hover:bg-white/30 transition-all hover-grow"
                  >
                    <CheckCircle className="w-8 h-8 flex-shrink-0 animate-spin-medium" />
                    <span className="text-xl font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Módulo 3-10 en grid compacto */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { title: '3. Web Marketing', value: '8.000€', icon: '🌐', color: 'from-orange-500 to-red-600' },
              { title: '4. Blog SEO', value: '6.500€', icon: '📝', color: 'from-pink-500 to-purple-600' },
              { title: '5. SEO 54 Ciudades', value: '12.000€', icon: '🗺️', color: 'from-cyan-500 to-blue-600' },
              { title: '6. Performance 95/100', value: '9.500€', icon: '⚡', color: 'from-yellow-500 to-orange-600' },
              { title: '7. Seguridad Total', value: '5.500€', icon: '🔒', color: 'from-red-500 to-pink-600' },
              { title: '8. Infraestructura', value: '4.500€', icon: '☁️', color: 'from-blue-500 to-cyan-600' },
              { title: '9. Analítica', value: '2.500€', icon: '📈', color: 'from-green-500 to-emerald-600' },
              { title: '10. Documentación', value: '3.500€', icon: '📚', color: 'from-purple-500 to-indigo-600' }
            ].map((module, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${module.color} rounded-2xl p-6 text-white hover-grow cursor-pointer shadow-xl`}
              >
                <div className="text-5xl mb-3 animate-wiggle">{module.icon}</div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <div className="text-4xl font-black text-yellow-300">{module.value}</div>
              </div>
            ))}
          </div>

          {/* BONUS: Contenido Generado con IA */}
          <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden hover-grow animate-pulse-rainbow">
            <div className="p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-7xl animate-bounce-medium">🤖</div>
                  <div>
                    <h3 className="text-4xl font-black">11. CONTENIDO GENERADO CON N8N + IA</h3>
                    <p className="text-2xl text-yellow-300">🎁 ¡Bonus Incluido Gratis!</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-yellow-300 animate-sway">+3.500€</div>
                  <div className="text-xl">Valor adicional</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                  <h4 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="text-4xl mr-3">📚</span>
                    Contenido de Cursos
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Alfredo solo proporciona la metodología</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Generamos todo el contenido completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Automatizado con N8N + ChatGPT</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Listo para publicar y vender</span>
                    </li>
                  </ul>
                  <div className="mt-4 bg-white/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black">+15 horas</div>
                    <div className="text-sm">trabajo adicional</div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                  <h4 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="text-4xl mr-3">✍️</span>
                    50 Artículos SEO
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>50 artículos de blog profesionales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Optimizados para SEO y Google</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Generados con N8N automático</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>Contenido evergreen de valor</span>
                    </li>
                  </ul>
                  <div className="mt-4 bg-white/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black">+20 horas</div>
                    <div className="text-sm">trabajo adicional</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-yellow-400 text-black rounded-2xl p-6 text-center">
                <div className="text-3xl font-black mb-2">
                  🎁 ¡VALOR ADICIONAL: +35 HORAS DE TRABAJO!
                </div>
                <div className="text-lg font-bold">
                  Todo el contenido listo para que Alfredo empiece a vender desde el día 1
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRECIO FINAL - MEGA EXPLOSIÓN */}
        <section className="bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 py-20 relative overflow-hidden">
          {/* Lluvia de dinero - MEDIO */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {[...Array(20)].map((_, i) => ( // 20 elementos (punto medio)
              <div
                key={i}
                className="text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `floatUp ${4 + Math.random() * 3}s linear infinite`, // 4-7s (punto medio)
                  animationDelay: `${Math.random() * 4}s`
                }}
              >
                💰
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-red-600 text-white px-12 py-6 rounded-2xl text-5xl font-black animate-bounce-medium shadow-2xl mb-6">
                🚨 ¡ALFREDO PAGA YA! 🚨
              </div>
              <div className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-xl text-3xl font-black animate-sway ml-4">
                💸 ¡O DAME LA PISCINA! 🏊‍♂️
              </div>
            </div>

            <h2 className="text-6xl font-black text-center mb-12 text-forest-dark">
              💰 INVERSIÓN Y FACTURACIÓN 💰
            </h2>

            {/* Precio principal */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-gold mb-10 hover-grow">
              <div className="text-center">
                <div className="text-7xl mb-6 animate-bounce-medium">🤖💰🎉</div>

                <div className="mb-6">
                  <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full text-2xl font-black animate-pulse shadow-xl">
                    ¡¡LA IA DICE QUE VALE 14.000€!!
                  </span>
                </div>

                <div className="text-lg text-gray-600 mb-3">VALOR TRADICIONAL</div>
                <div className="text-5xl font-bold text-gray-400 line-through mb-4">95.000€</div>
                <div className="text-xl text-green-600 font-bold mb-8">
                  Con IA: 40 horas en 5 días (18.5x más rápido)
                </div>

                <div className="border-t-4 border-gold pt-8 mb-8">
                  <div className="text-3xl font-bold text-forest-dark mb-4">PRECIO RECOMENDADO ⭐</div>
                  <div className="text-9xl font-black text-gold mb-4 animate-pulse text-shadow-glow">
                    12.000€
                  </div>
                  <div className="text-3xl text-gray-600 mb-2">+ IVA (21%)</div>
                  <div className="text-6xl font-black text-forest-dark mb-6 animate-bounce-medium">
                    14.520€ TOTAL
                  </div>

                  <div className="mt-8">
                    <span className="inline-block bg-green-500 text-white px-10 py-5 rounded-xl text-3xl font-black animate-pulse shadow-2xl">
                      🎊 ¡ACEPTO LA RANCHERA! 🚜
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border-4 border-green-400 rounded-2xl p-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    💰 AHORRO DE 81.000€ (83%)
                  </div>
                  <div className="text-xl text-gray-700">
                    ⚡ Entrega en 5 días vs 4.5 meses tradicional
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de precio */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Opción A */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-300 hover-grow">
                <h3 className="text-2xl font-bold mb-2">OPCIÓN A</h3>
                <p className="text-lg text-gray-600 mb-4">🏊‍♂️ La Piscina Edition</p>
                <div className="text-5xl font-bold text-forest mb-3">10.000€</div>
                <div className="text-sm text-gray-600 mb-4">+ IVA = 12.100€</div>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Todo lo desarrollado</li>
                  <li>✓ Transferencia completa</li>
                  <li>✓ 1 mes de soporte</li>
                </ul>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-bold">2.000€/día</div>
                  <div className="text-xs">¡Dame la piscina! 🏊</div>
                </div>
              </div>

              {/* Opción B - RECOMENDADA */}
              <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl shadow-2xl p-6 border-4 border-gold relative transform scale-110">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full text-sm font-black animate-bounce-medium">
                  ⭐ ¡¡ELIGE ESTA ALFREDO!! ⭐
                </div>
                <h3 className="text-2xl font-bold mb-2 mt-4">OPCIÓN B</h3>
                <p className="text-lg text-gray-700 mb-4">💎 La Ranchera Edition 🚜</p>
                <div className="text-6xl font-bold text-gold mb-3 animate-pulse">12.000€</div>
                <div className="text-sm text-gray-700 mb-4">+ IVA = <strong>14.520€</strong></div>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Todo lo desarrollado</li>
                  <li>✓ <strong>3 meses de soporte</strong></li>
                  <li>✓ <strong>Formación 4 horas</strong></li>
                </ul>
                <div className="bg-gold/20 p-3 rounded text-center mb-3">
                  <div className="font-bold">2.400€/día</div>
                  <div className="text-xs font-bold">¡DICE LA IA QUE PERFECTO!</div>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                    💰 ¡PAGA YA! 💰
                  </span>
                </div>
              </div>

              {/* Opción C */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-300 hover-grow">
                <h3 className="text-2xl font-bold mb-2">OPCIÓN C</h3>
                <p className="text-lg text-gray-600 mb-4">🚗 La Tesla Edition</p>
                <div className="text-5xl font-bold text-forest mb-3">15.000€</div>
                <div className="text-sm text-gray-600 mb-4">+ IVA = 18.150€</div>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Todo incluido</li>
                  <li>✓ <strong>6 meses soporte</strong></li>
                  <li>✓ Consultoría marketing</li>
                </ul>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-bold">3.000€/día</div>
                  <div className="text-xs">¡Para los ricos! 💎</div>
                </div>
              </div>
            </div>

            {/* ROI */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-25">
                {[...Array(16)].map((_, i) => ( // 16 elementos (punto medio entre 12 y 20)
                  <div
                    key={i}
                    className="absolute text-5xl animate-spin-medium"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${4 + Math.random() * 5}s` // 4-9s (punto medio)
                    }}
                  >
                    {['🚜', '🏊‍♂️', '💰', '🐕'][i % 4]}
                  </div>
                ))}
              </div>

              <div className="relative z-10 text-center">
                <div className="mb-6">
                  <span className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full text-3xl font-black animate-bounce-medium">
                    🎉 ¡LA IA LO CALCULÓ! 🎉
                  </span>
                </div>

                <h3 className="text-4xl font-bold mb-6">💰 RETORNO DE INVERSIÓN</h3>
                <p className="text-2xl mb-8">La inversión de 12.000€ se amortiza con:</p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover-grow">
                    <div className="text-5xl font-bold mb-3">600</div>
                    <div className="text-xl">ventas de cursos online (20€)</div>
                    <div className="text-sm mt-2">🐕 50 ventas al mes = 1 año</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover-grow">
                    <div className="text-5xl font-bold mb-3">45</div>
                    <div className="text-xl">servicios presenciales (270€)</div>
                    <div className="text-sm mt-2">🏋️ 4 servicios al mes = 1 año</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover-grow">
                    <div className="text-5xl font-bold mb-3">MIX</div>
                    <div className="text-xl">Cursos online + servicios presenciales</div>
                    <div className="text-sm mt-2">💪 ¡Lo tienes chupado!</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
                  <div className="text-xl font-bold mb-3">📊 Escenario Realista:</div>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="font-semibold mb-2">• 10 cursos online/mes (10-50€)</div>
                      <div className="text-sm">= 300€/mes = 3.600€/año</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">• 3 servicios presenciales/mes (250€)</div>
                      <div className="text-sm">= 750€/mes = 9.000€/año</div>
                    </div>
                    <div className="md:col-span-2 text-center mt-4 pt-4 border-t border-white/20">
                      <div className="text-2xl font-black text-yellow-300">
                        TOTAL: 12.600€/año = ROI en 11-12 meses
                      </div>
                      <div className="text-sm mt-2">¡Combinando cursos online + servicios presenciales! 🎯</div>
                    </div>
                  </div>
                </div>

                <div className="text-3xl font-bold text-yellow-300 mb-6 animate-pulse">
                  ROI ESTIMADO: 6-12 MESES
                </div>

                <div className="mt-8">
                  <span className="inline-block bg-orange-500 text-white px-10 py-5 rounded-xl text-2xl font-black animate-sway shadow-2xl">
                    💸 ¡DAME LA PISCINA ALFREDO! 🏊‍♂️
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARATIVA COMPETENCIA */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-5xl font-black text-center mb-12 text-forest-dark">
            🏆 VS COMPETENCIA 🏆
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
              <thead className="bg-gradient-to-r from-forest-dark to-forest text-white text-lg">
                <tr>
                  <th className="px-6 py-5">CARACTERÍSTICA</th>
                  <th className="px-6 py-5">EDUCANINE</th>
                  <th className="px-6 py-5">SENDA CANINA</th>
                  <th className="px-6 py-5 bg-gold text-forest-dark">
                    <div className="animate-bounce-medium">HAKADOGS ⭐</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-lg">
                {[
                  { name: 'Performance', others: ['65', '72'], hakadogs: '95 ✅' },
                  { name: 'SEO Score', others: ['78', '85'], hakadogs: '100 ✅' },
                  { name: 'Mobile', others: ['⚠️', '✅'], hakadogs: '✅' },
                  { name: 'Gamificación', others: ['❌', '❌'], hakadogs: '✅ 🎮' },
                  { name: 'IA Integrada', others: ['❌', '❌'], hakadogs: '✅ 🤖' },
                  { name: 'SEO 54 ciudades', others: ['❌', '❌'], hakadogs: '✅ 🗺️' },
                  { name: 'Contenido cursos completo', others: ['❌', '❌'], hakadogs: '✅ 📚' },
                  { name: '50 Artículos blog', others: ['❌', '❌'], hakadogs: '✅ ✍️' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold">{row.name}</td>
                    <td className="px-6 py-4">{row.others[0]}</td>
                    <td className="px-6 py-4">{row.others[1]}</td>
                    <td className="px-6 py-4 bg-green-50 font-bold text-green-700 text-xl">
                      {row.hakadogs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center mt-8 text-2xl font-bold text-gray-700">
            🏆 <strong className="text-gold">HAKADOGS DESTROZA A LA COMPETENCIA</strong> 🏆
          </p>
        </section>

        {/* CONCLUSIÓN FINAL ÉPICA */}
        <section className="bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 py-20 relative overflow-hidden">
          {/* Confetti - MEDIO */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(60)].map((_, i) => ( // 60 elementos (punto medio entre 40 y 100)
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)],
                  animation: `floatUp ${4 + Math.random() * 3}s linear infinite`, // 4-7s (punto medio)
                  animationDelay: `${Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-12 py-6 rounded-full text-4xl font-black animate-pulse-rainbow shadow-2xl">
                🎊 ¡ALFREDO, ESTO ES UN CHOLLAZO! 🎊
              </span>
            </div>

            <h2 className="text-6xl font-black mb-10 text-forest-dark">
              CONCLUSIÓN FINAL
            </h2>

            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 border-4 border-gold hover-grow">
              <div className="text-8xl mb-6 animate-bounce-medium">
                🚜🏊‍♂️💰
              </div>

              <p className="text-3xl font-bold text-gray-800 mb-6">
                Hakadogs.com NO es solo una web,<br />
                es una <span className="text-gold text-4xl">MÁQUINA DE HACER DINERO</span>
              </p>

              <div className="mb-8">
                <span className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-xl text-2xl font-black animate-bounce-medium">
                  💎 ¡VALE 14.000€ SEGÚN LA IA! 💎
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
                {[
                  'Generar ingresos 24/7 💰',
                  'Competir con los grandes 🏆',
                  'Posicionarte en 54 ciudades 🗺️',
                  'Automatizar todo ⚙️',
                  'Escalar sin límites 🚀',
                  'Gamificación única 🎮',
                  '+10 Cursos con contenido completo 📚',
                  '+50 Artículos SEO listos ✍️'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-xl p-4 hover-grow">
                    <CheckCircle className="w-8 h-8 text-green-600 animate-spin-medium" />
                    <span className="text-xl font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-4 border-gold pt-8">
                <p className="text-2xl italic text-gray-700 mb-6">
                  &ldquo;Tu inversión en educación canina,<br />
                  nuestra inversión en excelencia técnica&rdquo;
                </p>

                <div className="space-y-4">
                  <span className="inline-block bg-green-600 text-white px-10 py-5 rounded-xl text-3xl font-black animate-pulse shadow-2xl">
                    🚨 ¡ACEPTO LA RANCHERA! 🚜
                  </span>
                  <br />
                  <span className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-2xl font-black animate-sway">
                    🏊‍♂️ ¡O LA PISCINA! 🏊‍♂️
                  </span>
                  <br />
                  <span className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl text-2xl font-black animate-wiggle">
                    💸 ¡ALFREDO PAGA! 💸
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-forest-dark text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-6">
              <p className="text-2xl font-bold text-gold mb-4 animate-pulse">
                PRESUPUESTO VÁLIDO HASTA: 28 de Febrero de 2026
              </p>
              <div className="text-4xl mb-4 animate-bounce-medium">
                🤖💰🚀
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
              <div>
                <h3 className="font-bold text-sage text-xl mb-3">DESARROLLADO POR:</h3>
                <p className="text-lg">Narciso Pardo Buendía</p>
                <p className="text-sage">Desarrollador Full Stack + IA 🤖</p>
              </div>
              <div>
                <h3 className="font-bold text-sage text-xl mb-3">PARA:</h3>
                <p className="text-lg">Hakadogs - Alfredo García 🐕</p>
                <p className="text-sage">contacto@hakadogs.com</p>
                <p className="text-sage">www.hakadogs.com</p>
              </div>
            </div>

            <div className="text-3xl font-black text-yellow-300 animate-pulse">
              🎊 ¡ALFREDO, DAME TU RANCHERA! 🚜
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
