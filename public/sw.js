// Service Worker para PWA - Hakadogs
const CACHE_NAME = 'hakadogs-v1';
const OFFLINE_URL = '/offline.html';

// Assets críticos para cachear inmediatamente
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets críticos');
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control inmediatamente
  self.clients.claim();
});

// Estrategia de caché: Network First con Fallback a Caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests no-HTTP (chrome-extension://, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Ignorar API calls de Supabase (siempre red)
  if (url.hostname.includes('supabase')) {
    return;
  }
  
  // Ignorar Google Analytics
  if (url.hostname.includes('google-analytics') || url.hostname.includes('googletagmanager')) {
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la respuesta es válida, cachearla
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            // Cachear páginas HTML, CSS, JS, imágenes
            if (
              request.method === 'GET' &&
              (request.destination === 'document' ||
               request.destination === 'style' ||
               request.destination === 'script' ||
               request.destination === 'image')
            ) {
              cache.put(request, responseToCache);
            }
          });
        }
        
        return response;
      })
      .catch(async () => {
        // Si falla la red, buscar en caché
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
          console.log('[SW] Sirviendo desde caché:', request.url);
          return cachedResponse;
        }
        
        // Si es una navegación y no hay caché, mostrar página offline
        if (request.destination === 'document') {
          console.log('[SW] Sin conexión, mostrando página offline');
          return caches.match(OFFLINE_URL);
        }
        
        // Para otros recursos, devolver error
        return new Response('Sin conexión', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain',
          }),
        });
      })
  );
});

// Sincronización en background (para cuando vuelva la conexión)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-course-progress') {
    event.waitUntil(syncCourseProgress());
  }
});

// Función para sincronizar progreso de cursos
async function syncCourseProgress() {
  console.log('[SW] Sincronizando progreso de cursos...');
  // Aquí implementarías la lógica para sincronizar
  // el progreso guardado en IndexedDB con Supabase
}

// Notificaciones Push (opcional)
self.addEventListener('push', (event) => {
  console.log('[SW] Push recibido:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver ahora',
        icon: '/icon-72x72.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-72x72.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('Hakadogs', options)
  );
});

// Manejar click en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificación clickeada:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
