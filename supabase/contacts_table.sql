-- =====================================================
-- TABLA DE CONTACTOS - HAKADOGS
-- =====================================================
-- Gestión de mensajes de contacto recibidos desde el formulario web
-- Incluye estado de respuesta y seguimiento
-- =====================================================

-- 1. Crear tabla de contactos
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos del contacto
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  
  -- Estado del contacto
  status TEXT NOT NULL DEFAULT 'pending',
  -- Valores posibles: 'pending', 'in_progress', 'responded', 'closed'
  
  -- Notas internas del admin
  admin_notes TEXT,
  
  -- Quién respondió (si aplica)
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  
  -- Metadata
  source TEXT DEFAULT 'web_form',
  -- Valores posibles: 'web_form', 'email', 'phone', 'whatsapp'
  
  user_agent TEXT,
  ip_address INET,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Crear índices para búsquedas rápidas
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX idx_contacts_phone ON public.contacts(phone) WHERE phone IS NOT NULL;

-- 3. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at_trigger
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- 4. RLS (Row Level Security)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins pueden ver contactos
CREATE POLICY "Admins can view all contacts"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Solo admins pueden actualizar contactos
CREATE POLICY "Admins can update contacts"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Solo admins pueden eliminar contactos
CREATE POLICY "Admins can delete contacts"
  ON public.contacts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Cualquiera puede crear contactos (formulario público)
CREATE POLICY "Anyone can create contacts"
  ON public.contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Función para obtener estadísticas de contactos
CREATE OR REPLACE FUNCTION get_contacts_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'responded', COUNT(*) FILTER (WHERE status = 'responded'),
    'closed', COUNT(*) FILTER (WHERE status = 'closed'),
    'today', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE),
    'this_week', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'this_month', COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE))
  )
  INTO result
  FROM public.contacts;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para marcar contacto como respondido
CREATE OR REPLACE FUNCTION mark_contact_responded(
  contact_id UUID,
  admin_user_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE public.contacts
  SET 
    status = 'responded',
    responded_by = admin_user_id,
    responded_at = NOW()
  WHERE id = contact_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Vista para admins con información enriquecida
CREATE OR REPLACE VIEW contacts_admin_view AS
SELECT 
  c.*,
  u.email as responded_by_email,
  u.raw_user_meta_data->>'name' as responded_by_name,
  EXTRACT(EPOCH FROM (NOW() - c.created_at))/3600 as hours_since_created
FROM public.contacts c
LEFT JOIN auth.users u ON c.responded_by = u.id
ORDER BY c.created_at DESC;

-- Grant access to authenticated users (admin check will be in RLS)
GRANT SELECT ON contacts_admin_view TO authenticated;

-- =====================================================
-- COMENTARIOS Y NOTAS
-- =====================================================

COMMENT ON TABLE public.contacts IS 'Mensajes de contacto recibidos desde el formulario web y otros canales';
COMMENT ON COLUMN public.contacts.status IS 'Estado del contacto: pending, in_progress, responded, closed';
COMMENT ON COLUMN public.contacts.source IS 'Origen del contacto: web_form, email, phone, whatsapp';
COMMENT ON COLUMN public.contacts.admin_notes IS 'Notas internas para seguimiento del admin';
COMMENT ON FUNCTION get_contacts_stats() IS 'Retorna estadísticas generales de contactos';
COMMENT ON FUNCTION mark_contact_responded(UUID, UUID) IS 'Marca un contacto como respondido y registra quién lo respondió';

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL - comentar en producción)
-- =====================================================

-- INSERT INTO public.contacts (name, email, phone, subject, message, status)
-- VALUES 
--   ('Juan Pérez', 'juan@example.com', '685641234', 'Consulta sobre cursos', 'Me gustaría información sobre el curso de educación básica', 'pending'),
--   ('María González', 'maria@example.com', '685645678', 'Problema con mi perro', '¿Ofrecen sesiones de modificación de conducta?', 'responded'),
--   ('Carlos López', 'carlos@example.com', NULL, 'Precio curso cachorros', 'Quisiera saber el precio del curso para cachorros', 'pending');

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'contacts';

-- =====================================================
-- ÍNDICE DE RENDIMIENTO
-- =====================================================

-- Verificar índices creados
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'contacts'
  AND schemaname = 'public';
