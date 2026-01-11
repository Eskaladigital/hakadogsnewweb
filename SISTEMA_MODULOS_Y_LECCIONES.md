# 📚 Sistema de Módulos y Lecciones - Hakadogs

**Versión**: 2.2.0  
**Fecha**: Enero 2026  
**Estado**: ✅ Implementado y Operativo

---

## 🎯 Resumen

Sistema completo de organización jerárquica de cursos mediante **módulos** y **lecciones**, permitiendo una estructura ordenada y profesional para los cursos online de Hakadogs.

---

## 📊 Estructura Jerárquica

```
🎓 CURSO
  ├── 📂 Módulo 1: Bienvenida y Mapa del Curso
  │   ├── 📄 Lección 1.1: Qué vas a conseguir en 45-60 minutos
  │   ├── 📄 Lección 1.2: Caminar sin tirar a nivel funcional
  │   ├── 📄 Lección 1.3: Objetivos realistas por niveles
  │   └── 📄 Lección 1.4: Las 3 piezas BE HAKA
  │
  ├── 📂 Módulo 2: Fundamentos del Paseo
  │   ├── 📄 Lección 2.1: ...
  │   ├── 📄 Lección 2.2: ...
  │   └── 📄 Lección 2.3: ...
  │
  └── 📂 Módulo 3: Técnicas Avanzadas
      ├── 📄 Lección 3.1: ...
      └── 📄 Lección 3.2: ...
```

---

## 🔧 Funcionalidades del Panel Administrativo

### 1️⃣ Pestaña "Información del Curso"

- ✅ Título del curso
- ✅ Descripción corta (con generación IA)
- ✅ "Qué aprenderás" (dinámico)
- ✅ Precio y dificultad
- ✅ Estado de publicación

### 2️⃣ Pestaña "Módulos"

#### Gestión de Módulos:
- ✅ **Crear nuevos módulos**
  - Título y descripción
  - Orden automático
  
- ✅ **Editar módulos existentes**
  - Cambiar título/descripción
  - Reordenar con drag & drop
  
- ✅ **Eliminar módulos**
  - Confirmación de seguridad
  - Las lecciones pasan a "Sin asignar"

#### Visualización:
- ✅ Lista de módulos ordenada
- ✅ Contador de lecciones por módulo
- ✅ Lecciones desplegables dentro de cada módulo
- ✅ Botón "Quitar del módulo" para reasignar

### 3️⃣ Pestaña "Lecciones"

#### Vista Agrupada:
```
┌─────────────────────────────────────────────┐
│ ⚠️ Sin asignar a módulo (5)                 │
│ [Fondo amarillo/ámbar]                      │
│ ├─ Lección A                                │
│ ├─ Lección B                                │
│ └─ Lección C                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📂 Módulo 1: Bienvenida (6 lecciones)      │
│ [Fondo verde claro]                         │
│ ├─ Lección 1.1: Qué vas a conseguir...     │
│ ├─ Lección 1.2: Caminar sin tirar...       │
│ └─ ...                                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📂 Módulo 2: Fundamentos (15 lecciones)    │
│ ├─ Lección 2.1: ...                         │
│ └─ ...                                       │
└─────────────────────────────────────────────┘
```

#### Características de Lecciones:
- ✅ **Desplegable de asignación de módulo**
  - "Sin módulo"
  - "Módulo 1: Título del módulo"
  - "Módulo 2: Título del módulo"
  - etc.

- ✅ **Badges visuales**
  - ⚠️ "Sin módulo" (amarillo) - si hay módulos creados
  - ✅ "Vista previa" (verde) - lección gratis

- ✅ **Edición completa**
  - Título
  - Duración
  - Video/Audio
  - Contenido HTML
  - Recursos descargables

- ✅ **Reordenamiento**
  - Botones ↑ ↓
  - El orden se respeta en el front

---

## 🚨 Sistema de Advertencias

### Advertencias Visuales:

1. **Banner superior (pestaña Lecciones)**
   ```
   ⚠️ 5 lecciones pendientes de asignar a un módulo
   
   Este curso tiene módulos creados. Por favor, asigna cada 
   lección a un módulo para mantener la organización del curso.
   ```

2. **Badge en cada lección sin asignar**
   ```
   ⚠️ Sin módulo
   ```

3. **Contador en Sidebar**
   ```
   Resumen:
   Lecciones: 82
   Duración total: 410 min
   ⚠️ Sin módulo: 5
   ```

4. **Diálogo de confirmación al guardar**
   ```
   ⚠️ ADVERTENCIA:
   
   Hay 5 lecciones sin asignar a ningún módulo.
   
   Estas lecciones NO se mostrarán en el curso hasta que 
   las asignes a un módulo.
   
   ¿Deseas guardar de todas formas?
   
   [Cancelar] [Aceptar]
   ```

