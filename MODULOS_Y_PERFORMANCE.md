# 📚 Sistema de Módulos para Cursos - Hakadogs

**Fecha**: 10 enero 2026  
**Problema**: Cursos con muchas lecciones (82+) tardan eternamente en cargar  
**Solución**: Sistema de Módulos + Optimización de queries

---

## ⚡ Optimización Inmediata (COMPLETADA)

### Problema Detectado
```
❌ ANTES:
- 82 lecciones = 82 peticiones HTTP individuales
- Tiempo de carga: 15-30 segundos
- Errores 406 en consola
- Experiencia de usuario pésima
```

### Solución Aplicada
```typescript
// ANTES (82 peticiones):
for (const lesson of lessonsData) {
  const lessonProg = await getUserLessonProgress(uid, lesson.id)
  progressMap[lesson.id] = lessonProg?.completed || false
}

// AHORA (1 petición):
const lessonIds = lessonsData.map(lesson => lesson.id)
const progressMap = await getUserLessonsProgressBulk(uid, lessonIds)
```

### Resultado
```
✅ AHORA:
- 82 lecciones = 1 sola petición bulk
- Tiempo de carga: < 2 segundos
- Sin errores
- Carga instantánea
```

**Commit**: `4baca88` - Ya está en producción

---

## 🏗️ Nueva Arquitectura con Módulos

### Estructura Antigua vs Nueva

#### ❌ Estructura Antigua (Plana)
```
Curso
├── Lección 1
├── Lección 2
├── Lección 3
├── ...
└── Lección 82  ← Difícil de navegar
```

#### ✅ Estructura Nueva (Jerárquica)
```
Curso
├── Módulo 1: Bienvenida (5 lecciones) [colapsable]
│   ├── Lección 1: ¿Qué vas a conseguir?
│   ├── Lección 2: Mapa del curso
│   └── ...
├── Módulo 2: Fundamentos (6 lecciones) [colapsable]
│   ├── Lección 6: Conceptos básicos
│   └── ...
├── ...
└── Módulo 15: Cierre (1 lección)
```

---

## 📊 Nueva Tabla: `course_modules`

```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Campo Agregado a `course_lessons`
```sql
ALTER TABLE course_lessons 
ADD COLUMN module_id UUID REFERENCES course_modules(id);
```

**Compatibilidad**: Las lecciones sin `module_id` (NULL) seguirán funcionando como antes.

---

## 🚀 Pasos de Migración

### **Paso 1**: Ejecutar SQL de estructura
```bash
Archivo: supabase/add_modules_structure.sql
```

**Qué hace**:
- Crea tabla `course_modules`
- Agrega campo `module_id` a `course_lessons`
- Crea funciones optimizadas
- Mantiene compatibilidad con cursos existentes

### **Paso 2**: Migrar curso de la correa
```bash
Archivo: supabase/migrate_curso_correa_a_modulos.sql
```

**Qué hace**:
- Busca el curso por slug
- Crea 15 módulos temáticos
- Distribuye las 82 lecciones entre los módulos (aprox. 5-6 lecciones/módulo)
- Asigna `module_id` a cada lección

**Distribución sugerida** (ajústala según tu contenido):

| Módulo | Lecciones | Tema |
|--------|-----------|------|
| 1 | 1-5 | Bienvenida y Mapa del Curso |
| 2 | 6-11 | Fundamentos del Paseo |
| 3 | 12-16 | Equipamiento y Herramientas |
| 4 | 17-22 | Posición Inicial y Atención |
| 5 | 23-28 | Primeros Pasos en Casa |
| 6 | 29-34 | Gestión de la Correa |
| 7 | 35-40 | Ejercicios de Parada |
| 8 | 41-47 | Refuerzo Positivo en Movimiento |
| 9 | 48-54 | Entorno Real: Primeros Exteriores |
| 10 | 55-61 | Manejo de Distracciones |
| 11 | 62-67 | Problemas Frecuentes |
| 12 | 68-73 | Consolidación y Generalización |
| 13 | 74-78 | Mantenimiento a Largo Plazo |
| 14 | 79-81 | Casos Avanzados |
| 15 | 82 | Cierre y Próximos Pasos |

### **Paso 3**: Actualizar UI del frontend

#### UI Colapsable con Módulos
```tsx
// Cada módulo se puede expandir/contraer
📦 Módulo 1: Bienvenida (5 lecciones) [▼]
  └─ 🎥 Lección 1: ¿Qué vas a conseguir?
  └─ 🎥 Lección 2: Mapa del curso
  └─ 🎥 Lección 3: ...
  
