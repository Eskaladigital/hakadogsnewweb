import { Metadata } from 'next'
import { getBlogPostBySlug } from '@/lib/supabase/blog'
import Script from 'next/script'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug(params.slug)
    
    const title = post.seo_title || post.title
    const description = post.seo_description || post.excerpt || `${post.title} - Blog Hakadogs`
    const image = post.featured_image_url || 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'
    
    return {
      title,
      description,
      keywords: post.seo_keywords || undefined,
      alternates: {
        canonical: `https://www.hakadogs.com/blog/${params.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.hakadogs.com/blog/${params.slug}`,
        type: 'article',
        publishedTime: post.published_at || undefined,
        modifiedTime: post.updated_at || undefined,
        authors: ['Alfredo García - Hakadogs'],
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch (error) {
    return {
      title: 'Blog | Hakadogs',
      description: 'Artículos sobre educación canina y adiestramiento.',
    }
  }
}

export default function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <>
      {children}
      <ArticleSchema slug={params.slug} />
    </>
  )
}

async function ArticleSchema({ slug }: { slug: string }) {
  try {
    const post = await getBlogPostBySlug(slug)
    
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.seo_description,
      image: post.featured_image_url || 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at,
      author: {
        '@type': 'Person',
        name: 'Alfredo García',
        url: 'https://www.hakadogs.com/sobre-nosotros',
        jobTitle: 'Educador Canino Profesional',
        worksFor: {
          '@type': 'Organization',
          name: 'Hakadogs',
          url: 'https://www.hakadogs.com'
        }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Hakadogs',
        url: 'https://www.hakadogs.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.hakadogs.com/images/logo_definitivo_hakadogs.webp'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.hakadogs.com/blog/${slug}`
      },
      articleBody: post.content,
      wordCount: post.content.split(/\s+/).length,
      inLanguage: 'es-ES',
      about: {
        '@type': 'Thing',
        name: 'Educación Canina'
      }
    }

    return (
      <Script
        id={`article-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    )
  } catch (error) {
    return null
  }
}
