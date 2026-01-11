'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Eye, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag, Loader2 } from 'lucide-react'
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/supabase/blog'
import type { BlogPostWithCategory } from '@/lib/supabase/blog'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<BlogPostWithCategory | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostWithCategory[]>([])

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const postData = await getBlogPostBySlug(slug)
      setPost(postData)

      // Cargar posts relacionados (misma categoría)
      if (postData.category_id) {
        const allPosts = await getPublishedBlogPosts(4)
        const related = allPosts
          .filter(p => p.category_id === postData.category_id && p.id !== postData.id)
          .slice(0, 3)
        setRelatedPosts(related)
      }
    } catch (error) {
      console.error('Error cargando post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const sharePost = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = window.location.href
    const title = post?.title || ''
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-forest" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link href="/blog" className="text-forest hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero con imagen destacada */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Link href="/blog" className="inline-flex items-center text-forest hover:text-sage mb-6 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al blog
          </Link>

          {/* Categoría */}
          {post.category && (
            <div className="mb-4">
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            </div>
          )}

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Meta información */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.reading_time_minutes} min de lectura</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              <span>{post.views_count} vistas</span>
            </div>
          </div>

          {/* Botones de compartir */}
          <div className="flex items-center gap-3 pb-8">
            <span className="text-sm font-semibold text-gray-700">Compartir:</span>
            <button
              onClick={() => sharePost('facebook')}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              title="Compartir en Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => sharePost('twitter')}
              className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
              title="Compartir en Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => sharePost('linkedin')}
              className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              title="Compartir en LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Imagen destacada */}
        {post.featured_image_url && (
          <div className="container mx-auto px-4 sm:px-6">
            <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenido del artículo */}
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Extracto */}
          {post.excerpt && (
            <div className="bg-forest/5 border-l-4 border-forest p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}

          {/* Contenido HTML */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2
              prose-li:text-gray-700
              prose-a:text-forest prose-a:underline hover:prose-a:text-sage
              prose-blockquote:border-l-4 prose-blockquote:border-forest prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
              prose-table:w-full prose-table:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
              >
                {relatedPost.featured_image_url && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={relatedPost.featured_image_url}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {relatedPost.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                      style={{ backgroundColor: relatedPost.category.color }}
                    >
                      {relatedPost.category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-forest transition line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Te ha gustado este artículo?</h2>
          <p className="text-xl text-white/90 mb-8">
            Descubre nuestros cursos y lleva la educación de tu perro al siguiente nivel
          </p>
          <Link
            href="/cursos"
            className="inline-block bg-white text-forest px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Ver Cursos
          </Link>
        </div>
      </section>
    </div>
  )
}
