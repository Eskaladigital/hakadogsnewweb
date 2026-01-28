import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('title, excerpt, featured_image_url')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!post) {
      return {
        title: 'Artículo no encontrado | Hakadogs',
        description: 'El artículo que buscas no está disponible.',
      }
    }

    return {
      title: `${post.title} | Blog Hakadogs`,
      description: post.excerpt || 'Artículo de educación canina profesional.',
      openGraph: {
        title: post.title,
        description: post.excerpt || 'Artículo de educación canina profesional.',
        url: `https://www.hakadogs.com/blog/${slug}`,
        type: 'article',
        images: post.featured_image_url ? [
          {
            url: post.featured_image_url,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [
          {
            url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
            width: 1200,
            height: 630,
            alt: 'Hakadogs - Blog de Educación Canina',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || 'Artículo de educación canina profesional.',
        images: post.featured_image_url ? [post.featured_image_url] : ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
      },
    }
  } catch (error) {
    return {
      title: 'Blog | Hakadogs',
      description: 'Blog de educación canina profesional.',
    }
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
