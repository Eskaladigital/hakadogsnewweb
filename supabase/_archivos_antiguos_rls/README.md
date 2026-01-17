# 📁 Archivos Antiguos de RLS

**Fecha de archivo:** 15 Enero 2026  
**Razón:** Políticas RLS obsoletas reemplazadas por configuración definitiva

---

## ⚠️ IMPORTANTE

Estos archivos contienen **políticas RLS antiguas y obsoletas** que causaban problemas.

**NO USAR ESTOS ARCHIVOS** ❌

---

## 📄 Archivos Archivados

| Archivo | Fecha Original | Razón de Archivo |
|---------|---------------|------------------|
| `DESHABILITAR_RLS_AHORA.sql` | 13/01/2026 | Script de emergencia, ya no necesario |
| `fix_rls_policies.sql` | 13/01/2026 | Versión antigua con 40+ políticas |
| `FIX_ALTERNATIVO_PERMISIVO.sql` | ~13/01/2026 | Solución temporal demasiado permisiva |
| `FIX_ALTERNATIVO_SIMPLE.sql` | ~13/01/2026 | Versión de prueba incompleta |
| `FIX_URGENTE_403_406.sql` | ~13/01/2026 | Fix específico para errores, ya incluido |
| `FIX_SIMPLE_AHORA.sql` | ~13/01/2026 | Versión experimental |
| `SOLUCION_DEFINITIVA.sql` | ~14/01/2026 | No era tan definitiva después de todo |
| `check_current_policies.sql` | ~13/01/2026 | Script de diagnóstico, reemplazado |
| `DIAGNOSTICO_COMPLETO.sql` | ~13/01/2026 | Script de diagnóstico antiguo |
| `DIAGNOSTICO_ERROR_500.sql` | ~13/01/2026 | Diagnóstico específico, ya no necesario |

---

## ✅ Script Actual y Definitivo

**Usar este en su lugar:** `../POLITICAS_RLS_DEFINITIVAS.sql`

Este script:
- ✅ Contiene la configuración final optimizada
- ✅ Reduce de 40+ a 11 políticas
- ✅ Funciona sin errores 403/406/500
- ✅ Está bien documentado
- ✅ Es la única fuente de verdad

---

## 📚 Documentación Actual

Para cualquier consulta sobre políticas RLS, consultar:

1. `../POLITICAS_RLS_DEFINITIVAS.sql` - Script SQL ejecutable
2. `../POLITICAS_RLS_EXPLICADAS.md` - Guía completa
3. `../REFERENCIA_RAPIDA_RLS.md` - Comandos rápidos
4. `../../docs/POLITICAS_RLS_RESUMEN.md` - Resumen ejecutivo

---

## 🗑️ ¿Puedo Borrar Esta Carpeta?

**Sí, pero no es urgente.**

Esta carpeta se mantiene por:
- Referencia histórica
- Backup de seguridad
- Documentación de evolución

Si el espacio es problema, se puede eliminar sin afectar al sistema.

---

## 📝 Historial

- **13-14 Enero 2026:** Múltiples intentos de configuración RLS
- **15 Enero 2026:** Configuración definitiva creada
- **15 Enero 2026:** Archivos antiguos movidos aquí

---

**Estado:** Archivados para referencia histórica  
**Acción recomendada:** No usar, consultar documentación actual