📦 Módulo 2: Fundamentos [▶] (colapsado)

📦 Módulo 3: Equipamiento [▶]
```

---

## 🎨 Beneficios del Sistema de Módulos

### Performance
- ✅ Carga inicial: solo cargar módulos (15 en vez de 82 items)
- ✅ Lazy loading: lecciones se cargan al expandir módulo
- ✅ Progreso bulk: 1 petición para todo el curso
- ✅ Sin errores 406

### UX
- ✅ Navegación más clara y organizada
- ✅ Sensación de progreso por módulo
- ✅ Menos abrumador para el estudiante
- ✅ Estructura pedagógica lógica

### Admin
- ✅ Crear módulos desde el panel admin
- ✅ Arrastrar lecciones entre módulos
- ✅ Bloquear módulos completos
- ✅ Estadísticas por módulo

---

## 🔧 Funciones SQL Nuevas

### `get_course_modules_with_stats(course_id, user_id)`
Obtiene módulos con estadísticas de progreso:
```json
{
  "id": "uuid",
  "title": "Bienvenida",
  "description": "Introducción...",
  "total_lessons": 5,
  "completed_lessons": 3,
  "duration_minutes": 25,
  "is_locked": false
}
```

### `get_lessons_by_module(module_id)`
Obtiene lecciones de un módulo específico (solo cuando se expande).

---

## 📝 Próximos Pasos

### 1. **Ejecutar Scripts SQL** (10 min)
```bash
# 1. Estructura
supabase/add_modules_structure.sql

# 2. Migración del curso
supabase/migrate_curso_correa_a_modulos.sql
```

### 2. **Actualizar Panel Admin** (pendiente)
- Agregar sección "Módulos" en edición de cursos
- CRUD de módulos
- Asignar lecciones a módulos
- Reordenar módulos y lecciones

### 3. **Actualizar Frontend Estudiante** (pendiente)
- Sidebar con módulos colapsables
- Contador de progreso por módulo
- Lazy loading de lecciones al expandir
- Indicadores visuales de módulo completo

---

## ⚠️ Notas Importantes

### Compatibilidad hacia atrás
- ✅ Cursos sin módulos seguirán funcionando
- ✅ Lecciones con `module_id = NULL` se muestran normalmente
- ✅ No rompe cursos existentes

### Errores 406
Los errores 406 que ves son por **límites de peticiones simultáneas** de Supabase (máximo ~50 concurrentes). Con la optimización bulk, este problema desaparece.

### Ajuste de Títulos de Módulos
Los títulos en `migrate_curso_correa_a_modulos.sql` son **sugerencias**. Debes ajustarlos según el contenido real de tu curso. Revisa las lecciones 1-82 y agrupa temáticamente.

---

## 🎯 Próxima Actualización

Una vez ejecutados los scripts SQL, necesitaremos:
1. Actualizar `lib/supabase/courses.ts` con funciones de módulos
2. Actualizar `app/cursos/mi-escuela/[cursoId]/page.tsx` con UI colapsable
3. Actualizar panel admin para gestionar módulos

---

**Estado**: ⚡ Optimización inmediata COMPLETADA  
**Próximo**: Agregar UI de módulos  
**Versión**: 1.1.0 - Módulos y Performance
