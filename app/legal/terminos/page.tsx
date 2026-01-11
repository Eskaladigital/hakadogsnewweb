import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso | Hakadogs',
  description: 'Términos y condiciones de uso de los servicios de Hakadogs. Información sobre servicios presenciales, cursos online, cancelaciones y políticas.',
  alternates: {
    canonical: 'https://www.hakadogs.com/legal/terminos',
  },
  openGraph: {
    title: 'Términos y Condiciones | Hakadogs',
    description: 'Términos y condiciones de uso de los servicios de Hakadogs. Servicios presenciales y cursos online.',
    url: 'https://www.hakadogs.com/legal/terminos',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Términos y Condiciones',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Términos y Condiciones | Hakadogs',
    description: 'Términos de uso de servicios Hakadogs.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-forest-dark to-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Inicio
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <FileText size={48} />
            <h1 className="text-4xl font-bold">Términos y Condiciones</h1>
          </div>
          <p className="text-white/90">Última actualización: 31 de diciembre de 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="responsive-prose bg-white rounded-xl p-8 lg:p-12 shadow-lg prose max-w-none">
          
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma Hakadogs y sus servicios relacionados (en adelante, &quot;el Servicio&quot;), 
            usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de 
            estos términos, no debe utilizar nuestro Servicio.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
            Hakadogs es una plataforma de educación canina profesional que ofrece:
          </p>
          <ul>
            <li><strong>HakaHealth</strong>: Gestión de salud y registros médicos de mascotas</li>
            <li><strong>HakaTrainer</strong>: Programas de entrenamiento y educación canina</li>
            <li><strong>HakaCommunity</strong>: Red social y comunidad de propietarios de perros</li>
            <li>Servicios presenciales de educación canina a domicilio</li>
            <li>Recursos educativos y blog</li>
          </ul>

          <h2>3. Registro y Cuentas de Usuario</h2>
          
          <h3>3.1. Requisitos</h3>
          <p>
            Para utilizar ciertas funciones del Servicio, debe crear una cuenta. Usted se compromete a:
          </p>
          <ul>
            <li>Proporcionar información precisa, actualizada y completa</li>
            <li>Mantener la seguridad de su contraseña</li>
            <li>Ser mayor de 18 años o contar con el consentimiento de un tutor legal</li>
            <li>Notificarnos inmediatamente de cualquier uso no autorizado de su cuenta</li>
          </ul>

          <h3>3.2. Responsabilidad</h3>
          <p>
            Usted es responsable de todas las actividades que ocurran bajo su cuenta. Hakadogs no se hace 
            responsable de ninguna pérdida o daño derivado de su incumplimiento de mantener segura su cuenta.
          </p>

          <h2>4. Uso Aceptable</h2>
          
          <h3>4.1. Usted se compromete a NO:</h3>
          <ul>
            <li>Utilizar el Servicio para fines ilegales o no autorizados</li>
            <li>Intentar obtener acceso no autorizado a cualquier parte del Servicio</li>
            <li>Interferir o interrumpir el Servicio o los servidores</li>
            <li>Transmitir virus, malware o código malicioso</li>
            <li>Acosar, amenazar o difamar a otros usuarios</li>
            <li>Publicar contenido ofensivo, inapropiado o ilegal</li>
            <li>Violar los derechos de propiedad intelectual de terceros</li>
            <li>Utilizar el Servicio para spam o publicidad no solicitada</li>
          </ul>

          <h2>5. Servicios Presenciales</h2>
          
          <h3>5.1. Sesiones de Entrenamiento</h3>
          <p>
            Los servicios presenciales de educación canina están sujetos a disponibilidad y requieren 
            programación previa. Las tarifas y condiciones específicas se comunicarán antes de la contratación.
          </p>

          <h3>5.2. Cancelaciones</h3>
          <ul>
            <li>Cancelaciones con más de 48 horas de antelación: reembolso completo</li>
            <li>Cancelaciones entre 24-48 horas: 50% de reembolso</li>
            <li>Cancelaciones con menos de 24 horas: sin reembolso</li>
          </ul>

          <h3>5.3. Responsabilidad del Cliente</h3>
          <p>
            El cliente es responsable de:
          </p>
          <ul>
            <li>Proporcionar información precisa sobre la salud y comportamiento de su perro</li>
            <li>Mantener al día las vacunas y control sanitario del animal</li>
            <li>Informar de cualquier condición médica o comportamiento agresivo</li>
            <li>Seguir las instrucciones del educador profesional</li>
          </ul>

          <h2>6. Contenido del Usuario</h2>
          
          <h3>6.1. Propiedad</h3>
          <p>
            Usted conserva todos los derechos sobre el contenido que publica (fotos, posts, comentarios, etc.). 
            Sin embargo, al publicar contenido en Hakadogs, nos otorga una licencia mundial, no exclusiva, 
            libre de regalías para usar, modificar y mostrar ese contenido en relación con el Servicio.
          </p>

          <h3>6.2. Contenido Prohibido</h3>
          <p>
            No se permite contenido que:
          </p>
          <ul>
            <li>Promueva la crueldad animal</li>
            <li>Sea sexualmente explícito</li>
            <li>Incite al odio o la violencia</li>
            <li>Viole derechos de privacidad de terceros</li>
            <li>Contenga información falsa o engañosa</li>
          </ul>

          <h2>7. Propiedad Intelectual</h2>
          <p>
            Todo el contenido del Servicio (textos, gráficos, logos, iconos, imágenes, clips de audio, 
            descargas digitales) es propiedad de Hakadogs o sus proveedores de contenido y está protegido 
            por las leyes de propiedad intelectual españolas e internacionales.
          </p>

          <h2>8. Privacidad y Datos Personales</h2>
          <p>
            El uso de sus datos personales está regido por nuestra{' '}
            <Link href="/legal/privacidad" className="text-forest hover:text-forest-dark">
              Política de Privacidad
            </Link>, que forma parte integral de estos Términos y Condiciones.
          </p>

          <h2>9. Pagos y Reembolsos</h2>
          
          <h3>9.1. Métodos de Pago</h3>
          <p>
            Aceptamos pagos mediante tarjeta de crédito/débito, transferencia bancaria y Bizum.
          </p>

          <h3>9.2. Política de Reembolso</h3>
          <p>
            Los reembolsos están sujetos a las condiciones específicas de cada servicio. 
            Para servicios digitales (apps), no se ofrecen reembolsos una vez iniciado el acceso, 
            excepto en casos de defecto técnico que impida el uso del servicio.
          </p>

          <h2>10. Limitación de Responsabilidad</h2>
          <p>
            Hakadogs proporciona el Servicio &quot;tal cual&quot; y &quot;según disponibilidad&quot;. No garantizamos que:
          </p>
          <ul>
            <li>El Servicio estará disponible de forma ininterrumpida o libre de errores</li>
            <li>Los resultados del entrenamiento canino serán específicos o garantizados</li>
            <li>Los errores en el software serán corregidos</li>
          </ul>
          <p>
            En ningún caso Hakadogs será responsable de daños indirectos, incidentales, especiales o 
            consecuentes derivados del uso o la imposibilidad de usar el Servicio.
          </p>

          <h2>11. Indemnización</h2>
          <p>
            Usted acepta indemnizar y mantener indemne a Hakadogs, sus directores, empleados y agentes de 
            cualquier reclamo, pérdida, responsabilidad, daño o gasto (incluidos los honorarios legales) 
            derivados de su uso del Servicio o violación de estos Términos.
          </p>

          <h2>12. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de:
          </p>
          <ul>
            <li>Modificar o descontinuar, temporal o permanentemente, el Servicio (o cualquier parte del mismo)</li>
            <li>Cambiar las tarifas por nuestros servicios con previo aviso de 30 días</li>
            <li>Actualizar estas Términos y Condiciones</li>
          </ul>

          <h2>13. Terminación</h2>
          <p>
            Podemos suspender o terminar su acceso al Servicio inmediatamente, sin previo aviso, por 
            cualquier razón, incluyendo pero no limitado a violación de estos Términos.
          </p>
          <p>
            Usted puede cancelar su cuenta en cualquier momento desde la configuración de su perfil.
          </p>

          <h2>14. Legislación Aplicable</h2>
          <p>
            Estos Términos se regirán e interpretarán de conformidad con las leyes de España. 
            Cualquier disputa se resolverá en los tribunales de Murcia, España.
          </p>

          <h2>15. Divisibilidad</h2>
          <p>
            Si alguna disposición de estos Términos se considera inválida o inaplicable, las disposiciones 
            restantes continuarán en pleno vigor y efecto.
          </p>

          <h2>16. Contacto</h2>
          <p>
            Para cualquier pregunta sobre estos Términos y Condiciones, puede contactarnos en:
          </p>
          <ul>
            <li><strong>Email:</strong> legal@hakadogs.com</li>
            <li><strong>Teléfono:</strong> 685 64 82 41</li>
            <li><strong>Dirección:</strong> Hakadogs, Murcia, España</li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-600">
            Al utilizar el Servicio de Hakadogs, usted reconoce haber leído, entendido y aceptado estar 
            sujeto a estos Términos y Condiciones.
          </p>

          <div className="mt-8 p-6 bg-forest-dark/5 rounded-lg">
            <p className="text-sm text-gray-700 mb-4">
              <strong>Última actualización:</strong> 31 de diciembre de 2024
            </p>
            <p className="text-sm text-gray-700">
              <strong>Versión:</strong> 1.0
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/legal/privacidad" className="text-forest hover:text-forest-dark font-semibold">
              Ver Política de Privacidad →
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
