// Data de ciudades para SEO local

export interface CityData {
  slug: string
  name: string
  province: string
  region: string
  population: number
  description: string
  keywords: string[]
  nearbyParks?: string[]
  localInfo?: string
  distanceFromArchena?: number // Distancia en km desde Archena (null para ciudades lejanas)
  isRemoteMarket?: boolean // true = foco en cursos online, false = servicios presenciales
}

export const cities: CityData[] = [
  // Región de Murcia (mercado principal)
  {
    slug: 'murcia',
    name: 'Murcia',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 460000,
    description: 'Educación canina profesional en Murcia capital y pedanías. Servicios de adiestramiento, modificación de conducta y socialización para perros de todas las razas y edades.',
    keywords: ['adiestramiento canino murcia', 'educador canino murcia', 'adiestrador de perros murcia', 'clases perros murcia'],
    nearbyParks: ['Parque Regional El Valle', 'Jardín de Floridablanca', 'Parque de la Fica'],
    localInfo: 'Servicio en el centro de Murcia y pedanías como El Palmar, Sangonera, La Alberca, Puente Tocinos y más.',
    distanceFromArchena: 25,
    isRemoteMarket: false
  },
  {
    slug: 'cartagena',
    name: 'Cartagena',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 218000,
    description: 'Adiestramiento canino en Cartagena. Educador profesional con experiencia en comportamiento, obediencia y preparación para convivencia urbana y costera.',
    keywords: ['adiestramiento perros cartagena', 'educacion canina cartagena', 'adiestrador cartagena'],
    nearbyParks: ['Parque Torres', 'Cala Cortina', 'Batería de Castillitos'],
    localInfo: 'Disponible en Cartagena ciudad y comarca: La Manga, Los Belones, Cabo de Palos, La Unión.',
    distanceFromArchena: 70,
    isRemoteMarket: true
  },
  {
    slug: 'molina-de-segura',
    name: 'Molina de Segura',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 72000,
    description: 'Educación canina en Molina de Segura. Especialistas en cachorros, perros adultos y modificación de conducta. Método positivo y respetuoso.',
    keywords: ['adiestrador molina de segura', 'educador canino molina', 'clases perros molina'],
    nearbyParks: ['Parque de la Compañía', 'Paraje de La Murta'],
    distanceFromArchena: 15,
    isRemoteMarket: false
  },
  {
    slug: 'las-torres-de-cotillas',
    name: 'Las Torres de Cotillas',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 22000,
    description: 'Adiestramiento canino en Las Torres de Cotillas. Clases individuales y grupales. Especialistas en socialización y obediencia básica.',
    keywords: ['adiestrador torres cotillas', 'educacion canina torres cotillas'],
    nearbyParks: ['Parque de la Constitución'],
    distanceFromArchena: 18,
    isRemoteMarket: false
  },
  {
    slug: 'cieza',
    name: 'Cieza',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 35000,
    description: 'Educador canino profesional en Cieza. Adiestramiento ético y científico. Problemas de conducta, obediencia y preparación para terapia.',
    keywords: ['adiestrador cieza', 'educacion canina cieza', 'adiestramiento perros cieza'],
    nearbyParks: ['Cañón de los Almadenes', 'Paseo Ribera'],
    distanceFromArchena: 20,
    isRemoteMarket: false
  },
  {
    slug: 'archena',
    name: 'Archena',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 19000,
    description: 'Adiestramiento canino en Archena. Educación positiva para perros de todas las edades. Clases personalizadas según las necesidades de cada familia.',
    keywords: ['adiestrador archena', 'educador canino archena'],
    nearbyParks: ['Balneario de Archena', 'Parque Municipal'],
    distanceFromArchena: 0,
    isRemoteMarket: false
  },
  {
    slug: 'fortuna',
    name: 'Fortuna',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 10000,
    description: 'Educación canina en Fortuna. Servicio profesional de adiestramiento con enfoque en el bienestar animal y la convivencia familiar.',
    keywords: ['adiestrador fortuna', 'educacion canina fortuna'],
    nearbyParks: ['Balneario de Fortuna', 'Sierra de la Pila'],
    distanceFromArchena: 22,
    isRemoteMarket: false
  },
  {
    slug: 'ulea',
    name: 'Ulea',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 1000,
    description: 'Adiestramiento canino en Ulea y Valle de Ricote. Educador profesional que se desplaza a domicilio. Especialista en perros de campo y caza.',
    keywords: ['adiestrador ulea', 'educacion canina valle ricote'],
    nearbyParks: ['Valle de Ricote'],
    distanceFromArchena: 8,
    isRemoteMarket: false
  },
  {
    slug: 'lorca',
    name: 'Lorca',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 95000,
    description: 'Educación canina profesional en Lorca. Adiestramiento de perros con método positivo. Especialistas en obediencia y modificación de conducta.',
    keywords: ['adiestrador lorca', 'educacion canina lorca', 'adiestramiento perros lorca'],
    nearbyParks: ['Castillo de Lorca', 'Parque Almenara'],
    distanceFromArchena: 60,
    isRemoteMarket: true
  },
  {
    slug: 'yecla',
    name: 'Yecla',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 35000,
    description: 'Adiestramiento canino en Yecla. Educador profesional con experiencia en perros de todas las razas. Clases personalizadas y grupales.',
    keywords: ['adiestrador yecla', 'educacion canina yecla'],
    nearbyParks: ['Monte Arabí', 'Parque de la Constitución'],
    distanceFromArchena: 75,
    isRemoteMarket: true
  },
  {
    slug: 'jumilla',
    name: 'Jumilla',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 26000,
    description: 'Educación canina en Jumilla. Adiestramiento respetuoso y eficaz. Especialistas en socialización y convivencia familiar.',
    keywords: ['adiestrador jumilla', 'educacion canina jumilla'],
    nearbyParks: ['Castillo de Jumilla', 'Sierra del Carche'],
    distanceFromArchena: 65,
    isRemoteMarket: true
  },
  {
    slug: 'totana',
    name: 'Totana',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 32000,
    description: 'Adiestramiento canino en Totana. Educación positiva para perros. Método científico y tecnología de seguimiento.',
    keywords: ['adiestrador totana', 'educacion canina totana'],
    nearbyParks: ['Sierra Espuña', 'Parque Municipal'],
    distanceFromArchena: 52,
    isRemoteMarket: true
  },
  {
    slug: 'aguilas',
    name: 'Águilas',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 35000,
    description: 'Educación canina en Águilas. Adiestramiento especializado para convivencia costera. Socialización en playa y entorno urbano.',
    keywords: ['adiestrador aguilas', 'educacion canina aguilas'],
    nearbyParks: ['Playa de Levante', 'Isla del Fraile'],
    distanceFromArchena: 100,
    isRemoteMarket: true
  },
  {
    slug: 'mazarron',
    name: 'Mazarrón',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 33000,
    description: 'Adiestramiento canino en Mazarrón y Puerto de Mazarrón. Educador profesional con experiencia en perros de costa.',
    keywords: ['adiestrador mazarron', 'educacion canina mazarron'],
    nearbyParks: ['Bahía de Mazarrón', 'Sierra de las Moreras'],
    distanceFromArchena: 80,
    isRemoteMarket: true
  },
  {
    slug: 'san-javier',
    name: 'San Javier',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 33000,
    description: 'Educación canina en San Javier y Santiago de la Ribera. Adiestramiento para convivencia en zonas costeras y urbanas.',
    keywords: ['adiestrador san javier', 'educacion canina san javier'],
    nearbyParks: ['Parque Almansa', 'Mar Menor'],
    distanceFromArchena: 75,
    isRemoteMarket: true
  },
  {
    slug: 'san-pedro-del-pinatar',
    name: 'San Pedro del Pinatar',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 26000,
    description: 'Adiestramiento canino en San Pedro del Pinatar. Educación especializada para perros que disfrutan la playa y el mar.',
    keywords: ['adiestrador san pedro pinatar', 'educacion canina san pedro'],
    nearbyParks: ['Salinas y Arenales', 'Playa de la Torre Derribada'],
    distanceFromArchena: 80,
    isRemoteMarket: true
  },
  {
    slug: 'alcantarilla',
    name: 'Alcantarilla',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 42000,
    description: 'Educación canina profesional en Alcantarilla. Adiestramiento con método positivo. Clases individuales y grupales.',
    keywords: ['adiestrador alcantarilla', 'educacion canina alcantarilla'],
    nearbyParks: ['Parque de las Norias', 'Parque Municipal'],
    distanceFromArchena: 28,
    isRemoteMarket: false
  },
  {
    slug: 'alhama-de-murcia',
    name: 'Alhama de Murcia',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 22000,
    description: 'Adiestramiento canino en Alhama de Murcia. Educador profesional con tecnología exclusiva de seguimiento.',
    keywords: ['adiestrador alhama murcia', 'educacion canina alhama'],
    nearbyParks: ['Sierra Espuña', 'Gebas'],
    distanceFromArchena: 48,
    isRemoteMarket: true
  },
  {
    slug: 'caravaca-de-la-cruz',
    name: 'Caravaca de la Cruz',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 26000,
    description: 'Educación canina en Caravaca de la Cruz. Adiestramiento rural y urbano. Especialistas en perros de trabajo.',
    keywords: ['adiestrador caravaca', 'educacion canina caravaca'],
    nearbyParks: ['Santuario de Caravaca', 'Fuentes del Marqués'],
    distanceFromArchena: 72,
    isRemoteMarket: true
  },
  {
    slug: 'ceheguin',
    name: 'Cehegín',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 16000,
    description: 'Adiestramiento canino en Cehegín. Educación positiva y respetuosa para perros de todas las edades.',
    keywords: ['adiestrador cehegin', 'educacion canina cehegin'],
    nearbyParks: ['Casco Antiguo', 'Parque Municipal'],
    distanceFromArchena: 60,
    isRemoteMarket: true
  },
  {
    slug: 'calasparra',
    name: 'Calasparra',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 10000,
    description: 'Educación canina en Calasparra. Adiestramiento profesional con desplazamiento a domicilio. Método científico.',
    keywords: ['adiestrador calasparra', 'educacion canina calasparra'],
    nearbyParks: ['Santuario Virgen de la Esperanza', 'Río Segura'],
    distanceFromArchena: 35,
    isRemoteMarket: false
  },
  {
    slug: 'bullas',
    name: 'Bullas',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 12000,
    description: 'Adiestramiento canino en Bullas. Educador profesional especializado en perros de campo y ciudad.',
    keywords: ['adiestrador bullas', 'educacion canina bullas'],
    nearbyParks: ['Casco Histórico', 'Salto del Usero'],
    distanceFromArchena: 45,
    isRemoteMarket: true
  },
  {
    slug: 'mula',
    name: 'Mula',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 17000,
    description: 'Educación canina profesional en Mula. Adiestramiento basado en refuerzo positivo y tecnología innovadora.',
    keywords: ['adiestrador mula', 'educacion canina mula'],
    nearbyParks: ['Castillo de Mula', 'Parque de la Constitución'],
    distanceFromArchena: 22,
    isRemoteMarket: false
  },
  {
    slug: 'lorqui',
    name: 'Lorquí',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 7000,
    description: 'Adiestramiento canino en Lorquí. Educación personalizada para cada perro y familia.',
    keywords: ['adiestrador lorqui', 'educacion canina lorqui'],
    nearbyParks: ['Río Segura', 'Parque Municipal'],
    distanceFromArchena: 6,
    isRemoteMarket: false
  },
  {
    slug: 'abarán',
    name: 'Abarán',
    province: 'Murcia',
    region: 'Región de Murcia',
    population: 13000,
    description: 'Educación canina en Abarán y Valle de Ricote. Adiestramiento profesional con método positivo.',
    keywords: ['adiestrador abaran', 'educacion canina abaran'],
    nearbyParks: ['Valle de Ricote', 'Sotos de Abarán'],
    distanceFromArchena: 10,
    isRemoteMarket: false
  },

  // Comunidad Valenciana (expansión regional)
  {
    slug: 'alicante',
    name: 'Alicante',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 337000,
    description: 'Educación canina profesional en Alicante. Adiestramiento en positivo, modificación de conducta y socialización. Apps exclusivas para seguimiento.',
    keywords: ['adiestramiento canino alicante', 'educador perros alicante', 'adiestrador alicante'],
    nearbyParks: ['Monte Benacantil', 'Parque Canalejas', 'Playa del Postiguet'],
    localInfo: 'Servicio en Alicante capital y área metropolitana: San Juan, Campello, San Vicente.',
    isRemoteMarket: true
  },
  {
    slug: 'valencia',
    name: 'Valencia',
    province: 'Valencia',
    region: 'Comunidad Valenciana',
    population: 800000,
    description: 'Adiestramiento canino en Valencia. Educador profesional certificado. Método científico y respetuoso. Tecnología exclusiva HakaDogs.',
    keywords: ['adiestrador valencia', 'educacion canina valencia', 'adiestramiento perros valencia'],
    nearbyParks: ['Jardín del Turia', 'Parque de Cabecera', 'La Albufera'],
    localInfo: 'Disponible en Valencia ciudad y área metropolitana: Torrent, Paterna, Mislata, Burjassot.',
    isRemoteMarket: true
  },
  {
    slug: 'elche',
    name: 'Elche',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 234000,
    description: 'Educación canina profesional en Elche. Adiestramiento con método positivo en la segunda ciudad más grande de la Comunidad Valenciana.',
    keywords: ['adiestrador elche', 'educacion canina elche', 'adiestramiento perros elche'],
    nearbyParks: ['Palmeral de Elche', 'Parque Municipal'],
    isRemoteMarket: true
  },
  {
    slug: 'torrevieja',
    name: 'Torrevieja',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 83000,
    description: 'Adiestramiento canino en Torrevieja. Educación especializada para convivencia costera y urbana.',
    keywords: ['adiestrador torrevieja', 'educacion canina torrevieja'],
    nearbyParks: ['Lagunas de Torrevieja', 'Paseo Marítimo'],
    isRemoteMarket: true
  },
  {
    slug: 'orihuela',
    name: 'Orihuela',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 86000,
    description: 'Educación canina en Orihuela y Orihuela Costa. Adiestramiento profesional con tecnología innovadora.',
    keywords: ['adiestrador orihuela', 'educacion canina orihuela'],
    nearbyParks: ['Palmeral de Orihuela', 'Sierra de Orihuela'],
    isRemoteMarket: true
  },
  {
    slug: 'benidorm',
    name: 'Benidorm',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 70000,
    description: 'Adiestramiento canino en Benidorm. Educación para perros en entorno turístico y costero.',
    keywords: ['adiestrador benidorm', 'educacion canina benidorm'],
    nearbyParks: ['Parque de L\'Aigüera', 'Sierra Helada'],
    isRemoteMarket: true
  },
  {
    slug: 'alcoy',
    name: 'Alcoy',
    province: 'Alicante',
    region: 'Comunidad Valenciana',
    population: 60000,
    description: 'Educación canina profesional en Alcoy. Adiestramiento adaptado a entorno montañoso y urbano.',
    keywords: ['adiestrador alcoy', 'educacion canina alcoy'],
    nearbyParks: ['Parque de Cantagallet', 'Font Roja'],
    isRemoteMarket: true
  },

  // Castilla-La Mancha
  {
    slug: 'albacete',
    name: 'Albacete',
    province: 'Albacete',
    region: 'Castilla-La Mancha',
    population: 174000,
    description: 'Educación canina profesional en Albacete. Adiestramiento basado en evidencia científica. Apps móviles para seguimiento 24/7 de tu perro.',
    keywords: ['adiestrador albacete', 'educacion canina albacete', 'adiestramiento perros albacete'],
    nearbyParks: ['Parque de Abelardo Sánchez', 'Parque Lineal'],
    localInfo: 'Servicio en Albacete capital y comarca.',

    isRemoteMarket: true
  },
  {
    slug: 'hellin',
    name: 'Hellín',
    province: 'Albacete',
    region: 'Castilla-La Mancha',
    population: 31000,
    description: 'Adiestramiento canino en Hellín. Educación profesional para perros con método positivo.',
    keywords: ['adiestrador hellin', 'educacion canina hellin'],
    nearbyParks: ['Minateda', 'Parque del Rosario'],,

    isRemoteMarket: true
  },
  {
    slug: 'villarrobledo',
    name: 'Villarrobledo',
    province: 'Albacete',
    region: 'Castilla-La Mancha',
    population: 26000,
    description: 'Educación canina en Villarrobledo. Adiestramiento respetuoso con tecnología de seguimiento.',
    keywords: ['adiestrador villarrobledo', 'educacion canina villarrobledo'],
    nearbyParks: ['Parque de la Constitución'],,

    isRemoteMarket: true
  },

  // Andalucía
  {
    slug: 'almeria',
    name: 'Almería',
    province: 'Almería',
    region: 'Andalucía',
    population: 201000,
    description: 'Adiestramiento canino en Almería. Educador profesional con tecnología innovadora. Especialistas en convivencia urbana y playa.',
    keywords: ['adiestrador almeria', 'educacion canina almeria', 'adiestramiento perros almeria'],
    nearbyParks: ['Parque del Andarax', 'Cabo de Gata'],
    localInfo: 'Disponible en Almería capital, Roquetas de Mar, El Ejido y comarca.',

    isRemoteMarket: true
  },
  {
    slug: 'roquetas-de-mar',
    name: 'Roquetas de Mar',
    province: 'Almería',
    region: 'Andalucía',
    population: 95000,
    description: 'Educación canina en Roquetas de Mar. Adiestramiento especializado para convivencia costera.',
    keywords: ['adiestrador roquetas', 'educacion canina roquetas'],
    nearbyParks: ['Parque Natural Punta Entinas', 'Playa Serena'],,

    isRemoteMarket: true
  },
  {
    slug: 'el-ejido',
    name: 'El Ejido',
    province: 'Almería',
    region: 'Andalucía',
    population: 85000,
    description: 'Adiestramiento canino en El Ejido. Educador profesional con método positivo y científico.',
    keywords: ['adiestrador el ejido', 'educacion canina el ejido'],
    nearbyParks: ['Parque Municipal', 'Playas de El Ejido'],,

    isRemoteMarket: true
  },
  {
    slug: 'granada',
    name: 'Granada',
    province: 'Granada',
    region: 'Andalucía',
    population: 232000,
    description: 'Educación canina profesional en Granada. Adiestramiento con tecnología exclusiva HakaDogs.',
    keywords: ['adiestrador granada', 'educacion canina granada', 'adiestramiento perros granada'],
    nearbyParks: ['Parque Federico García Lorca', 'Sierra Nevada'],,

    isRemoteMarket: true
  },
  {
    slug: 'jaen',
    name: 'Jaén',
    province: 'Jaén',
    region: 'Andalucía',
    population: 114000,
    description: 'Adiestramiento canino en Jaén. Educación positiva y respetuosa para perros.',
    keywords: ['adiestrador jaen', 'educacion canina jaen'],
    nearbyParks: ['Parque del Seminario', 'Cerro de Santa Catalina'],,

    isRemoteMarket: true
  },

  // Comunidad de Madrid
  {
    slug: 'madrid',
    name: 'Madrid',
    province: 'Madrid',
    region: 'Comunidad de Madrid',
    population: 3300000,
    description: 'Educación canina profesional en Madrid. Adiestramiento de perros con método positivo. Apps exclusivas HakaDogs para seguimiento 24/7.',
    keywords: ['adiestrador madrid', 'educacion canina madrid', 'adiestramiento perros madrid'],
    nearbyParks: ['Parque del Retiro', 'Casa de Campo', 'Madrid Río'],
    localInfo: 'Servicio en Madrid capital y área metropolitana.',

    isRemoteMarket: true
  },

  // Cataluña
  {
    slug: 'barcelona',
    name: 'Barcelona',
    province: 'Barcelona',
    region: 'Cataluña',
    population: 1620000,
    description: 'Adiestramiento canino en Barcelona. Educador profesional certificado. Tecnología innovadora HakaDogs.',
    keywords: ['adiestrador barcelona', 'educacion canina barcelona', 'adiestramiento perros barcelona'],
    nearbyParks: ['Parc de la Ciutadella', 'Parc del Guinardó', 'Montjuïc'],
    localInfo: 'Disponible en Barcelona ciudad y área metropolitana.',

    isRemoteMarket: true
  },
  {
    slug: 'hospitalet-de-llobregat',
    name: "L'Hospitalet de Llobregat",
    province: 'Barcelona',
    region: 'Cataluña',
    population: 260000,
    description: 'Educación canina en L\'Hospitalet. Adiestramiento profesional en el área metropolitana de Barcelona.',
    keywords: ['adiestrador hospitalet', 'educacion canina hospitalet'],
    nearbyParks: ['Parc de Can Buxeres', 'Parc de la Torrassa'],
  },

  // Andalucía (más ciudades)
  {
    slug: 'sevilla',
    name: 'Sevilla',
    province: 'Sevilla',
    region: 'Andalucía',
    population: 688000,
    description: 'Educación canina profesional en Sevilla. Adiestramiento con método científico y respetuoso.',
    keywords: ['adiestrador sevilla', 'educacion canina sevilla', 'adiestramiento perros sevilla'],
    nearbyParks: ['Parque de María Luisa', 'Alamillo', 'Parque del Guadalquivir'],,

    isRemoteMarket: true
  },
  {
    slug: 'malaga',
    name: 'Málaga',
    province: 'Málaga',
    region: 'Andalucía',
    population: 578000,
    description: 'Adiestramiento canino en Málaga. Educación especializada para convivencia urbana y costera.',
    keywords: ['adiestrador malaga', 'educacion canina malaga', 'adiestramiento perros malaga'],
    nearbyParks: ['Parque de Málaga', 'Montes de Málaga', 'Playas de Málaga'],,

    isRemoteMarket: true
  },
  {
    slug: 'cordoba',
    name: 'Córdoba',
    province: 'Córdoba',
    region: 'Andalucía',
    population: 326000,
    description: 'Educación canina en Córdoba. Adiestramiento profesional con tecnología HakaDogs.',
    keywords: ['adiestrador cordoba', 'educacion canina cordoba'],
    nearbyParks: ['Jardines de la Victoria', 'Sotos de la Albolafia'],,

    isRemoteMarket: true
  },

  // Aragón
  {
    slug: 'zaragoza',
    name: 'Zaragoza',
    province: 'Zaragoza',
    region: 'Aragón',
    population: 675000,
    description: 'Educación canina profesional en Zaragoza. Adiestramiento con método positivo y apps exclusivas.',
    keywords: ['adiestrador zaragoza', 'educacion canina zaragoza', 'adiestramiento perros zaragoza'],
    nearbyParks: ['Parque Grande', 'Parque del Agua', 'Ribera del Ebro'],,

    isRemoteMarket: true
  },

  // Islas Baleares
  {
    slug: 'palma-de-mallorca',
    name: 'Palma de Mallorca',
    province: 'Baleares',
    region: 'Islas Baleares',
    population: 416000,
    description: 'Adiestramiento canino en Palma de Mallorca. Educación especializada para perros en entorno insular.',
    keywords: ['adiestrador palma mallorca', 'educacion canina palma'],
    nearbyParks: ['Parc de la Mar', 'Bellver', 'Son Quint'],,

    isRemoteMarket: true
  },

  // Islas Canarias
  {
    slug: 'las-palmas-de-gran-canaria',
    name: 'Las Palmas de Gran Canaria',
    province: 'Las Palmas',
    region: 'Islas Canarias',
    population: 379000,
    description: 'Educación canina en Las Palmas. Adiestramiento profesional con tecnología innovadora.',
    keywords: ['adiestrador las palmas', 'educacion canina las palmas', 'gran canaria'],
    nearbyParks: ['Parque Doramas', 'Parque Santa Catalina', 'Las Canteras'],,

    isRemoteMarket: true
  },

  // País Vasco
  {
    slug: 'bilbao',
    name: 'Bilbao',
    province: 'Vizcaya',
    region: 'País Vasco',
    population: 347000,
    description: 'Adiestramiento canino en Bilbao. Educación positiva con método científico.',
    keywords: ['adiestrador bilbao', 'educacion canina bilbao', 'adiestramiento perros bilbao'],
    nearbyParks: ['Doña Casilda Iturrizar', 'Etxebarria', 'Artxanda'],,

    isRemoteMarket: true
  },
  {
    slug: 'vitoria-gasteiz',
    name: 'Vitoria-Gasteiz',
    province: 'Álava',
    region: 'País Vasco',
    population: 253000,
    description: 'Educación canina en Vitoria. Adiestramiento profesional en la ciudad más verde de Europa.',
    keywords: ['adiestrador vitoria', 'educacion canina vitoria'],
    nearbyParks: ['Anillo Verde', 'Parque de la Florida', 'Armentia'],,

    isRemoteMarket: true
  },

  // Castilla y León
  {
    slug: 'valladolid',
    name: 'Valladolid',
    province: 'Valladolid',
    region: 'Castilla y León',
    population: 298000,
    description: 'Adiestramiento canino en Valladolid. Educación profesional con tecnología HakaDogs.',
    keywords: ['adiestrador valladolid', 'educacion canina valladolid'],
    nearbyParks: ['Campo Grande', 'Parque Ribera de Castilla', 'Pisuerga'],,

    isRemoteMarket: true
  },

  // Galicia
  {
    slug: 'vigo',
    name: 'Vigo',
    province: 'Pontevedra',
    region: 'Galicia',
    population: 296000,
    description: 'Educación canina en Vigo. Adiestramiento especializado para convivencia costera y urbana.',
    keywords: ['adiestrador vigo', 'educacion canina vigo'],
    nearbyParks: ['Parque de Castrelos', 'Monte del Castro', 'Samil'],,

    isRemoteMarket: true
  },
  {
    slug: 'a-coruna',
    name: 'A Coruña',
    province: 'A Coruña',
    region: 'Galicia',
    population: 246000,
    description: 'Adiestramiento canino en A Coruña. Educación positiva y respetuosa.',
    keywords: ['adiestrador coruña', 'educacion canina coruña', 'a coruña'],
    nearbyParks: ['Parque de Santa Margarita', 'Monte de San Pedro', 'Paseo Marítimo'],,

    isRemoteMarket: true
  },

  // Asturias
  {
    slug: 'gijon',
    name: 'Gijón',
    province: 'Asturias',
    region: 'Principado de Asturias',
    population: 273000,
    description: 'Educación canina profesional en Gijón. Adiestramiento con método científico.',
    keywords: ['adiestrador gijon', 'educacion canina gijon'],
    nearbyParks: ['Parque de Isabel la Católica', 'Cerro de Santa Catalina', 'Playa de San Lorenzo'],,

    isRemoteMarket: true
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(city => city.slug === slug)
}

export function getCitiesByRegion(region: string): CityData[] {
  return cities.filter(city => city.region === region)
}

export function getAllCitySlugs(): string[] {
  return cities.map(city => city.slug)
}
