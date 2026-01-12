# 🎮 Sistema de Gamificación Hakadogs

## 📋 Resumen

Sistema completo de badges, puntos, niveles y logros para aumentar el engagement de los usuarios en la plataforma educativa.

---

## 🗄️ 1. CONFIGURACIÓN DE SUPABASE

### Paso 1: Ejecutar el Script SQL

1. Ve a tu **Supabase Dashboard**
2. Navega a **SQL Editor**
3. Abre el archivo `supabase/gamification_system.sql`
4. **Copia todo el contenido** y pégalo en el editor
5. Haz clic en **RUN** para ejecutar

### Paso 2: Verificar Tablas Creadas

Deberías ver estas 5 nuevas tablas:

- ✅ `badges` - Catálogo de insignias
- ✅ `user_badges` - Badges ganados por usuarios
- ✅ `user_stats` - Estadísticas del usuario
- ✅ `badge_progress` - Progreso hacia badges
- ✅ `user_achievements` - Historial de logros

---

## 🎯 2. CARACTERÍSTICAS PRINCIPALES

### Sistema de Badges

#### Categorías de Badges:
- 🎓 **Progress**: Badges de progreso general
- 📚 **Courses**: Completar cursos
- 💡 **Knowledge**: Lecciones completadas
- ⏱️ **Time**: Rachas de días consecutivos
- ✨ **Special**: Badges especiales y secretos
- 👥 **Social**: Interacción con la comunidad

#### Tiers (Niveles):
- 🥉 **Bronze** - Común (10-30 puntos)
- 🥈 **Silver** - Raro (50-100 puntos)
- 🥇 **Gold** - Épico (150-250 puntos)
- 💎 **Platinum** - Legendario (500+ puntos)
- 💠 **Diamond** - Ultra-raro (1000+ puntos)

