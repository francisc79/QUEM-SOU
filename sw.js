const CACHE_NAME = 'quemsou-v1'; 

// Lista de arquivos para funcionar offline
const urlsToCache = [
  './',
  './index.html',
  './quem-sou.css',
  './quem-sou.js',
  './manifest.json',
  './icone.png',
  './som-fundo.mp3',
  './som-acerto.mp3',
  './som-erro.mp3',
  './som-vitoria.mp3',
  // IMAGENS (Adicione todas aqui se quiser que funcione 100% offline)
  './aranha.png', './peixe.png', './cachorro.png', './gato.png',
  './galinha.png', './vaca.png', './zebra.png', './macaco.png',
  './girafa.png', './golfinho.png', './borboleta.png', './abelha.png',
  './tartaruga.png', './porco.png', './sapo.png', './tubarao.png',
  './elefante.png', './leao.png', './rato.png', './formiga.png',
  './coelho.png', './tatu.png', './baleia.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});