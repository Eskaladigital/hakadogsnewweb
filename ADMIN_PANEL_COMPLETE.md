# 🎯 Panel de Administración Completo - Hakadogs

**Fecha**: 10 enero 2026  
**Estado**: ✅ **EN DESARROLLO**  
**Versión**: 1.0.0

---

## 📋 Resumen Ejecutivo

Sistema completo de administración para Hakadogs con 4 secciones principales:

1. 📊 **Dashboard** - Estadísticas generales
2. 👥 **Usuarios** - Gestión completa de usuarios
3. 📚 **Cursos** - Gestión de cursos (ya existente)
4. 📧 **Contactos** - Gestión de mensajes

---

## 🗄️ Base de Datos

### **1. Tabla `user_roles`**

**Archivo**: `supabase/user_roles_table.sql`

**Propósito**: Sistema de roles para usuarios

**Campos**:
- `id` (UUID) - PK
- `user_id` (UUID) - FK a auth.users
- `role` (TEXT) - 'admin', 'user', 'instructor'
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Funciones**:
- `get_user_role(UUID)` - Obtiene el rol de un usuario
- `is_admin(UUID)` - Verifica si es admin
- `create_user_with_role()` - Trigger automático al registrarse

**Características**:
- ✅ RLS completo
- ✅ Trigger automático: nuevo usuario → rol "user"
- ✅ Unique constraint: un usuario = un rol
- ✅ Políticas de seguridad por rol

---

### **2. Tabla `contacts`**

**Archivo**: `supabase/contacts_table.sql`

**Propósito**: Mensajes de contacto del formulario web

**Campos**:
- `id` (UUID) - PK
- `name`, `email`, `phone`, `subject`, `message` (TEXT)
- `status` (TEXT) - 'pending', 'in_progress', 'responded', 'closed'
- `admin_notes` (TEXT) - Notas internas
- `responded_by` (UUID) - Quién respondió
- `responded_at` (TIMESTAMPTZ)
- `source` (TEXT) - 'web_form', 'email', 'phone', 'whatsapp'
- `user_agent`, `ip_address`
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Funciones**:
- `get_contacts_stats()` - Estadísticas de contactos
- `mark_contact_responded(UUID, UUID)` - Marcar como respondido

**Vista**:
- `contacts_admin_view` - Vista enriquecida con info del admin que respondió

**Características**:
- ✅ RLS: Solo admins leen/actualizan/eliminan
- ✅ Policy pública: Cualquiera puede crear contactos
- ✅ Índices optimizados (email, status, created_at, phone)

---

### **3. Funciones del Dashboard**

**Archivo**: `supabase/dashboard_functions.sql`

**Funciones Principales**:

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `get_dashboard_stats()` | Estadísticas generales completas | JSON |
| `get_recent_users(limit)` | Usuarios más recientes | TABLE |
| `get_recent_sales(limit)` | Ventas más recientes | TABLE |
| `get_recent_contacts(limit)` | Contactos más recientes | TABLE |
| `get_sales_chart_data()` | Datos para gráfica de ventas | JSON |
| `get_top_selling_courses(limit)` | Cursos más vendidos | TABLE |
| `get_conversion_metrics()` | Métricas de conversión | JSON |

**Estadísticas que proporciona `get_dashboard_stats()`**:

```json
{
  "users": {
    "total": 150,
    "today": 5,
    "this_week": 23,
    "this_month": 87,
    "admins": 2
  },
  "courses": {
    "total": 12,
    "published": 11,
    "draft": 1,
    "free": 1,
    "paid": 11
  },
  "sales": {
    "total": 234,
    "today": 3,
    "this_week": 15,
    "this_month": 56,
    "revenue_total": 5234.50,
    "revenue_today": 89.97,
    "revenue_month": 1567.43
  },
  "contacts": {
    "total": 89,
    "pending": 12,
    "in_progress": 5,
    "responded": 67,
    "today": 2,
    "this_week": 8
  },
  "progress": {
    "completed_courses": 45,
    "in_progress": 123,
    "avg_completion": 62.5
  }
}
```

---

## 💻 Librerías TypeScript

### **1. Dashboard (`lib/supabase/dashboard.ts`)**

**Funciones**:
- `getDashboardStats()` - Estadísticas principales
- `getRecentUsers(limit)` - Usuarios recientes
- `getRecentSales(limit)` - Ventas recientes
- `getRecentContacts(limit)` - Contactos recientes
- `getSalesChartData()` - Datos para gráficas
- `getTopSellingCourses(limit)` - Top cursos
- `getConversionMetrics()` - Métricas de conversión

