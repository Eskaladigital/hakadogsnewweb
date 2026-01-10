import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad - RGPD | Hakadogs',
  description: 'Política de privacidad y protección de datos de Hakadogs conforme al RGPD (UE) 2016/679 y LOPDGDD 3/2018. Tus datos están seguros.',
  openGraph: {
    title: 'Política de Privacidad | Hakadogs',
    description: 'Política de privacidad y protección de datos conforme al RGPD. Tus datos están seguros.',
    url: 'https://www.hakadogs.com/legal/privacidad',
    images: [
      {
        url: '/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Política de Privacidad',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidad | Hakadogs',
    description: 'Protección de datos conforme al RGPD.',
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-forest-dark to-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Inicio
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <Shield size={48} />
            <h1 className="text-4xl font-bold">Política de Privacidad</h1>
          </div>
          <p className="text-white/90">Última actualización: 31 de diciembre de 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg prose prose-lg max-w-none">
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <p className="text-blue-900 font-semibold mb-2">
              Tu privacidad es importante para nosotros
            </p>
            <p className="text-blue-800 text-sm">
              En Hakadogs cumplimos estrictamente con el Reglamento General de Protección de Datos (RGPD) 
              y la Ley Orgánica de Protección de Datos (LOPD) española.
            </p>
          </div>

          <h2>1. Responsable del Tratamiento</h2>
          <ul>
            <li><strong>Identidad:</strong> Hakadogs (Alfredo García)</li>
            <li><strong>CIF/NIF:</strong> [Pendiente de completar]</li>
            <li><strong>Dirección:</strong> Murcia, España</li>
            <li><strong>Email:</strong> privacidad@hakadogs.com</li>
            <li><strong>Teléfono:</strong> 685 64 82 41</li>
          </ul>

          <h2>2. Datos que Recopilamos</h2>
          
          <h3>2.1. Datos Personales</h3>
          <p>Recopilamos los siguientes datos personales cuando usted se registra o utiliza nuestros servicios:</p>
          <ul>
            <li><strong>Datos de identificación:</strong> Nombre completo, email, teléfono</li>
            <li><strong>Datos de acceso:</strong> Contraseña cifrada, dirección IP, cookies</li>
            <li><strong>Datos de perfil:</strong> Fotografía de perfil (opcional), ubicación (opcional)</li>
          </ul>

          <h3>2.2. Datos de Mascotas</h3>
          <p>Para el correcto funcionamiento de las apps HakaHealth y HakaTrainer:</p>
          <ul>
            <li>Nombre, raza, fecha de nacimiento, peso, sexo de la mascota</li>
            <li>Fotografías de la mascota</li>
            <li>Información de salud: vacunas, alergias, condiciones médicas</li>
            <li>Número de microchip</li>
            <li>Historial de entrenamiento y comportamiento</li>
          </ul>

          <h3>2.3. Datos de Uso</h3>
          <ul>
            <li>Datos de navegación y uso de la plataforma</li>
            <li>Interacciones en la comunidad (posts, comentarios, eventos)</li>
            <li>Progreso en ejercicios de entrenamiento</li>
            <li>Mensajes del chat (cifrados)</li>
          </ul>

          <h3>2.4. Datos de Pago</h3>
          <p>
            NO almacenamos datos de tarjetas de crédito. Los pagos se procesan a través de pasarelas 
            de pago certificadas PCI-DSS (Stripe/Redsys) que cumplen con los más altos estándares de seguridad.
          </p>

          <h2>3. Finalidad del Tratamiento</h2>
          <p>Utilizamos sus datos personales para:</p>
          
          <h3>3.1. Gestión de la Cuenta</h3>
          <ul>
            <li>Crear y mantener su cuenta de usuario</li>
            <li>Autenticación y gestión de sesiones</li>
            <li>Comunicaciones relacionadas con el servicio</li>
          </ul>

          <h3>3.2. Prestación del Servicio</h3>
          <ul>
            <li>Proporcionar acceso a HakaHealth, HakaTrainer y HakaCommunity</li>
            <li>Gestionar el historial médico y de entrenamiento de su mascota</li>
            <li>Coordinar sesiones presenciales de educación canina</li>
            <li>Generar códigos QR de emergencia para su mascota</li>
          </ul>

          <h3>3.3. Mejora del Servicio</h3>
          <ul>
            <li>Análisis de uso para mejorar la plataforma</li>
            <li>Personalización de recomendaciones de ejercicios</li>
            <li>Desarrollo de nuevas funcionalidades</li>
          </ul>

          <h3>3.4. Marketing (con su consentimiento)</h3>
          <ul>
            <li>Envío de newsletter con consejos de educación canina</li>
            <li>Promociones y ofertas especiales</li>
            <li>Invitaciones a eventos</li>
          </ul>

          <h2>4. Base Legal del Tratamiento</h2>
          <p>Tratamos sus datos bajo las siguientes bases legales:</p>
          <ul>
            <li><strong>Ejecución de contrato:</strong> Para prestar los servicios contratados</li>
            <li><strong>Consentimiento:</strong> Para marketing y comunicaciones promocionales</li>
            <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y seguridad</li>
            <li><strong>Obligación legal:</strong> Para cumplir con requisitos fiscales y legales</li>
          </ul>

          <h2>5. Conservación de Datos</h2>
          <p>Conservamos sus datos personales durante:</p>
          <ul>
            <li><strong>Cuenta activa:</strong> Mientras mantenga su cuenta activa</li>
            <li><strong>Cuenta inactiva:</strong> Hasta 2 años después de la última actividad</li>
            <li><strong>Datos fiscales:</strong> 10 años (obligación legal)</li>
            <li><strong>Datos de marketing:</strong> Hasta que retire su consentimiento</li>
          </ul>
          <p>
            Puede solicitar la eliminación de sus datos en cualquier momento desde la configuración 
            de su cuenta o contactando con privacidad@hakadogs.com
          </p>

          <h2>6. Compartición de Datos</h2>
          
          <h3>6.1. NO vendemos sus datos</h3>
          <p>
            Hakadogs NUNCA vende ni comercializa datos personales a terceros.
          </p>

          <h3>6.2. Compartimos datos solo con:</h3>
          <ul>
            <li>
              <strong>Supabase (proveedor de base de datos):</strong> Almacenamiento seguro en servidores 
              de la UE. Cumple con RGPD.
            </li>
            <li>
              <strong>Pasarelas de pago:</strong> Solo datos necesarios para procesar pagos, procesados 
              bajo sus propias políticas PCI-DSS.
            </li>
            <li>
              <strong>Servicios de email:</strong> Para envío de notificaciones transaccionales (obligatorias) 
              y marketing (opcional).
            </li>
            <li>
              <strong>Autoridades:</strong> Solo cuando sea legalmente requerido.
            </li>
          </ul>

          <h3>6.3. Datos Públicos</h3>
          <p>
            Si participa en HakaCommunity (foro, eventos), cierta información es visible públicamente:
          </p>
          <ul>
            <li>Nombre de usuario y foto de perfil (si la añade)</li>
            <li>Posts y comentarios en el foro</li>
            <li>Asistencia a eventos públicos</li>
            <li>Perfil público de su perro (si lo configura como público)</li>
          </ul>
          <p>
            Puede controlar la visibilidad desde la configuración de privacidad.
          </p>

          <h2>7. Derechos del Usuario (RGPD)</h2>
          <p>Como titular de los datos, usted tiene derecho a:</p>
          
          <h3>7.1. Derecho de Acceso</h3>
          <p>
            Solicitar una copia de todos los datos personales que tenemos sobre usted.
          </p>

          <h3>7.2. Derecho de Rectificación</h3>
          <p>
            Corregir datos inexactos o incompletos. Puede hacerlo desde su perfil o solicitarlo por email.
          </p>

          <h3>7.3. Derecho de Supresión (&quot;Derecho al Olvido&quot;)</h3>
          <p>
            Eliminar sus datos personales, salvo que exista obligación legal de conservarlos.
          </p>

          <h3>7.4. Derecho de Limitación</h3>
          <p>
            Restringir el tratamiento de sus datos en determinadas circunstancias.
          </p>

          <h3>7.5. Derecho de Portabilidad</h3>
          <p>
            Recibir sus datos en formato estructurado y transferirlos a otro proveedor.
          </p>

          <h3>7.6. Derecho de Oposición</h3>
          <p>
            Oponerse al tratamiento de sus datos, especialmente para marketing.
          </p>

          <h3>7.7. Derecho a Retirar Consentimiento</h3>
          <p>
            Retirar su consentimiento en cualquier momento para tratamientos basados en consentimiento.
          </p>

          <h3>Ejercicio de Derechos</h3>
          <p>Para ejercer cualquiera de estos derechos:</p>
          <ul>
            <li>Email: privacidad@hakadogs.com</li>
            <li>Desde su cuenta: Configuración → Privacidad</li>
            <li>Responderemos en máximo 30 días</li>
          </ul>

          <h2>8. Seguridad de los Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas:</p>
          <ul>
            <li>Cifrado SSL/TLS en todas las comunicaciones</li>
            <li>Contraseñas cifradas (no almacenamos contraseñas en texto plano)</li>
            <li>Autenticación de dos factores (opcional)</li>
            <li>Copias de seguridad diarias cifradas</li>
            <li>Acceso restringido a datos personales solo a personal autorizado</li>
            <li>Servidores en la Unión Europea (cumplimiento RGPD)</li>
            <li>Auditorías de seguridad periódicas</li>
          </ul>

          <h2>9. Cookies y Tecnologías Similares</h2>
          
          <h3>9.1. Cookies Esenciales (Siempre Activas)</h3>
          <ul>
            <li>Autenticación y gestión de sesión</li>
            <li>Preferencias de usuario</li>
            <li>Seguridad</li>
          </ul>

          <h3>9.2. Cookies Analíticas (Opcional)</h3>
          <ul>
            <li>Google Analytics para análisis de uso</li>
            <li>Datos anonimizados</li>
            <li>Puede desactivarlas en configuración</li>
          </ul>

          <h3>9.3. Cookies de Marketing (Requiere Consentimiento)</h3>
          <ul>
            <li>Publicidad personalizada</li>
            <li>Retargeting</li>
            <li>Solo con su consentimiento explícito</li>
          </ul>

          <p>
            Gestione sus preferencias de cookies desde: Configuración → Privacidad → Cookies
          </p>

          <h2>10. Transferencias Internacionales</h2>
          <p>
            Todos nuestros datos se almacenan en servidores dentro de la Unión Europea (Supabase - región EU). 
            NO realizamos transferencias internacionales de datos fuera de la UE.
          </p>

          <h2>11. Menores de Edad</h2>
          <p>
            Hakadogs no está dirigido a menores de 18 años. No recopilamos intencionadamente datos de menores. 
            Si descubrimos que hemos recopilado datos de un menor sin consentimiento parental, los eliminaremos inmediatamente.
          </p>

          <h2>12. Cambios en la Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio 
            material por email o mediante aviso destacado en la plataforma.
          </p>
          <p>
            Cambios significativos requieren su consentimiento renovado.
          </p>

          <h2>13. Autoridad de Control</h2>
          <p>
            Si considera que no hemos tratado sus datos conforme al RGPD, puede presentar una reclamación ante:
          </p>
          <ul>
            <li><strong>Agencia Española de Protección de Datos (AEPD)</strong></li>
            <li>Web: www.aepd.es</li>
            <li>Teléfono: 901 100 099 / 912 663 517</li>
            <li>Dirección: C/ Jorge Juan, 6, 28001 Madrid</li>
          </ul>

          <h2>14. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de sus datos:
          </p>
          <ul>
            <li><strong>Email:</strong> privacidad@hakadogs.com</li>
            <li><strong>Teléfono:</strong> 685 64 82 41</li>
            <li><strong>Dirección postal:</strong> Hakadogs, Murcia, España</li>
          </ul>

          <hr className="my-8" />

          <div className="bg-green-50 border-l-4 border-green-600 p-6 mt-8">
            <p className="text-green-900 font-semibold mb-2">
              Compromiso de Hakadogs
            </p>
            <p className="text-green-800 text-sm">
              Nos comprometemos a proteger su privacidad y la de su mascota. Cumplimos estrictamente 
              con todas las normativas de protección de datos y trabajamos continuamente para mejorar 
              la seguridad de nuestra plataforma.
            </p>
          </div>

          <div className="mt-8 p-6 bg-forest-dark/5 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Última actualización:</strong> 31 de diciembre de 2024
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Versión:</strong> 1.0
            </p>
            <p className="text-sm text-gray-700">
              <strong>Normativa aplicable:</strong> RGPD (UE) 2016/679, LOPDGDD 3/2018
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/legal/terminos" className="text-forest hover:text-forest-dark font-semibold">
              Ver Términos y Condiciones →
            </Link>
            <Link href="/contacto" className="text-forest hover:text-forest-dark font-semibold">
              Contactar con Soporte →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
