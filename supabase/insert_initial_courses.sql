-- =============================================
-- INSERTAR CURSOS INICIALES DE HAKADOGS
-- =============================================
-- Ejecuta este script DESPUÉS de haber ejecutado schema_cursos.sql
-- 
-- IMPORTANTE: El primer curso será GRATUITO, el resto de PAGO
-- Luego podrás editar cada curso desde el panel de administración
-- =============================================

-- 1. CURSO: Cómo Enseñar a tu Perro a Sentarse
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a Sentarse',
  'como-ensenar-a-tu-perro-a-sentarse',
  'Aprende el comando más básico y fundamental de la educación canina. Perfecto para empezar.',
  'Aprende el comando más básico y fundamental de la educación canina. Perfecto para empezar.',
  9.99,
  'basico',
  ARRAY[
    'Técnica paso a paso para enseñar "Sentado"',
    'Cómo reforzar el comportamiento correctamente',
    'Errores comunes y cómo evitarlos',
    'Ejercicios prácticos con videos'
  ],
  false,
  false,
  1
);

-- 2. CURSO: Cómo Enseñar a tu Perro a Venir cuando le Llamas
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a Venir cuando le Llamas',
  'como-ensenar-a-tu-perro-a-venir-cuando-le-llamas',
  'La llamada más importante. Aprende a conseguir que tu perro venga siempre, incluso con distracciones.',
  'La llamada más importante. Aprende a conseguir que tu perro venga siempre, incluso con distracciones.',
  14.99,
  'basico',
  ARRAY[
    'Técnicas de llamada efectiva',
    'Cómo trabajar con distracciones',
    'Refuerzo positivo avanzado',
    'Solución a problemas comunes'
  ],
  false,
  false,
  2
);

-- 3. CURSO: Cómo Enseñar a tu Perro a Caminar sin Tirar de la Correa
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a Caminar sin Tirar de la Correa',
  'como-ensenar-a-tu-perro-a-caminar-sin-tirar-de-la-correa',
  'Paseos relajados y disfrutables. Deja de luchar con tu perro en cada paseo.',
  'Paseos relajados y disfrutables. Deja de luchar con tu perro en cada paseo.',
  19.99,
  'intermedio',
  ARRAY[
    'Técnicas de paseo sin tirar',
    'Cómo usar la correa correctamente',
    'Ejercicios progresivos de dificultad',
    'Solución para perros que tiran mucho'
  ],
  false,
  false,
  3
);

-- 4. CURSO: Cómo Solucionar que tu Perro Muerda
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Solucionar que tu Perro Muerda',
  'como-solucionar-que-tu-perro-muerda',
  'Detén el comportamiento de mordida de forma efectiva y segura. Para cachorros y adultos.',
  'Detén el comportamiento de mordida de forma efectiva y segura. Para cachorros y adultos.',
  24.99,
  'intermedio',
  ARRAY[
    'Por qué los perros muerden',
    'Diferencias entre cachorros y adultos',
    'Técnicas de redirección',
    'Cómo prevenir mordidas futuras'
  ],
  false,
  false,
  4
);

-- 5. CURSO: Cómo Enseñar a tu Perro a No Saltar sobre las Personas
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a No Saltar sobre las Personas',
  'como-ensenar-a-tu-perro-a-no-saltar-sobre-las-personas',
  'Evita situaciones incómodas cuando recibes visitas. Enseña a tu perro a saludar correctamente.',
  'Evita situaciones incómodas cuando recibes visitas. Enseña a tu perro a saludar correctamente.',
  12.99,
  'basico',
  ARRAY[
    'Por qué los perros saltan',
    'Técnica de ignorar y recompensar',
    'Cómo enseñar saludo correcto',
    'Mantener el comportamiento a largo plazo'
  ],
  false,
  false,
  5
);

-- 6. CURSO: Cómo Enseñar a tu Perro a Hacer sus Necesidades Fuera
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a Hacer sus Necesidades Fuera',
  'como-ensenar-a-tu-perro-a-hacer-sus-necesidades-fuera',
  'El problema más común con cachorros. Aprende el método más efectivo paso a paso.',
  'El problema más común con cachorros. Aprende el método más efectivo paso a paso.',
  19.99,
  'basico',
  ARRAY[
    'Rutina de salidas efectiva',
    'Señales que indican que necesita salir',
    'Qué hacer cuando hay accidentes',
    'Cómo acelerar el proceso'
  ],
  false,
  false,
  6
);

-- 7. CURSO: Cómo Enseñar a tu Perro a Quedarse Quieto
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a Quedarse Quieto',
  'como-ensenar-a-tu-perro-a-quedarse-quieto',
  'El comando "Quieto" es esencial para seguridad y control. Domínalo con este curso.',
  'El comando "Quieto" es esencial para seguridad y control. Domínalo con este curso.',
  14.99,
  'intermedio',
  ARRAY[
    'Técnica de "Quieto" paso a paso',
    'Aumentar distancia y duración gradualmente',
    'Trabajar con distracciones',
    'Aplicaciones prácticas del comando'
  ],
  false,
  false,
  7
);

-- 8. CURSO: Cómo Solucionar que tu Perro Ladre en Exceso
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Solucionar que tu Perro Ladre en Exceso',
  'como-solucionar-que-tu-perro-ladre-en-exceso',
  'Reduce los ladridos molestos de forma efectiva. Entiende por qué ladra y cómo solucionarlo.',
  'Reduce los ladridos molestos de forma efectiva. Entiende por qué ladra y cómo solucionarlo.',
  24.99,
  'intermedio',
  ARRAY[
    'Tipos de ladridos y sus causas',
    'Técnicas de desensibilización',
    'Cómo redirigir la atención',
    'Solución para ladridos por ansiedad'
  ],
  false,
  false,
  8
);

-- 9. CURSO: Cómo Enseñar a tu Perro a No Mendigar Comida
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Enseñar a tu Perro a No Mendigar Comida',
  'como-ensenar-a-tu-perro-a-no-mendigar-comida',
  'Disfruta de tus comidas en paz. Enseña a tu perro a respetar tus momentos de comida.',
  'Disfruta de tus comidas en paz. Enseña a tu perro a respetar tus momentos de comida.',
  9.99,
  'basico',
  ARRAY[
    'Por qué los perros mendigan',
    'Técnica de ignorar efectiva',
    'Cómo enseñar "A tu cama"',
    'Mantener el comportamiento'
  ],
  false,
  false,
  9
);

-- 10. CURSO: Cómo Socializar a tu Perro con Otros Perros
INSERT INTO courses (
  title, 
  slug, 
  short_description, 
  description,
  price, 
  difficulty, 
  what_you_learn,
  is_free,
  is_published,
  order_index
) VALUES (
  'Cómo Socializar a tu Perro con Otros Perros',
  'como-socializar-a-tu-perro-con-otros-perros',
  'Aprende a presentar a tu perro correctamente y fomenta interacciones positivas.',
  'Aprende a presentar a tu perro correctamente y fomenta interacciones positivas.',
  29.99,
  'avanzado',
  ARRAY[
    'Señales de lenguaje corporal canino',
    'Cómo hacer presentaciones correctas',
    'Gestionar situaciones de conflicto',
    'Socialización para perros tímidos o reactivos'
  ],
  false,
  false,
  10
);

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Consulta para verificar que se insertaron correctamente
SELECT 
  title, 
  slug, 
  price, 
  difficulty, 
  is_free,
  is_published,
  array_length(what_you_learn, 1) as num_learning_points
FROM courses
ORDER BY order_index;
