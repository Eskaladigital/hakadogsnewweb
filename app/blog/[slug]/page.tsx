'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Eye, Share2, Facebook, Twitter, Linkedin, Tag, Loader2, BookOpen, ChevronRight, Mail, Copy, Check } from 'lucide-react'
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/supabase/blog'
import type { BlogPostWithCategory } from '@/lib/supabase/blog'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<BlogPostWithCategory | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostWithCategory[]>([])
  const [readProgress, setReadProgress] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setReadProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [post])

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

  const sharePost = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href
    const title = post?.title || ''
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link href="/blog" className="text-forest hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Barra de progreso de lectura */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-forest to-sage transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Header compacto con breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-6 sticky top-0 z-40 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-forest transition">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-forest transition">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{post.category.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Hero minimalista */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Categoría */}
          {post.category && (
            <div className="mb-6">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white shadow-md"
                style={{ backgroundColor: post.category.color }}
              >
                <Tag className="w-4 h-4 mr-2" />
                {post.category.name}
              </span>
            </div>
          )}

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Extracto grande */}
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
              {post.excerpt}
            </p>
          )}

          {/* Meta información mejorada */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">{formatDate(post.published_at || post.created_at)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">{post.reading_time_minutes} min lectura</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">{post.views_count.toLocaleString()} vistas</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-4 pt-8">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-forest to-sage text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Compartir
              </button>
              
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 min-w-[200px]">
                  <button
                    onClick={() => sharePost('facebook')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition text-left group"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Facebook className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600">Facebook</span>
                  </button>
                  <button
                    onClick={() => sharePost('twitter')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 rounded-lg transition text-left group"
                  >
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-sky-500">Twitter</span>
                  </button>
                  <button
                    onClick={() => sharePost('linkedin')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition text-left group"
                  >
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-700">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => sharePost('copy')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-left group"
                  >
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                      {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">
                      {copied ? '¡Copiado!' : 'Copiar enlace'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Imagen destacada full-width con efecto parallax */}
      {post.featured_image_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="relative aspect-[21/9] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Layout con sidebar derecho solamente */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Contenido principal - MÁS ANCHO */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-12">
                {/* Contenido HTML con estilos mejorados */}
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gray-900
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-forest prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:my-6 prose-ul:space-y-2
                    prose-ol:my-6 prose-ol:space-y-2
                    prose-li:text-gray-700 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-forest prose-blockquote:bg-forest/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                    prose-code:text-forest prose-code:bg-gray-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:rounded-2xl prose-pre:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {/* Compartir al final del artículo */}
            <div className="mt-12 bg-gradient-to-br from-forest/5 via-sage/5 to-forest/5 rounded-2xl p-8 border border-forest/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">¿Te ha resultado útil?</h3>
                  <p className="text-gray-600">Comparte este artículo con otros amantes de los perros</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => sharePost('facebook')}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                    title="Compartir en Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => sharePost('twitter')}
                    className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition shadow-md hover:shadow-lg"
                    title="Compartir en Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => sharePost('linkedin')}
                    className="p-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition shadow-md hover:shadow-lg"
                    title="Compartir en LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar derecho - Info adicional */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              
              {/* Artículos Relacionados */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-forest" />
                    Artículos Relacionados
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="group block hover:bg-gray-50 p-3 rounded-lg transition"
                      >
                        {relatedPost.featured_image_url && (
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}
                        {relatedPost.category && (
                          <span
                            className="inline-block px-2 py-1 rounded-full text-xs font-bold text-white mb-2"
                            style={{ backgroundColor: relatedPost.category.color }}
                          >
                            {relatedPost.category.name}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-forest transition line-clamp-2 mb-1">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedPost.reading_time_minutes} min
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorías del Blog */}
              {post.category && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-forest" />
                    Más Temas
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/blog"
                      className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 font-medium"
                    >
                      Ver Todos los Artículos
                    </Link>
                    <Link
                      href="/blog"
                      className="block px-4 py-3 rounded-lg transition text-white font-medium"
                      style={{ backgroundColor: post.category.color }}
                    >
                      Más de {post.category.name}
                    </Link>
                  </div>
                </div>
              )}

              {/* CTA Cursos */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-forest/10 rounded-xl mb-4">
                  <BookOpen className="w-6 h-6 text-forest" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aprende Más</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Descubre nuestros cursos profesionales de educación canina
                </p>
                <Link
                  href="/cursos"
                  className="block w-full bg-gradient-to-r from-forest to-sage text-white text-center px-4 py-3 rounded-lg font-bold hover:shadow-lg transition"
                >
                  Ver Cursos
                </Link>
              </div>

              {/* Info rápida */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-bold text-gray-900 mb-4">Sobre Hakadogs</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Somos profesionales con más de 15 años de experiencia en educación canina. 
                  Nuestra misión es ayudarte a crear una relación equilibrada con tu perro.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-forest via-sage to-forest text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">¿Listo para transformar la vida con tu perro?</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Únete a miles de personas que ya han mejorado la relación con sus perros gracias a nuestros cursos profesionales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cursos"
              className="inline-block bg-white text-forest px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Explorar Cursos
            </Link>
            <Link
              href="/blog"
              className="inline-block bg-white/10 backdrop-blur text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition"
            >
              Más Artículos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
