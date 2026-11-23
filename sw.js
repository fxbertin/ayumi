// Service worker do Ayumi: deixa o site funcionar offline.
// Estratégia: responde na hora com a cópia guardada e atualiza essa cópia em segundo plano
// (stale-while-revalidate); assim, uma atualização do site aparece na visita seguinte, sem precisar trocar nada aqui.
// Quando ADICIONAR ou REMOVER arquivos do site, atualize CORE e aumente VERSION (kd-v2, kd-v3...).
const VERSION = "kd-v11";
const CORE = [
  "./",
  "conjugacao-adjetivos.html",
  "conjugacao.html",
  "contadores.html",
  "densetsu.html",
  "ditado.html",
  "grammar-prova.html",
  "grammar.html",
  "index.html",
  "kana-blaster.html",
  "kana-drop.html",
  "kanji.html",
  "karada.html",
  "kotonoha.html",
  "kurashi.html",
  "lacuna.html",
  "leitura.html",
  "numeros.html",
  "relogio.html",
  "progresso.html",
  "taxi-a.html",
  "taxi.html",
  "velocidade.html",
  "vozes.html",
  "vocabulario.html",
  "style.css",
  "app.js",
  "gram-quiz.js",
  "pwa.js",
  "tts.js",
  "manifest.json",
  "data/accent.js",
  "data/body.js",
  "data/casa.js",
  "data/densetsu.js",
  "data/zonas.css",
  "data/zonas.js",
  "data/conj-adj.js",
  "data/conj-lista.js",
  "data/conj.js",
  "data/counters.js",
  "data/grammar-quiz.js",
  "data/grammar.js",
  "data/highlight.js",
  "data/kanji-ex.js",
  "data/kanji.js",
  "data/kotonoha-engine.js",
  "data/numeros-ja.js",
  "data/reading.js",
  "data/relogio.js",
  "data/sentences.js",
  "data/taxi.js",
  "data/words.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "img/prev-densetsu.webp",
  "img/prev-kana-blaster.webp",
  "img/prev-kana-drop.webp",
  "img/prev-karada.webp",
  "img/prev-kotonoha.webp",
  "img/prev-kurashi.webp",
  "img/prev-numeros.webp",
  "img/prev-relogio.webp",
  "img/prev-taxi.webp",
  "img/prev-velocidade.webp"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("kd-") && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    if (r) return r;
    if (req.mode === "navigate") { const home = await cache.match("./"); if (home) return home; }
    return new Response("Sem conexão e este arquivo ainda não foi guardado.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }));
});
