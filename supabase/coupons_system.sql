-- ============================================
-- SISTEMA DE CUPONES DE DESCUENTO
-- ============================================
-- Fecha: 2026-02-04
-- Descripción: Sistema completo de cupones para colaboraciones y promociones

-- ============================================
-- 1. TABLA DE CUPONES
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,           -- Código del cupón (ej: "JACA26")
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  partner_name VARCHAR(255),                  -- Nombre del colaborador/destinatario
  description TEXT,                           -- Descripción interna del cupón
  is_active BOOLEAN DEFAULT true,             -- Activo/Inactivo
  usage_limit INTEGER,                        -- NULL = ilimitado, o número de usos permitidos
  times_used INTEGER DEFAULT 0,               -- Contador de veces usado
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,       -- NULL = sin fecha de expiración
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por código (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(LOWER(code));

-- Índice para filtrar cupones activos
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

COMMENT ON TABLE coupons IS 'Tabla de cupones de descuento para colaboraciones y promociones';
COMMENT ON COLUMN coupons.code IS 'Código del cupón (se buscará case-insensitive)';
COMMENT ON COLUMN coupons.discount_percentage IS 'Porcentaje de descuento (0-100)';
COMMENT ON COLUMN coupons.partner_name IS 'Nombre del colaborador (veterinario, tienda, etc.)';
COMMENT ON COLUMN coupons.usage_limit IS 'Límite de usos totales (NULL = ilimitado)';
COMMENT ON COLUMN coupons.times_used IS 'Número de veces que se ha usado el cupón';

-- ============================================
-- 2. TABLA DE AUDITORÍA DE USO DE CUPONES
-- ============================================

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES course_purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL,
  discount_applied DECIMAL(10,2) NOT NULL,    -- Descuento en euros aplicado
  original_price DECIMAL(10,2) NOT NULL,      -- Precio original del curso
  final_price DECIMAL(10,2) NOT NULL,         -- Precio final pagado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas y análisis
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_purchase_id ON coupon_usage(purchase_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_created_at ON coupon_usage(created_at);

-- Restricción: evitar que la misma compra use múltiples cupones
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usage_unique_purchase ON coupon_usage(purchase_id);

COMMENT ON TABLE coupon_usage IS 'Auditoría de uso de cupones - track de cada aplicación';
COMMENT ON COLUMN coupon_usage.discount_applied IS 'Descuento en euros que se aplicó';
COMMENT ON COLUMN coupon_usage.original_price IS 'Precio PVP original del curso';
COMMENT ON COLUMN coupon_usage.final_price IS 'Precio final después del descuento';

-- ============================================
-- 3. MODIFICAR TABLA course_purchases
-- ============================================

-- Añadir columnas para registrar cupones en las compras
ALTER TABLE course_purchases 
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id),
  ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS discount_applied DECIMAL(10,2) DEFAULT 0;

COMMENT ON COLUMN course_purchases.coupon_id IS 'Cupón usado en esta compra (si aplica)';
COMMENT ON COLUMN course_purchases.original_price IS 'Precio original antes del descuento';
COMMENT ON COLUMN course_purchases.discount_applied IS 'Descuento aplicado en euros';

-- ============================================
-- 4. TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_coupons_timestamp ON coupons;

CREATE TRIGGER trigger_update_coupons_timestamp
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_coupons_updated_at();

-- ============================================
-- 5. FUNCIÓN PARA VALIDAR CUPÓN
-- ============================================

CREATE OR REPLACE FUNCTION validate_coupon(
  p_code VARCHAR(50),
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  valid BOOLEAN,
  coupon_id UUID,
  code VARCHAR(50),
  discount_percentage DECIMAL(5,2),
  partner_name VARCHAR(255),
  error_message TEXT
) AS $$
DECLARE
  v_coupon RECORD;
  v_is_valid BOOLEAN := false;
  v_error TEXT := NULL;
BEGIN
  -- Buscar el cupón (case-insensitive)
  SELECT * INTO v_coupon
  FROM coupons
  WHERE LOWER(coupons.code) = LOWER(p_code);

  -- Si no existe
  IF NOT FOUND THEN
    v_error := 'Cupón no válido';
    RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(50), NULL::DECIMAL(5,2), NULL::VARCHAR(255), v_error;
    RETURN;
  END IF;

  -- Validar que esté activo
  IF NOT v_coupon.is_active THEN
    v_error := 'Este cupón ya no está activo';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  -- Validar fecha de inicio
  IF v_coupon.valid_from IS NOT NULL AND NOW() < v_coupon.valid_from THEN
    v_error := 'Este cupón aún no es válido';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  -- Validar fecha de expiración
  IF v_coupon.valid_until IS NOT NULL AND NOW() > v_coupon.valid_until THEN
    v_error := 'Este cupón ha expirado';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  -- Validar límite de usos
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.times_used >= v_coupon.usage_limit THEN
    v_error := 'Este cupón ha alcanzado su límite de usos';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  -- Cupón válido
  v_is_valid := true;
  RETURN QUERY SELECT 
    true, 
    v_coupon.id, 
    v_coupon.code, 
    v_coupon.discount_percentage, 
    v_coupon.partner_name, 
    NULL::TEXT;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_coupon IS 'Valida si un cupón es válido para usar';

-- ============================================
-- 6. FUNCIÓN PARA CALCULAR PRECIO CON DESCUENTO
-- ============================================

CREATE OR REPLACE FUNCTION calculate_discounted_price(
  p_original_price DECIMAL(10,2),
  p_discount_percentage DECIMAL(5,2)
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_discount_amount DECIMAL(10,2);
  v_final_price DECIMAL(10,2);
BEGIN
  -- Calcular descuento en euros
  v_discount_amount := ROUND((p_original_price * p_discount_percentage / 100)::NUMERIC, 2);
  
  -- Calcular precio final
  v_final_price := p_original_price - v_discount_amount;
  
  -- Asegurar que no sea negativo
  IF v_final_price < 0 THEN
    v_final_price := 0;
  END IF;
  
  RETURN v_final_price;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_discounted_price IS 'Calcula el precio final después de aplicar un porcentaje de descuento';

-- ============================================
-- 7. FUNCIÓN PARA INCREMENTAR CONTADOR DE CUPONES
-- ============================================

CREATE OR REPLACE FUNCTION increment_coupon_usage(
  p_coupon_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE coupons
  SET times_used = times_used + 1
  WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION increment_coupon_usage IS 'Incrementa el contador de usos de un cupón de forma segura';

-- ============================================
-- 8. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en las nuevas tablas
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS PARA coupons =====

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Admins pueden gestionar cupones" ON coupons;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer cupones activos" ON coupons;

-- Admins pueden hacer todo
CREATE POLICY "Admins pueden gestionar cupones"
  ON coupons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Usuarios autenticados pueden leer cupones activos (para validar en frontend)
CREATE POLICY "Usuarios autenticados pueden leer cupones activos"
  ON coupons
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ===== POLÍTICAS PARA coupon_usage =====

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Admins pueden ver todo el historial de cupones" ON coupon_usage;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios usos de cupones" ON coupon_usage;

-- Admins pueden ver todo el historial
CREATE POLICY "Admins pueden ver todo el historial de cupones"
  ON coupon_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Usuarios pueden ver sus propios usos de cupones
CREATE POLICY "Usuarios pueden ver sus propios usos de cupones"
  ON coupon_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 9. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar algunos cupones de ejemplo
INSERT INTO coupons (code, discount_percentage, partner_name, description, usage_limit)
VALUES 
  ('JACA26', 15.00, 'Clínica Veterinaria Jaca', 'Cupón del 15% para colaboración con clínica Jaca', 100),
  ('BIENVENIDA', 10.00, NULL, 'Cupón de bienvenida genérico', NULL),
  ('VIP25', 25.00, 'Clientes VIP', 'Descuento especial para clientes VIP', 50)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 10. VISTA PARA ESTADÍSTICAS DE CUPONES
-- ============================================

CREATE OR REPLACE VIEW coupon_stats AS
SELECT 
  c.id,
  c.code,
  c.partner_name,
  c.discount_percentage,
  c.is_active,
  c.usage_limit,
  c.times_used,
  c.valid_from,
  c.valid_until,
  COALESCE(SUM(cu.discount_applied), 0) AS total_discount_given,
  COALESCE(SUM(cu.final_price), 0) AS total_revenue_with_coupon,
  COUNT(cu.id) AS actual_uses,
  c.created_at,
  c.updated_at
FROM coupons c
LEFT JOIN coupon_usage cu ON cu.coupon_id = c.id
GROUP BY c.id, c.code, c.partner_name, c.discount_percentage, c.is_active, 
         c.usage_limit, c.times_used, c.valid_from, c.valid_until, c.created_at, c.updated_at
ORDER BY c.created_at DESC;

COMMENT ON VIEW coupon_stats IS 'Vista con estadísticas de uso y rendimiento de cupones';

-- ============================================
-- FINALIZADO
-- ============================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de cupones instalado correctamente';
  RAISE NOTICE '📊 Tablas creadas: coupons, coupon_usage';
  RAISE NOTICE '🔧 Funciones creadas: validate_coupon, calculate_discounted_price';
  RAISE NOTICE '🔒 Políticas RLS configuradas';
  RAISE NOTICE '📈 Vista coupon_stats creada para análisis';
END $$;
