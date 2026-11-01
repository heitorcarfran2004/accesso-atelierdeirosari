// Service worker de L'Atelier del Rosario: deixa o app "instalável" (PWA).
// Não intercepta as requisições (sem event.respondWith): cada requisição segue o fluxo normal do navegador.
// Notificações push estão desligadas neste app (as Edge Functions de push só aceitam e-mail com compra paga).
self.addEventListener("install", () => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", () => {});
