import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '🚨 ¡¡ALFREDO PAGA!! - Dice la IA que vale 14.000€ 💰🚜',
  description: '🎉 ¡Dame tu ranchera o tu piscina! 🏊‍♂️ Presupuesto ÉPICO con IA - Plataforma completa Hakadogs valorada en 95.000€ por solo 14.520€. ¡Acepto la ranchera! 🚜💰',
  robots: 'noindex, nofollow',
  openGraph: {
    title: '🚨 ¡¡ALFREDO PAGA!! - Dice la IA que vale 14.000€ 💰',
    description: '🎉 ¡Dame tu ranchera o tu piscina! 🏊‍♂️ Presupuesto SÚPER DIVERTIDO - Plataforma completa Hakadogs con animaciones locas. La IA dice que es un CHOLLAZO. ¡Acepto la ranchera! 🚜',
    type: 'website',
    url: 'https://www.hakadogs.com/presupuesto-web-hakadogs',
    siteName: 'Hakadogs',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - ¡Alfredo Paga! 💰🚜',
        type: 'image/jpeg'
      }
    ],
    locale: 'es_ES'
  },
  twitter: {
    card: 'summary_large_image',
    title: '🚨 ¡¡ALFREDO PAGA!! - Vale 14.000€ según la IA 💰',
    description: '🎉 ¡Dame tu ranchera o tu piscina! 🏊‍♂️ Presupuesto ÉPICO con animaciones locas. ¡Acepto la ranchera! 🚜💰',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg']
  },
  other: {
    'og:price:amount': '14520',
    'og:price:currency': 'EUR'
  }
};

export default function PresupuestoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
