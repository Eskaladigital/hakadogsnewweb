# 📁 Índice de Archivos SQL - Supabase

**Actualizado:** 28 Enero 2026  
**Versión:** 3.1.0 - Integración Stripe + Fix Dashboard

---

## 🎯 Archivos Principales

### 💳 Stripe y Pagos (NUEVO - v3.1.0)

| Archivo | Tipo | Usar Para |
|---------|------|-----------|
| **`FIX_COURSE_PURCHASES_RLS.sql`** | ⭐ NUEVO | Fix RLS para compras con Stripe |
| **`FIX_DASHBOARD_RLS.sql`** | ⭐ NUEVO | Fix estadísticas dashboard y valoraciones |
| **`FIX_ERROR_USUARIO_NO_EXISTE.sql`** | ⭐ NUEVO | Fix error "usuario no existe" al hacer login |

### ⭐ Políticas RLS

| Archivo | Tipo | Usar Para |
|---------|------|-----------|
| **`POLITICAS_RLS_DEFINITIVAS.sql`** | ⭐ PRINCIPAL | Aplicar políticas RLS definitivas |
| `POLITICAS_RLS_EXPLICADAS.md` | 📖 Docs | Entender el sistema completo |
| `REFERENCIA_RAPIDA_RLS.md` | 📋 Ref | Comandos rápidos y troubleshooting |
| `RESUMEN_VISUAL_RLS.txt` | 📊 Visual | Diagrama ASCII del sistema |

---

## 📦 Schema Completo

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `setup_completo.sql` | Base de cursos completa | ✅ Activo |
| `gamification_system.sql` | Sistema de gamificación | ✅ Activo |
| `blog_schema.sql` | Sistema de blog | ✅ Activo |
| `user_roles_table.sql` | Roles de usuario | ✅ Activo |
| `contacts_table.sql` | Sistema de contactos | ✅ Activo |
| `dashboard_functions.sql` | Funciones RPC del dashboard | ✅ Activo |
| `city_content_cache.sql` | Caché de contenido IA | ✅ Activo |

---

## 🔧 Scripts de Fixes Específicos

| Archivo | Para qué sirve | Cuándo usar |
|---------|---------------|-------------|
| **`FIX_DASHBOARD_RLS.sql`** | ⭐ Fix dashboard y valoraciones | Si estadísticas muestran 0 |
| **`FIX_COURSE_PURCHASES_RLS.sql`** | ⭐ Fix compras Stripe | Si error 406 en compras |
| **`FIX_ERROR_USUARIO_NO_EXISTE.sql`** | ⭐ Fix error login usuario | Si error "usuario no existe" al hacer login |
| `module_tests_rls.sql` | RLS para tests de módulos | Si reinstalar tests |
| `blog_storage_SOLO_RLS.sql` | RLS para imágenes blog | Si reinstalar blog |
| `fix_badge_counter.sql` | Fix contador de badges | Si falla contador |
| `fix_streak_realista.sql` | Fix rachas realistas | Si fallan rachas |
| `badges_mejorados.sql` | Badges optimizados | Si reinstalar badges |
| `FIX_GAMIFICACION_TRIGGER.sql` | Fix triggers gamificación | Si fallan triggers |
| `FIX_MODULE_TESTS_RPC.sql` | Fix funciones RPC tests | Si fallan RPCs |
| `FIX_REGISTRO_USUARIOS.sql` | Fix registro usuarios | Si falla registro |
| `FIX_ERROR_406.sql` | Fix error 406 específico | Si error 406 persiste |

---

## 🗄️ Archivos Archivados

📁 **`_archivos_antiguos_rls/`** - Scripts RLS obsoletos

**⚠️ NO USAR** - Contiene versiones antiguas con 40+ políticas que causaban problemas.

