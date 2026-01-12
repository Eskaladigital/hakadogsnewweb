# 🚀 Panel de Administración - Guía de Setup Completa

**Fecha**: 10 enero 2026  
**Estado**: ✅ **COMPLETADO Y FUNCIONAL**  
**Versión**: 1.0.0 FINAL

---

## ✅ **¡SISTEMA COMPLETO Y OPERATIVO!**

El panel de administración está 100% funcional con:

1. ✅ **Dashboard** - Estadísticas en tiempo real con KPIs
2. ✅ **Usuarios** - Gestión completa con cambio de roles
3. ✅ **Cursos** - Gestión de cursos y lecciones (existente)
4. ✅ **Contactos** - Workflow completo con estado editable desde tabla

---

## 📋 Instrucciones de Setup (Paso a Paso)

### **PASO 1: Ejecutar Scripts SQL en Supabase**

Abre el **SQL Editor** en Supabase Dashboard y ejecuta los scripts en este orden:

#### **1.1 - Crear tabla de roles** ⏱️ 2 min

```bash
# Archivo: supabase/user_roles_table.sql
```

**Qué hace**:
- Crea tabla `user_roles`
- Configura RLS (Row Level Security)
- Crea funciones `get_user_role()` y `is_admin()`
- Trigger automático: nuevo usuario → rol "user"

**Verificar**:
```sql
SELECT * FROM public.user_roles LIMIT 5;
```

---

#### **1.2 - Crear tabla de contactos** ⏱️ 2 min

```bash
# Archivo: supabase/contacts_table.sql
```

**Qué hace**:
- Crea tabla `contacts`
- Estados de workflow (pending, in_progress, responded, closed)
- Vista `contacts_admin_view` con info enriquecida
- Funciones `get_contacts_stats()` y `mark_contact_responded()`

**Verificar**:
```sql
SELECT * FROM public.contacts LIMIT 5;
SELECT * FROM contacts_admin_view LIMIT 5;
```

---

#### **1.3 - Crear funciones del dashboard** ⏱️ 3 min

```bash
# Archivo: supabase/dashboard_functions.sql
```

**Qué hace**:
- Crea 7 funciones para estadísticas
- `get_dashboard_stats()` - Stats generales
- `get_recent_users()`, `get_recent_sales()`, `get_recent_contacts()`
- `get_sales_chart_data()` - Datos para gráficas
- `get_top_selling_courses()` - Top ventas
- `get_conversion_metrics()` - Métricas de conversión

**Verificar**:
```sql
SELECT get_dashboard_stats();
SELECT * FROM get_recent_users(5);
```

---

### **PASO 2: Asignar Rol de Administrador** ⏱️ 1 min

**Opción A - SQL Editor**:

```sql
-- Reemplaza 'TU_EMAIL@example.com' con tu email
WITH user_data AS (
  SELECT id FROM auth.users 
  WHERE email = 'TU_EMAIL@example.com'
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM user_data
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

**Opción B - Usar script existente**:
```bash
# Edita: supabase/update_user_role.sql
# Cambia el email y ejecuta
```

**Verificar**:
```sql
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'TU_EMAIL@example.com';
```

Debe mostrar: `role = 'admin'`

---

### **PASO 3: Acceder al Panel** ⏱️ 1 min

1. **Ir a**: `https://www.hakadogs.com/administrator`
2. **Login** con tu cuenta admin
3. **Verás**: Dashboard con 4 pestañas

---

## 🎯 Estructura del Panel

```
/administrator
├── Dashboard (/)
│   ├── 6 tarjetas de estadísticas
│   ├── Usuarios recientes (5)
│   ├── Ventas recientes (5)
│   └── Contactos recientes (tabla)
│
├── Usuarios (/usuarios)
│   ├── Listado completo
│   ├── Búsqueda por email/nombre
│   ├── Filtro por rol
│   ├── Cambiar rol de usuario
│   └── Ver info detallada
│
├── Cursos (/cursos)
│   ├── Listado completo
│   ├── Crear/Editar/Eliminar
│   ├── Gestión de lecciones
│   ├── Publicar/Despublicar
│   └── Estadísticas de ventas
│
└── Contactos (/contactos)
    ├── Listado por estado
    ├── Búsqueda por nombre/email/asunto
    ├── Ver detalles completos
    ├── Agregar notas internas
    ├── Cambiar estado
    ├── Marcar como respondido
    └── Eliminar contacto
```

