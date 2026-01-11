import { supabase } from './client'

// ===== INTERFACES =====

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  views_count: number
  reading_time_minutes: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogPostWithCategory extends BlogPost {
  category?: BlogCategory | null
  tags?: BlogTag[]
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogComment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

// ===== CATEGORÍAS =====

export async function getAllBlogCategories(includeInactive = false) {
  let query = (supabase as any)
    .from('blog_categories')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (!includeInactive) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as BlogCategory[]
}

export async function getBlogCategoryBySlug(slug: string) {
  const { data, error } = await (supabase as any)
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  return data as BlogCategory
}

export async function createBlogCategory(category: Partial<BlogCategory>) {
  const { data, error } = await (supabase as any)
    .from('blog_categories')
    .insert([category])
    .select()
    .single()
  
  if (error) throw error
  return data as BlogCategory
}

export async function updateBlogCategory(id: string, updates: Partial<BlogCategory>) {
  const { data, error } = await (supabase as any)
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as BlogCategory
}

export async function deleteBlogCategory(id: string) {
  const { error } = await (supabase as any)
    .from('blog_categories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== POSTS =====

export async function getAllBlogPosts(status?: 'draft' | 'published' | 'archived') {
  let query = (supabase as any)
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as BlogPostWithCategory[]
}

export async function getPublishedBlogPosts(limit?: number) {
  let query = (supabase as any)
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as BlogPostWithCategory[]
}

export async function getFeaturedBlogPosts(limit = 3) {
  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as BlogPostWithCategory[]
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  
  // Incrementar vistas
  if (data && data.id) {
    await incrementPostViews(data.id)
  }
  
  return data as BlogPostWithCategory
}

export async function getBlogPostsByCategory(categorySlug: string, limit?: number) {
  let query = (supabase as any)
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories!inner(*)
    `)
    .eq('status', 'published')
    .eq('category.slug', categorySlug)
    .order('published_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as BlogPostWithCategory[]
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .insert([{
      ...post,
      published_at: post.status === 'published' ? new Date().toISOString() : null
    }])
    .select()
    .single()
  
  if (error) throw error
  return data as BlogPost
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const updateData: any = { ...updates }
  
  // Si cambia a published y no tiene published_at, agregarlo
  if (updates.status === 'published' && !updates.published_at) {
    updateData.published_at = new Date().toISOString()
  }
  
  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as BlogPost
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function incrementPostViews(postId: string) {
  const { error } = await (supabase as any).rpc('increment_post_views', {
    p_post_id: postId
  })
  
  if (error) console.error('Error incrementing views:', error)
}

export async function searchBlogPosts(query: string, categoryId?: string, limit = 10) {
  const { data, error } = await (supabase as any).rpc('search_blog_posts', {
    search_query: query,
    p_category_id: categoryId || null,
    p_limit: limit
  })
  
  if (error) throw error
  return data as BlogPostWithCategory[]
}

// ===== TAGS =====

export async function getAllBlogTags() {
  const { data, error } = await (supabase as any)
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true })
  
  if (error) throw error
  return data as BlogTag[]
}

export async function getPostTags(postId: string) {
  const { data, error } = await (supabase as any)
    .from('blog_post_tags')
    .select(`
      tag:blog_tags(*)
    `)
    .eq('post_id', postId)
  
  if (error) throw error
  if (!data) return []
  return data.map((item: any) => item.tag) as BlogTag[]
}

export async function addTagToPost(postId: string, tagId: string) {
  const { error } = await (supabase as any)
    .from('blog_post_tags')
    .insert([{ post_id: postId, tag_id: tagId }])
  
  if (error) throw error
}

export async function removeTagFromPost(postId: string, tagId: string) {
  const { error } = await (supabase as any)
    .from('blog_post_tags')
    .delete()
    .eq('post_id', postId)
    .eq('tag_id', tagId)
  
  if (error) throw error
}

export async function createBlogTag(tag: Partial<BlogTag>) {
  const { data, error } = await (supabase as any)
    .from('blog_tags')
    .insert([tag])
    .select()
    .single()
  
  if (error) throw error
  return data as BlogTag
}

// ===== UTILIDADES =====

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function calculateReadingTime(content: string): number {
  // Quitar HTML
  const text = content.replace(/<[^>]+>/g, '')
  const wordCount = text.split(/\s+/).length
  // Promedio 200 palabras por minuto
  return Math.max(1, Math.round(wordCount / 200))
}
