/* ═══════════ LE VIDEOLEZIONI di L'Atelier del Rosario (02/11/2026) ═══════════
   Arquivo escrito à mão (o index.html é gerado pelo scripts/ros-app-montar.cjs; este não).
   As 28 videoaulas dubladas em italiano, em 9 modelos; dados em lezioni-dati.js (scripts/ros-app-lezioni.cjs).
   Duas telas:
     #lezioni         catálogo: título, números, "continua a guardare", como assistir e os modelos com as aulas
     #lezione/<slug>  a aula: player, Precedente/Successiva dentro do modelo, velocidade e as outras aulas do modelo
   HLS em /video/<slug>/index.m3u8: HLS nativo (Safari/iPhone, Chrome novo) ou hls.js (cdnjs, versão fixa).
   Posição de cada aula salva por e-mail ("continua da dove eri rimasta"). Usa as funções globais do index:
   $, esc, ico, toast, guardar, ler, chaveUsuario. Era o bônus 9 (4 aulas mudas) até 02/11. */
var LEZ = (function () {
  var HLS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.20/hls.min.js';
  var VEL = [0.75, 1, 1.25, 1.5];
  function M() { return (window.LDATI && window.LDATI.modelli) || []; }
  var TUTTE = [];   // as aulas em sequência, cada uma com o seu modelo
  M().forEach(function (m) { m.lezioni.forEach(function (l) { TUTTE.push({ l: l, m: m }); }); });
  function trova(slug) { for (var i = 0; i < TUTTE.length; i++) if (TUTTE[i].l.slug === slug) return TUTTE[i]; return null; }
  function chiave(k) { return 'ar:lez:' + chaveUsuario() + ':' + k; }
  function salva(k, v) { guardar(chiave(k), JSON.stringify(v)); }
  function leggi(k, def) { try { var v = JSON.parse(ler(chiave(k)) || 'null'); return v == null ? def : v; } catch (e) { return def; } }
  function mmss(s) { s = Math.max(0, Math.floor(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = ('0' + s % 60).slice(-2); return h ? h + ':' + ('0' + m).slice(-2) + ':' + x : m + ':' + x; }
  function stato(slug) { return leggi('v:' + slug, { t: 0, dur: 0, fatto: false }); }
  function pct(slug) { var st = stato(slug); return st.fatto ? 100 : st.dur ? Math.min(100, Math.round(100 * st.t / st.dur)) : 0; }
  function minuti(m) { return Math.round(m.lezioni.reduce(function (s, l) { return s + l.dur; }, 0) / 60); }

  /* cartão de uma aula (catálogo e lista do modelo) */
  function cardLez(l, on) {
    var p = pct(l.slug), st = stato(l.slug);
    return '<a class="lz-lez' + (on ? ' on' : '') + '" href="#lezione/' + l.slug + '"' + (on ? ' aria-current="true"' : '') + '>' +
      '<span class="th"><img src="/assets/lezioni/' + l.slug + '.webp" alt="" width="640" height="360" loading="lazy"><span class="dur">' + mmss(l.dur) + '</span>' +
      (st.fatto ? '<span class="ok">✓</span>' : '<span class="pl">' + ico('play') + '</span>') + '</span>' +
      '<span class="t"><small>Lezione ' + l.n + (on ? ' · in visione' : st.fatto ? ' · vista' : p > 2 ? ' · ' + p + '%' : '') + '</small><b>' + esc(l.tit) + '</b>' +
      '<span class="mini-prog"><i style="width:' + p + '%"></i></span></span></a>';
  }

  /* ═══ catálogo (#lezioni) ═══ */
  function catalogo() {
    var box = $('lezioni-corpo'); if (!box) return;
    var tot = TUTTE.reduce(function (s, x) { return s + x.l.dur; }, 0);
    var fatte = TUTTE.filter(function (x) { return stato(x.l.slug).fatto; }).length;
    var u = trova(leggi('ultima', '')), cont = '';
    if (u && !stato(u.l.slug).fatto) {
      var st = stato(u.l.slug);
      cont = '<a class="lz-cont" href="#lezione/' + u.l.slug + '"><span class="th"><img src="/assets/lezioni/' + u.l.slug + '.webp" alt="" width="640" height="360"><span class="pl">' + ico('play') + '</span></span>' +
        '<span class="t"><small>Continua a guardare</small><b>' + esc(u.m.nome) + '</b><span>Lezione ' + u.l.n + ' · ' + esc(u.l.tit) + (st.t > 5 ? ' · da ' + mmss(st.t) : '') + '</span>' +
        '<span class="mini-prog"><i style="width:' + pct(u.l.slug) + '%"></i></span></span><span class="vai">Riprendi</span></a>';
    }
    var CONSIGLI = [
      ['🧺', 'Prepara i materiali', 'La lezione 1 di ogni modello è la lista dei materiali: guardala prima e metti tutto sul tavolo.'],
      ['⏸️', 'Metti in pausa', 'Ferma il video a ogni passaggio e rifallo con le tue mani prima di andare avanti.'],
      ['🐢', 'Rallenta', 'Per i nodi e i passaggi più veloci usa la velocità 0,75x.'],
      ['✅', 'Riprendi quando vuoi', 'L’app ricorda il punto in cui eri rimasta in ogni lezione, su questo dispositivo.']
    ];
    box.innerHTML =
      '<div class="lz-numeri"><div><b>' + M().length + '</b><span>modelli</span></div><div><b>' + TUTTE.length + '</b><span>lezioni</span></div><div><b>' + Math.round(tot / 360) / 10 + ' h</b><span>di video</span></div>' +
        '<div><b>' + fatte + '</b><span>completate</span></div></div>' +
      cont +
      '<section class="bloco lz-come"><h2>Come guardarle</h2><div class="lz-consigli">' + CONSIGLI.map(function (c) {
        return '<div class="lz-cons"><span class="e">' + c[0] + '</span><div><b>' + esc(c[1]) + '</b><p>' + esc(c[2]) + '</p></div></div>';
      }).join('') + '</div></section>' +
      '<div class="sec-tit lz-tit-mod"><h2>I modelli</h2><span class="cont">' + M().length + '</span></div>' +
      '<div class="lz-mods">' + M().map(function (m) {
        var f = m.lezioni.filter(function (l) { return stato(l.slug).fatto; }).length;
        return '<section class="lz-mod" id="lz-' + m.id + '"><div class="lz-mod-cab"><img src="/assets/lezioni/mod-' + m.id + '.webp" alt="" width="240" height="240" loading="lazy">' +
          '<div><h3>' + esc(m.nome) + '</h3><p>' + esc(m.txt) + '</p><small>' + m.lezioni.length + ' lezioni · ' + minuti(m) + ' min' + (f ? ' · ' + f + ' di ' + m.lezioni.length + ' completate' : '') + '</small></div></div>' +
          '<div class="lz-lista">' + m.lezioni.map(function (l) { return cardLez(l, false); }).join('') + '</div></section>';
      }).join('') + '</div>';
  }

  /* ═══ a aula (#lezione/<slug>) ═══ */
  var hls = null, el = null, atual = '', ult = 0, vel = 1;
  function salvaPos() {
    if (!el || !atual || !isFinite(el.duration) || !el.duration) return;
    var st = stato(atual); st.t = el.currentTime; st.dur = el.duration; if (el.currentTime > el.duration * 0.95) st.fatto = true; salva('v:' + atual, st);
  }
  function ferma() {
    if (el) { salvaPos(); try { el.pause(); } catch (e) {} }
    if (hls) { hls.destroy(); hls = null; }
    el = null; atual = '';
  }
  function caricaHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = HLS_URL; s.crossOrigin = 'anonymous'; s.onload = function () { ok(window.Hls); }; s.onerror = ko; document.head.appendChild(s); });
  }
  function erro() { toast('Il video non si carica. Controlla la connessione e riprova.'); }

  function apri(slug) {
    var x = trova(slug), box = $('lezione-corpo');
    if (!x || !box) { location.hash = '#lezioni'; return false; }
    ferma();
    // contêiner novo a cada aula: os ouvintes da aula anterior vão embora junto
    var novo = box.cloneNode(false); box.parentNode.replaceChild(novo, box); box = novo;
    var m = x.m, l = x.l, i = m.lezioni.indexOf(l), prec = m.lezioni[i - 1], succ = m.lezioni[i + 1];
    var proxMod = !succ && M()[M().indexOf(m) + 1];
    box.innerHTML = '<a class="b-voltar" href="#lezioni">' + ico('baixo') + 'Tutte le videolezioni</a>' +
      '<div class="lz-cab"><small>' + esc(m.nome) + ' · Lezione ' + l.n + ' di ' + m.lezioni.length + ' · ' + mmss(l.dur) + '</small><h1>' + esc(l.tit) + '</h1></div>' +
      '<div class="lz-player"><video id="lz-video" controls playsinline preload="metadata" poster="/assets/lezioni/' + l.slug + '.webp"></video></div>' +
      '<div class="lz-barra">' +
        (prec ? '<a class="lz-chip" href="#lezione/' + prec.slug + '">← Precedente</a>' : '<span class="lz-chip off">← Precedente</span>') +
        (succ ? '<a class="lz-chip pieno" href="#lezione/' + succ.slug + '">Successiva →</a>' : proxMod ? '<a class="lz-chip pieno" href="#lezione/' + proxMod.lezioni[0].slug + '">Prossimo modello →</a>' : '<a class="lz-chip pieno" href="#lezioni">Tutte le lezioni</a>') +
        '<span class="esp"></span><span class="lz-vel" role="group" aria-label="Velocità"><span>Velocità</span>' + VEL.map(function (v) { return '<button type="button" class="lz-chip' + (v === vel ? ' on' : '') + '" data-vel="' + v + '">' + String(v).replace('.', ',') + 'x</button>'; }).join('') + '</span>' +
      '</div>' +
      '<section class="bloco lz-mod lz-mod-aula"><div class="lz-mod-cab"><img src="/assets/lezioni/mod-' + m.id + '.webp" alt="" width="240" height="240" loading="lazy">' +
        '<div><small>Le lezioni di questo modello</small><h3>' + esc(m.nome) + '</h3><p>' + esc(m.txt) + '</p></div></div>' +
        '<div class="lz-lista">' + m.lezioni.map(function (y) { return cardLez(y, y === l); }).join('') + '</div></section>';

    el = $('lz-video'); atual = l.slug; salva('ultima', atual);
    var st = stato(atual), src = '/video/' + atual + '/index.m3u8', video = el;
    video.addEventListener('loadedmetadata', function () {
      if (el !== video) return;   // sobra de uma aula anterior que não chegou a carregar
      video.playbackRate = vel;
      if (st.t > 5 && !(st.dur && st.t > st.dur - 10)) { video.currentTime = st.t; toast('Continua da dove eri rimasta: ' + mmss(st.t)); }
    }, { once: true });
    video.ontimeupdate = function () { var a = Date.now(); if (a - ult > 4000) { ult = a; salvaPos(); } };
    video.onpause = salvaPos;
    video.onended = function () {
      salvaPos();
      [].forEach.call(box.querySelectorAll('.lz-lez.on small'), function (s) { s.textContent = 'Lezione ' + l.n + ' · vista'; });
      toast(succ ? 'Lezione completata ✓ Tocca “Successiva” per continuare.' : 'Hai finito questo modello ✓');
    };
    box.addEventListener('click', function (e) {
      var v = e.target.closest('[data-vel]'); if (!v) return;
      vel = +v.getAttribute('data-vel'); video.defaultPlaybackRate = vel; video.playbackRate = vel;
      [].forEach.call(box.querySelectorAll('[data-vel]'), function (b) { b.classList.toggle('on', b === v); });
    });
    if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = src;
    else caricaHls().then(function (Hls) {
      if (el !== video) return;
      if (!Hls.isSupported()) { video.src = src; return; }
      hls = new Hls({ maxBufferLength: 30 });
      hls.on(Hls.Events.ERROR, function (e, d) { if (d && d.fatal) erro(); });
      hls.loadSource(src); hls.attachMedia(video);
    }, erro);
    window.scrollTo(0, 0);
    return true;
  }

  window.addEventListener('pagehide', salvaPos);
  return { catalogo: catalogo, apri: apri, ferma: ferma };
})();