---

## 📊 Funcionalidades por Sección

### **1. Dashboard** 

**Estadísticas Principales**:
- Usuarios Totales (+X hoy)
- Cursos Publicados (X total)
- Ventas del Mes (+X hoy)
- Ingresos del Mes (X€ total)
- Contactos Pendientes (X total)
- Cursos Completados (X% promedio)

**Actividad Reciente**:
- 5 usuarios más recientes (nombre, email, rol, fecha)
- 5 ventas más recientes (curso, usuario, precio, fecha)
- Contactos recientes (tabla completa con estados)

**Características**:
- ✅ Datos en tiempo real
- ✅ Links a cada sección
- ✅ Badges de estado
- ✅ Formato de fechas localizado

---

### **2. Usuarios**

**Listado**:
- Nombre/Email
- Rol (badge con icono)
- Fecha de registro
- Último acceso

**Búsqueda**:
- Por email o nombre
- Filtro por rol (admin/instructor/user)
- Contador de resultados

**Cambiar Rol**:
- Modal de edición
- 3 roles: Admin, Instructor, Usuario
- Advertencia para rol admin
- Confirmación y feedback

**Estadísticas**:
- Total usuarios
- Admins
- Instructores
- Usuarios regulares

---

### **3. Cursos**

**Funcionalidades** (ya existente):
- CRUD completo de cursos
- Gestión de lecciones
- Editor TinyMCE
- Upload de audio/archivos
- Publicar/Despublicar
- Estadísticas de ventas

---

### **4. Contactos**

**Listado**:
- Nombre, Email, Teléfono
- Asunto del mensaje
- **Estado editable directamente** (dropdown en tabla)
- Fecha y tiempo desde creación

**Estados del Workflow**:
- 🔴 **Pendiente** - Nuevo mensaje sin atender
- 🟡 **En Progreso** - Siendo atendido
- 🟢 **Respondido** - Mensaje respondido
- ⚫ **Cerrado** - Caso cerrado

**Edición de Estado**:
- ✅ **Dropdown directamente en tabla** (sin necesidad de modal)
- Cambio instantáneo con actualización en BD
- Toast de confirmación
- Colores distintivos por estado

**Modal de Detalles**:
- Info completa del contacto
- Mensaje completo
- Notas internas editables
- Cambiar estado (4 botones rápidos)
- Marcar como respondido (registra admin + fecha)
- Eliminar con confirmación

**Búsqueda**:
- Por nombre, email o asunto
- Filtro por estado
- Contador de resultados

**Estadísticas**:
- Total contactos
- Pendientes
- En progreso
- Respondidos
- Cerrados

---

## 🔒 Seguridad

### **Row Level Security (RLS)**:

✅ **user_roles**:
- Usuarios pueden ver su propio rol
- Solo admins ven todos los roles
- Solo admins pueden modificar roles

✅ **contacts**:
- Solo admins pueden ver/editar/eliminar
- Cualquiera puede crear (formulario público)

✅ **Funciones**:
- Solo usuarios autenticados pueden ejecutar
- SECURITY DEFINER para acceso controlado
- Verificación de rol admin en el frontend

### **Frontend**:
- Layout verifica rol admin antes de mostrar contenido
- Redirección automática si no es admin
- Session management con Supabase Auth

---

## 🧪 Testing

### **1. Dashboard**:
```bash
# Verificar que carga sin errores
1. Ir a /administrator
2. Debe mostrar 6 tarjetas con números
3. Debe mostrar listas de usuarios/ventas/contactos
```