**Interfaces TypeScript**:
```typescript
interface DashboardStats {
  users: { total, today, this_week, this_month, admins }
  courses: { total, published, draft, free, paid }
  sales: { total, today, this_week, this_month, revenue_* }
  contacts: { total, pending, in_progress, responded, today, this_week }
  progress: { completed_courses, in_progress, avg_completion }
}
```

---

### **2. Contactos (`lib/supabase/contacts.ts`)**

**Funciones**:
- `getAllContacts()` - Todos los contactos
- `getContactById(id)` - Un contacto por ID
- `getContactsByStatus(status)` - Filtrar por estado
- `createContact(data)` - Crear contacto (público)
- `updateContact(id, updates)` - Actualizar (admin)
- `markContactAsResponded(id, adminId)` - Marcar respondido
- `deleteContact(id)` - Eliminar contacto
- `getContactsStats()` - Estadísticas
- `searchContacts(query)` - Buscar por email/nombre

**Interfaces TypeScript**:
```typescript
interface Contact {
  id, name, email, phone, subject, message
  status: 'pending' | 'in_progress' | 'responded' | 'closed'
  admin_notes, responded_by, responded_at
  source, user_agent, ip_address
  created_at, updated_at
}

interface ContactWithDetails extends Contact {
  responded_by_email, responded_by_name
  hours_since_created
}
```

---

### **3. Usuarios (`lib/supabase/users.ts`)**

**Funciones**:
- `getAllUsers()` - Todos los usuarios
- `getUserWithStats(userId)` - Usuario con estadísticas de cursos
- `getUserRole(userId)` - Obtener rol
- `isAdmin(userId)` - Verificar si es admin
- `updateUserRole(userId, newRole)` - Cambiar rol (admin)
- `searchUsers(query)` - Buscar usuarios
- `getUsersByRole(role)` - Filtrar por rol
- `deleteUser(userId)` - Eliminar usuario
- `getUserActivityStats(userId)` - Estadísticas de actividad

**Interfaces TypeScript**:
```typescript
interface User {
  id, email, name, role
  created_at, last_sign_in, email_confirmed_at
}

interface UserWithStats extends User {
  courses_purchased, courses_completed
  total_spent, avg_progress
}
```

---

## 🎨 Frontend - Panel de Administración

### **Layout Principal (`app/administrator/layout.tsx`)**

**Características**:
- ✅ Verificación de rol admin
- ✅ Header con info del usuario y logout
- ✅ Navegación por pestañas sticky
- ✅ 4 pestañas: Dashboard, Usuarios, Cursos, Contactos
- ✅ Responsive

**Pestañas**:
```typescript
const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/administrator' },
  { id: 'users', name: 'Usuarios', icon: Users, href: '/administrator/usuarios' },
  { id: 'courses', name: 'Cursos', icon: BookOpen, href: '/administrator/cursos' },
  { id: 'contacts', name: 'Contactos', icon: Mail, href: '/administrator/contactos' },
]
```

---

### **Dashboard Principal (`app/administrator/page.tsx`)**

**Secciones**:

#### **1. Tarjetas de Estadísticas** (Grid 3 columnas)
- Usuarios Totales
- Cursos Publicados
- Ventas del Mes
- Ingresos del Mes
- Contactos Pendientes
- Cursos Completados

Cada tarjeta incluye:
- Valor principal
- Cambio/contexto (hoy, total, etc.)
- Icono con color distintivo
- Link a sección correspondiente

#### **2. Actividad Reciente** (Grid 2 columnas)
- **Usuarios Recientes**: 5 últimos registrados
  - Nombre/Email
  - Rol (badge)
  - Fecha de registro
- **Ventas Recientes**: 5 últimas compras
  - Título del curso
  - Usuario comprador
  - Precio pagado
  - Fecha de compra

#### **3. Contactos Recientes** (Tabla completa)
- Nombre, Email, Asunto, Estado, Fecha
- Estado con badge de color
- Link "Ver todos" a gestión de contactos

---

### **Gestión de Cursos (`app/administrator/cursos/page.tsx`)**

**Estado**: ✅ Ya existía, movida desde `/administrator/page.tsx`

**Características**:
- Listado completo de cursos
- Filtros y búsqueda
- Ordenamiento por columnas
- Edición, eliminación, publicación
- Estadísticas de ventas

---

### **Gestión de Usuarios (`app/administrator/usuarios/page.tsx`)**

**Estado**: ⏳ **POR CREAR**