#### Rareza:
- **Common** - Gris (#94a3b8)
- **Rare** - Azul (#3b82f6)
- **Epic** - Naranja (#f59e0b)
- **Legendary** - Púrpura (#8b5cf6)

---

## 🏆 3. BADGES INCLUIDOS (15 iniciales)

### Badges de Bienvenida
1. 👋 **Bienvenido a Hakadogs** - Primer paso (10 pts)
2. 📚 **Primera Lección** - Completar 1 lección (20 pts)
3. 🎓 **Primer Curso** - Completar 1 curso (50 pts)

### Badges de Progreso en Cursos
4. 📖 **Aprendiz Dedicado** - 3 cursos completados (100 pts)
5. 🏆 **Experto Canino** - 5 cursos completados (200 pts)
6. 👑 **Maestro Hakadogs** - Todos los cursos (500 pts)

### Badges de Lecciones
7. ✨ **Estudiante Activo** - 10 lecciones (30 pts)
8. 💎 **Conocimiento Profundo** - 50 lecciones (150 pts)

### Badges de Racha (Streak)
9. 🔥 **Racha de 7 Días** - 7 días consecutivos (75 pts)
10. 🚀 **Racha de 30 Días** - 30 días consecutivos (250 pts)
11. ⚡ **Imparable** - 100 días consecutivos (1000 pts)

### Badges Especiales
12. 🌅 **Madrugador** - Lección antes de 7 AM (50 pts)
13. 🦉 **Búho Nocturno** - Lección después de 11 PM (50 pts)
14. 💯 **Perfeccionista** - 100% en 5 evaluaciones (200 pts)

### Badge Secreto
15. 🥚 **Descubridor** - Encontrar secreto oculto (500 pts)

---

## 📊 4. SISTEMA DE PUNTOS Y NIVELES

### Cálculo de Nivel
```
Nivel = √(Experiencia / 100) + 1
```

### Ejemplos:
- **Nivel 1**: 0-100 puntos
- **Nivel 2**: 100-400 puntos
- **Nivel 3**: 400-900 puntos
- **Nivel 5**: 1,600-2,500 puntos
- **Nivel 10**: 8,100-10,000 puntos

---

## 🔄 5. FUNCIONES AUTOMÁTICAS

El sistema incluye triggers automáticos que:

### ✅ Otorgan badges automáticamente cuando:
- Usuario completa su primera lección
- Usuario completa 10, 50 lecciones
- Usuario completa 1, 3, 5 cursos o todos
- Usuario mantiene racha de 7, 30, 100 días

### ✅ Actualizan estadísticas:
- Contador de lecciones completadas
- Contador de cursos completados
- Total de puntos
- Nivel del usuario
- Racha de días consecutivos

### ✅ Calculan progreso:
- Porcentaje hacia siguiente nivel
- Experiencia necesaria
- Ranking global

---

## 🎨 6. COMPONENTES DE FRONTEND

### Necesitaremos crear:

1. **BadgeCard** - Tarjeta individual de badge
2. **BadgeGrid** - Galería de badges
3. **BadgeNotification** - Notificación al desbloquear
4. **UserStatsCard** - Estadísticas del usuario
5. **ProgressBar** - Barra de progreso hacia nivel
6. **Leaderboard** - Tabla de clasificación
7. **BadgeShowcase** - Showcase en perfil
8. **StreakCounter** - Contador de racha

---

## 📱 7. PÁGINAS A CREAR/MODIFICAR

### Nuevas Páginas:
- `/cursos/badges` - Galería de todos los badges
- `/cursos/leaderboard` - Tabla de clasificación
- `/perfil/logros` - Logros del usuario

### Modificar:
- `/cursos/mi-escuela` - Añadir sección de badges destacados
- `/perfil` - Añadir estadísticas y badges destacados

---

## 🔧 8. FUNCIONES DE SUPABASE DISPONIBLES

### Para otorgar badges manualmente:
```sql
SELECT award_badge('user-uuid', 'badge_code');
```

### Para obtener leaderboard:
```sql
SELECT * FROM get_leaderboard(10, 'all_time');
```

### Para calcular nivel:
```sql
SELECT calculate_user_level('user-uuid');
```

---

## 🔐 9. SEGURIDAD (RLS)

Todas las tablas tienen políticas de seguridad:

- ✅ Usuarios pueden ver sus propios badges
- ✅ Usuarios pueden ver badges de otros (público)
- ✅ Solo el usuario puede actualizar sus stats
- ✅ Badges son visibles para todos
- ✅ Stats son públicas para leaderboard

---

## 📈 10. ANALYTICS Y MÉTRICAS

El sistema rastrea:

- Total de puntos acumulados
- Nivel actual y experiencia
- Cursos iniciados vs completados
- Lecciones completadas
- Tiempo total de estudio
- Racha actual y más larga
- Total de badges por rareza
- Posición en ranking global

---

## 🚀 11. PRÓXIMOS PASOS

1. ✅ **Ejecutar SQL en Supabase** (ya tienes el archivo)
2. ⏳ **Crear componentes de UI** (BadgeCard, etc.)
3. ⏳ **Crear páginas de badges y leaderboard**
4. ⏳ **Integrar notificaciones de badges**
5. ⏳ **Añadir animaciones al desbloquear**
6. ⏳ **Implementar sistema de badges destacados**

---

## 🎯 12. CASOS DE USO

### Ejemplo 1: Usuario completa primera lección
```typescript
// El trigger automático:
1. Detecta que user_lesson_progress.completed = true
2. Actualiza user_stats.lessons_completed
3. Verifica si lessons_completed = 1
4. Otorga badge 'first_lesson' automáticamente
5. Suma 20 puntos
6. Recalcula nivel
7. Muestra notificación en frontend
```

### Ejemplo 2: Usuario mantiene racha de 7 días
```typescript
// El trigger automático:
1. Detecta actividad en nuevo día
2. Compara con last_activity_date
3. Incrementa current_streak_days
4. Verifica si streak = 7
5. Otorga badge 'streak_7_days'
6. Suma 75 puntos
```

---

## 💡 13. CÓMO AÑADIR NUEVOS BADGES

```sql
INSERT INTO badges (
  code, 
  name, 
  description, 
  icon, 
  category, 
  tier, 
  points, 
  rarity, 
  color
) VALUES (
  'nuevo_badge',
  'Nombre del Badge',
  'Descripción del logro',
  '🎯',
  'courses',
  'gold',
  150,
  'epic',
  '#f59e0b'
);
```

Luego añadir lógica en `check_and_award_badges()` si es automático.

---

## 📞 14. TESTING

### Probar el sistema:

```sql
-- Crear stats para usuario de prueba
INSERT INTO user_stats (user_id) VALUES ('tu-user-uuid');

-- Otorgar badge manualmente
SELECT award_badge('tu-user-uuid', 'welcome');

-- Ver badges del usuario
SELECT * FROM user_badges WHERE user_id = 'tu-user-uuid';

-- Ver estadísticas
SELECT * FROM user_stats WHERE user_id = 'tu-user-uuid';

-- Ver leaderboard
SELECT * FROM get_leaderboard(10);
```

---

## 🎨 15. DISEÑO SUGERIDO

### Colores por Rareza:
- **Common**: Gris claro (#94a3b8)
- **Rare**: Azul (#3b82f6)
- **Epic**: Naranja (#f59e0b)
- **Legendary**: Púrpura (#8b5cf6)

### Efectos Visuales:
- Brillo sutil para badges desbloqueados
- Silueta gris para badges bloqueados
- Animación de "unlock" con confetti
- Progress bar animada hacia siguiente nivel
- Contador de racha con efecto de fuego 🔥

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend (Supabase) ✅
- [x] Crear tablas
- [x] Crear funciones automáticas
- [x] Insertar badges iniciales
- [x] Configurar RLS
- [x] Crear triggers

### Frontend (Pendiente)
- [ ] Crear componentes de badges
- [ ] Crear página de galería
- [ ] Crear página de leaderboard
- [ ] Integrar notificaciones
- [ ] Añadir animaciones
- [ ] Integrar en perfil
- [ ] Integrar en mi-escuela

---

## 🎉 RESULTADO ESPERADO

Los usuarios tendrán:
- 🎯 **Motivación constante** para completar cursos
- 🏆 **Reconocimiento** por sus logros
- 📊 **Visualización clara** de su progreso
- 🔥 **Incentivo** para mantener rachas
- 👥 **Competencia sana** con leaderboard
- 🎨 **Experiencia gamificada** atractiva

---

**Creado para Hakadogs** 🐕  
Sistema de Gamificación v1.0  
Enero 2026
