/* ═══════════ LE VIDEOLEZIONI di L'Atelier del Rosario (aba #lezioni, 02/11/2026) ═══════════
   Arquivo escrito à mão (o index.html é gerado pelo scripts/ros-app-montar.cjs; este não).
   As 28 videoaulas dubladas em italiano, em 9 modelos; dados em lezioni-dati.js (scripts/ros-app-lezioni.cjs).
   HLS em /video/<slug>/index.m3u8: HLS nativo (Safari/iPhone) ou hls.js (cdnjs, versão fixa), carregado só
   quando a aba abre. Posição de cada aula salva por e-mail ("continua da dove eri rimasta"), velocidade
   0,75/1/1,25/1,5x e "Lezione successiva" no fim. Usa as funções globais do index: $, esc, toast, guardar, ler,
   chaveUsuario. Era o bônus 9 (4 aulas mudas) até 02/11. */
var LEZ = (function () {
  var HLS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.20/hls.min.js';
  var VEL = [0.75, 1, 1.25, 1.5];
  function M() { return (window.LDATI && window.LDATI.modelli) || []; }
  var TUTTE = [];   // as aulas em sequência, cada uma com o seu modelo
  M().forEach(function (m) { m.lezioni.forEach(function (l) { TUTTE.push({ l: l, m: m }); }); });
  function trova(slug) { for (var i = 0; i < TUTTE.length; i++) if (TUTTE[i].l.slug === slug) return i; return -1; }
  function chiave(k) { return 'ar:lez:' + chaveUsuario() + ':' + k; }
  function salva(k, v) { guardar(chiave(k), JSON.stringify(v)); }
  function leggi(k, def) { try { var v = JSON.parse(ler(chiave(k)) || 'null'); return v == null ? def : v; } catch (e) { return def; } }
  function mmss(s) { s = Math.max(0, Math.floor(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = ('0' + s % 60).slice(-2); return h ? h + ':' + ('0' + m).slice(-2) + ':' + x : m + ':' + x; }
  function stato(slug) { return leggi('v:' + slug, { t: 0, dur: 0, fatto: false }); }
  function pct(slug) { var st = stato(slug); return st.fatto ? 100 : st.dur ? Math.min(100, Math.round(100 * st.t / st.dur)) : 0; }

  var hls = null, el = null, atual = '', ult = 0, vel = 1, pronto = false;
  function salvaPos() {
    if (!el || !atual || !isFinite(el.duration) || !el.duration) return;
    var st = stato(atual); st.t = el.currentTime; st.dur = el.duration; if (el.currentTime > el.duration * 0.95) st.fatto = true; salva('v:' + atual, st);
  }
  function ferma() { if (el) { salvaPos(); try { el.pause(); } catch (e) {} } }
  function caricaHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = HLS_URL; s.crossOrigin = 'anonymous'; s.onload = function () { ok(window.Hls); }; s.onerror = ko; document.head.appendChild(s); });
  }
  function erro() { toast('Il video non si carica. Controlla la connessione e riprova.'); }

  function carica(slug, play) {
    salvaPos();
    if (hls) { hls.destroy(); hls = null; }
    var i = trova(slug); if (i < 0) i = 0;
    var x = TUTTE[i], st = stato(x.l.slug);
    atual = x.l.slug; salva('ultima', atual);
    var src = '/video/' + atual + '/index.m3u8';
    el.poster = '/assets/lezioni/' + atual + '.webp';
    el.addEventListener('loadedmetadata', function () {
      if (atual !== x.l.slug) return;   // sobra de uma aula anterior que não chegou a carregar
      el.playbackRate = vel;
      if (st.t > 5 && !(st.dur && st.t > st.dur - 10)) { el.currentTime = st.t; toast('Continua da dove eri rimasta: ' + mmss(st.t)); }
    }, { once: true });
    function vai() { if (play) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } }
    if (el.canPlayType('application/vnd.apple.mpegurl')) { el.src = src; vai(); }
    else caricaHls().then(function (Hls) {
      if (atual !== x.l.slug) return;
      if (!Hls.isSupported()) { el.src = src; vai(); return; }
      hls = new Hls({ maxBufferLength: 30 });
      hls.on(Hls.Events.ERROR, function (e, d) { if (d && d.fatal) erro(); });
      hls.loadSource(src); hls.attachMedia(el); vai();
    }, erro);
    info(); lista();
  }

  function info() {
    var i = trova(atual), x = TUTTE[i], prox = TUTTE[i + 1];
    $('lz-info').innerHTML = '<small>' + esc(x.m.nome) + ' · Lezione ' + x.l.n + ' di ' + x.m.lezioni.length + ' · ' + mmss(x.l.dur) + '</small><h2>' + esc(x.l.tit) + '</h2>';
    $('lz-prec').disabled = i <= 0; $('lz-succ').disabled = !prox;
  }
  function resumo() {
    var fatte = TUTTE.filter(function (x) { return stato(x.l.slug).fatto; }).length;
    var tot = TUTTE.reduce(function (s, x) { return s + x.l.dur; }, 0);
    $('lz-resumo').textContent = TUTTE.length + ' lezioni · ' + Math.round(tot / 3600 * 10) / 10 + ' ore in tutto' + (fatte ? ' · ne hai completate ' + fatte : '');
  }
  function lista() {
    $('lz-mods').innerHTML = M().map(function (m) {
      var fatte = m.lezioni.filter(function (l) { return stato(l.slug).fatto; }).length;
      var min = Math.round(m.lezioni.reduce(function (s, l) { return s + l.dur; }, 0) / 60);
      return '<section class="lz-mod" id="lz-' + m.id + '"><div class="lz-mod-cab"><img src="/assets/lezioni/mod-' + m.id + '.webp" alt="" width="240" height="240" loading="lazy">' +
        '<div><h3>' + esc(m.nome) + '</h3><p>' + esc(m.txt) + '</p><small>' + m.lezioni.length + ' lezioni · ' + min + ' min' + (fatte ? ' · ' + fatte + ' completate' : '') + '</small></div></div>' +
        '<div class="lz-lista">' + m.lezioni.map(function (l) {
          var p = pct(l.slug), st = stato(l.slug);
          return '<button type="button" class="lz-lez' + (l.slug === atual ? ' on' : '') + '" data-lez="' + l.slug + '">' +
            '<span class="th"><img src="/assets/lezioni/' + l.slug + '.webp" alt="" width="640" height="360" loading="lazy"><span class="dur">' + mmss(l.dur) + '</span>' + (st.fatto ? '<span class="ok">✓</span>' : '') + '</span>' +
            '<span class="t"><small>Lezione ' + l.n + (st.fatto ? ' · vista' : p > 2 ? ' · ' + p + '%' : '') + '</small><b>' + esc(l.tit) + '</b>' +
            '<span class="mini-prog"><i style="width:' + p + '%"></i></span></span></button>';
        }).join('') + '</div></section>';
    }).join('');
    resumo();
  }

  function monta() {
    var box = $('lezioni-corpo'); if (!box || !TUTTE.length) return;
    box.innerHTML = '<div class="lz-player"><video id="lz-video" controls playsinline preload="none"></video></div>' +
      '<div class="lz-info" id="lz-info"></div>' +
      '<div class="lz-barra"><button type="button" class="lz-chip" id="lz-prec">← Precedente</button><button type="button" class="lz-chip" id="lz-succ">Successiva →</button><span class="esp"></span>' +
      '<span class="lz-vel" role="group" aria-label="Velocità"><span>Velocità</span>' + VEL.map(function (v) { return '<button type="button" class="lz-chip' + (v === vel ? ' on' : '') + '" data-vel="' + v + '">' + String(v).replace('.', ',') + 'x</button>'; }).join('') + '</span></div>' +
      '<p class="lz-resumo" id="lz-resumo"></p><div class="lz-mods" id="lz-mods"></div>';
    el = $('lz-video');
    el.ontimeupdate = function () { var a = Date.now(); if (a - ult > 4000) { ult = a; salvaPos(); } };
    el.onpause = salvaPos;
    el.onended = function () {
      salvaPos(); lista();
      var prox = TUTTE[trova(atual) + 1];
      toast(prox ? 'Lezione completata ✓ Tocca “Successiva” per continuare.' : 'Hai completato tutte le videolezioni ✓');
    };
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lez]');
      if (b) { carica(b.getAttribute('data-lez'), true); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      var v = e.target.closest('[data-vel]');
      if (v) { vel = +v.getAttribute('data-vel'); el.defaultPlaybackRate = vel; el.playbackRate = vel; [].forEach.call(box.querySelectorAll('[data-vel]'), function (x) { x.classList.toggle('on', x === v); }); return; }
      var i = trova(atual);
      if (e.target.closest('#lz-prec') && TUTTE[i - 1]) carica(TUTTE[i - 1].l.slug, true);
      if (e.target.closest('#lz-succ') && TUTTE[i + 1]) carica(TUTTE[i + 1].l.slug, true);
    });
    pronto = true;
  }

  // a cada entrada na aba: monta uma vez e volta para a última aula vista (sem dar play sozinho)
  function mostra() {
    if (!pronto) monta();
    if (!el) return;
    var u = leggi('ultima', '');
    if (!atual || (u && u !== atual)) carica(trova(u) >= 0 ? u : TUTTE[0].l.slug, false);
    else lista();
  }
  window.addEventListener('pagehide', salvaPos);
  return { mostra: mostra, ferma: ferma };
})();
