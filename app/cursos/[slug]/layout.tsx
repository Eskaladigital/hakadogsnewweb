import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase para server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Props {
  params: Promise<{ slug: string }>
}

async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return {
      title: 'Curso no encontrado | Hakadogs',
      description: 'El curso que buscas no existe o no está disponible.',
    }
  }

  // Limpiar HTML de la descripción para el meta
  const cleanDescription = (course.short_description || course.description || '')
    .replace(/<[^>]*>/g, '')
    .slice(0, 160)

  const difficultyLabels: Record<string, string> = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
  }

  return {
    title: `${course.title} | Curso de Educación Canina | Hakadogs`,
    description: `${cleanDescription} Nivel: ${difficultyLabels[course.difficulty] || course.difficulty}. ${course.duration_minutes} minutos de contenido. ${course.total_lessons} lecciones.`,
    keywords: `${course.title.toLowerCase()}, curso educación canina, adiestramiento perros online, ${course.difficulty}, hakadogs`,
    alternates: {
      canonical: `https://www.hakadogs.com/cursos/${slug}`,
    },
    openGraph: {
      title: `${course.title} | Hakadogs`,
      description: cleanDescription,
      url: `https://www.hakadogs.com/cursos/${slug}`,
      type: 'website',
      siteName: 'Hakadogs',
      images: [
        {
          url: course.thumbnail_url || 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
          width: 1200,
          height: 630,
          alt: course.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} | Hakadogs`,
      description: cleanDescription,
      images: [course.thumbnail_url || 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Generar rutas estáticas para todos los cursos publicados (mejora SEO)
export async function generateStaticParams() {
  const { data: courses } = await supabase
    .from('courses')
    .select('slug')
    .eq('is_published', true)

  return (courses || []).map((course) => ({
    slug: course.slug,
  }))
}

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
