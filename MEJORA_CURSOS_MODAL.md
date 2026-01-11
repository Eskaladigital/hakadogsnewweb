# Mejora en Página de Cursos - Modal con Ficha Completa

## Problema Resuelto

Las descripciones generadas por IA en las tarjetas de cursos tenían longitudes variables, lo que causaba que las tarjetas tuvieran diferentes alturas y se viera descompensado el diseño.

## Solución Implementada

### 1. Limitación de Caracteres en Tarjetas

- Las descripciones en las tarjetas ahora están limitadas a **150 caracteres**
- Se agregó `line-clamp-3` para mantener máximo 3 líneas de texto
- Se muestra "..." cuando la descripción es más larga

### 2. Botón "Ver más detalles"

Cada tarjeta de curso ahora incluye un botón "Ver más detalles" con el icono de información (`Info`) que:
- Abre un modal con la ficha completa del curso
- Carga automáticamente el temario completo del curso
- Mantiene las tarjetas con altura uniforme

### 3. Modal con Ficha Completa del Curso

El modal incluye toda la información del curso organizada de forma profesional:

#### a) Badges Informativos
- **Nivel de dificultad** (Básico/Intermedio/Avanzado) con colores diferenciados
- **Duración total** del curso en minutos
- **Número de lecciones** totales

#### b) Sección de Precio
- Precio destacado en grande
- Indicador de "pago único"
- Texto de "Acceso de por vida"
- Botón de compra prominente

#### c) Descripción Completa
- Muestra la descripción completa del curso sin límite de caracteres
- Renderizado HTML completo con formato

#### d) "Qué Aprenderás"
- Lista de objetivos de aprendizaje
- Diseño en grid de 2 columnas
- Checks verdes para cada punto
- Fondo gris claro para destacar cada item

#### e) Temario del Curso
- Listado completo de todas las lecciones
- Numeración secuencial
- Duración de cada lección
- Badge de "Vista previa gratuita" cuando aplica
- Indicador de carga mientras obtiene las lecciones
- Mensaje informativo si no hay lecciones

#### f) CTA Final
- Banner verde con degradado
- Título motivacional "¿Listo para empezar?"
- Botón de compra con precio
- Texto de beneficios (acceso de por vida, actualizaciones)

## Archivos Modificados

### `/app/cursos/page.tsx`

**Importaciones añadidas:**
```typescript
import { getCourseLessons } from '@/lib/supabase/courses'
import type { Lesson } from '@/lib/supabase/courses'
import Modal from '@/components/ui/Modal'
import { Info, GraduationCap, Target, PlayCircle } from 'lucide-react'
```

**Estados nuevos:**
```typescript
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
const [courseLessons, setCourseLessons] = useState<Lesson[]>([])
const [loadingLessons, setLoadingLessons] = useState(false)
```

**Funciones nuevas:**
- `handleOpenCourseModal(curso: Course)`: Abre modal y carga lecciones
- `handleCloseCourseModal()`: Cierra modal y limpia datos
- `truncateDescription(html: string | null, maxLength: number)`: Trunca HTML a texto plano

## Beneficios

1. ✅ **Diseño Uniforme**: Todas las tarjetas tienen la misma altura
2. ✅ **Mejor UX**: Los usuarios pueden ver detalles completos sin salir de la página
3. ✅ **Información Completa**: El modal muestra todo: precio, temario, objetivos, duración
4. ✅ **Mejor Conversión**: Dos botones de compra (modal y tarjeta) facilitan la decisión
5. ✅ **Profesional**: El modal tiene un diseño limpio y bien organizado
6. ✅ **Responsive**: Funciona bien en móviles y escritorio
7. ✅ **Performance**: Las lecciones se cargan solo al abrir el modal

## Tecnologías Utilizadas

- **React Hooks**: useState, useEffect
- **Framer Motion**: Para animaciones suaves
- **Lucide Icons**: Para iconografía consistente
- **Tailwind CSS**: Para estilos responsive
- **Supabase**: Para obtener datos del curso y lecciones

## Uso

1. El usuario ve las tarjetas de cursos con descripciones cortas
2. Hace clic en "Ver más detalles"
3. Se abre el modal con toda la información del curso
4. Puede ver el temario completo, objetivos y precio
5. Puede comprar directamente desde el modal o cerrar para seguir explorando

## Próximas Mejoras Potenciales

- [ ] Agregar vista previa de video del curso en el modal
- [ ] Incluir reseñas/testimonios en el modal
- [ ] Agregar botón de compartir curso
- [ ] Permitir marcar cursos como favoritos
- [ ] Agregar comparador de cursos

---

**Fecha de implementación**: 11 de Enero de 2026  
**Desarrollado por**: Asistente IA - Cursor  
**Versión**: 1.0
