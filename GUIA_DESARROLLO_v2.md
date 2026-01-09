# 🐕 GUÍA DE DESARROLLO - PLATAFORMA HAKADOGS v2.0

**Versión Proyecto:** 1.0.0 PRODUCTION  
**Última actualización:** Enero 2026  
**Versión Guía:** 2.0 - Apps redefinidas  
**Estado:** ✅ DESPLEGADO EN VERCEL

---

## 📋 ÍNDICE

1. [Visión General](#1-visión-general)
2. [Arquitectura del Proyecto](#2-arquitectura-del-proyecto)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estructura de URLs](#4-estructura-de-urls)
5. [Las 3 Apps Principales](#5-las-3-apps-principales)
6. [Base de Datos Completa](#6-base-de-datos-completa)
7. [Estrategia SEO](#7-estrategia-seo)
8. [Roadmap de Desarrollo](#8-roadmap-de-desarrollo)
9. [Monetización](#9-monetización)
10. [Próximos Pasos](#10-próximos-pasos)

---

## 1. VISIÓN GENERAL

### 1.1 Objetivo Principal

Crear una **plataforma digital completa** para Hakadogs que combine:
- ✅ Website corporativo premium con SEO optimizado
- ✅ PWA con **3 apps funcionales** para clientes
- ✅ Sistema de gestión para el educador (Alfredo)
- ✅ Comunidad activa de usuarios
- ✅ Generación automática de contenido SEO

### 1.2 Las 3 Apps

**APP 1: HakaHealth** 🏥  
Salud del perro + historial médico + seguimiento del programa de educación

**APP 2: HakaTrainer** 🎓  
Biblioteca de ejercicios de entrenamiento + juegos + gamificación

**APP 3: HakaCommunity** 🐕‍🦺  
Red social canina + buscar amigos + buscar pareja + eventos + recursos

### 1.3 Diferenciador Clave

**No es solo una web, es un ecosistema digital** que:
1. **Diferencia** a Hakadogs de cualquier competidor en España
2. **Fideliza** a los clientes más allá de las sesiones presenciales
3. **Genera** contenido SEO automáticamente
4. **Crea** una barrera de entrada altísima para competidores
5. **Permite** monetización recurrente

### 1.4 Inspiración

Basado en el modelo de **8patas** (empresa española de apps para perros con AI, IoT, AR) pero adaptado específicamente al mundo de la **educación canina profesional**.

---

## 2. ARQUITECTURA DEL PROYECTO

### 2.1 Estructura de Carpetas

```
hakadogs/
├── app/                          # Next.js 14+ App Router
│   ├── (landing)/               # Rutas públicas
│   │   ├── page.tsx            # Home premium
│   │   ├── servicios/
│   │   ├── sobre-nosotros/
│   │   ├── metodologia/
│   │   ├── blog/
│   │   ├── casos-exito/
│   │   └── contacto/
│   │
│   ├── (apps)/                  # Las 3 apps principales
│   │   ├── health/             # HakaHealth
│   │   │   ├── perfil/
│   │   │   ├── historial/
│   │   │   ├── veterinarios/
│   │   │   └── progreso/
│   │   ├── trainer/            # HakaTrainer
│   │   │   ├── ejercicios/
│   │   │   ├── juegos/
│   │   │   ├── mi-progreso/
│   │   │   └── logros/
│   │   └── community/          # HakaCommunity
│   │       ├── explorar/
│   │       ├── amigos/
│   │       ├── pareja/
│   │       ├── foro/
│   │       ├── eventos/
│   │       ├── mapa/
│   │       └── mensajes/
│   │
│   ├── (auth)/                  # Autenticación
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar/
│   │
│   ├── (dashboard)/             # Áreas privadas
│   │   ├── cliente/
│   │   └── admin/
│   │
│   └── api/                     # API Routes
│       └── [...routes]/
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── shared/                 # Componentes compartidos
│   ├── landing/                # Componentes landing
│   ├── health/                 # Componentes HakaHealth
│   ├── trainer/                # Componentes HakaTrainer
│   └── community/              # Componentes HakaCommunity
│
├── lib/
│   ├── supabase/              # Cliente Supabase
│   ├── utils/                 # Utilidades
│   ├── hooks/                 # Custom hooks
│   └── validations/           # Schemas Zod
│
├── types/                      # TypeScript types
│   ├── database.types.ts
│   ├── health.types.ts
│   ├── trainer.types.ts
│   └── community.types.ts
│
└── public/
    ├── images/
    ├── icons/
    └── manifest.json
```

---

## 3. STACK TECNOLÓGICO

### 3.1 Frontend

```typescript
// Framework
Next.js: "^14.0.0"          // App Router, RSC, Server Actions
React: "^18.2.0"
TypeScript: "^5.3.0"

// Styling
Tailwind CSS: "^3.4.0"
shadcn/ui: "latest"         // Headless components
Framer Motion: "^11.0.0"    // Animaciones

// Forms & Validation
React Hook Form: "^7.48.0"
Zod: "^3.22.0"

// State Management
TanStack Query: "^5.0.0"    // Server state
Zustand: "^4.4.0"           // Client state (opcional)

// Icons & Assets
Lucide React: "^0.294.0"
next/image                   // Optimización automática
```

### 3.2 Backend

```typescript
// BaaS
Supabase:
  - Auth (usuarios, roles)
  - PostgreSQL (base de datos)
  - Storage (fotos/videos)
  - Realtime (chat, notificaciones)
  - Edge Functions (lógica servidor)

// API
Next.js API Routes
Next.js Server Actions
```

### 3.3 PWA & Performance

```typescript
// PWA
next-pwa: "^5.6.0"
workbox-*: "^7.0.0"

// Performance
sharp: "^0.33.0"            // Optimización imágenes
@vercel/analytics: "^1.1.0"
@vercel/speed-insights: "^1.0.0"
```

### 3.4 SEO & Analytics

```typescript
// SEO
next-seo: "^6.4.0"
@next/mdx: "^14.0.0"        // Blog en MDX
rehype-*: "latest"          // Plugins MDX

// Analytics
Google Analytics 4
Google Search Console API
Vercel Analytics
```

### 3.5 Maps & Media

```typescript
// Maps
@googlemaps/js-api-loader: "^1.16.0"
react-map-gl: "^7.1.0"      // Alternativa: Mapbox

// Media
Cloudflare Stream          // Videos
Uploadthing: "^6.0.0"      // Subida archivos
@supabase/storage-js       // Storage alternativo
```

### 3.6 Emails & Notifications

```typescript
// Email
Resend: "^2.0.0"
React Email: "^1.9.0"

// Push Notifications
web-push: "^3.6.0"
```

### 3.7 Payments (Fase 2)

```typescript
@stripe/stripe-js: "^2.0.0"
stripe: "^14.0.0"
```

---

## 4. ESTRUCTURA DE URLS

### 4.1 Landing Público

```
/                                    # Home premium
/servicios                           # Overview servicios
/servicios/educacion-basica-perros-murcia
/servicios/modificacion-conducta-perros-archena
/servicios/educacion-cachorros-murcia
/servicios/clases-grupales-perros
/sobre-nosotros                      # Historia Alfredo
/metodologia                         # Proceso trabajo
/precios                             # Planes y precios
/contacto                            # Formulario contacto
```

### 4.2 Blog y Contenido SEO

```
/blog                                # Listado artículos
/blog/[categoria]                    # Por categoría
/blog/[categoria]/[slug]             # Artículo individual
/blog/ejercicios/[slug]              # Ejercicio (de HakaTrainer)

/casos-exito                         # Listado casos
/casos-exito/[slug]                  # Caso individual (de HakaHealth)
```

### 4.3 SEO Local

```
/educador-canino-murcia
/educador-canino-archena
/adiestrador-perros-molina-segura
/educacion-canina-region-murcia
/parques-perros-murcia
/veterinarios-murcia
```

### 4.4 HakaHealth App

```
/app/health                          # Dashboard
/app/health/perfil                   # Perfil del perro
/app/health/historial/vacunas
/app/health/historial/visitas
/app/health/historial/medicamentos
/app/health/historial/desparasitaciones
/app/health/veterinarios             # Mapa veterinarios
/app/health/progreso                 # Seguimiento educación
/app/health/sesiones                 # Historial sesiones
/app/health/certificados             # Certificados
```

### 4.5 HakaTrainer App

```
/app/trainer                         # Dashboard
/app/trainer/ejercicios              # Biblioteca
/app/trainer/ejercicios/[id]         # Detalle ejercicio
/app/trainer/juegos                  # Juegos y actividades
/app/trainer/juegos/[id]             # Detalle juego
/app/trainer/mi-progreso             # Progreso personal
/app/trainer/planes                  # Planes personalizados
/app/trainer/logros                  # Badges y logros
```

### 4.6 HakaCommunity App

```
/app/community                       # Dashboard
/app/community/explorar              # Mapa perros cercanos
/app/community/amigos                # Lista amigos
/app/community/pareja                # Búsqueda pareja
/app/community/foro                  # Foro general
/app/community/foro/[categoria]      # Por categoría
/app/community/foro/[slug]           # Post individual (SEO)
/app/community/eventos               # Calendario eventos
/app/community/eventos/[id]          # Evento individual (SEO)
/app/community/mapa                  # Mapa recursos
/app/community/mapa/[categoria]/[ciudad]  # SEO local
/app/community/mensajes              # Chat
```

### 4.7 Dashboard Cliente

```
/cliente/dashboard
/cliente/perfil
/cliente/configuracion
```

### 4.8 Admin Panel (Alfredo)

```
/admin/dashboard
/admin/clientes
/admin/clientes/[id]
/admin/sesiones
/admin/calendario
/admin/ejercicios                    # Gestión ejercicios
/admin/juegos                        # Gestión juegos
/admin/moderacion                    # Moderar comunidad
/admin/eventos                       # Gestión eventos
/admin/contenido                     # Blog y casos
/admin/estadisticas
```

---

## 5. LAS 3 APPS PRINCIPALES

### 5.1 APP 1: HakaHealth 🏥

#### Concepto
App integral que combina **salud veterinaria** del perro con **seguimiento del programa de educación** de Hakadogs.

#### Módulos

**A. Perfil del Perro**
- Información básica completa
- QR code de emergencia
- Tarjeta digital descargable (PDF)

**B. Historial Médico**
- 💉 **Vacunas**: Registro completo + recordatorios automáticos
- 🏥 **Visitas veterinario**: Historial, diagnósticos, tratamientos
- 💊 **Medicamentos**: Activos con recordatorios de toma
- 🐛 **Desparasitaciones**: Interna/externa con recordatorios
- 📊 **Peso**: Gráfico de evolución

**C. Directorio de Veterinarios**
- Mapa interactivo con veterinarios cercanos
- Filtros: urgencias 24h, especialidades, precio
- Valoraciones y reseñas de usuarios
- Guardar favoritos
- Llamar / Cómo llegar

**D. Seguimiento Programa Educación**
- Dashboard de progreso (% completado)
- Historial completo de sesiones con Alfredo
- Comandos: dominados / en progreso / pendientes
- Notas del educador después de cada sesión
- Homework asignado para practicar
- Objetivos para próxima sesión
- Fotos y videos de las sesiones
- Certificados descargables en PDF

#### Panel Educador (Alfredo)
- Ver todos los clientes activos
- Registrar sesión rápidamente
- Marcar comandos dominados
- Asignar homework personalizado
- Subir fotos/videos de sesión
- Enviar resumen automático al cliente

#### SEO Automático
Cuando un programa se completa exitosamente:
- Se genera automáticamente página pública
- URL: `/casos-exito/[nombre-perro-problema]`
- Timeline completo del progreso
- Fotos antes/después
- Testimonio del propietario
- Técnicas utilizadas por Alfredo

**Beneficio SEO:** 2-4 casos nuevos por mes = contenido único y valioso

---

### 5.2 APP 2: HakaTrainer 🎓

#### Concepto
Biblioteca completa de **ejercicios de entrenamiento** y **juegos interactivos** para practicar en casa.

#### Módulos

**A. Biblioteca de Ejercicios (50+ ejercicios)**

Categorías:
- 🎯 **Comandos Básicos**: Sentado, Quieto, Aquí, Tumba, Junto, Espera, Suelta, Déjalo
- 🧠 **Control de Impulsos**: Autocontrol comida, no tirar correa, calma ante estímulos
- 🐕 **Socialización**: Con otros perros, personas, ruidos, entornos nuevos
- 😌 **Gestión de Energía**: Relajación, protocolo de calma, desactivación
- ⭐ **Trucos Avanzados**: Dar la pata, rodar, traer objetos, saltar obstáculos
- 🎪 **Habilidades Prácticas**: Caminar sin correa, no mendigar, ir a su cama

Cada ejercicio incluye:
- Video tutorial (2-5 min)
- Paso a paso escrito detallado
- Dificultad y edad recomendada
- Duración y repeticiones sugeridas
- Materiales necesarios
- Tips de Alfredo
- Errores comunes a evitar
- Transcripción completa (SEO)

**B. Mi Progreso**
- Plan personalizado asignado por Alfredo
- Registrar cada práctica:
  - Duración
  - Nivel de éxito (1-5 ⭐)
  - Notas personales
  - Video opcional
- Historial completo de prácticas
- Estadísticas:
  - Tiempo total entrenamiento
  - Racha de días consecutivos
  - Ejercicios dominados
  - Gráficos de evolución

**C. Gamificación (Logros y Badges)**

Ejemplos de logros:
- 🏆 Primera práctica
- 🏆 7 días consecutivos
- 🏆 30 días consecutivos
- 🏆 50 ejercicios completados
- 🏆 Maestro de Comandos Básicos
- 🏆 100 horas de entrenamiento

Los badges se muestran en perfil público de HakaCommunity.

**D. Juegos y Actividades**

Categorías:
- 👃 **Juegos de Olfato**: Buscar premios, alfombra olfativa DIY, seguir rastros
- 🏃 **Juegos de Agilidad**: Circuitos caseros, saltos, equilibrio
- 🧩 **Juegos Mentales**: Kong relleno (recetas), puzzles, tres tazas
- 💦 **Juegos de Agua**: Piscina casera, manguera (verano)
- 👥 **Juegos Sociales**: Persecución controlada, pelota grupal

Cada juego incluye:
- Video demostrativo
- Instrucciones paso a paso
- Materiales DIY
- Duración y nivel de energía
- Beneficios para el perro

**E. Tips y Recursos**
- Tip del día (notificación push)
- Guías descargables en PDF
- Infografías educativas
- FAQs sobre entrenamiento

#### Panel Educador
- Subir nuevos ejercicios con video
- Editar ejercicios existentes
- Asignar ejercicios a clientes específicos
- Crear planes semanales personalizados
- Ver videos de práctica de clientes
- Dar feedback en videos

#### Modo Offline (PWA)
- Descargar ejercicios favoritos
- Ver videos sin conexión
- Registrar práctica (sincroniza después)
- Acceder a guías PDF

#### SEO Automático
- Cada ejercicio = artículo de blog
- URL: `/blog/ejercicios/[nombre-ejercicio]`
- Video embebido + transcripción completa
- Instrucciones paso a paso
- Comentarios de usuarios (UGC)

**Beneficio SEO:** 50+ ejercicios = 50+ artículos optimizados

---

### 5.3 APP 3: HakaCommunity 🐕‍🦺

#### Concepto
Red social canina donde propietarios pueden **conectar**, **hacer amigos**, **buscar pareja** para sus perros y **organizar actividades**.

#### Módulos

**A. Perfil Social del Perro**
- Foto principal + galería (hasta 10 fotos)
- Info básica: raza, edad, tamaño, peso
- Personalidad (etiquetas): Juguetón, Tranquilo, Activo, Tímido, Sociable...
- Intereses: Parques, Nadar, Pelota, Senderismo...
- Compatibilidades:
  - Con perros pequeños/grandes
  - Con cachorros
  - Con gatos
  - Con niños
- Bio (300 caracteres)
- Ubicación aproximada (privacidad)
- Estado: Buscando amigos / Buscando pareja / Explorando

**B. Explorar y Buscar Amigos**
- 🗺️ Mapa con perros cercanos
- Radio ajustable: 1km, 5km, 10km, 20km
- Filtros avanzados:
  - Raza, tamaño, edad, género
  - Nivel de energía
  - Personalidad
  - Intereses comunes
  - Compatibilidad con mi perro
- Enviar solicitud de amistad
- Mensaje de presentación opcional
- Gestionar solicitudes recibidas
- Lista de amigos
- Organizar encuentros

**C. Búsqueda de Pareja (Cría Responsable)**

⚠️ **Disclaimer importante:**  
> Esta función está destinada ÚNICAMENTE a cría responsable y ética.  
> Hakadogs promueve la ADOPCIÓN como primera opción.  
> Solo criadores responsables con certificados completos.

Perfil de Cría incluye:
- Pedigree completo (PDF)
- Certificados de salud:
  - Displasia cadera/codo (OFA/PennHIP)
  - Tests genéticos por raza
  - Enfermedades hereditarias descartadas
- Evaluación profesional de temperamento
- Historial de camadas previas
- Info del criador:
  - Nombre completo
  - Años de experiencia
  - Afijo (si tiene)
  - Club de raza
  - Certificaciones
  - Referencias
- Términos de cría (económicos y responsabilidades)

**Sistema de Verificación:**
- Badge "Criador Verificado" ✓
- Verificación de identidad (DNI)
- Verificación de certificados médicos
- Verificación de pedigree
- Llamada de verificación
- Referencias comprobadas

**D. Foro de la Comunidad**

Categorías:
- Educación y Entrenamiento
- Salud y Veterinaria
- Alimentación y Nutrición
- Cachorros
- Razas Específicas (subforos)
- Actividades y Viajes
- Zona Local (Murcia)
- Off-topic

Funcionalidades:
- Crear posts (texto + hasta 5 fotos + 1 video)
- Sistema de likes ❤️
- Comentarios y respuestas (hilos)
- Marcar respuesta como útil ⭐
- Marcar respuesta aceptada (si es pregunta)
- **Respuestas de Alfredo** con badge ✓ Educador Verificado
- Seguir post (notificaciones)
- Sistema de reputación:
  - Puntos por actividad
  - Badges: Miembro Activo, Colaborador Destacado, Experto

**E. Eventos y Quedadas**

Tipos de eventos:
1. **Oficiales Hakadogs:**
   - Clases grupales
   - Talleres especiales
   - Puppy parties
   - Sesiones de socialización
   - Competencias amistosas

2. **Organizados por Comunidad:**
   - Quedadas en parques
   - Paseos grupales
   - Excursiones montaña/playa
   - Cumpleaños caninos
   - Eventos benéficos

Cada evento incluye:
- Fecha, hora, duración
- Ubicación (mapa)
- Descripción completa
- Organizador
- Máximo participantes
- Requisitos (vacunas, comportamiento)
- Precio (si aplica)
- Lista de inscritos (ver perros)
- Chat del evento
- Galería de fotos post-evento

Los usuarios pueden crear eventos (con moderación de Alfredo).

**F. Mapa de Recursos Caninos**

11 categorías de lugares:
- 🌳 Parques para perros
- 🏥 Veterinarios (integrado con HakaHealth)
- 🛒 Tiendas de mascotas
- ✂️ Peluquerías caninas
- 🏨 Residencias y guarderías
- 🎓 Adiestradores
- 📸 Fotógrafos de mascotas
- 🏖️ Playas dog-friendly
- 🍴 Restaurantes con perros
- 🏨 Hoteles que admiten mascotas
- 🥾 Rutas de senderismo

Cada lugar:
- Ubicación en mapa interactivo
- Info completa (horarios, servicios, precios)
- Valoraciones y reseñas de usuarios (UGC)
- Fotos de usuarios
- Cómo llegar (integración Google Maps)
- Guardar en favoritos

Los usuarios pueden añadir nuevos lugares (con moderación).

**G. Chat y Mensajería**
- Mensajes privados 1 a 1
- Chats de grupo
- Chat de evento (automático)
- Grupos por zona (ej: "Perros de Archena")
- Grupos por raza (ej: "Golden Retrievers Murcia")
- Notificaciones en tiempo real
- Indicador "escribiendo..."
- Enviar fotos del perro

#### Panel Moderador (Alfredo)
- Revisar contenido reportado
- Eliminar posts/comentarios inapropiados
- Advertir/banear usuarios
- Aprobar eventos de usuarios
- Crear eventos oficiales
- Verificar criadores (búsqueda pareja)
- Responder en foro con badge oficial
- Analytics de la comunidad:
  - Usuarios activos
  - Posts por día
  - Eventos organizados
  - Engagement

#### SEO Automático

**1. Foro → Contenido UGC:**
- Cada pregunta/respuesta = página indexable
- URL: `/comunidad/preguntas/[titulo-slug]`
- Schema markup Q&A
- Respuestas de Alfredo = contenido de experto
- Keywords long-tail: "mi perro no quiere comer murcia", "cachorro muerde muebles"

**2. Eventos → SEO Local:**
- URL: `/eventos/[nombre-evento]`
- Schema markup Event
- Contenido local (parque X en Murcia)
- Fotos y testimonios de asistentes

**3. Mapa Recursos → Landing Pages:**
- URL: `/recursos/[categoria]/[ciudad]`
- Ejemplos:
  - `/recursos/parques-perros/murcia`
  - `/recursos/veterinarios/archena`
  - `/recursos/playas-dog-friendly/region-murcia`
- Listados completos + mapa
- Reseñas de usuarios (UGC constante)
- Schema markup LocalBusiness

**Beneficio SEO:** La comunidad genera contenido fresco constantemente sin trabajo manual.

---

## 6. BASE DE DATOS COMPLETA

### 6.1 Esquema Supabase (PostgreSQL)

```sql
-- ================================================
-- USUARIOS Y AUTENTICACIÓN
-- ================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client', -- 'client', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- PERROS
-- ================================================

CREATE TABLE dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Información básica
  name TEXT NOT NULL,
  breed TEXT,
  birthdate DATE,
  weight DECIMAL,
  gender TEXT, -- 'male', 'female'
  size TEXT, -- 'small', 'medium', 'large', 'giant'
  neutered BOOLEAN DEFAULT false,
  photo_url TEXT,
  gallery_urls TEXT[], -- Array de fotos
  microchip TEXT,
  insurance_info TEXT,
  
  -- Perfil social (para HakaCommunity)
  bio TEXT, -- max 300 caracteres
  personality_tags TEXT[], -- ['playful', 'calm', 'active', etc.]
  interests TEXT[], -- ['parks', 'swimming', 'ball', etc.]
  energy_level INTEGER, -- 1-5
  socialization_level INTEGER, -- 1-5
  
  -- Compatibilidades
  compatible_small_dogs BOOLEAN DEFAULT true,
  compatible_large_dogs BOOLEAN DEFAULT true,
  compatible_puppies BOOLEAN DEFAULT true,
  compatible_same_gender BOOLEAN DEFAULT true,
  compatible_cats BOOLEAN DEFAULT false,
  compatible_kids BOOLEAN DEFAULT true,
  
  -- Ubicación (privacidad configurable)
  location_city TEXT,
  location_neighborhood TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  show_location BOOLEAN DEFAULT true,
  
  -- Estado social
  looking_for TEXT, -- 'friends', 'partner', 'exploring', 'available'
  profile_public BOOLEAN DEFAULT true,
  allow_messages_from TEXT DEFAULT 'friends', -- 'all', 'friends', 'none'
  
  -- Notas generales
  behavior_notes TEXT,
  health_notes TEXT,
  special_characteristics TEXT,
  allergies TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- HISTORIAL MÉDICO (HakaHealth)
-- ================================================

-- VACUNAS
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  manufacturer TEXT,
  batch_number TEXT,
  application_date DATE NOT NULL,
  veterinarian TEXT,
  clinic_name TEXT,
  next_dose_date DATE,
  certificate_url TEXT, -- PDF
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VISITAS AL VETERINARIO
CREATE TABLE vet_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  veterinarian_name TEXT,
  clinic_name TEXT,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  tests_performed TEXT[],
  test_results TEXT,
  invoice_url TEXT,
  documents_urls TEXT[],
  next_visit_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- MEDICAMENTOS
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  time_of_day TEXT[], -- ['08:00', '16:00', '00:00']
  is_active BOOLEAN DEFAULT true,
  reminders_enabled BOOLEAN DEFAULT true,
  side_effects_observed TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DESPARASITACIONES
CREATE TABLE dewormings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'internal', 'external'
  product_name TEXT NOT NULL,
  application_date DATE NOT NULL,
  next_application_date DATE NOT NULL,
  reminders_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PESO
CREATE TABLE weight_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  measured_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DIRECTORIO DE VETERINARIOS
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  lat DECIMAL,
  lng DECIMAL,
  hours_monday TEXT,
  hours_tuesday TEXT,
  hours_wednesday TEXT,
  hours_thursday TEXT,
  hours_friday TEXT,
  hours_saturday TEXT,
  hours_sunday TEXT,
  emergency_24h BOOLEAN DEFAULT false,
  services TEXT[],
  specialties TEXT[],
  photos_urls TEXT[],
  price_range TEXT, -- '€', '€€', '€€€'
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- PROGRAMAS Y SESIONES (HakaHealth - Seguimiento Educación)
-- ================================================

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  program_type TEXT NOT NULL, -- 'basica', 'modificacion', 'cachorros', 'grupal'
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  total_sessions INTEGER,
  completed_sessions INTEGER DEFAULT 0,
  price DECIMAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  session_number INTEGER,
  date TIMESTAMP NOT NULL,
  duration INTEGER, -- minutos
  location TEXT,
  session_type TEXT, -- 'presencial', 'online'
  exercises_practiced UUID[], -- IDs de ejercicios
  commands_worked TEXT[],
  commands_mastered TEXT[],
  success_level INTEGER, -- 1-5
  notes_educator TEXT,
  homework TEXT,
  next_objectives TEXT,
  dog_mood TEXT, -- 'excelente', 'bueno', 'normal', 'regular', 'malo'
  attendance BOOLEAN DEFAULT true,
  photos TEXT[],
  videos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dog_commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  command_name TEXT NOT NULL,
  command_category TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'mastered'
  mastery_level INTEGER DEFAULT 0, -- 0-5
  learned_date DATE,
  last_practiced DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- EJERCICIOS Y JUEGOS (HakaTrainer)
-- ================================================

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'comandos_basicos', 'impulsos', 'socializacion', etc.
  subcategory TEXT,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  age_group TEXT, -- 'puppy', 'young', 'adult', 'senior', 'all'
  duration INTEGER, -- minutos
  repetitions_per_day INTEGER,
  materials_needed TEXT[],
  space_required TEXT, -- 'indoor', 'outdoor', 'both'
  energy_level TEXT, -- 'low', 'medium', 'high'
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  instructions TEXT,
  objective TEXT,
  benefits TEXT,
  tips TEXT,
  common_mistakes TEXT,
  troubleshooting TEXT,
  variations TEXT,
  next_steps TEXT,
  related_exercises UUID[],
  transcript TEXT, -- Para SEO
  view_count INTEGER DEFAULT 0,
  practice_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'olfato', 'agilidad', 'mental', 'agua', 'social'
  description TEXT,
  instructions TEXT,
  materials TEXT[],
  duration TEXT,
  energy_level TEXT,
  benefits TEXT,
  safety_tips TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  photos_urls TEXT[],
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercise_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  dog_id UUID REFERENCES dogs(id),
  exercise_id UUID REFERENCES exercises(id),
  practiced_at TIMESTAMP DEFAULT NOW(),
  duration INTEGER,
  success_level INTEGER, -- 1-5
  dog_interest BOOLEAN,
  distractions TEXT,
  notes TEXT,
  video_url TEXT,
  shared_with_educator BOOLEAN DEFAULT false,
  educator_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  week_number INTEGER,
  exercises UUID[],
  frequency INTEGER[],
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LOGROS (Gamificación)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, dog_id, achievement_id)
);

-- ================================================
-- COMUNIDAD (HakaCommunity)
-- ================================================

-- AMISTADES
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id_1 UUID REFERENCES dogs(id) ON DELETE CASCADE,
  dog_id_2 UUID REFERENCES dogs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  requested_by UUID REFERENCES dogs(id),
  request_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  UNIQUE(dog_id_1, dog_id_2)
);

-- BÚSQUEDA DE PAREJA
CREATE TABLE breeding_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  pedigree_url TEXT,
  pedigree_number TEXT,
  lineage TEXT,
  hip_dysplasia_cert TEXT,
  elbow_dysplasia_cert TEXT,
  genetic_tests TEXT[],
  health_certs_urls TEXT[],
  last_vet_checkup DATE,
  temperament_evaluation TEXT,
  temperament_traits TEXT[],
  previous_litters INTEGER DEFAULT 0,
  last_litter_date DATE,
  total_puppies INTEGER DEFAULT 0,
  litter_health_info TEXT,
  previous_litters_photos TEXT[],
  breeding_type TEXT[],
  terms TEXT,
  contract_template_url TEXT,
  guarantees TEXT,
  breeder_full_name TEXT NOT NULL,
  breeder_experience_years INTEGER,
  breeder_affix TEXT,
  breeder_club TEXT,
  breeder_certifications TEXT[],
  breeder_phone TEXT NOT NULL,
  breeder_email TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verification_notes TEXT,
  active BOOLEAN DEFAULT false,
  available_dates TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(dog_id)
);

-- FORO
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  dog_id UUID REFERENCES dogs(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  photos TEXT[],
  video_url TEXT,
  tags TEXT[],
  is_question BOOLEAN DEFAULT false,
  has_accepted_answer BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  parent_comment_id UUID REFERENCES community_comments(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_answer BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  verified_by_educator BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- EVENTOS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type TEXT, -- 'clase_grupal', 'taller', 'paseo', etc.
  date TIMESTAMP NOT NULL,
  duration INTEGER, -- minutos
  location_name TEXT,
  location_address TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL DEFAULT 0,
  requirements TEXT[],
  image_url TEXT,
  photos_urls TEXT[], -- Post-evento
  organizer_id UUID REFERENCES profiles(id),
  organizer_dog_id UUID REFERENCES dogs(id),
  is_official BOOLEAN DEFAULT false, -- Si es oficial de Hakadogs
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  dog_id UUID REFERENCES dogs(id),
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  UNIQUE(event_id, user_id, dog_id)
);

-- MAPA DE RECURSOS
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'park', 'vet', 'shop', 'grooming', etc.
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT,
  hours TEXT, -- JSON o texto simple
  services TEXT[],
  amenities TEXT[], -- Para parques: fuente, bolsas, vallado, etc.
  price_range TEXT,
  photos_urls TEXT[],
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  added_by UUID REFERENCES profiles(id),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE place_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INTEGER NOT NULL, -- 1-5
  comment TEXT,
  photos_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- MENSAJERÍA
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  photo_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- GRUPOS (Chats grupales)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  type TEXT, -- 'event', 'zone', 'breed', 'custom'
  related_event_id UUID REFERENCES events(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE group_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- BLOG Y CASOS DE ÉXITO (SEO)
-- ================================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- MDX
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  view_count INTEGER DEFAULT 0,
  read_time INTEGER,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id),
  dog_id UUID REFERENCES dogs(id),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  initial_problem TEXT,
  process_description TEXT,
  techniques_used TEXT[],
  timeline TEXT, -- JSON
  before_photos TEXT[],
  after_photos TEXT[],
  before_videos TEXT[],
  after_videos TEXT[],
  testimonial TEXT,
  duration_days INTEGER,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- NOTIFICACIONES Y PUSH
-- ================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================

CREATE INDEX idx_dogs_owner ON dogs(owner_id);
CREATE INDEX idx_programs_dog ON programs(dog_id);
CREATE INDEX idx_sessions_program ON sessions(program_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_exercise_progress_dog ON exercise_progress(dog_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_slug ON community_posts(slug);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_places_category_city ON places(category, city);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_success_stories_slug ON success_stories(slug);
```

---

## 7. ESTRATEGIA SEO

### 7.1 Blog - Pilar Central

**Plan de Contenidos Año 1:**

**Meses 1-3: Fundación (12 artículos)**
- 3 guías completas (2500-3000 palabras)
- 6 artículos problemas específicos (1000-1500 palabras)
- 3 artículos locales (800-1200 palabras)

**Artículos Prioritarios:**

Guías:
1. "Guía Completa de Educación Canina 2025"
2. "Cómo Educar a tu Cachorro: Guía Definitiva"
3. "Modificación de Conductas: Guía Paso a Paso"

Problemas:
1. "Mi Perro Tira de la Correa: 7 Técnicas Efectivas"
2. "Cómo Eliminar Ladridos Excesivos sin Castigos"
3. "Ansiedad por Separación: Plan de 30 Días"
4. "Perro Agresivo con Otros Perros: Soluciones"
5. "Socialización de Cachorros: Guía 0-6 Meses"
6. "Enseñar Recuerdo Efectivo (Venir Cuando Llamas)"

Locales:
1. "10 Mejores Parques para Perros en Murcia"
2. "Educador Canino en Archena: Qué Saber"
3. "Dónde Socializar tu Perro en Región de Murcia"

**Keywords Objetivo:**

Primary:
- educador canino murcia (260/mes)
- adiestrador perros archena (90/mes)
- educación canina murcia (210/mes)

Long-tail:
- mi perro tira mucho de la correa (50/mes)
- perro agresivo con otros perros (30/mes)
- clases cachorros murcia (60/mes)

Informational:
- cómo educar cachorro (8,100/mes)
- comandos básicos perros (3,600/mes)
- perro ladra cuando me voy (2,400/mes)

### 7.2 Contenido SEO Automático

**De las Apps:**
1. **HakaHealth** → Casos de éxito (2-4/mes)
2. **HakaTrainer** → Ejercicios (50+ artículos)
3. **HakaCommunity** → Foro + Eventos + Mapa (continuo)

### 7.3 SEO Técnico

- Sitemap.xml automático
- Robots.txt optimizado
- Schema markup (LocalBusiness, Service, BlogPosting, Q&A, Event)
- Core Web Vitals < 2.5s LCP
- Mobile-first design
- URLs limpias y descriptivas

### 7.4 SEO Local

Páginas dedicadas:
- `/educador-canino-murcia`
- `/educador-canino-archena`
- `/veterinarios-murcia` (del mapa)
- `/parques-perros-murcia` (del mapa)

Google Business Profile optimizado:
- 50+ fotos profesionales
- 2-3 posts/semana
- Responder todas las reseñas
- Q&A completas
- Objetivo: 100+ reseñas con 4.9+ estrellas

---

## 8. ROADMAP DE DESARROLLO

### Fase 0: Setup (1 semana)
- Configurar Next.js 14+ con TypeScript
- Configurar Tailwind CSS + shadcn/ui
- Configurar Supabase (proyecto, database, auth)
- Setup GitHub + Vercel
- Diseñar logo y assets visuales

### Fase 1: Landing + SEO Base (3 semanas)
**Semana 1-2:**
- Home premium (basado en version-definitiva-premium.html)
- Páginas de servicios (4)
- Sobre nosotros, metodología, contacto, precios

**Semana 3:**
- Sitemap.xml, robots.txt
- Metadata dinámica
- Schema markup básico
- Google Analytics 4
- Google Business Profile

### Fase 2: Blog (3 semanas)
- Infraestructura blog con MDX
- Layout y diseño
- Sistema de categorías y tags
- 12 artículos iniciales
- SEO completo por artículo

### Fase 3: Auth + Dashboard Base (2 semanas)
- Supabase Auth integrado
- Login/registro/recuperar
- Middleware de protección
- Dashboard cliente básico
- Perfil editable

### Fase 4: HakaHealth (4 semanas)
**Semana 1:**
- Perfil del perro completo
- QR code y tarjeta digital

**Semana 2:**
- Historial médico (vacunas, visitas, medicamentos)
- Recordatorios

**Semana 3:**
- Directorio veterinarios con mapa
- Filtros y búsqueda

**Semana 4:**
- Seguimiento programa educación
- Dashboard de progreso
- Comandos y sesiones

### Fase 5: HakaTrainer (4 semanas)
**Semana 1:**
- Biblioteca de ejercicios
- Sistema de categorías y filtros
- Detalle de ejercicio con video

**Semana 2:**
- Sistema de práctica y progreso
- Estadísticas y gráficos

**Semana 3:**
- Juegos y actividades
- Tips y recursos

**Semana 4:**
- Gamificación (logros y badges)
- Planes personalizados
- Contenido inicial: 30 ejercicios + 15 juegos

### Fase 6: HakaCommunity (5 semanas)
**Semana 1:**
- Perfil social del perro
- Buscar amigos (mapa + filtros)
- Solicitudes de amistad

**Semana 2:**
- Foro (crear posts, comentarios, likes)
- Categorías
- Sistema de reputación

**Semana 3:**
- Eventos (calendario, crear, inscribirse)
- Chat de evento

**Semana 4:**
- Mapa de recursos (11 categorías)
- Añadir lugares
- Reseñas

**Semana 5:**
- Chat y mensajería
- Búsqueda de pareja (básico)
- Sistema de verificación

### Fase 7: Admin Panel (3 semanas)
- Dashboard con KPIs
- Gestión de clientes
- Registrar sesiones
- Gestión de ejercicios y juegos
- Moderación de comunidad
- Aprobar eventos
- Gestión de contenido (blog, casos)
- Estadísticas

### Fase 8: PWA + Notificaciones (2 semanas)
- Configurar next-pwa
- Service Workers
- Manifest.json completo
- Funcionalidad offline
- Notificaciones push
- Recordatorios automáticos

### Fase 9: Optimización (2 semanas)
- Auditoría Lighthouse completa
- Optimizar Core Web Vitals
- Testing en dispositivos reales
- Corregir bugs
- Pulir animaciones
- Accesibilidad (A11y)

### Fase 10: Lanzamiento (1 semana)
- Materiales de marketing
- Email a base de datos
- Post en redes sociales
- Contactar medios locales
- Monitorear métricas

**TOTAL: ~6-7 meses**

---

## 9. MONETIZACIÓN

### 9.1 Fase 1: Gratis para Clientes Activos

- Acceso completo a las 3 apps
- Sin costo adicional mientras son clientes
- Objetivo: Fidelización y diferenciación

### 9.2 Fase 2: Plan Premium (Mes 12+)

**Plan "Haka+" — 9.99€/mes**

Para ex-clientes que terminaron su programa:
- Acceso continuo a las 3 apps
- Biblioteca completa de ejercicios
- Diario ilimitado
- Comunidad exclusiva
- Soporte por email

**Proyección:**
- Año 1: 18 suscriptores = 2,148€/año
- Año 2: 40 suscriptores = 4,795€/año
- Año 3: 70 suscriptores = 8,391€/año

### 9.3 Fase 3: Licencia B2B (Año 2+)

**Plan "Haka Pro" — 49€/mes por educador**

Para otros educadores caninos:
- White-label de la plataforma
- Su propia marca
- Apps para sus clientes
- Panel de admin
- Soporte técnico

**Proyección:**
- Año 2: 5 educadores = 2,940€/año
- Año 3: 15 educadores = 8,820€/año
- Año 4: 30 educadores = 17,640€/año

### 9.4 Otras Fuentes

**Marketplace de Servicios:**
- Comisión veterinarios (10%)
- Comisión residencias (15%)
- Afiliación tiendas (5-10%)

**Publicidad Selecta:**
- Marcas premium de comida
- Seguros para mascotas
- Productos de educación

**Cursos Online:**
- "Educación Básica desde Casa" — 49€
- "Resuelve Problemas" — 79€
- "Cachorro Perfecto 60 Días" — 59€

---

## 10. PRÓXIMOS PASOS

### Inmediato (Esta semana)
1. ✅ **Aprobar esta guía**
2. ⏳ **Preparar contenido:**
   - 50+ fotos profesionales
   - Textos de servicios
   - 10 videos para HakaTrainer
3. ⏳ **Setup técnico:**
   - Crear cuenta Vercel
   - Crear proyecto Supabase
   - Dominio hakadogs.com

### Próximo (Semana 2)
4. ⏳ **Iniciar Fase 0:** Setup del proyecto
5. ⏳ **Diseño final:** Logo y branding
6. ⏳ **Planificación:** Sprints semanales

### Medio plazo (Mes 1-2)
7. ⏳ **Desarrollar Fase 1:** Landing + SEO
8. ⏳ **Crear Google Business Profile**
9. ⏳ **Escribir primeros 12 artículos blog**

---

## 📞 CONTACTO

**Cliente:**
- Hakadogs - Alfredo
- Email: info@hakadogs.com
- Teléfono: 685 64 82 41
- Ubicación: Archena, Murcia

**Desarrollador:**
- Narciso Pardo Buendía

---

**Fin de la Guía v2.0** 🚀

*Esta guía es un documento vivo y se actualizará conforme avance el proyecto.*