### Comportamiento:
- Solo se muestran advertencias si el curso **tiene módulos creados**
- Si no hay módulos, las lecciones se muestran normalmente (sin advertencias)
- El administrador puede guardar con lecciones sin asignar (pero recibe advertencia)

---

## 👨‍🎓 Vista del Alumno (Frontend)

### Navegación Mejorada:

1. **Breadcrumb jerárquico tipo árbol**
   ```
   📚 Curso: Cómo Enseñar a tu Perro a Caminar sin Tirar
       ↓
   📂 Módulo 1: Bienvenida y Mapa del Curso
       ↓
   📄 Lección 1.1: Qué vas a conseguir en 45-60 minutos ← Estás aquí
   ```

2. **Botones de navegación**
   - ← Anterior (lección previa en el mismo módulo o módulo anterior)
   - Siguiente → (siguiente lección o siguiente módulo)
   - Solo se habilita "Siguiente" si la lección actual está completada

3. **Carga dinámica de módulos**
   - Al cambiar de módulo, se cargan sus lecciones automáticamente
   - El módulo se expande automáticamente en el sidebar
   - Navegación fluida entre módulos sin recargar página

4. **Sidebar organizado**
   ```
   📂 Módulo 1: Bienvenida (5 lecciones) [100% completado]
   ├─ ✓ Lección 1.1
   ├─ ✓ Lección 1.2
   └─ ... 
   
   📂 Módulo 2: Fundamentos (15 lecciones) [40% completado]
   ├─ ✓ Lección 2.1
   ├─ 🔒 Lección 2.2 (bloqueada)
   └─ ...
   
   📂 Módulo 3: Avanzado (0% completado) [BLOQUEADO]
   ```

---

## 🗄️ Estructura de Base de Datos

### Tabla `course_modules`
```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla `course_lessons` (campo agregado)
```sql
ALTER TABLE course_lessons ADD COLUMN module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL;
```

### Índices:
```sql
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_lessons_module_id ON course_lessons(module_id);
```

---

## 🎨 Flujo de Trabajo Recomendado

### Crear un curso nuevo con módulos:

1. **Crear el curso** (Pestaña Info)
   - Título, descripción, precio
   - "Qué aprenderás"
   - Guardar

2. **Crear los módulos** (Pestaña Módulos)
   - Módulo 1: Bienvenida
   - Módulo 2: Fundamentos
   - Módulo 3: Avanzado
   - etc.

3. **Crear y asignar lecciones** (Pestaña Lecciones)
   - Crear lección → Asignar a módulo mediante desplegable
   - Repetir para todas las lecciones
   - Verificar que no haya lecciones "Sin asignar"

4. **Guardar el curso**
   - Si hay lecciones sin asignar, aparecerá advertencia
   - Opción de cancelar y revisar, o continuar

### Editar un curso existente:

1. **Reorganizar módulos** (si es necesario)
   - Cambiar orden con drag & drop
   - Editar títulos/descripciones

2. **Reasignar lecciones** (si es necesario)
   - Ir a pestaña Lecciones
   - Usar desplegable en cada lección
   - Ver visualmente la organización por módulos

3. **Guardar cambios**

---

## ✨ Ventajas del Sistema

### Para el Administrador:
- ✅ **Organización visual clara** de todo el curso
- ✅ **Advertencias inteligentes** evitan errores
- ✅ **Vista agrupada** facilita la gestión
- ✅ **Numeración automática** de módulos
- ✅ **Flexibilidad**: cursos con o sin módulos

### Para el Alumno:
- ✅ **Navegación intuitiva** entre módulos
- ✅ **Breadcrumb claro** de ubicación
- ✅ **Progreso por módulo** visible
- ✅ **Carga rápida** con lazy loading
- ✅ **Experiencia profesional** tipo plataformas premium

---

## 🚀 Mejoras Futuras (Roadmap)

- [ ] **Reordenamiento drag & drop de lecciones** dentro de módulos
- [ ] **Duplicar módulos completos** con sus lecciones
- [ ] **Plantillas de módulos** para reutilizar en otros cursos
- [ ] **Módulos opcionales** (no obligatorios para completar el curso)
- [ ] **Certificado por módulo** además del certificado final
- [ ] **Requisitos previos entre módulos** (Módulo 2 requiere completar Módulo 1)

---

## 📞 Soporte

Para cualquier duda sobre el sistema de módulos y lecciones, consultar:
- `README.md` - Documentación general
- `SISTEMA_MODULOS_COMPLETO.md` - Guía detallada de implementación técnica
- Panel administrativo → Ayuda contextual (tooltips)

---

**Última actualización**: Enero 2026  
**Desarrollado por**: Eskala Digital para Hakadogs