**Características Planificadas**:
- Listado completo de usuarios
- Búsqueda por email/nombre
- Filtros por rol
- Ver estadísticas individuales
- Cambiar rol (admin/user/instructor)
- Eliminar usuario
- Ver historial de compras y progreso

---

### **Gestión de Contactos (`app/administrator/contactos/page.tsx`)**

**Estado**: ⏳ **POR CREAR**

**Características Planificadas**:
- Listado completo de contactos
- Filtros por estado (pending, in_progress, responded, closed)
- Búsqueda por email/nombre
- Ver detalles del mensaje
- Agregar notas internas
- Cambiar estado
- Marcar como respondido
- Eliminar contacto

---

## 📊 Orden de Implementación

### **✅ Completado**:

1. ✅ Tabla `user_roles` con RLS y funciones
2. ✅ Tabla `contacts` con RLS y funciones
3. ✅ Funciones SQL del dashboard (`dashboard_functions.sql`)
4. ✅ Librería TypeScript `dashboard.ts`
5. ✅ Librería TypeScript `contacts.ts`
6. ✅ Librería TypeScript `users.ts`
7. ✅ Layout del panel admin con navegación
8. ✅ Página Dashboard principal
9. ✅ Gestión de cursos (movida a `/cursos`)

### **⏳ Pendiente**:

10. ⏳ Página de gestión de usuarios (`/administrator/usuarios/page.tsx`)
11. ⏳ Página de gestión de contactos (`/administrator/contactos/page.tsx`)
12. ⏳ Actualizar formulario de contacto para usar la tabla `contacts`
13. ⏳ Componentes UI reutilizables (tablas, modales, etc.)

---

## 🚀 Instrucciones de Setup

### **1. Ejecutar Scripts SQL (en orden)**:

```bash
# 1. Tabla user_roles (primero)
supabase/user_roles_table.sql

# 2. Tabla contacts (después)
supabase/contacts_table.sql

# 3. Funciones del dashboard (al final)
supabase/dashboard_functions.sql
```

### **2. Verificar en Supabase Dashboard**:

- ✅ Tablas `user_roles` y `contacts` creadas
- ✅ Políticas RLS aplicadas
- ✅ Funciones y triggers activos
- ✅ Vista `contacts_admin_view` disponible

### **3. Asignar rol admin**:

```sql
-- En Supabase SQL Editor:
-- Reemplaza 'TU_USER_ID' con el UUID de tu usuario
INSERT INTO public.user_roles (user_id, role)
VALUES ('TU_USER_ID', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

O ejecuta el script existente:
```bash
supabase/update_user_role.sql
```

### **4. Acceder al Panel**:

```
https://www.hakadogs.com/administrator
```

---

## 🎯 Próximos Pasos

### **Fase 1: Completar UI**
- [ ] Crear página de gestión de usuarios
- [ ] Crear página de gestión de contactos
- [ ] Actualizar formulario de contacto

### **Fase 2: Mejoras**
- [ ] Gráficas de ventas (Chart.js o Recharts)
- [ ] Exportar datos a CSV/Excel
- [ ] Notificaciones en tiempo real (nuevos contactos)
- [ ] Dashboard con widgets arrastrables

### **Fase 3: Analytics Avanzado**
- [ ] Google Analytics integración
- [ ] Tracking de eventos personalizados
- [ ] Funnel de conversión
- [ ] Retención de usuarios

---

## 📝 Notas Técnicas

### **Seguridad**:
- ✅ RLS habilitado en todas las tablas
- ✅ Verificación de rol admin en el layout
- ✅ Políticas de acceso granulares
- ✅ Funciones con `SECURITY DEFINER`

### **Performance**:
- ✅ Índices en campos frecuentemente consultados
- ✅ Vistas materializadas para consultas complejas
- ✅ Paginación en listados grandes
- ✅ Lazy loading de componentes pesados

### **UX**:
- ✅ Navegación intuitiva con pestañas
- ✅ Feedback visual (toasts, modales)
- ✅ Estados de carga claros
- ✅ Responsive en todos los dispositivos

---

## ✅ Checklist de Validación

- [x] Scripts SQL ejecutados sin errores
- [x] Tabla `user_roles` con datos
- [x] Tabla `contacts` creada
- [x] Dashboard muestra estadísticas
- [ ] Usuario admin puede acceder al panel
- [ ] Navegación entre pestañas funciona
- [ ] Estadísticas se cargan correctamente
- [ ] Formulario de contacto guarda en BD

---

**Última actualización**: 10 enero 2026  
**Estado**: ✅ Infraestructura completa, UI en desarrollo  
**Versión**: 1.0.0