### **2. Usuarios**:
```bash
# Verificar gestión de usuarios
1. Ir a /administrator/usuarios
2. Buscar un usuario por email
3. Filtrar por rol
4. Cambiar rol de un usuario
5. Verificar toast de éxito
```

### **3. Contactos**:
```bash
# Verificar gestión de contactos
1. Ir a /administrator/contactos
2. Ver detalles de un contacto
3. Agregar notas internas
4. Cambiar estado
5. Marcar como respondido
```

---

## 🐛 Troubleshooting

### **Error: "No permission to execute function"**

**Solución**:
```sql
-- Verificar grants
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_users(INTEGER) TO authenticated;
-- etc. (ver dashboard_functions.sql)
```

---

### **Error: "No rows returned" en dashboard**

**Solución**:
```sql
-- Verificar que las tablas tienen datos
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.courses;
SELECT COUNT(*) FROM public.user_courses;
SELECT COUNT(*) FROM public.contacts;
```

---

### **Error: "Not authorized" al acceder a /administrator**

**Solución**:
```sql
-- Verificar tu rol
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'TU_EMAIL@example.com';

-- Si no aparece 'admin', asignar rol:
INSERT INTO public.user_roles (user_id, role)
VALUES ('TU_USER_ID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

### **Error: Tabla "contacts" no existe**

**Solución**:
```bash
# Ejecutar scripts en orden:
1. user_roles_table.sql
2. contacts_table.sql
3. dashboard_functions.sql
```

---

## 📝 Próximas Mejoras (Opcionales)

### **Fase 2 - Analytics Avanzado**:
- [ ] Gráficas de ventas por mes (Chart.js)
- [ ] Embudo de conversión
- [ ] Retención de usuarios
- [ ] Heatmap de actividad

### **Fase 3 - Automatización**:
- [ ] Respuestas automáticas a contactos
- [ ] Emails de notificación a admins
- [ ] Recordatorios de seguimiento
- [ ] Exportar datos a CSV/Excel

### **Fase 4 - Integraciones**:
- [ ] Google Analytics 4
- [ ] Mailchimp/SendGrid
- [ ] Webhooks externos
- [ ] API REST para terceros

---

## ✅ Checklist Final

- [x] Scripts SQL ejecutados sin errores
- [x] Tabla `user_roles` creada
- [x] Tabla `contacts` creada
- [x] Funciones del dashboard creadas
- [x] Rol admin asignado a tu usuario
- [x] Dashboard carga correctamente
- [x] Gestión de usuarios funciona
- [x] Gestión de contactos funciona
- [x] **Estado editable desde tabla de contactos**
- [x] Formulario de contacto actualizado
- [x] Toast notifications operativos
- [x] Manejo de errores resiliente
- [x] **Sistema completo en producción**

---

## 🎉 ¡Listo y en Producción!

Tu panel de administración está completo, funcional y desplegado en producción.

**URL**: `https://www.hakadogs.com/administrator`

**Funcionalidades Completas**:
- ✅ Dashboard con estadísticas en tiempo real y KPIs
- ✅ Gestión completa de usuarios con cambio de roles
- ✅ Gestión completa de cursos con IA integrada
- ✅ **Gestión completa de contactos con estado editable directamente desde tabla**
- ✅ Workflow de 4 estados para seguimiento de contactos
- ✅ Modal de detalles con notas internas
- ✅ Toast notifications para feedback
- ✅ Manejo resiliente de errores

**Nuevas Características**:
- 🎯 **Estado editable inline** - Cambia el estado sin abrir modal
- 🎨 **Colores dinámicos** - Visualización clara del workflow
- ⚡ **Actualización instantánea** - Sin recargar la página
- 💾 **Persistencia automática** - Guardado en Supabase

---

**Última actualización**: 10 enero 2026  
**Estado**: ✅ **PRODUCCIÓN READY Y DESPLEGADO**  
**Versión**: 1.0.0 FINAL
