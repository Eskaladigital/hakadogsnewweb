// Datos estructurados Schema.org para SEO
// https://schema.org/

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.hakadogs.com/#organization',
  name: 'Hakadogs - Educación Canina Profesional',
  image: 'https://www.hakadogs.com/images/logo_definitivo_hakadogs.webp',
  logo: 'https://www.hakadogs.com/images/logo_definitivo_hakadogs.webp',
  url: 'https://www.hakadogs.com',
  telephone: '+34685648241',
  email: 'info@hakadogs.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Archena',
    addressRegion: 'Murcia',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1128,
    longitude: -1.3011,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Archena',
    },
    {
      '@type': 'City',
      name: 'Murcia',
    },
    {
      '@type': 'City',
      name: 'Molina de Segura',
    },
    {
      '@type': 'State',
      name: 'Región de Murcia',
    },
    {
      '@type': 'Country',
      name: 'España',
    },
  ],
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/hakadogs',
    'https://www.instagram.com/hakadogs',
  ],
  description:
    'Educación canina profesional con Enfoque BE HAKA. Servicios presenciales en Murcia y cursos online en toda España. Educamos desde el equilibrio. Métodos 100% positivos.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
  founder: {
    '@type': 'Person',
    name: 'Alfredo Gandolfo',
    jobTitle: 'Educador Canino Profesional',
    description: 'Educador canino con amplia experiencia en el sector, educamos desde el equilibrio',
  },
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.hakadogs.com/#organization',
  name: 'Hakadogs',
  url: 'https://www.hakadogs.com',
  logo: 'https://www.hakadogs.com/images/logo_definitivo_hakadogs.webp',
  description:
    'Educación canina profesional con metodología BE HAKA. Servicios presenciales en Murcia y cursos online en toda España.',
  sameAs: [
    'https://www.facebook.com/hakadogs',
    'https://www.instagram.com/hakadogs',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+34685648241',
    contactType: 'customer service',
    areaServed: 'ES',
    availableLanguage: 'Spanish',
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.hakadogs.com/#website',
  url: 'https://www.hakadogs.com',
  description:
    'Educación canina profesional con Enfoque BE HAKA. Servicios presenciales en Murcia y cursos online en toda España.',
  publisher: {
    '@id': 'https://www.hakadogs.com/#organization',
  },
  inLanguage: 'es-ES',
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Educación Canina',
  provider: {
    '@id': 'https://www.hakadogs.com/#organization',
  },
  areaServed: {
    '@type': 'State',
    name: 'Región de Murcia',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Educación Canina',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Educación Básica para Perros',
          description: 'Programa completo de educación canina básica. Comandos esenciales, obediencia y control.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Modificación de Conducta',
          description: 'Soluciones para problemas de agresividad, ansiedad, miedos y conductas no deseadas.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Educación de Cachorros',
          description: 'Programa especializado para cachorros de 2 a 6 meses. Socialización temprana.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Clases Grupales',
          description: 'Clases de socialización y obediencia en grupo.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cursos Online',
          description: '11+ cursos específicos de educación canina disponibles 24/7 para toda España.',
        },
      },
    ],
  },
}

export function generateBlogPostSchema(post: {
  title: string
  description: string
  slug: string
  published_at: string
  updated_at?: string
  author?: string
  image_url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image_url || 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Alfredo Gandolfo',
      url: 'https://www.hakadogs.com/sobre-nosotros',
    },
    publisher: {
      '@id': 'https://www.hakadogs.com/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.hakadogs.com/blog/${post.slug}`,
    },
    inLanguage: 'es-ES',
  }
}

export function generateLocalPageSchema(city: { name: string; slug: string; province: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Hakadogs - Educación Canina en ${city.name}`,
    image: 'https://www.hakadogs.com/images/logo_definitivo_hakadogs.webp',
    url: `https://www.hakadogs.com/adiestramiento-canino/${city.slug}`,
    telephone: '+34685648241',
    email: 'info@hakadogs.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.province,
      addressCountry: 'ES',
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    description: `Educación canina profesional en ${city.name}. Servicios presenciales y cursos online con Enfoque BE HAKA. Métodos 100% positivos.`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: '$$',
  }
}
