import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hakadogsnewweb.vercel.app' // URL de producción

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/administrator/',
          '/cursos/mi-escuela/',
          '/cursos/comprar/',
          '/_next/',
          '/qr/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

