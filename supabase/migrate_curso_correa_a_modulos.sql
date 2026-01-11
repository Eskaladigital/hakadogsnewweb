-- =============================================
-- MIGRAR CURSO "Caminar sin Tirar de la Correa"
-- =============================================
-- De 82 lecciones → 15 módulos temáticos

-- IMPORTANTE: Ejecutar DESPUÉS de "add_modules_structure.sql"

-- Obtener el ID del curso
DO $$
DECLARE
  curso_id UUID;
  modulo_01_id UUID;
  modulo_02_id UUID;
  modulo_03_id UUID;
  modulo_04_id UUID;
  modulo_05_id UUID;
  modulo_06_id UUID;
  modulo_07_id UUID;
  modulo_08_id UUID;
  modulo_09_id UUID;
  modulo_10_id UUID;
  modulo_11_id UUID;
  modulo_12_id UUID;
  modulo_13_id UUID;
  modulo_14_id UUID;
  modulo_15_id UUID;
BEGIN
  -- Buscar el curso por slug
  SELECT id INTO curso_id 
  FROM courses 
  WHERE slug = 'como-ensenar-a-tu-perro-a-caminar-sin-tirar-de-la-correa';
  
  IF curso_id IS NULL THEN
    RAISE EXCEPTION 'Curso no encontrado';
  END IF;
  
  RAISE NOTICE 'Curso encontrado: %', curso_id;
  
  -- CREAR MÓDULOS (ajusta títulos según tu contenido real)
  
  -- Módulo 1
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Bienvenida y Mapa del Curso', 'Introducción al curso y objetivos', 1)
  RETURNING id INTO modulo_01_id;
  
  -- Módulo 2
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Fundamentos del Paseo', 'Conceptos básicos para caminar sin tirones', 2)
  RETURNING id INTO modulo_02_id;
  
  -- Módulo 3
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Equipamiento y Herramientas', 'Arnés, correa y accesorios adecuados', 3)
  RETURNING id INTO modulo_03_id;
  
  -- Módulo 4
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Posición Inicial y Atención', 'Ejercicios de contacto visual y posición', 4)
  RETURNING id INTO modulo_04_id;
  
  -- Módulo 5
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Primeros Pasos en Casa', 'Práctica en entorno controlado', 5)
  RETURNING id INTO modulo_05_id;
  
  -- Módulo 6
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Gestión de la Correa', 'Técnicas de manejo y tensión', 6)
  RETURNING id INTO modulo_06_id;
  
  -- Módulo 7
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Ejercicios de Parada', 'Detención ante tirones', 7)
  RETURNING id INTO modulo_07_id;
  
  -- Módulo 8
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Refuerzo Positivo en Movimiento', 'Recompensar el buen paseo', 8)
  RETURNING id INTO modulo_08_id;
  
  -- Módulo 9
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Entorno Real: Primeros Exteriores', 'Transición a espacios abiertos', 9)
  RETURNING id INTO modulo_09_id;
  
  -- Módulo 10
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Manejo de Distracciones', 'Otros perros, personas, estímulos', 10)
  RETURNING id INTO modulo_10_id;
  
  -- Módulo 11
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Problemas Frecuentes', 'Solución de casos comunes', 11)
  RETURNING id INTO modulo_11_id;
  
  -- Módulo 12
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Consolidación y Generalización', 'Diferentes rutas y contextos', 12)
  RETURNING id INTO modulo_12_id;
  
  -- Módulo 13
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Mantenimiento a Largo Plazo', 'Estrategias de mantenimiento', 13)
  RETURNING id INTO modulo_13_id;
  
  -- Módulo 14
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Casos Avanzados', 'Situaciones complejas y soluciones', 14)
  RETURNING id INTO modulo_14_id;
  
  -- Módulo 15
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (curso_id, 'Cierre y Próximos Pasos', 'Resumen y plan de acción', 15)
  RETURNING id INTO modulo_15_id;
  
  -- ASIGNAR LECCIONES A MÓDULOS (distribuir las 82 lecciones)
  -- Esto es una distribución APROXIMADA - ajústalo según tu contenido real
  
  -- Lecciones 1-5 → Módulo 1 (Bienvenida)
  UPDATE course_lessons SET module_id = modulo_01_id
  WHERE course_id = curso_id AND order_index BETWEEN 1 AND 5;
  
  -- Lecciones 6-11 → Módulo 2 (Fundamentos)
  UPDATE course_lessons SET module_id = modulo_02_id
  WHERE course_id = curso_id AND order_index BETWEEN 6 AND 11;
  
  -- Lecciones 12-16 → Módulo 3 (Equipamiento)
  UPDATE course_lessons SET module_id = modulo_03_id
  WHERE course_id = curso_id AND order_index BETWEEN 12 AND 16;
  
  -- Lecciones 17-22 → Módulo 4 (Posición)
  UPDATE course_lessons SET module_id = modulo_04_id
  WHERE course_id = curso_id AND order_index BETWEEN 17 AND 22;
  
  -- Lecciones 23-28 → Módulo 5 (Casa)
  UPDATE course_lessons SET module_id = modulo_05_id
  WHERE course_id = curso_id AND order_index BETWEEN 23 AND 28;
  
  -- Lecciones 29-34 → Módulo 6 (Gestión correa)
  UPDATE course_lessons SET module_id = modulo_06_id
  WHERE course_id = curso_id AND order_index BETWEEN 29 AND 34;
  
  -- Lecciones 35-40 → Módulo 7 (Parada)
  UPDATE course_lessons SET module_id = modulo_07_id
  WHERE course_id = curso_id AND order_index BETWEEN 35 AND 40;
  
  -- Lecciones 41-47 → Módulo 8 (Refuerzo)
  UPDATE course_lessons SET module_id = modulo_08_id
  WHERE course_id = curso_id AND order_index BETWEEN 41 AND 47;
  
  -- Lecciones 48-54 → Módulo 9 (Exteriores)
  UPDATE course_lessons SET module_id = modulo_09_id
  WHERE course_id = curso_id AND order_index BETWEEN 48 AND 54;
  
  -- Lecciones 55-61 → Módulo 10 (Distracciones)
  UPDATE course_lessons SET module_id = modulo_10_id
  WHERE course_id = curso_id AND order_index BETWEEN 55 AND 61;
  
  -- Lecciones 62-67 → Módulo 11 (Problemas)
  UPDATE course_lessons SET module_id = modulo_11_id
  WHERE course_id = curso_id AND order_index BETWEEN 62 AND 67;
  
  -- Lecciones 68-73 → Módulo 12 (Consolidación)
  UPDATE course_lessons SET module_id = modulo_12_id
  WHERE course_id = curso_id AND order_index BETWEEN 68 AND 73;
  
  -- Lecciones 74-78 → Módulo 13 (Mantenimiento)
  UPDATE course_lessons SET module_id = modulo_13_id
  WHERE course_id = curso_id AND order_index BETWEEN 74 AND 78;
  
  -- Lecciones 79-81 → Módulo 14 (Avanzados)
  UPDATE course_lessons SET module_id = modulo_14_id
  WHERE course_id = curso_id AND order_index BETWEEN 79 AND 81;
  
  -- Lección 82 → Módulo 15 (Cierre)
  UPDATE course_lessons SET module_id = modulo_15_id
  WHERE course_id = curso_id AND order_index = 82;
  
  RAISE NOTICE '✅ Migración completada: 82 lecciones organizadas en 15 módulos';
END $$;

-- 7. VERIFICAR RESULTADOS
SELECT 
  cm.order_index as "Módulo #",
  cm.title as "Título Módulo",
  COUNT(cl.id) as "Lecciones",
  SUM(cl.duration_minutes) as "Duración (min)"
FROM course_modules cm
LEFT JOIN course_lessons cl ON cl.module_id = cm.id
JOIN courses c ON c.id = cm.course_id
WHERE c.slug = 'como-ensenar-a-tu-perro-a-caminar-sin-tirar-de-la-correa'
GROUP BY cm.id, cm.order_index, cm.title
ORDER BY cm.order_index;
