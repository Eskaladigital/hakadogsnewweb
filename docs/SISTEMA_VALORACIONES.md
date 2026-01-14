# ⭐ Sistema de Valoraciones de Cursos - Hakadogs

**Versión**: 1.0.0  
**Fecha**: 14 Enero 2026  
**Estado**: ✅ Implementado y funcional

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Características Principales](#características-principales)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Funcionalidades](#funcionalidades)
5. [Base de Datos](#base-de-datos)
6. [Frontend](#frontend)
7. [Panel de Administración](#panel-de-administración)
8. [Instalación](#instalación)
9. [Casos de Uso](#casos-de-uso)

---

## 🎯 Resumen Ejecutivo

El **Sistema de Valoraciones de Cursos** permite a los estudiantes calificar los cursos completados mediante un sistema multi-criterio, generando métricas de engagement automáticas que ayudan a los administradores a identificar qué cursos funcionan mejor y qué usuarios están más comprometidos.

### ✨ Valor para el Negocio

- **📊 Feedback Continuo**: Conocer en tiempo real qué cursos satisfacen a los estudiantes
- **🎯 Engagement Tracking**: Identificar usuarios comprometidos vs. pasivos
- **📈 Mejora Continua**: Ajustar contenido basado en valoraciones reales
- **🔍 Segmentación Inteligente**: Valoraciones de usuarios activos tienen más peso
- **📱 Experiencia Mejorada**: Los estudiantes sienten que su opinión importa

---

## 🌟 Características Principales

### ⭐ Rating Multi-Criterio

El sistema evalúa **4 aspectos independientes** (escala 1-5):

1. **Dificultad del Curso** (1 = Muy fácil, 5 = Muy difícil)
2. **Comprensión del Contenido** (1 = Muy confuso, 5 = Muy claro)
3. **Duración del Curso** (1 = Muy corto, 5 = Muy largo)
4. **Dificultad del Test** (1 = Muy fácil, 5 = Muy difícil)

**Rating Global Automático**: Promedio de los 4 criterios (1-5 estrellas)

### 🎯 Engagement Score (0-100)

Métrica automática que combina:
- **50% Lecciones**: `(lecciones completadas / total lecciones) * 50`
- **50% Tests**: `(tests aprobados / total tests) * 50`

**Interpretación**:
- **Alto engagement (>66)**: Usuario muy comprometido
- **Medio engagement (33-66)**: Participación moderada
- **Bajo engagement (<33)**: Usuario poco activo

### 💬 Comentarios Opcionales

Los estudiantes pueden añadir feedback cualitativo para contexto adicional.

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL + RLS)
- **UI**: Tailwind CSS + Framer Motion
- **Iconos**: Lucide React

### Componentes Clave

```
Sistema de Valoraciones
├── Frontend
│   ├── CourseReviewModal.tsx      # Modal de valoración (estudiante)
│   ├── app/administrator/valoraciones/page.tsx  # Panel admin
│   └── lib/supabase/reviews.ts    # Funciones de gestión
└── Backend (Supabase)
    ├── course_reviews              # Tabla principal
    ├── calculate_user_engagement() # Función de cálculo
    ├── get_all_reviews_admin()     # RPC para panel admin
    ├── get_course_review_stats()   # Stats por curso
    └── get_overall_review_stats()  # Stats globales
```

---

## 🎨 Funcionalidades

### 👨‍🎓 Para Estudiantes

#### 1. **Crear/Editar Valoración**

**Ubicación**: `/cursos/mi-escuela` → Card de curso → Botón "⭐ Valorar curso"

**Flujo**:
1. Usuario abre modal de valoración
2. Sistema verifica si ya existe una valoración previa
3. Si existe, precarga los valores para editar
4. Usuario califica los 4 aspectos (obligatorio)
5. Usuario puede añadir comentario (opcional)
6. Al guardar, se calcula automáticamente:
   - Rating global (promedio de 4 aspectos)
   - Engagement score (lecciones + tests)

**Validaciones**:
- ✅ Solo puede valorar cursos que ha comprado
- ✅ Puede editar su valoración en cualquier momento
- ✅ Solo una valoración por usuario por curso

#### 2. **Visualizar Rating Global**

En el dashboard "Mi Escuela", cada curso muestra:
- **⭐ Rating global** (si ha valorado)
- **Botón "Valorar curso"** / **"Editar valoración"**

---

### 👨‍💼 Para Administradores

#### 1. **Panel de Valoraciones** (`/administrator/valoraciones`)

**Vista Principal**:

| Campo | Descripción |
|-------|-------------|
| **Curso** | Título del curso valorado |
| **Usuario** | Email del estudiante (privacidad: solo email) |
| **Rating** | Estrellas globales + desglose por criterio |
| **Engagement** | Badge de color (🟢 Alto, 🟡 Medio, 🔴 Bajo) |
| **Progreso** | Lecciones completadas / total |
| **Tests** | Tests intentados / tests aprobados |
| **Comentario** | Feedback cualitativo |
| **Fecha** | Cuándo se creó la valoración |

#### 2. **Filtros Avanzados**

**Por Curso**:
- Desplegable con búsqueda
- Ver todas las valoraciones de un curso específico

**Por Engagement**:
- Alto (>66)
- Medio (33-66)
- Bajo (<33)

**Por Rating**:
- 5 estrellas
- 4 estrellas
- 3 estrellas
- 2 estrellas
- 1 estrella

**Por Fecha**:
- Orden descendente (más recientes primero)

#### 3. **Estadísticas Globales**

En la parte superior del panel:

```
┌─────────────────────────────────────────────────────┐
│  Total Valoraciones    Rating Promedio    Engagement │
│        124                  4.2 ⭐           62%     │
└─────────────────────────────────────────────────────┘
```

#### 4. **Visualización Detallada**

Cada valoración muestra:

```
┌────────────────────────────────────────────────────────────┐
│ 📚 Curso: Educación Básica para Perros Adultos           │
│ 👤 Usuario: usuario@email.com                             │
│                                                            │
│ ⭐ Rating Global: 4.5 estrellas                           │
│   • Dificultad: ⭐⭐⭐⭐☆                                   │
│   • Comprensión: ⭐⭐⭐⭐⭐                                  │
│   • Duración: ⭐⭐⭐⭐☆                                      │
│   • Test: ⭐⭐⭐⭐⭐                                         │
│                                                            │
│ 🎯 Engagement: 🟢 Alto (85/100)                           │
│   • Lecciones: 15/15 (100%)                               │
│   • Tests: 1/1 aprobado                                   │
│                                                            │
│ 💬 Comentario:                                            │
│ "Excelente curso, muy bien explicado y útil. Los tests   │
│  ayudan a reforzar el aprendizaje."                       │
│                                                            │
│ 📅 Fecha: 14 Enero 2026                                   │
└────────────────────────────────────────────────────────────┘
```

#### 5. **Integración en Dashboard Principal**

En `/administrator`:

```
┌───────────────────────────────────────────┐
│ ⭐ Valoraciones                           │
│    124 valoraciones                       │
│    Rating promedio: 4.2 ⭐               │
│                                           │
│    [Ver todas las valoraciones →]        │
└───────────────────────────────────────────┘
```

---

## 🗄️ Base de Datos

### Tabla `course_reviews`

```sql
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Ratings individuales (1-5)
  rating_difficulty INT NOT NULL CHECK (rating_difficulty BETWEEN 1 AND 5),
  rating_comprehension INT NOT NULL CHECK (rating_comprehension BETWEEN 1 AND 5),
  rating_duration INT NOT NULL CHECK (rating_duration BETWEEN 1 AND 5),
  rating_test_difficulty INT NOT NULL CHECK (rating_test_difficulty BETWEEN 1 AND 5),
  
  -- Rating global automático
  overall_rating NUMERIC(3,2) NOT NULL,
  
  -- Comentario opcional
  comment TEXT,
  
  -- Engagement score automático (0-100)
  user_engagement_score INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(course_id, user_id)  -- Una valoración por usuario por curso
);
```

### Índices

```sql
CREATE INDEX idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_user_id ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_overall_rating ON course_reviews(overall_rating);
CREATE INDEX idx_course_reviews_engagement ON course_reviews(user_engagement_score);
CREATE INDEX idx_course_reviews_created_at ON course_reviews(created_at DESC);
```

### Políticas RLS

```sql
-- Usuarios pueden ver sus propias valoraciones
CREATE POLICY "users_view_own_reviews"
ON course_reviews FOR SELECT
USING (auth.uid() = user_id);

-- Usuarios pueden insertar valoraciones en cursos que compraron
CREATE POLICY "users_insert_own_reviews"
ON course_reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM course_purchases
    WHERE course_id = course_reviews.course_id
    AND user_id = auth.uid()
  )
);

-- Usuarios pueden actualizar sus propias valoraciones
CREATE POLICY "users_update_own_reviews"
ON course_reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Admins pueden ver todo (mediante function, no policy directa)
```

### Triggers Automáticos

#### 1. **Calcular Rating Global**

```sql
CREATE OR REPLACE FUNCTION calculate_overall_rating()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_rating := (
    NEW.rating_difficulty +
    NEW.rating_comprehension +
    NEW.rating_duration +
    NEW.rating_test_difficulty
  )::NUMERIC / 4;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_or_update_course_review
BEFORE INSERT OR UPDATE ON course_reviews
FOR EACH ROW
EXECUTE FUNCTION calculate_overall_rating();
```

#### 2. **Calcular Engagement Score**

```sql
CREATE OR REPLACE FUNCTION update_review_engagement()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_engagement_score := calculate_user_engagement(NEW.user_id, NEW.course_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_or_update_review_engagement
BEFORE INSERT OR UPDATE ON course_reviews
FOR EACH ROW
EXECUTE FUNCTION update_review_engagement();
```

---

## 🧮 Función de Engagement

### `calculate_user_engagement(user_id, course_id)`

**Propósito**: Calcular el score de engagement (0-100) basado en actividad real.

**Lógica**:

```sql
CREATE OR REPLACE FUNCTION calculate_user_engagement(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_lessons INTEGER := 0;
  v_completed_lessons INTEGER := 0;
  v_total_tests INTEGER := 0;
  v_passed_tests INTEGER := 0;
  v_lesson_score INTEGER := 0;
  v_test_score INTEGER := 0;
  v_final_score INTEGER := 0;
BEGIN
  -- 1. Total lecciones del curso
  SELECT COUNT(*) INTO v_total_lessons
  FROM course_lessons
  WHERE course_id = p_course_id;

  -- 2. Lecciones completadas por el usuario
  SELECT COUNT(DISTINCT ulp.lesson_id) INTO v_completed_lessons
  FROM user_lesson_progress ulp
  JOIN course_lessons cl ON ulp.lesson_id = cl.id
  WHERE cl.course_id = p_course_id
    AND ulp.user_id = p_user_id
    AND ulp.completed = true;

  -- 3. Total tests del curso (= número de módulos con test publicado)
  SELECT COUNT(*) INTO v_total_tests
  FROM module_tests mt
  JOIN course_modules cm ON mt.module_id = cm.id
  WHERE cm.course_id = p_course_id
    AND mt.is_published = true;

  -- 4. Tests aprobados por el usuario
  SELECT COUNT(DISTINCT uta.test_id) INTO v_passed_tests
  FROM user_test_attempts uta
  JOIN module_tests mt ON uta.test_id = mt.id
  JOIN course_modules cm ON mt.module_id = cm.id
  WHERE cm.course_id = p_course_id
    AND uta.user_id = p_user_id
    AND uta.passed = true;

  -- 📊 CALCULAR PUNTUACIONES
  -- Lecciones: 50% del engagement
  IF v_total_lessons > 0 THEN
    v_lesson_score := (v_completed_lessons::NUMERIC / v_total_lessons * 50)::INTEGER;
  END IF;

  -- Tests: 50% del engagement
  IF v_total_tests > 0 THEN
    v_test_score := (v_passed_tests::NUMERIC / v_total_tests * 50)::INTEGER;
  END IF;

  -- ENGAGEMENT FINAL (0-100)
  v_final_score := v_lesson_score + v_test_score;

  RETURN GREATEST(0, LEAST(100, v_final_score));
END;
$$;
```

**Ejemplo de Cálculo**:

```
Curso: "Educación Básica para Perros Adultos"
- Total lecciones: 15
- Lecciones completadas: 15
- Total tests: 1
- Tests aprobados: 1

Cálculo:
- Lesson score = (15/15 * 50) = 50
- Test score = (1/1 * 50) = 50
- Engagement = 50 + 50 = 100

✅ Engagement: 100/100 (Alto)
```

---

## 🖥️ Frontend

### `components/courses/CourseReviewModal.tsx`

**Props**:

```typescript
interface CourseReviewModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
  userId: string
  onReviewSubmitted?: () => void
}
```

**Estado**:

```typescript
const [ratings, setRatings] = useState({
  difficulty: 3,
  comprehension: 3,
  duration: 3,
  testDifficulty: 3
})
const [comment, setComment] = useState('')
const [loading, setLoading] = useState(false)
const [existingReview, setExistingReview] = useState<CourseReview | null>(null)
```

**Flujo de Uso**:

1. **Al abrir modal**:
   - Cargar valoración existente (si existe)
   - Precargar valores o usar defaults (3 estrellas)

2. **Interacción**:
   - Usuario ajusta estrellas por criterio (1-5)
   - Usuario añade comentario opcional
   - Sistema valida que todos los campos obligatorios estén completos

3. **Al guardar**:
   - Si existe valoración previa → `UPDATE`
   - Si no existe → `INSERT`
   - Backend calcula automáticamente:
     - `overall_rating` = promedio de 4 ratings
     - `user_engagement_score` = función `calculate_user_engagement()`

4. **Después de guardar**:
   - Mostrar toast de éxito
   - Cerrar modal
   - Refrescar lista de cursos (callback `onReviewSubmitted`)

**Validaciones**:

```typescript
const isValid = 
  ratings.difficulty > 0 &&
  ratings.comprehension > 0 &&
  ratings.duration > 0 &&
  ratings.testDifficulty > 0
```

---

## 🎛️ Panel de Administración

### `/administrator/valoraciones/page.tsx`

**Funcionalidades**:

#### 1. **Cargar Valoraciones**

```typescript
const { data: reviews } = await supabase
  .rpc('get_all_reviews_admin')

// reviews: CourseReviewAdmin[]
```

**Tipo `CourseReviewAdmin`**:

```typescript
interface CourseReviewAdmin {
  id: string
  course_id: string
  course_title: string
  user_id: string
  user_email: string
  overall_rating: number
  rating_difficulty: number
  rating_comprehension: number
  rating_duration: number
  rating_test_difficulty: number
  comment: string | null
  user_engagement_score: number
  completed_lessons: number
  total_lessons: number
  tests_attempted: number
  tests_passed: number
  created_at: string
}
```

#### 2. **Filtros**

**Por Curso**:

```typescript
const filteredByCourse = selectedCourse === 'all'
  ? reviews
  : reviews.filter(r => r.course_id === selectedCourse)
```

**Por Engagement**:

```typescript
const engagementLevels = {
  all: () => true,
  high: (r) => r.user_engagement_score > 66,
  medium: (r) => r.user_engagement_score >= 33 && r.user_engagement_score <= 66,
  low: (r) => r.user_engagement_score < 33
}
```

**Por Rating**:

```typescript
const filteredByRating = selectedRating === 'all'
  ? reviews
  : reviews.filter(r => Math.round(r.overall_rating) === parseInt(selectedRating))
```

#### 3. **Visualización**

**Tabla Responsiva**:

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">
    <thead>
      <tr>
        <th>Curso</th>
        <th>Usuario</th>
        <th>Rating</th>
        <th>Engagement</th>
        <th>Progreso</th>
        <th>Tests</th>
        <th>Comentario</th>
        <th>Fecha</th>
      </tr>
    </thead>
    <tbody>
      {filteredReviews.map(review => (
        <tr key={review.id}>
          {/* ... */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Badge de Engagement**:

```tsx
const getEngagementBadge = (score: number) => {
  if (score > 66) return { color: 'green', label: 'Alto', icon: '🟢' }
  if (score >= 33) return { color: 'yellow', label: 'Medio', icon: '🟡' }
  return { color: 'red', label: 'Bajo', icon: '🔴' }
}
```

#### 4. **Estadísticas**

```typescript
const stats = {
  totalReviews: reviews.length,
  averageRating: (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1),
  averageEngagement: Math.round(reviews.reduce((sum, r) => sum + r.user_engagement_score, 0) / reviews.length)
}
```

---

## 📦 Instalación

### 1. **Ejecutar Script SQL**

En **Supabase SQL Editor**:

```bash
# Ejecutar archivo
supabase/course_reviews_system.sql
```

**Contenido del script**:

```sql
-- 1. Crear tabla
CREATE TABLE course_reviews (...);

-- 2. Crear índices
CREATE INDEX ...;

-- 3. Habilitar RLS
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas
CREATE POLICY ...;

-- 5. Crear funciones
CREATE FUNCTION calculate_user_engagement(...);
CREATE FUNCTION get_all_reviews_admin();
CREATE FUNCTION get_course_review_stats(UUID);
CREATE FUNCTION get_overall_review_stats();

-- 6. Crear triggers
CREATE TRIGGER ...;
```

### 2. **Verificar Instalación**

```sql
-- Verificar tabla
SELECT * FROM course_reviews LIMIT 0;

-- Verificar funciones
SELECT proname FROM pg_proc WHERE proname LIKE '%review%';

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'course_reviews';
```

### 3. **Integrar Frontend**

**En tu código React**:

```typescript
// 1. Importar funciones
import { getUserReview, createReview, updateReview } from '@/lib/supabase/reviews'

// 2. Integrar modal en página de cursos
<CourseReviewModal
  isOpen={isReviewModalOpen}
  onClose={() => setIsReviewModalOpen(false)}
  courseId={course.id}
  courseTitle={course.title}
  userId={user.id}
  onReviewSubmitted={refreshCourses}
/>
```

### 4. **Añadir Pestaña en Admin**

**En `app/administrator/layout.tsx`**:

```tsx
const tabs = [
  { name: 'Dashboard', href: '/administrator' },
  { name: 'Usuarios', href: '/administrator/usuarios' },
  { name: 'Cursos', href: '/administrator/cursos' },
  { name: 'Tests', href: '/administrator/tests' },
  { name: 'Valoraciones', href: '/administrator/valoraciones' }, // ⭐ NUEVO
  { name: 'Contactos', href: '/administrator/contactos' },
]
```

---

## 💡 Casos de Uso

### Caso 1: Estudiante Valora Curso Completado

**Escenario**: María ha completado "Educación Básica para Perros Adultos" (15 lecciones + 1 test aprobado).

**Flujo**:

1. María va a `/cursos/mi-escuela`
2. Ve su curso con botón "⭐ Valorar curso"
3. Abre modal y califica:
   - Dificultad: ⭐⭐⭐⭐☆ (4)
   - Comprensión: ⭐⭐⭐⭐⭐ (5)
   - Duración: ⭐⭐⭐⭐☆ (4)
   - Test: ⭐⭐⭐⭐⭐ (5)
4. Añade comentario: "Excelente curso, muy bien explicado."
5. Guarda valoración

**Resultado Backend**:

```sql
INSERT INTO course_reviews (
  course_id,
  user_id,
  rating_difficulty = 4,
  rating_comprehension = 5,
  rating_duration = 4,
  rating_test_difficulty = 5,
  overall_rating = 4.5,  -- Calculado automáticamente
  comment = "Excelente curso...",
  user_engagement_score = 100  -- 15/15 lecciones + 1/1 test
)
```

**Visible en Admin**:

```
┌─────────────────────────────────────────────────────────┐
│ Curso: Educación Básica para Perros Adultos           │
│ Usuario: maria@email.com                               │
│ Rating: 4.5 ⭐ | Engagement: 🟢 Alto (100/100)        │
│ Progreso: 15/15 lecciones | Tests: 1/1 aprobado       │
│ "Excelente curso, muy bien explicado."                │
└─────────────────────────────────────────────────────────┘
```

---

### Caso 2: Admin Identifica Curso con Bajo Rating

**Escenario**: El curso "Obediencia Avanzada" tiene rating promedio de 2.8 ⭐.

**Flujo**:

1. Admin va a `/administrator/valoraciones`
2. Filtra por curso: "Obediencia Avanzada"
3. Ve valoraciones con bajo rating
4. Analiza comentarios:
   - "Muy difícil de seguir"
   - "Necesita más ejemplos prácticos"
   - "Las lecciones son muy densas"
5. Nota que usuarios con alto engagement (completaron todo) valoran mejor
6. Usuarios con bajo engagement (abandonaron) tienen peor opinión

**Acción**:

- Revisar contenido del curso
- Simplificar explicaciones
- Añadir más ejemplos prácticos
- Dividir lecciones largas

---

### Caso 3: Segmentar por Engagement

**Escenario**: Admin quiere ver solo valoraciones de usuarios comprometidos.

**Flujo**:

1. Admin va a `/administrator/valoraciones`
2. Filtra por "Engagement: Alto (>66)"
3. Ve valoraciones de usuarios que:
   - Completaron la mayoría de lecciones
   - Aprobaron tests
   - Dedicaron tiempo al curso
4. Estas valoraciones tienen más peso para decisiones

**Resultado**:

```
🟢 Alto Engagement (85+): 45 valoraciones | Promedio 4.6 ⭐
🟡 Medio Engagement (33-66): 62 valoraciones | Promedio 3.8 ⭐
🔴 Bajo Engagement (<33): 17 valoraciones | Promedio 2.1 ⭐
```

**Interpretación**:

- Usuarios comprometidos aman el curso (4.6 ⭐)
- Usuarios pasivos lo valoran peor (2.1 ⭐)
- Posible razón: El curso requiere dedicación para apreciarlo

---

## 🚀 Beneficios del Sistema

### Para Estudiantes

- ✅ **Voz valorada**: Su opinión ayuda a mejorar los cursos
- ✅ **Experiencia personalizada**: Futuros cursos se ajustan según feedback
- ✅ **Transparencia**: Ven que su progreso y esfuerzo se reconocen

### Para Administradores

- ✅ **Feedback continuo**: Saber qué funciona y qué no
- ✅ **Segmentación inteligente**: Valoraciones de usuarios activos tienen más peso
- ✅ **Detección temprana**: Identificar cursos problemáticos rápido
- ✅ **Métricas accionables**: Engagement score guía decisiones
- ✅ **Mejora continua**: Ajustar contenido basado en datos reales

### Para el Negocio

- ✅ **Calidad mejorada**: Cursos se refinan constantemente
- ✅ **Retención aumentada**: Estudiantes satisfechos completan más cursos
- ✅ **Credibilidad**: Ratings altos atraen nuevos estudiantes
- ✅ **ROI medible**: Engagement score indica efectividad de cursos

---

## 📊 Métricas Clave

### KPIs del Sistema

| Métrica | Descripción | Objetivo |
|---------|-------------|----------|
| **Tasa de Valoración** | % de estudiantes que valoran | >60% |
| **Rating Promedio** | Promedio de todas las valoraciones | >4.0 ⭐ |
| **Engagement Promedio** | Score promedio de usuarios activos | >70 |
| **Valoraciones Alto Engagement** | % de valoraciones de usuarios comprometidos | >50% |
| **Respuesta a Feedback** | Tiempo para ajustar cursos según feedback | <30 días |

---

## 🔧 Troubleshooting

### Problema 1: Engagement Score = 0

**Síntoma**: Todas las valoraciones muestran engagement 0.

**Causas**:
- Función `calculate_user_engagement()` no está creada
- Trigger no está ejecutándose
- Usuario no tiene progreso registrado

**Solución**:

```sql
-- 1. Verificar función
SELECT proname FROM pg_proc WHERE proname = 'calculate_user_engagement';

-- 2. Verificar trigger
SELECT * FROM pg_trigger WHERE tgname LIKE '%engagement%';

-- 3. Recalcular manualmente
UPDATE course_reviews cr
SET user_engagement_score = calculate_user_engagement(cr.user_id, cr.course_id);
```

---

### Problema 2: Estudiante No Puede Valorar

**Síntoma**: Error al intentar guardar valoración.

**Causas**:
- No ha comprado el curso
- Política RLS mal configurada

**Solución**:

```sql
-- Verificar compra
SELECT * FROM course_purchases
WHERE user_id = 'USER_ID' AND course_id = 'COURSE_ID';

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'course_reviews';
```

---

### Problema 3: Admin No Ve Valoraciones

**Síntoma**: Panel de valoraciones vacío para admin.

**Causas**:
- Función `get_all_reviews_admin()` no existe
- Error en RPC call

**Solución**:

```sql
-- Verificar función
SELECT * FROM get_all_reviews_admin();

-- Si hay error, recrear función
DROP FUNCTION IF EXISTS get_all_reviews_admin();
-- Ejecutar script completo
```

---

## 📚 Recursos Adicionales

### Archivos Relacionados

- `supabase/course_reviews_system.sql` - Script SQL completo
- `lib/supabase/reviews.ts` - Funciones de gestión
- `components/courses/CourseReviewModal.tsx` - Modal de valoración
- `app/administrator/valoraciones/page.tsx` - Panel admin

### Documentación Externa

- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## ✅ Checklist de Implementación

- [x] Crear tabla `course_reviews` en Supabase
- [x] Crear índices para optimización
- [x] Configurar políticas RLS
- [x] Crear función `calculate_user_engagement()`
- [x] Crear función `get_all_reviews_admin()`
- [x] Crear triggers automáticos
- [x] Crear componente `CourseReviewModal.tsx`
- [x] Crear página admin `/administrator/valoraciones`
- [x] Integrar en dashboard principal
- [x] Añadir pestaña "Valoraciones" en layout admin
- [x] Crear funciones de gestión en `reviews.ts`
- [x] Integrar en dashboard de estudiante
- [x] Añadir estadísticas en dashboard admin
- [x] Testing end-to-end
- [x] Documentación completa

---

**Última actualización**: 14 Enero 2026  
**Versión**: 1.0.0  
**Estado**: ✅ Implementado y documentado

---

## 🎉 Conclusión

El **Sistema de Valoraciones de Cursos** de Hakadogs proporciona una herramienta poderosa para:

- **Estudiantes**: Expresar su opinión y sentirse valorados
- **Administradores**: Tomar decisiones basadas en datos reales
- **Negocio**: Mejorar continuamente la calidad de los cursos

La combinación de **rating multi-criterio** + **engagement score automático** + **filtros avanzados** crea un sistema robusto que va más allá de simples estrellas, proporcionando insights accionables para el crecimiento del negocio.

🚀 **¡Sistema listo para producción!**
