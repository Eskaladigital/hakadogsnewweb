'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Eye, Share2, Facebook, Twitter, Linkedin, Tag, Loader2, BookOpen, ChevronRight, Copy, Check, MessageCircle } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const sharePost = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
    const url = window.location.href
    const title = post?.title || ''
    const text = `${title} - ${post?.excerpt || ''}`
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    }
    
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      navigator.share({ title, text, url }).catch(() => {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400')
      })
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-500">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link href="/blog" className="text-forest hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barra de progreso de lectura */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 z-50">
        <div 
          className="h-full bg-forest transition-all duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="pt-24 pb-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Link href="/" className="hover:text-forest transition">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-forest transition">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-600">{post.category.name}</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Cabecera del artículo */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        {post.category && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest/10 text-forest mb-5">
            <Tag className="w-3 h-3" />
            {post.category.name}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.15] tracking-tight mb-5">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-8">
            {post.excerpt}
          </p>
        )}

        {/* Meta: fecha, tiempo, vistas + compartir */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.reading_time_minutes} min
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views_count.toLocaleString()}
            </span>
          </div>

          {/* Botón compartir */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-forest transition text-sm"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 min-w-[180px]">
                {[
                  { key: 'facebook' as const, icon: Facebook, label: 'Facebook', color: 'bg-blue-600' },
                  { key: 'twitter' as const, icon: Twitter, label: 'Twitter', color: 'bg-sky-500' },
                  { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-700' },
                  { key: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-500' },
                ].map(({ key, icon: Icon, label, color }) => (
                  <button
                    key={key}
                    onClick={() => sharePost(key)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-left"
                  >
                    <div className={`w-6 h-6 ${color} rounded flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </button>
                ))}
                <button
                  onClick={() => sharePost('copy')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-left"
                >
                  <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Imagen destacada */}
      {post.featured_image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority
              quality={85}
            />
          </div>
        </div>
      )}

      {/* CONTENIDO DEL ARTÍCULO — el corazón de la página */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className="blog-content prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-forest prose-a:font-medium hover:prose-a:underline
            prose-strong:text-gray-900
            prose-blockquote:border-l-4 prose-blockquote:border-forest prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-img:rounded-xl prose-img:shadow-md
            prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Separador */}
      <hr className="max-w-3xl mx-auto border-gray-100" />

      {/* Compartir al final */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">¿Te ha resultado útil? Compártelo</p>
          <div className="flex gap-2">
            {[
              { key: 'facebook' as const, icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
              { key: 'twitter' as const, icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
              { key: 'linkedin' as const, icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
              { key: 'whatsapp' as const, icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600' },
            ].map(({ key, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => sharePost(key)}
                className={`p-2.5 ${color} text-white rounded-lg transition`}
                title={`Compartir en ${key}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Artículos relacionados */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Artículos Relacionados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {relatedPost.featured_image_url && (
                    <div className="aspect-video relative">
                      <Image
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {relatedPost.category && (
                      <span className="inline-block text-xs font-semibold text-forest mb-2">
                        {relatedPost.category.name}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-forest transition line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {relatedPost.reading_time_minutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="bg-forest text-white py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para transformar la vida con tu perro?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Únete a miles de personas que ya han mejorado la relación con sus perros
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-block bg-white text-forest px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition"
            >
              Explorar Cursos
            </Link>
            <Link
              href="/blog"
              className="inline-block border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition"
            >
              Más Artículos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
