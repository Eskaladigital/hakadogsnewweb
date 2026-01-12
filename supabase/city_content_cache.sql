-- =====================================================
-- TABLA PARA CACHEAR CONTENIDO ÚNICO DE LOCALIDADES
-- Generado con OpenAI y guardado para reutilización
-- =====================================================

-- Crear tabla de caché de contenido de ciudades
CREATE TABLE IF NOT EXISTS city_content_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_slug TEXT NOT NULL UNIQUE,
  city_name TEXT NOT NULL,
  province TEXT NOT NULL,
  
  -- Contenido generado
  intro_text TEXT NOT NULL,
  local_benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  local_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  challenges JSONB NOT NULL DEFAULT '[]'::jsonb,
  testimonial JSONB NOT NULL DEFAULT '{}'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  
  -- Índices para búsqueda rápida
  CONSTRAINT city_content_cache_city_slug_key UNIQUE (city_slug)
);

-- Índice para búsqueda por slug
CREATE INDEX IF NOT EXISTS idx_city_content_cache_slug ON city_content_cache(city_slug);

-- Comentarios
COMMENT ON TABLE city_content_cache IS 'Caché de contenido único generado con IA para páginas de localidades';
COMMENT ON COLUMN city_content_cache.city_slug IS 'Slug de la ciudad (ej: valencia, madrid, barcelona)';
COMMENT ON COLUMN city_content_cache.intro_text IS 'Texto introductorio único de la ciudad';
COMMENT ON COLUMN city_content_cache.local_benefits IS 'Array de beneficios específicos para la ciudad';
COMMENT ON COLUMN city_content_cache.local_info IS 'Info local: pipicanes, normativas, clima, playas';
COMMENT ON COLUMN city_content_cache.challenges IS 'Desafíos específicos de tener perro en esta ciudad';
COMMENT ON COLUMN city_content_cache.testimonial IS 'Testimonio contextualizado de la ciudad';
COMMENT ON COLUMN city_content_cache.faqs IS 'FAQs específicas de la ciudad';
COMMENT ON COLUMN city_content_cache.version IS 'Versión del contenido (para regeneración selectiva)';

-- RLS (Row Level Security)
ALTER TABLE city_content_cache ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer (contenido público)
CREATE POLICY "city_content_cache_select_policy" ON city_content_cache
  FOR SELECT
  USING (true);

-- Política: Solo admins pueden insertar/actualizar
CREATE POLICY "city_content_cache_insert_policy" ON city_content_cache
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "city_content_cache_update_policy" ON city_content_cache
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_city_content_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_city_content_cache_updated_at ON city_content_cache;
CREATE TRIGGER trigger_update_city_content_cache_updated_at
  BEFORE UPDATE ON city_content_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_city_content_cache_updated_at();

-- Función helper para obtener contenido de ciudad (o NULL si no existe)
CREATE OR REPLACE FUNCTION get_city_content(p_city_slug TEXT)
RETURNS TABLE (
  intro_text TEXT,
  local_benefits JSONB,
  local_info JSONB,
  challenges JSONB,
  testimonial JSONB,
  faqs JSONB,
  generated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.intro_text,
    c.local_benefits,
    c.local_info,
    c.challenges,
    c.testimonial,
    c.faqs,
    c.generated_at
  FROM city_content_cache c
  WHERE c.city_slug = p_city_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para insertar/actualizar contenido de ciudad
CREATE OR REPLACE FUNCTION upsert_city_content(
  p_city_slug TEXT,
  p_city_name TEXT,
  p_province TEXT,
  p_intro_text TEXT,
  p_local_benefits JSONB,
  p_local_info JSONB,
  p_challenges JSONB,
  p_testimonial JSONB,
  p_faqs JSONB
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO city_content_cache (
    city_slug,
    city_name,
    province,
    intro_text,
    local_benefits,
    local_info,
    challenges,
    testimonial,
    faqs
  ) VALUES (
    p_city_slug,
    p_city_name,
    p_province,
    p_intro_text,
    p_local_benefits,
    p_local_info,
    p_challenges,
    p_testimonial,
    p_faqs
  )
  ON CONFLICT (city_slug) DO UPDATE SET
    city_name = EXCLUDED.city_name,
    province = EXCLUDED.province,
    intro_text = EXCLUDED.intro_text,
    local_benefits = EXCLUDED.local_benefits,
    local_info = EXCLUDED.local_info,
    challenges = EXCLUDED.challenges,
    testimonial = EXCLUDED.testimonial,
    faqs = EXCLUDED.faqs,
    version = city_content_cache.version + 1,
    updated_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants
GRANT SELECT ON city_content_cache TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_city_content(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_city_content(TEXT, TEXT, TEXT, TEXT, JSONB, JSONB, JSONB, JSONB, JSONB) TO authenticated;

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Verificación
SELECT 
  'city_content_cache' as tabla,
  COUNT(*) as registros
FROM city_content_cache;