Archivos dentro:
- `fix_rls_policies.sql` (obsoleto)
- `DESHABILITAR_RLS_AHORA.sql` (obsoleto)
- `FIX_ALTERNATIVO_*.sql` (obsoletos)
- `SOLUCION_DEFINITIVA.sql` (obsoleto)
- Y otros 6 scripts antiguos

**Usar en su lugar:** `POLITICAS_RLS_DEFINITIVAS.sql`

---

## 🚀 Guía Rápida de Uso

### Instalación Nueva

```
1. setup_completo.sql           - Base de cursos
2. user_roles_table.sql          - Roles
3. contacts_table.sql            - Contactos
4. dashboard_functions.sql       - Dashboard
5. blog_schema.sql               - Blog
6. city_content_cache.sql        - Caché IA
7. gamification_system.sql       - Gamificación
8. POLITICAS_RLS_DEFINITIVAS.sql - RLS (IMPORTANTE)
```

### Solo Aplicar Políticas RLS

```
1. Ejecutar: POLITICAS_RLS_DEFINITIVAS.sql
2. Verificar con comandos de: REFERENCIA_RAPIDA_RLS.md
```

### Solucionar Problema RLS

```
1. Consultar: POLITICAS_RLS_EXPLICADAS.md (Sección 7)
2. Ejecutar comandos de: REFERENCIA_RAPIDA_RLS.md
3. Si persiste: Re-ejecutar POLITICAS_RLS_DEFINITIVAS.sql
```

---

## ⚠️ Reglas Importantes

### ✅ USAR

- `POLITICAS_RLS_DEFINITIVAS.sql` - Para políticas RLS
- Archivos en la raíz de `/supabase/` (excepto `_archivos_antiguos_rls/`)
- Documentación `.md` reciente

### ❌ NO USAR

- Nada dentro de `_archivos_antiguos_rls/`
- Scripts con nombres como `FIX_ALTERNATIVO_*`
- Versiones viejas de `fix_rls_policies.sql`

### 🤔 Si tienes duda

1. Pregunta antes de ejecutar
2. Consulta `README.md` principal
3. Revisa fecha del archivo (usar los más recientes)

---

## 📊 Estadísticas

| Categoría | Cantidad |
|-----------|----------|
| Scripts activos principales | 7 |
| Scripts de fixes específicos | 12 |
| Scripts RLS definitivos | 4 (1 SQL + 3 docs) |
| Scripts Stripe/Dashboard/Auth | 3 |
| Scripts archivados (obsoletos) | 10 |
| **Total archivos útiles** | **26** |

---

## 📞 Soporte

**¿Qué archivo usar?**
- Para RLS: `POLITICAS_RLS_DEFINITIVAS.sql`
- Para Stripe/Pagos: `FIX_COURSE_PURCHASES_RLS.sql`
- Para Dashboard: `FIX_DASHBOARD_RLS.sql`
- Para error login: `FIX_ERROR_USUARIO_NO_EXISTE.sql`
- Para instalación completa: Orden indicado en "Instalación Nueva"
- Para fixes: Según el problema específico

**¿Tengo que ejecutar todos los archivos?**
- No, solo los necesarios según tu situación
- Si instalas desde cero: sí, ejecutar en orden
- Si solo actualizas RLS: solo `POLITICAS_RLS_DEFINITIVAS.sql`

**¿Puedo borrar `_archivos_antiguos_rls/`?**
- Sí, pero no es urgente
- Se mantiene solo como referencia histórica

---

## 🔄 Última Actualización

- **Fecha:** 28 Enero 2026
- **Cambio principal:** Integración Stripe + Fix Dashboard/Valoraciones + Fix Login
- **Archivos nuevos:** `FIX_DASHBOARD_RLS.sql`, `FIX_COURSE_PURCHASES_RLS.sql`, `FIX_ERROR_USUARIO_NO_EXISTE.sql`
- **Estado:** ✅ Stripe funcionando en producción

---

**Proyecto:** Hakadogs - Educación Canina Profesional  
**Mantener actualizado:** Sí, con cada cambio importante
