-- ============================================
-- MIGRACIÓN: Sistema de Cupones - Versión Simplificada
-- ============================================
-- Fecha: 2026-02-04
-- Descripción: Añade el sistema de cupones sin duplicar tablas existentes

-- ============================================
-- 1. CREAR TABLA DE CUPONES
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  partner_name VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(LOWER(code));
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

COMMENT ON TABLE coupons IS 'Cupones de descuento para colaboraciones';

-- ============================================
-- 2. AÑADIR COLUMNAS A course_purchases (SI NO EXISTEN)
-- ============================================

DO $$ 
BEGIN
    -- Añadir coupon_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_purchases' AND column_name = 'coupon_id'
    ) THEN
        ALTER TABLE course_purchases ADD COLUMN coupon_id UUID REFERENCES coupons(id);
    END IF;

    -- Añadir original_price
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_purchases' AND column_name = 'original_price'
    ) THEN
        ALTER TABLE course_purchases ADD COLUMN original_price DECIMAL(10,2);
    END IF;

    -- Añadir discount_applied
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_purchases' AND column_name = 'discount_applied'
    ) THEN
        ALTER TABLE course_purchases ADD COLUMN discount_applied DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

COMMENT ON COLUMN course_purchases.coupon_id IS 'Cupón usado en esta compra';
COMMENT ON COLUMN course_purchases.original_price IS 'Precio original antes del descuento';
COMMENT ON COLUMN course_purchases.discount_applied IS 'Descuento aplicado en euros';

-- ============================================
-- 3. CREAR TABLA DE AUDITORÍA DE CUPONES
-- ============================================

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES course_purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL,
  discount_applied DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_purchase_id ON coupon_usage(purchase_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_created_at ON coupon_usage(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usage_unique_purchase ON coupon_usage(purchase_id);

COMMENT ON TABLE coupon_usage IS 'Historial de uso de cupones';

-- ============================================
-- 4. FUNCIONES
-- ============================================

-- Función para validar cupón
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
  v_error TEXT := NULL;
BEGIN
  SELECT * INTO v_coupon FROM coupons WHERE LOWER(coupons.code) = LOWER(p_code);

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(50), NULL::DECIMAL(5,2), NULL::VARCHAR(255), 'Cupón no válido'::TEXT;
    RETURN;
  END IF;

  IF NOT v_coupon.is_active THEN
    v_error := 'Este cupón ya no está activo';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  IF v_coupon.valid_from IS NOT NULL AND NOW() < v_coupon.valid_from THEN
    v_error := 'Este cupón aún no es válido';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  IF v_coupon.valid_until IS NOT NULL AND NOW() > v_coupon.valid_until THEN
    v_error := 'Este cupón ha expirado';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.times_used >= v_coupon.usage_limit THEN
    v_error := 'Este cupón ha alcanzado su límite de usos';
    RETURN QUERY SELECT false, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, v_error;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, v_coupon.id, v_coupon.code, v_coupon.discount_percentage, v_coupon.partner_name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contador de cupones
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_coupon_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE coupons SET times_used = times_used + 1 WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para updated_at
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
-- 5. POLÍTICAS RLS
-- ============================================

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins pueden gestionar cupones" ON coupons;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer cupones activos" ON coupons;
DROP POLICY IF EXISTS "Admins pueden ver historial de cupones" ON coupon_usage;
DROP POLICY IF EXISTS "Usuarios pueden ver sus usos de cupones" ON coupon_usage;

CREATE POLICY "Admins pueden gestionar cupones" ON coupons
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Usuarios autenticados pueden leer cupones activos" ON coupons
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins pueden ver historial de cupones" ON coupon_usage
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Usuarios pueden ver sus usos de cupones" ON coupon_usage
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 6. VISTA DE ESTADÍSTICAS
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
  COALESCE(SUM(cp.discount_applied), 0) AS total_discount_given,
  COALESCE(SUM(cp.price_paid), 0) AS total_revenue_with_coupon,
  COUNT(cp.id) AS actual_uses,
  c.created_at,
  c.updated_at
FROM coupons c
LEFT JOIN course_purchases cp ON cp.coupon_id = c.id
GROUP BY c.id
ORDER BY c.created_at DESC;

-- ============================================
-- 7. DATOS DE EJEMPLO
-- ============================================

INSERT INTO coupons (code, discount_percentage, partner_name, description, usage_limit)
VALUES 
  ('JACA26', 15.00, 'Clínica Veterinaria Jaca', 'Cupón del 15% para colaboración con clínica Jaca', 100),
  ('BIENVENIDA', 10.00, NULL, 'Cupón de bienvenida genérico', NULL),
  ('VIP25', 25.00, 'Clientes VIP', 'Descuento especial para clientes VIP', 50)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- FINALIZADO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de cupones instalado correctamente';
  RAISE NOTICE '📊 Tablas: coupons, coupon_usage';
  RAISE NOTICE '🔧 Funciones: validate_coupon, increment_coupon_usage';
  RAISE NOTICE '🔒 Políticas RLS configuradas';
  RAISE NOTICE '📈 Vista coupon_stats creada';
END $$;
