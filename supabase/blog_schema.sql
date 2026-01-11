-- =====================================================
-- SISTEMA DE BLOG COMPLETO
-- =====================================================

-- TABLA: blog_categories (Categorías del blog)
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#10b981', -- Color hex para la UI
  icon VARCHAR(50), -- Nombre del icono de lucide-react
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: blog_posts (Artículos del blog)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT, -- Resumen corto
  content TEXT NOT NULL, -- Contenido completo (HTML de TinyMCE)
  featured_image_url TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  is_featured BOOLEAN DEFAULT false, -- Para destacar en homepage
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: blog_tags (Etiquetas)
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: blog_post_tags (Relación muchos a muchos)
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- TABLA: blog_comments (Comentarios - opcional)
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- Para respuestas
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);

-- Índice de búsqueda full-text (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector('spanish', title || ' ' || excerpt || ' ' || content));

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS trigger_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER trigger_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(text_input, '[áàäâ]', 'a', 'gi'),
        '[éèëê]', 'e', 'gi'
      ),
      '[^a-z0-9]+', '-', 'gi'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para calcular tiempo de lectura
CREATE OR REPLACE FUNCTION calculate_reading_time(content_html TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
BEGIN
  -- Quitar HTML y contar palabras (promedio 200 palabras por minuto)
  word_count := array_length(
    regexp_split_to_array(
      regexp_replace(content_html, '<[^>]+>', '', 'g'),
      '\s+'
    ),
    1
  );
  RETURN GREATEST(1, ROUND(word_count / 200.0));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION increment_post_views(p_post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views_count = views_count + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Función para buscar posts
CREATE OR REPLACE FUNCTION search_blog_posts(search_query TEXT, p_category_id UUID DEFAULT NULL, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  excerpt TEXT,
  featured_image_url TEXT,
  category_id UUID,
  category_name VARCHAR,
  author_id UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  reading_time_minutes INTEGER,
  views_count INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    bp.category_id,
    bc.name as category_name,
    bp.author_id,
    bp.published_at,
    bp.reading_time_minutes,
    bp.views_count,
    ts_rank(to_tsvector('spanish', bp.title || ' ' || bp.excerpt || ' ' || bp.content), plainto_tsquery('spanish', search_query)) as rank
  FROM blog_posts bp
  LEFT JOIN blog_categories bc ON bc.id = bp.category_id
  WHERE bp.status = 'published'
    AND (p_category_id IS NULL OR bp.category_id = p_category_id)
    AND to_tsvector('spanish', bp.title || ' ' || bp.excerpt || ' ' || bp.content) @@ plainto_tsquery('spanish', search_query)
  ORDER BY rank DESC, bp.published_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para blog_categories
CREATE POLICY "Categorías públicas para lectura" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Solo admins pueden modificar categorías" ON blog_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Políticas para blog_posts
CREATE POLICY "Posts publicados públicos" ON blog_posts
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Admins pueden gestionar todos los posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Políticas para tags
CREATE POLICY "Tags públicos" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar tags" ON blog_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Políticas para relación post-tags
CREATE POLICY "Relaciones post-tag públicas" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar relaciones" ON blog_post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Políticas para comentarios
CREATE POLICY "Comentarios aprobados públicos" ON blog_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Usuarios pueden crear comentarios" ON blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins pueden moderar comentarios" ON blog_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =====================================================
-- PERMISOS
-- =====================================================

GRANT SELECT ON blog_categories TO authenticated, anon;
GRANT SELECT ON blog_posts TO authenticated, anon;
GRANT SELECT ON blog_tags TO authenticated, anon;
GRANT SELECT ON blog_post_tags TO authenticated, anon;
GRANT SELECT ON blog_comments TO authenticated, anon;

GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_blog_posts(TEXT, UUID, INTEGER) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION calculate_reading_time(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_slug(TEXT) TO authenticated;

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Categorías de ejemplo
INSERT INTO blog_categories (name, slug, description, color, icon, order_index) VALUES
('Educación Canina', 'educacion-canina', 'Consejos y técnicas para educar a tu perro', '#10b981', 'GraduationCap', 1),
('Salud y Bienestar', 'salud-bienestar', 'Todo sobre la salud de tu mascota', '#3b82f6', 'Heart', 2),
('Nutrición', 'nutricion', 'Alimentación y dietas para perros', '#f59e0b', 'Apple', 3),
('Comportamiento', 'comportamiento', 'Entendiendo el comportamiento canino', '#8b5cf6', 'Brain', 4),
('Razas', 'razas', 'Información sobre diferentes razas', '#ec4899', 'Dog', 5)
ON CONFLICT (slug) DO NOTHING;

-- Comentarios
COMMENT ON TABLE blog_categories IS 'Categorías del blog';
COMMENT ON TABLE blog_posts IS 'Artículos del blog';
COMMENT ON TABLE blog_tags IS 'Etiquetas para clasificar posts';
COMMENT ON TABLE blog_post_tags IS 'Relación muchos a muchos entre posts y tags';
COMMENT ON TABLE blog_comments IS 'Comentarios en los posts del blog';
