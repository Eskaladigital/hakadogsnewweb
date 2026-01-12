# 🚀 INSTALACIÓN RÁPIDA - Sistema de Gamificación

## ⚡ Pasos para activar el sistema

### 1️⃣ Instalar dependencias (IMPORTANTE)
```bash
npm install
```

Esto instalará `react-confetti` que se añadió al package.json.

### 2️⃣ Verificar que Supabase esté configurado
El SQL ya fue ejecutado en Supabase ✅

### 3️⃣ Ejecutar la aplicación
```bash
npm run dev
```

### 4️⃣ Probar las nuevas páginas

Abre tu navegador y visita:

1. **Mi Escuela con gamificación**
   ```
   http://localhost:3000/cursos/mi-escuela
   ```
   - Verás tu nivel, puntos y racha
   - Tus badges recientes
   - Estadísticas completas

2. **Galería de Badges**
   ```
   http://localhost:3000/cursos/badges
   ```
   - Todos los badges disponibles
   - Filtros por categoría y estado
   - Barra de progreso de colección

3. **Tabla de Clasificación**
   ```
   http://localhost:3000/cursos/leaderboard
   ```
   - Top usuarios
   - Tu posición en el ranking
   - Competencia sana

---

## 🧪 PROBAR EL SISTEMA

### Opción A: Usar la aplicación normalmente
1. Inicia sesión o regístrate
2. Ve a "Mi Escuela"
3. Completa una lección de cualquier curso
4. ¡Automáticamente ganarás badges! 🎉

### Opción B: Otorgar badges manualmente (para testing)
Ve a Supabase Dashboard → SQL Editor y ejecuta:

```sql
-- Reemplaza 'TU-USER-ID' con tu ID de usuario real
-- Lo puedes obtener desde auth.users

-- Otorgar badge de bienvenida
SELECT award_badge('TU-USER-ID', 'welcome');

-- Otorgar primera lección
SELECT award_badge('TU-USER-ID', 'first_lesson');

-- Otorgar primer curso
SELECT award_badge('TU-USER-ID', 'first_course');

-- Ver tus badges
SELECT 
  ub.earned_at,
  b.name,
  b.icon,
  b.points
FROM user_badges ub
JOIN badges b ON b.id = ub.badge_id
WHERE ub.user_id = 'TU-USER-ID';

-- Ver tus estadísticas
SELECT * FROM user_stats WHERE user_id = 'TU-USER-ID';
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Checklist
- [ ] `npm install` ejecutado sin errores
- [ ] Aplicación corre con `npm run dev`
- [ ] Página Mi Escuela muestra sección de gamificación
- [ ] Puedes acceder a /cursos/badges
- [ ] Puedes acceder a /cursos/leaderboard
- [ ] Los badges se muestran correctamente
- [ ] Las estadísticas se cargan

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module 'react-confetti'"
**Solución:**
```bash
npm install react-confetti
```

### Error: "Table badges does not exist"
**Solución:** Ejecuta el SQL en Supabase:
1. Ve a Supabase Dashboard
2. SQL Editor
3. Copia el contenido de `supabase/gamification_system.sql`
4. Ejecuta (RUN)

### Los badges no se muestran
**Solución:** Verifica que hay badges en la base de datos:
```sql
SELECT COUNT(*) FROM badges;
-- Debería devolver 15
```

Si no hay badges, ejecuta de nuevo el SQL completo.

### Las estadísticas no se actualizan
**Solución:** Verifica que los triggers estén creados:
```sql
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Deberías ver:
- `trigger_update_stats_on_lesson`
- `trigger_update_stats_on_course`
- `trigger_check_badges`
- `trigger_update_streak`

---

## 🎯 PRÓXIMOS PASOS

Una vez que todo funcione:

1. **Personaliza los badges**
   - Añade más badges específicos para Hakadogs
   - Modifica los puntos según tus necesidades
   - Crea badges por cursos específicos

2. **Ajusta la gamificación**
   - Cambia los niveles necesarios
   - Modifica los hitos de racha
   - Personaliza los mensajes motivacionales

3. **Promociona el sistema**
   - Informa a tus usuarios sobre las nuevas funcionalidades
   - Crea challenges/retos
   - Organiza competencias mensuales

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, consulta:
- `SISTEMA_GAMIFICACION.md` - Documentación técnica
- `PREPARACION_GAMIFICACION_COMPLETA.md` - Guía de preparación
- `IMPLEMENTACION_GAMIFICACION_COMPLETA.md` - Resumen de implementación

---

## 🆘 AYUDA

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la consola del terminal
3. Verifica que Supabase esté accesible
4. Comprueba las variables de entorno

---

**¡Listo para gamificar! 🎮**

Hakadogs - Sistema de Gamificación v1.0
