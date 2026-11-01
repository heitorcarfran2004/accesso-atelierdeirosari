/* ═══════════ I 10 BONUS di L'Atelier del Rosario ═══════════
   Arquivo escrito à mão (o index.html é gerado pelo scripts/ros-app-montar.cjs; este não).
   Os dados do manual (nome, tempo, materiais, confezione de cada modelo) vêm de bonus-dati.js
   (scripts/ros-app-bonus.cjs). Usa as funções globais do index: $, esc, ico, toast, guardar, ler,
   dois, norm, chaveUsuario, PERFIL. Tudo o que a cliente digita fica no aparelho, por e-mail. */
var BONUS = (function () {
  var LISTA = [
    { n: 1, tit: 'Guida per vendere + messaggi pronti', sub: 'Dove vendere e cosa scrivere' },
    { n: 2, tit: 'Prezzi + Calcolatrice', sub: 'Quanto chiedere per ogni modello' },
    { n: 3, tit: 'Calendario religioso', sub: 'Le date dell’anno per vendere' },
    { n: 4, tit: 'Prima Comunione e Battesimo', sub: 'Bomboniere a dozzine e preventivo' },
    { n: 5, tit: 'Il significato dei colori', sub: 'Colori e palette che stanno bene' },
    { n: 6, tit: 'Catalogo per WhatsApp', sub: 'Crea il tuo catalogo da inviare' },
    { n: 7, tit: 'Piano di 7 giorni per vendere sui social', sub: 'Cosa pubblicare ogni giorno' },
    { n: 8, tit: 'Confezioni, kit ed etichette', sub: 'Etichette e biglietti da stampare' },
    { n: 9, tit: 'Le videolezioni', sub: '4 rosari montati passo passo' },
    { n: 10, tit: 'Foto che vendono', sub: 'Foto belle con il telefono' },
    { n: 11, tit: 'Dove trovare i materiali', sub: 'La lista della spesa e dove comprare' }
  ];
  function M() { return (window.BDATI && window.BDATI.modelli) || []; }
  function mod(n) { return M()[(+n) - 1]; }
  function pag1(n) { return 2 * n + 2; }   // pagina dell'app della scheda del modello N
  function linkMod(n) { var m = mod(n); return m ? '<a class="b-mod" href="#leggi/principal/' + pag1(n) + '"><span>' + dois(n) + '</span>' + esc(m.nome) + '</a>' : ''; }
  function mods(l) { return l && l.length ? '<div class="b-mods">' + l.map(linkMod).join('') + '</div>' : ''; }
  function euro(v) { return (Math.round(v * 100) / 100).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
  function num(s) { var v = parseFloat(String(s == null ? '' : s).replace(/\s/g, '').replace(',', '.')); return isFinite(v) ? v : 0; }
  function chiave(k) { return 'ar:b:' + chaveUsuario() + ':' + k; }
  function salva(k, v) { guardar(chiave(k), JSON.stringify(v)); }
  function leggi(k, def) { try { var v = JSON.parse(ler(chiave(k)) || 'null'); return v == null ? def : v; } catch (e) { return def; } }
  function opzioniModelli(sel) { return M().map(function (m) { return '<option value="' + m.n + '"' + (m.n === +sel ? ' selected' : '') + '>' + dois(m.n) + ' · ' + esc(m.nome) + '</option>'; }).join(''); }
  function copia(testo) { return '<button class="btn claro b-copia" type="button" data-copia="' + encodeURIComponent(testo) + '">Copia</button>'; }
  function msg(tit, testo) { return '<div class="b-msg"><div class="b-msg-cab"><b>' + esc(tit) + '</b>' + copia(testo) + '</div><p>' + esc(testo).replace(/\n/g, '<br>') + '</p></div>'; }
  function sez(tit, html, sub) { return '<section class="bloco b-sez"><h3>' + esc(tit) + '</h3>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + html + '</section>'; }
  function capa(n) { return '/assets/bonus/capa-' + dois(n) + '.webp'; }

  /* copiar: clipboard e, se não der, seleção à moda antiga */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copia]'); if (!b) return;
    var t = decodeURIComponent(b.getAttribute('data-copia'));
    function ok() { toast('Copiato! Ora incollalo dove vuoi.'); }
    function vecchio() { var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); ok(); } catch (x) { prompt('Copia il testo:', t); } document.body.removeChild(a); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, vecchio); else vecchio();
  });

  /* ── cartões da Home ── */
  function cards() {
    return LISTA.map(function (b) {
      var foto = '<img src="/assets/capas/b' + dois(b.n) + '-480.webp" srcset="/assets/capas/b' + dois(b.n) + '-480.webp 480w, /assets/capas/b' + dois(b.n) + '-800.webp 800w" sizes="220px" alt="" width="800" height="600" loading="lazy" decoding="async" onerror="this.style.visibility=\'hidden\'">';
      return '<a class="card' + (b.inArrivo ? ' bloq' : ' feito') + '" href="#bonus/' + b.n + '"><div class="foto">' + foto + (b.inArrivo ? '<span class="fita">In arrivo</span>' : '') + '</div>' +
        '<div class="corpo"><h3>' + esc(b.tit) + '</h3><span class="sub">Bonus ' + b.n + ' · ' + esc(b.sub) + '</span><div class="pe"><span class="acao">' + (b.inArrivo ? 'In arrivo' : 'Apri →') + '</span></div></div></a>';
    }).join('');
  }

  /* ── tela de cada bônus ── */
  function apri(n) {
    var b = LISTA.filter(function (x) { return x.n === +n; })[0], box = $('bonus-corpo');
    if (!b || !box) { location.hash = '#home'; return; }
    // contêiner novo a cada abertura: os ouvintes do bônus anterior vão embora junto
    var novo = box.cloneNode(false); box.parentNode.replaceChild(novo, box); box = novo;
    VIDEO.ferma();
    var corpo = { 1: b1, 2: b2, 3: b3, 4: b4, 5: b5, 6: b6, 7: b7, 8: b8, 9: b9, 10: b10, 11: b11 }[b.n]();
    box.innerHTML = '<a class="b-voltar" href="#bonus">' + ico('baixo') + 'Tutti i bonus</a>' +
      '<div class="b-cab"><img src="' + capa(b.n) + '" alt="" width="240" height="320" onerror="this.remove()"><div><small>Bonus ' + b.n + ' di ' + LISTA.length + '</small><h1>' + esc(b.tit) + '</h1><p>' + esc(b.sub) + '</p></div></div>' + corpo.html;
    if (corpo.init) corpo.init();
    window.scrollTo(0, 0);
  }

  /* ═══ 1. Guida per vendere + messaggi pronti ═══ */
  function b1() {
    var dove = [
      ['⛪', 'La tua parrocchia', 'Chiedi al parroco se puoi esporre i rosari a un banchetto dopo la Messa della domenica o alla festa patronale. Porta pochi modelli, ben ordinati, con il prezzo visibile.'],
      ['📖', 'Il catechismo', 'Le catechiste preparano i gruppi della Prima Comunione e della Cresima: proponi un rosario-ricordo uguale per tutto il gruppo (vedi il bonus 4).'],
      ['🏪', 'Negozi di articoli religiosi e di bomboniere', 'Proponi qualche pezzo in conto vendita: lasci i rosari e ti pagano quelli venduti. Porta il catalogo (bonus 6).'],
      ['🎪', 'Mercatini', 'Mercatini dell’artigianato, di Natale e delle feste di paese: una tovaglia di lino, i rosari appesi e un cartellino con il prezzo.'],
      ['💬', 'WhatsApp', 'Una foto al giorno negli stati, il catalogo alle amiche e un messaggio personale a chi conosci.'],
      ['📷', 'Instagram', 'Foto curate (bonus 10) e il piano di 7 giorni (bonus 7). Rispondi sempre ai messaggi in giornata.'],
      ['🛒', 'Etsy', 'La vetrina online di chi cerca oggetti fatti a mano: servono buone foto, una descrizione chiara e i tempi di spedizione.']
    ];
    var M1 = [
      ['Al parroco', 'Buongiorno don [Nome], sono [il tuo nome] della parrocchia. Realizzo a mano rosari e decine, anche per la Prima Comunione e la Cresima. Sarebbe possibile esporne alcuni a un banchetto dopo la Messa di domenica? Le porto volentieri qualche modello da vedere. Grazie di cuore!'],
      ['Alla catechista', 'Ciao [Nome]! Faccio rosari a mano e ho pensato al gruppo della Prima Comunione: posso preparare un rosario-ricordo uguale per tutti i bambini, nel colore che preferite. Ti mando qualche foto? Per un gruppo faccio un prezzo speciale.'],
      ['Al negozio (conto vendita)', 'Buongiorno, realizzo rosari fatti a mano con grani di cristallo, legno e perle. Vi interesserebbe tenerne qualcuno in conto vendita? Posso passare a mostrarvi i modelli.'],
      ['Alle amiche', 'Ciao! Ho iniziato a fare rosari a mano 📿 Ti mando il mio catalogo: se ti piace un modello per te o da regalare, lo preparo nei colori che vuoi.'],
      ['Stato di WhatsApp', 'Fatto a mano oggi 📿 [Nome del modello]. Disponibile anche in altri colori: scrivimi per prenotarlo!'],
      ['Post su Instagram', 'Ogni grano, una preghiera. 📿\nQuesto rosario [Nome del modello] è fatto a mano, grano dopo grano.\nPerfetto anche come regalo per la Prima Comunione, il Battesimo e la Cresima.\nScrivimi in DM per ordinarlo.\n#rosario #fattoamano #primacomunione #bomboniere'],
      ['Risposta a “quanto costa?”', 'Grazie per avermi scritto! Il [modello] costa [prezzo] €. Lo preparo in [X] giorni e te lo consegno nella confezione regalo. Ti piace in questo colore o ne preferisci un altro?'],
      ['Dopo la vendita', 'Grazie di cuore per aver scelto un mio rosario! Se ti fa piacere, mandami una foto quando lo regali: per me è un grande aiuto. 🙏']
    ];
    return { html:
      sez('Dove vendere', '<div class="b-lista">' + dove.map(function (d) { return '<div class="b-item"><span class="e">' + d[0] + '</span><div><b>' + esc(d[1]) + '</b><p>' + esc(d[2]) + '</p></div></div>'; }).join('') + '</div>') +
      sez('Messaggi pronti', M1.map(function (m) { return msg(m[0], m[1]); }).join(''), 'Tocca “Copia”, incolla e cambia le parti tra [parentesi].') +
      '<p class="b-nota">Se le vendite diventano regolari, chiedi a un commercialista come metterti in regola.</p>' };
  }

  /* ═══ 2. Prezzi + Calcolatrice ═══ */
  var ATTREZZI = /^(Pinza|Pinzetta|Forbic|Tronchesino|Accendino|Vassoio|Ciotoline|Ago)/i;
  function b2() {
    var st = leggi('calc', { mod: 1, ora: '10', conf: '0,50', marg: '30', costi: {} });
    var html = sez('Come si calcola il prezzo', '<ol class="b-passi"><li><b>Materiali:</b> quanto spendi per i grani, il filo, la crociera e il crocifisso di UN rosario.</li><li><b>Il tuo tempo:</b> i minuti di lavoro moltiplicati per quanto vuoi guadagnare all’ora.</li><li><b>Confezione:</b> sacchetto, scatolina, biglietto.</li><li><b>Margine:</b> una percentuale in più, per gli imprevisti e per crescere.</li></ol>') +
      sez('La calcolatrice', '<label class="b-campo">Modello del manuale<select class="sel" id="c2-mod">' + opzioniModelli(st.mod) + '</select></label>' +
        '<div id="c2-mats"></div>' +
        '<div class="b-griglia"><label class="b-campo">Tempo di lavoro (minuti)<input id="c2-min" inputmode="numeric"></label>' +
        '<label class="b-campo">Il tuo tempo vale (€ all’ora)<input id="c2-ora" inputmode="decimal" value="' + esc(st.ora) + '"></label>' +
        '<label class="b-campo">Confezione (€)<input id="c2-conf" inputmode="decimal" value="' + esc(st.conf) + '"></label>' +
        '<label class="b-campo">Margine (%)<input id="c2-marg" inputmode="numeric" value="' + esc(st.marg) + '"></label></div>' +
        '<div class="b-ris" id="c2-ris"></div>',
        'Scegli il modello: la lista dei materiali e il tempo arrivano dalla scheda del manuale. Tu scrivi quanto hai speso.');
    function righe() {
      var m = mod($('c2-mod').value), costi = (st.costi[m.n] || {});
      $('c2-min').value = st.minuti && st.minuti[m.n] ? st.minuti[m.n] : m.tempo;
      $('c2-mats').innerHTML = '<div class="b-mats">' + m.mats.map(function (x, i) {
        var att = ATTREZZI.test(x[0]);
        return '<div class="b-mat"><div><b>' + esc(x[0]) + '</b><small>' + esc(x[1]) + (att ? ' · attrezzo, non entra nel prezzo' : '') + '</small></div>' +
          (att ? '' : '<input class="c2-c" data-i="' + i + '" inputmode="decimal" placeholder="€" aria-label="Costo di ' + esc(x[0]) + '" value="' + esc(costi[i] || '') + '">') + '</div>';
      }).join('') + '</div><p class="b-nota">Tempo nella scheda: <b>' + esc(m.tempoTxt) + '</b> · Misura: ' + esc(m.misura) + ' · Grani: ' + esc(m.grani) + '. Scrivi il costo della quantità indicata.</p>';
      calcola();
    }
    function calcola() {
      var m = mod($('c2-mod').value), mat = 0, costi = {};
      [].forEach.call(document.querySelectorAll('.c2-c'), function (inp) { mat += num(inp.value); if (inp.value) costi[inp.getAttribute('data-i')] = inp.value; });
      var min = num($('c2-min').value), ora = num($('c2-ora').value), conf = num($('c2-conf').value), marg = num($('c2-marg').value);
      var tempo = min / 60 * ora, tot = mat + tempo + conf, prezzo = Math.ceil(tot * (1 + marg / 100) * 2) / 2;
      st.mod = m.n; st.ora = $('c2-ora').value; st.conf = $('c2-conf').value; st.marg = $('c2-marg').value; st.costi[m.n] = costi;
      st.minuti = st.minuti || {}; if (min && min !== m.tempo) st.minuti[m.n] = min; else delete st.minuti[m.n];
      st.ultimo = { n: m.n, prezzo: prezzo }; salva('calc', st);
      $('c2-ris').innerHTML = '<div class="b-righe"><span>Materiali</span><b>' + euro(mat) + '</b><span>Il tuo tempo (' + min + ' min)</span><b>' + euro(tempo) + '</b><span>Confezione</span><b>' + euro(conf) + '</b><span>Costo totale</span><b>' + euro(tot) + '</b><span>Margine ' + marg + '%</span><b>' + euro(prezzo - tot) + '</b></div>' +
        '<div class="b-prezzo"><small>Prezzo consigliato</small><b>' + euro(prezzo) + '</b><span>arrotondato ai 50 centesimi</span></div>' +
        (mat ? '' : '<p class="b-nota">Scrivi i costi dei materiali per vedere il prezzo giusto.</p>');
    }
    return { html: html + '<p class="b-nota">Le prime volte ci metterai più del tempo indicato: per il prezzo usa il tempo della scheda, che è quello di chi ha già un po’ di pratica.</p>',
      init: function () { $('c2-mod').onchange = righe; $('bonus-corpo').addEventListener('input', function (e) { if (e.target.closest('#c2-ris') || !e.target.matches('.c2-c, #c2-min, #c2-ora, #c2-conf, #c2-marg')) return; calcola(); }); righe(); } };
  }

  /* ═══ 3. Calendario religioso ═══ */
  function pasqua(y) { var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mese = Math.floor((h + l - 7 * m + 114) / 31), g2 = ((h + l - 7 * m + 114) % 31) + 1; return new Date(y, mese - 1, g2); }
  function domenica(y, mese, n) { var d = new Date(y, mese - 1, 1); while (d.getDay() !== 0) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; }
  function piuGiorni(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  var DATE = [
    { t: 'Madonna di Lourdes', f: function (y) { return new Date(y, 1, 11); }, idea: 'Rosari bianchi e azzurri, i colori della Madonna.', m: [] },
    { t: 'San Giuseppe · Festa del papà', f: function (y) { return new Date(y, 2, 19); }, idea: 'Rosari sobri da uomo, da regalare al papà o al nonno.', m: [57, 61, 7] },
    { t: 'San Giorgio', f: function (y) { return new Date(y, 3, 23); }, idea: 'Il rosario di San Giorgio, per chi porta il suo nome.', m: [76] },
    { t: 'Pasqua', f: pasqua, idea: 'Rosari bianchi e dorati: un regalo al posto dell’uovo, o insieme all’uovo.', m: [92, 95] },
    { t: 'Supplica alla Madonna di Pompei', f: function (y) { return new Date(y, 4, 8); }, idea: 'La Madonna del Rosario: il giorno giusto per proporre il rosario classico.', m: [92, 57] },
    { t: 'Festa della Mamma', f: function (y) { return domenica(y, 5, 2); }, idea: 'Rosari delicati o con il nome, per la mamma e la nonna.', m: [3, 97, 51] },
    { t: 'Madonna di Fátima', f: function (y) { return new Date(y, 4, 13); }, idea: 'Il rosario della Madonna di Fátima.', m: [75] },
    { t: 'Santa Rita da Cascia', f: function (y) { return new Date(y, 4, 22); }, idea: 'Rose e rosari di Santa Rita: in molte parrocchie si benedicono le rose.', m: [78] },
    { t: 'Pentecoste', f: function (y) { return piuGiorni(pasqua(y), 49); }, idea: 'Il rosario dello Spirito Santo, anche per chi riceve la Cresima.', m: [81, 22] },
    { t: 'Sant’Antonio di Padova', f: function (y) { return new Date(y, 5, 13); }, idea: 'Il santo dei fidanzati: rosari per le coppie e per chi si chiama Antonio o Antonella.', m: [77, 10] },
    { t: 'Madonna del Perpetuo Soccorso', f: function (y) { return new Date(y, 5, 27); }, idea: 'Il rosario del Perpetuo Soccorso.', m: [80] },
    { t: 'Assunzione di Maria (Ferragosto)', f: function (y) { return new Date(y, 7, 15); }, idea: 'Rosari eleganti in bianco e oro per la festa di Maria.', m: [90] },
    { t: 'San Pio da Pietrelcina (Padre Pio)', f: function (y) { return new Date(y, 8, 23); }, idea: 'Molto amato in tutta Italia: proponi rosari semplici e sobri.', m: [57, 1] },
    { t: 'San Michele Arcangelo', f: function (y) { return new Date(y, 8, 29); }, idea: 'Il rosario dell’Arcangelo, per chi si chiama Michele o Michela.', m: [82] },
    { t: 'Supplica di ottobre a Pompei', f: function (y) { return domenica(y, 10, 1); }, idea: 'Inizia il mese del Rosario: il momento migliore dell’anno per vendere rosari.', m: [92, 57] },
    { t: 'San Francesco d’Assisi, patrono d’Italia', f: function (y) { return new Date(y, 9, 4); }, idea: 'Semplicità e legno naturale.', m: [1, 63] },
    { t: 'Beata Vergine del Rosario', f: function (y) { return new Date(y, 9, 7); }, idea: 'La festa del Rosario: proponi il catalogo a tutta la parrocchia.', m: [92, 95] },
    { t: 'San Giuda Taddeo', f: function (y) { return new Date(y, 9, 28); }, idea: 'Il santo delle cause difficili.', m: [79] },
    { t: 'Ognissanti e Commemorazione dei defunti', f: function (y) { return new Date(y, 10, 1); }, idea: 'Decine-ricordo per le Messe in memoria e per le famiglie.', m: [24] },
    { t: 'Immacolata Concezione', f: function (y) { return new Date(y, 11, 8); }, idea: 'Si apre il periodo dei regali di Natale: prepara le confezioni (bonus 8).', m: [] },
    { t: 'Santa Lucia', f: function (y) { return new Date(y, 11, 13); }, idea: 'In molte zone del Nord è il giorno dei regali ai bambini.', m: [11, 13] },
    { t: 'Natale', f: function (y) { return new Date(y, 11, 25); }, idea: 'Il periodo più forte dell’anno: kit regalo, modelli di lusso e da uomo.', m: [95, 98, 61] }
  ];
  var STAGIONI = [
    ['🌸', 'Prima Comunione e Cresima', 'Da aprile a giugno (la Cresima anche in autunno, dipende dalla parrocchia). Contatta le catechiste già a febbraio.', [27, 21, 22]],
    ['💒', 'Matrimoni', 'Da maggio a settembre: bomboniere, il kit dei testimoni e il rosario della sposa.', [83, 84, 85]],
    ['👶', 'Battesimi', 'Tutto l’anno: bomboniere e rosari con il nome del bambino.', [21, 48]],
    ['🌹', 'Maggio, mese mariano', 'Il mese della Madonna: rosari e decine per le preghiere di maggio.', [92, 75]],
    ['📿', 'Ottobre, mese del Rosario', 'Il mese del Rosario: proponi il catalogo in parrocchia.', [57, 92]]
  ];
  function b3() {
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var prossime = DATE.map(function (e) { var d = e.f(oggi.getFullYear()); if (d < oggi) d = e.f(oggi.getFullYear() + 1); return { e: e, d: d }; }).sort(function (a, b) { return a.d - b.d; });
    function fmt(d) { return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); }
    var html = sez('Le prossime date', '<div class="b-cal">' + prossime.map(function (x, i) {
      var gg = Math.round((x.d - oggi) / 86400e3), prep = piuGiorni(x.d, -30);
      return '<div class="b-data' + (i < 2 ? ' vicina' : '') + '"><div class="b-giorno"><b>' + x.d.getDate() + '</b><span>' + x.d.toLocaleDateString('it-IT', { month: 'short' }) + '</span></div><div class="b-dt"><b>' + esc(x.e.t) + '</b><small>' + fmt(x.d) + ' · ' + (gg === 0 ? 'oggi' : gg === 1 ? 'domani' : 'tra ' + gg + ' giorni') + '</small>' +
        '<p>' + esc(x.e.idea) + '</p><p class="b-prep">' + (prep > oggi ? 'Inizia a preparare entro il ' + prep.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) : 'È ora di preparare e di pubblicare') + '</p>' + mods(x.e.m) + '</div></div>';
    }).join('') + '</div>', 'In ordine, dalla più vicina. Un mese prima di ogni data: prepara i rosari, le foto e il messaggio.') +
      sez('I periodi dell’anno', '<div class="b-lista">' + STAGIONI.map(function (s) { return '<div class="b-item"><span class="e">' + s[0] + '</span><div><b>' + esc(s[1]) + '</b><p>' + esc(s[2]) + '</p>' + mods(s[3]) + '</div></div>'; }).join('') + '</div>');
    return { html: html };
  }

  /* ═══ 4. Prima Comunione e Battesimo: bomboniere a dozzine ═══ */
  var LUNGHEZZE = /^(Elastico|Nylon|Filo|Cordoncino|Cuoio|Paracord|Seta|Cavetto|Catena|Corda|Nastro|Cotone|Sisal|Cera)/i;
  function perN(nome, q, N) {
    if (ATTREZZI.test(nome)) return { t: '1 (attrezzo)', scorta: '' };
    var s = String(q).trim();
    if (/per (pezzo|invitato|bambino)/i.test(s)) return { t: N + ' pezzi', scorta: '' };
    if (/\b(cm|m)\b/.test(s) && LUNGHEZZE.test(nome)) {
      var tot = 0, unita = 'cm', okLen = true;
      var x = /^(\d+(?:,\d+)?)\s*x\s*(\d+(?:,\d+)?)\s*(cm|m)\b/.exec(s);
      if (x) tot = num(x[1]) * num(x[2]) * (x[3] === 'm' ? 100 : 1);
      else s.split('+').forEach(function (p) { var r = /(\d+(?:,\d+)?)\s*(cm|m)?/.exec(p); if (!r) { okLen = false; return; } if (r[2]) unita = r[2]; tot += num(r[1]) * ((r[2] || unita) === 'm' ? 100 : 1); });
      if (okLen && tot) { var cm = tot * N; return { t: cm >= 100 ? (Math.round(cm / 10) / 10).toLocaleString('it-IT') + ' m' : cm + ' cm', scorta: (Math.round(cm * 1.1 / 10) / 10).toLocaleString('it-IT') + ' m' }; }
    }
    var r2 = /^(\d+(?:,\d+)?)\s*(.*)$/.exec(s);
    if (r2 && !/\b(cm|m|mm)\b/.test(s)) { var v = num(r2[1]) * N, resto = r2[2].replace(/^\+.*$/, ''); return { t: v + (resto ? ' ' + resto : ''), scorta: Math.ceil(v * 1.1) + '' }; }
    return { t: N + ' pezzi (' + s + ')', scorta: '' };
  }
  function b4() {
    var st = leggi('bomb', { mod: 21, n: 24, prezzo: '', evento: 'Prima Comunione', data: '', sconto: '0' });
    var calc = leggi('calc', {});
    if (!st.prezzo && calc.ultimo && calc.ultimo.n === +st.mod) st.prezzo = String(calc.ultimo.prezzo).replace('.', ',');
    var sugg = [21, 22, 26, 27, 23, 83, 29];
    var html = sez('Quali modelli', mods(sugg), 'Le bomboniere del manuale sono decine ad anello: veloci, economiche e tutte uguali. Puoi usare anche qualsiasi altro modello.') +
      sez('Quanto comprare', '<div class="b-griglia"><label class="b-campo">Modello<select class="sel" id="c4-mod">' + opzioniModelli(st.mod) + '</select></label>' +
        '<label class="b-campo">Quanti pezzi<input id="c4-n" inputmode="numeric" value="' + esc(st.n) + '"></label></div>' +
        '<div class="b-chips">' + [12, 24, 36, 48, 60].map(function (x) { return '<button type="button" class="b-chip" data-n4="' + x + '">' + x + '</button>'; }).join('') + '</div>' +
        '<div id="c4-lista"></div>', 'La lista viene dalla scheda del modello, moltiplicata per il numero di pezzi.') +
      sez('Come farle in fretta', '<ol class="b-passi"><li>Prepara prima tutti i materiali, già contati, in ciotoline separate.</li><li>Lavora a fasi, come in una piccola catena di montaggio: prima taglia tutti i fili, poi infila tutti i grani, poi chiudi tutte le decine.</li><li>Montane 10 alla volta: è il consiglio del manuale per le bomboniere, e si fa prima.</li><li>Controlla la misura su ogni pezzo: tutte uguali fanno bella figura sul tavolo.</li><li>Lascia per ultime le confezioni e i cartellini (bonus 8).</li></ol>') +
      sez('Il preventivo', '<div class="b-griglia"><label class="b-campo">Occasione<select class="sel" id="c4-ev">' + ['Prima Comunione', 'Battesimo', 'Cresima', 'Matrimonio', 'Altra festa'].map(function (e) { return '<option' + (e === st.evento ? ' selected' : '') + '>' + e + '</option>'; }).join('') + '</select></label>' +
        '<label class="b-campo">Prezzo per pezzo (€)<input id="c4-p" inputmode="decimal" value="' + esc(st.prezzo) + '" placeholder="es. 4,50"></label>' +
        '<label class="b-campo">Sconto per il gruppo (%)<input id="c4-s" inputmode="numeric" value="' + esc(st.sconto) + '"></label>' +
        '<label class="b-campo">Consegna entro il<input id="c4-d" value="' + esc(st.data) + '" placeholder="es. 30 aprile"></label></div>' +
        '<div id="c4-prev"></div>', 'Il prezzo per pezzo lo trovi con la calcolatrice del bonus 2 (con la confezione già dentro).');
    function lista() {
      var m = mod($('c4-mod').value), N = Math.max(1, Math.round(num($('c4-n').value)) || 1), ore = m.tempo * N / 60;
      $('c4-lista').innerHTML = '<div class="b-tab"><div class="b-tr b-th"><span>Materiale</span><span>Per 1</span><span>Per ' + N + '</span><span>+10% scorta</span></div>' +
        m.mats.map(function (x) { var r = perN(x[0], x[1], N); return '<div class="b-tr"><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span><b>' + esc(r.t) + '</b><span>' + esc(r.scorta) + '</span></div>'; }).join('') + '</div>' +
        '<p class="b-nota">Tempo: ' + esc(m.tempoTxt) + ' a pezzo, circa <b>' + (Math.round(ore * 2) / 2).toLocaleString('it-IT') + ' ore</b> per ' + N + ' pezzi (lavorando a fasi si fa prima). Compra il 10% di grani in più: qualcuno si rompe o si perde.</p>';
      preventivo();
    }
    function preventivo() {
      var m = mod($('c4-mod').value), N = Math.max(1, Math.round(num($('c4-n').value)) || 1), p = num($('c4-p').value), sc = num($('c4-s').value);
      var tot = p * N * (1 - sc / 100), ev = $('c4-ev').value, data = $('c4-d').value.trim();
      st = { mod: m.n, n: N, prezzo: $('c4-p').value, evento: ev, data: data, sconto: $('c4-s').value }; salva('bomb', st);
      if (!p) { $('c4-prev').innerHTML = '<p class="b-nota">Scrivi il prezzo per pezzo per preparare il messaggio.</p>'; return; }
      var art = { 'Prima Comunione': 'la ', 'Cresima': 'la ', 'Battesimo': 'il ', 'Matrimonio': 'il ' }[ev];
      var t = 'Preventivo per ' + (art ? art + ev : 'la festa') + ':\n' + N + ' rosari-bomboniera, modello “' + m.nome + '”, nella confezione regalo.\n' +
        euro(p) + ' a pezzo' + (sc ? ', sconto del ' + sc + '% per il gruppo' : '') + ': totale ' + euro(tot) + '.\n' +
        (data ? 'Consegna entro il ' + data + '.\n' : '') + 'Per confermare: acconto del 30% (' + euro(tot * 0.3) + '), il resto alla consegna.';
      $('c4-prev').innerHTML = '<div class="b-prezzo"><small>Totale</small><b>' + euro(tot) + '</b><span>' + N + ' pezzi</span></div>' + msg('Messaggio con il preventivo', t);
    }
    return { html: html, init: function () {
      $('c4-mod').onchange = lista;
      $('bonus-corpo').addEventListener('input', function (e) { if (e.target.id === 'c4-n') lista(); else if (/^c4-(p|s|d)$/.test(e.target.id)) preventivo(); });
      $('c4-ev').onchange = preventivo;
      [].forEach.call(document.querySelectorAll('[data-n4]'), function (b) { b.onclick = function () { $('c4-n').value = b.getAttribute('data-n4'); lista(); }; });
      lista();
    } };
  }

  /* ═══ 5. Il significato dei colori ═══ */
  function b5() {
    var C = [
      ['#FFFFFF', 'Bianco', 'Purezza, luce e festa. È il colore liturgico di Natale e di Pasqua: perfetto per il Battesimo, la Prima Comunione e le spose.'],
      ['#7FA7D6', 'Azzurro', 'Nella tradizione è il colore del manto della Madonna. Dà serenità; è anche il colore del fiocco per i bambini.'],
      ['#F2B6C6', 'Rosa', 'Tenerezza e gioia. Si usa nelle domeniche Gaudete e Laetare; è il colore del fiocco per le bambine.'],
      ['#B3262E', 'Rosso', 'Amore e Spirito Santo. È il colore liturgico della Pentecoste e dei martiri: adatto alla Cresima.'],
      ['#4E8A4A', 'Verde', 'Speranza e vita. È il colore liturgico del Tempo Ordinario, la maggior parte dell’anno.'],
      ['#6E3F91', 'Viola', 'Attesa e conversione: è il colore dell’Avvento e della Quaresima.'],
      ['#C99A3E', 'Oro', 'Festa e preziosità. Ideale per anniversari, regali importanti e modelli di lusso.'],
      ['#6B4423', 'Legno e toni naturali', 'Semplicità e uso di tutti i giorni. Piace molto agli uomini e a chi prega ogni giorno.']
    ];
    var P = [
      ['Cristallo rosa e perla', ['#F48FB1', '#FFFFFF', '#E7B19A'], 78],
      ['Legno e bronzo', ['#6B4423', '#4A2C17', '#A97142'], 1],
      ['Turchese e argento', ['#35A3A3', '#C9CED3', '#2C7A7B'], 94],
      ['Ametista e argento', ['#7B4CA0', '#C9CED3', '#B794D6'], 93],
      ['Oro e avorio', ['#C99A3E', '#F4EBD9', '#E2C27A'], 90],
      ['Onice e oro', ['#1C1C1C', '#C99A3E', '#3A3A3A'], 98],
      ['Arcobaleno pastello', ['#F8C8DC', '#C8E6C9', '#BBDEFB', '#FFF9C4'], 20],
      ['I 5 colori liturgici', ['#FFFFFF', '#4E8A4A', '#6E3F91', '#B3262E', '#F2B6C6'], 73]
    ];
    return { html:
      sez('Cosa trasmette ogni colore', '<div class="b-colori">' + C.map(function (c) { return '<div class="b-colore"><span class="sw" style="background:' + c[0] + '"></span><div><b>' + esc(c[1]) + '</b><p>' + esc(c[2]) + '</p></div></div>'; }).join('') + '</div>') +
      sez('Palette che stanno sempre bene', '<div class="b-palette">' + P.map(function (p) { return '<a class="b-pal" href="#leggi/principal/' + pag1(p[2]) + '"><span class="sws">' + p[1].map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span><b>' + esc(p[0]) + '</b><small>Modello ' + dois(p[2]) + ' · ' + esc(mod(p[2]).nome) + '</small></a>'; }).join('') + '</div>', 'Ogni palette è un modello del manuale: tocca per aprirlo.') +
      '<p class="b-nota">Consiglio: in un rosario usa al massimo 2 colori più il metallo (oro, argento o bronzo). Il Padre Nostro di un colore diverso aiuta a contare.</p>' };
  }

  /* ═══ utilità di disegno (canvas) per catalogo, etichette e biglietti ═══ */
  function carica(src) { return new Promise(function (ok, ko) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = ko; im.src = src; }); }
  function fotoModello(n) {
    return carica('/assets/livros/principal/pag-' + ('00' + pag1(n)).slice(-3) + '.webp').then(function (im) {
      var c = document.createElement('canvas'); c.width = 425; c.height = 470; c.getContext('2d').drawImage(im, 100, 150, 425, 470, 0, 0, 425, 470); return c;
    });
  }
  function copri(ctx, img, x, y, w, h, r) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, k = Math.max(w / iw, h / ih), sw = w / k, sh = h / k;
    ctx.save(); arrot(ctx, x, y, w, h, r || 0); ctx.clip(); ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h); ctx.restore();
  }
  function arrot(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function testoA(ctx, t, x, y, maxW, lh) {
    var parole = String(t).split(' '), riga = '', righe = [];
    parole.forEach(function (p) { var prova = riga ? riga + ' ' + p : p; if (ctx.measureText(prova).width > maxW && riga) { righe.push(riga); riga = p; } else riga = prova; });
    if (riga) righe.push(riga);
    righe.forEach(function (r, i) { ctx.fillText(r, x, y + i * lh); });
    return righe.length;
  }
  function croce(ctx, cx, cy, s, col) { ctx.fillStyle = col; ctx.fillRect(cx - s * 0.09, cy - s * 0.5, s * 0.18, s); ctx.fillRect(cx - s * 0.32, cy - s * 0.25, s * 0.64, s * 0.18); }
  function font() { return document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 40px "Playfair Display"'), document.fonts.load('400 24px Nunito'), document.fonts.load('700 24px Nunito')]).catch(function () {}) : Promise.resolve(); }
  var SERIF = '"Playfair Display", Georgia, serif', SANS = 'Nunito, Arial, sans-serif';
  function stampa(url, titolo) {
    var w = window.open('', '_blank'); if (!w) { toast('Il browser ha bloccato la finestra: usa “Scarica” e stampa dal file.'); return; }
    w.document.write('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>' + esc(titolo) + '</title><style>@page{size:A4;margin:0}html,body{margin:0}img{width:100%;display:block}</style></head><body><img src="' + url + '" onload="setTimeout(function(){print()},300)"></body></html>');
    w.document.close();
  }
  function scarica(url, nome) { var a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove(); }

  /* ═══ 6. Catalogo per WhatsApp (editor) ═══ */
  function b6() {
    var st = leggi('catalogo', { tit: 'I miei rosari fatti a mano', contatto: 'Ordina su WhatsApp', voci: [[1, '', ''], [11, '', ''], [78, '', ''], [93, '', ''], [94, '', ''], [97, '', '']] });
    var fotoMie = {};
    var html = sez('Esempio pronto', '<img class="b-img" src="/assets/bonus/catalogo-esempio.webp" alt="Esempio di catalogo con 6 rosari e i prezzi" loading="lazy" onerror="this.parentNode.removeChild(this)"><p class="b-nota">Così può essere il tuo catalogo. I prezzi sono solo un esempio: calcola i tuoi con il bonus 2.</p>') +
      sez('Crea il tuo catalogo', '<label class="b-campo">Titolo<input id="c6-tit" maxlength="40" value="' + esc(st.tit) + '"></label>' +
        '<label class="b-campo">Riga in basso (come ordinare)<input id="c6-cont" maxlength="60" value="' + esc(st.contatto) + '" placeholder="es. Ordina su WhatsApp: 333 123 4567"></label>' +
        '<div class="b-voci">' + st.voci.map(function (v, i) {
          return '<div class="b-voce"><b>Rosario ' + (i + 1) + '</b><select class="sel c6-m" data-i="' + i + '"><option value="0">— vuoto —</option>' + opzioniModelli(v[0]) + '</select>' +
            '<input class="c6-n" data-i="' + i + '" maxlength="30" placeholder="Nome (facoltativo)" value="' + esc(v[1]) + '"><input class="c6-p" data-i="' + i + '" inputmode="decimal" maxlength="8" placeholder="Prezzo €" value="' + esc(v[2]) + '">' +
            '<label class="btn claro b-file">' + ico('camera') + 'La tua foto<input type="file" accept="image/*" class="c6-f" data-i="' + i + '" hidden></label></div>';
        }).join('') + '</div>' +
        '<div class="b-anteprima"><canvas id="c6-cv" width="1080" height="1350"></canvas></div>' +
        '<div class="b-azioni"><button class="btn" type="button" id="c6-giu">' + ico('baixar') + 'Scarica l’immagine</button><button class="btn claro" type="button" id="c6-cond">' + ico('compartilhar') + 'Condividi</button></div>',
        'Scegli i modelli, scrivi i prezzi e, se vuoi, metti le TUE foto. Le foto del manuale servono come esempio: per vendere usa le foto dei rosari che hai fatto tu (bonus 10).');
    var timer = null;
    function leggiForm() {
      st.tit = $('c6-tit').value; st.contatto = $('c6-cont').value;
      [].forEach.call(document.querySelectorAll('.c6-m'), function (s) { var i = +s.getAttribute('data-i'); st.voci[i] = [+s.value, document.querySelector('.c6-n[data-i="' + i + '"]').value, document.querySelector('.c6-p[data-i="' + i + '"]').value]; });
      salva('catalogo', st);
    }
    function disegna() {
      leggiForm();
      var cv = $('c6-cv'); if (!cv) return; var ctx = cv.getContext('2d');
      var voci = st.voci.map(function (v, i) { return { i: i, n: v[0], nome: v[1] || (v[0] ? mod(v[0]).nome : ''), prezzo: v[2] }; }).filter(function (v) { return v.n || fotoMie[v.i]; });
      return font().then(function () {
        return Promise.all(voci.map(function (v) { return fotoMie[v.i] ? Promise.resolve(fotoMie[v.i]) : fotoModello(v.n).catch(function () { return null; }); }));
      }).then(function (foto) {
        ctx.fillStyle = '#FBF6EA'; ctx.fillRect(0, 0, 1080, 1350);
        ctx.strokeStyle = '#C99A3E'; ctx.lineWidth = 3; ctx.strokeRect(28, 28, 1024, 1294); ctx.lineWidth = 1; ctx.strokeRect(40, 40, 1000, 1270);
        ctx.textAlign = 'center'; ctx.fillStyle = '#173F2E'; ctx.font = '700 54px ' + SERIF; ctx.fillText(st.tit || 'I miei rosari', 540, 125);
        croce(ctx, 540, 172, 34, '#C99A3E');
        var cols = 2, w = 450, h = 300, gx = 60, x0 = (1080 - (cols * w + gx)) / 2, y0 = 215, gy = 34;
        voci.slice(0, 6).forEach(function (v, k) {
          var x = x0 + (k % 2) * (w + gx), y = y0 + Math.floor(k / 2) * (h + gy);
          ctx.fillStyle = '#FFFFFF'; arrot(ctx, x, y, w, h, 20); ctx.fill(); ctx.strokeStyle = '#E2D6B8'; ctx.lineWidth = 2; ctx.stroke();
          if (foto[k]) copri(ctx, foto[k], x + 10, y + 10, w - 20, 200, 14);
          ctx.fillStyle = '#173F2E'; ctx.font = '700 27px ' + SANS; ctx.textAlign = 'left';
          var nm = v.nome; while (ctx.measureText(nm).width > w - 150 && nm.length > 3) nm = nm.slice(0, -2) + '…';
          ctx.fillText(nm, x + 18, y + 258);
          if (v.prezzo) {
            var pt = String(v.prezzo).replace(/\s*€?\s*$/, '') + ' €'; ctx.font = '800 26px ' + SANS; var pw = ctx.measureText(pt).width + 30;
            ctx.fillStyle = '#C99A3E'; arrot(ctx, x + w - pw - 14, y + 228, pw, 44, 22); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.fillText(pt, x + w - pw / 2 - 14, y + 259);
          }
        });
        ctx.fillStyle = '#4E6B47'; arrot(ctx, 60, 1218, 960, 78, 39); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.font = '700 30px ' + SANS; ctx.fillText(st.contatto || '', 540, 1267);
      });
    }
    function presto() { clearTimeout(timer); timer = setTimeout(disegna, 250); }
    return { html: html, init: function () {
      var box = $('bonus-corpo');
      box.addEventListener('input', function (e) { if (e.target.closest('#c6-tit, #c6-cont, .c6-n, .c6-p')) presto(); });
      box.addEventListener('change', function (e) {
        if (e.target.matches('.c6-m')) presto();
        if (e.target.matches('.c6-f')) {
          var f = e.target.files && e.target.files[0], i = +e.target.getAttribute('data-i'); if (!f) return;
          var u = URL.createObjectURL(f); carica(u).then(function (im) { fotoMie[i] = im; toast('Foto aggiunta.'); presto(); }, function () { toast('Non riesco ad aprire questa foto.'); });
        }
      });
      $('c6-giu').onclick = function () { disegna().then(function () { scarica($('c6-cv').toDataURL('image/jpeg', 0.92), 'catalogo-rosari.jpg'); }); };
      $('c6-cond').onclick = function () {
        disegna().then(function () {
          $('c6-cv').toBlob(function (b) {
            var file = new File([b], 'catalogo-rosari.jpg', { type: 'image/jpeg' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: st.tit }).catch(function () {});
            else { scarica(URL.createObjectURL(b), 'catalogo-rosari.jpg'); toast('Immagine scaricata: inviala da WhatsApp.'); }
          }, 'image/jpeg', 0.92);
        });
      };
      disegna();
    } };
  }

  /* ═══ 7. Piano di 7 giorni ═══ */
  function b7() {
    var G = [
      ['Presentati', 'Una foto delle tue mani mentre monti un rosario (il viso non serve). Racconta perché hai iniziato.', 'Ciao! Sono [il tuo nome] e faccio rosari a mano, grano dopo grano. 📿 Ho iniziato per [il tuo motivo] e adesso voglio condividerli con voi. Seguimi per vedere i nuovi modelli!'],
      ['Il primo rosario', 'La foto più bella di un rosario finito, su lino o legno chiaro, con la luce della finestra (bonus 10).', 'Il primo rosario della collezione: [Nome del modello]. 📿 Fatto a mano, pronto da regalare. Ti piace questo colore?'],
      ['Dietro le quinte', 'Un video di 10–15 secondi delle mani che infilano i grani o chiudono la decina.', 'Così nasce un rosario: un grano alla volta. 🙏 Quanto tempo pensi che ci voglia? Te lo dico nei commenti!'],
      ['Il significato', 'Un post su un colore e su cosa trasmette (bonus 5), con il rosario di quel colore.', 'Lo sapevi che [colore] significa [significato]? Per questo l’ho scelto per questo rosario. 📿'],
      ['Per chi è', 'Un’idea regalo per la prossima data del calendario (bonus 3): Prima Comunione, Festa della Mamma, Natale…', 'Cerchi un regalo per [occasione]? Un rosario fatto a mano resta per sempre. 💛 Scrivimi e lo preparo nei colori che vuoi.'],
      ['Il catalogo', 'Pubblica il catalogo (bonus 6) negli stati di WhatsApp e nelle storie di Instagram.', 'Ecco tutti i miei rosari, con i prezzi! 📿 Scrivimi in privato per ordinare il tuo.'],
      ['L’invito', 'Chiedi di prenotare con una data (es. per la Prima Comunione) e rispondi a tutti i messaggi in giornata.', 'Ultimi giorni per prenotare i rosari per [occasione]! 🌸 Ne preparo solo [numero]: scrivimi entro [data].']
    ];
    var fatti = leggi('7giorni', []);
    function barra() { var n = fatti.length; return '<div class="b-prog"><div class="mini-prog"><i style="width:' + Math.round(100 * n / 7) + '%"></i></div><span>' + n + ' di 7 giorni completati</span></div>'; }
    return { html: '<div id="c7-barra">' + barra() + '</div>' + G.map(function (g, i) {
      var on = fatti.indexOf(i) >= 0;
      return '<section class="bloco b-sez b-giorno7' + (on ? ' fatto' : '') + '"><label class="b-spunta"><input type="checkbox" class="c7" data-i="' + i + '"' + (on ? ' checked' : '') + '><span>Giorno ' + (i + 1) + ' · <b>' + esc(g[0]) + '</b></span></label><p>' + esc(g[1]) + '</p>' + msg('Testo da pubblicare', g[2]) + '</section>';
    }).join(''), init: function () {
      $('bonus-corpo').addEventListener('change', function (e) {
        if (!e.target.matches('.c7')) return;
        var i = +e.target.getAttribute('data-i'); fatti = fatti.filter(function (x) { return x !== i; }); if (e.target.checked) fatti.push(i);
        salva('7giorni', fatti); e.target.closest('.b-giorno7').classList.toggle('fatto', e.target.checked); $('c7-barra').innerHTML = barra();
        if (fatti.length === 7) toast('Complimenti! Hai completato i 7 giorni. 🎉');
      });
    } };
  }

  /* ═══ 8. Confezioni, kit ed etichette ═══ */
  var PREGHIERE = {
    'Ave Maria': 'Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell’ora della nostra morte. Amen.',
    'Padre Nostro': 'Padre nostro, che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà, come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come anche noi li rimettiamo ai nostri debitori, e non abbandonarci alla tentazione, ma liberaci dal male. Amen.',
    'Gloria al Padre': 'Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, e ora e sempre, nei secoli dei secoli. Amen.',
    'Angelo di Dio': 'Angelo di Dio, che sei il mio custode, illumina, custodisci, reggi e governa me, che ti fui affidato dalla pietà celeste. Amen.'
  };
  function b8() {
    var st = leggi('etichette', { r1: 'Fatto a mano', r2: 'con amore', r3: PERFIL && PERFIL.nome ? 'di ' + PERFIL.nome : '', pr: 'Ave Maria', ded: 'Ricordo della Prima Comunione' });
    var idee = [];
    M().forEach(function (m) { m.note.forEach(function (x) { if (/confezion|consegna|astuccio|biglietto|cartellino|sacchett|scatol/i.test(x[0] + ' ' + x[1]) && idee.length < 10 && !idee.some(function (y) { return y[1] === x[1]; })) idee.push([m.n, x[1]]); }); });
    var html = sez('Idee per le confezioni', '<img class="b-img" src="/assets/bonus/confezioni.webp" alt="Quattro idee di confezione regalo per rosari" loading="lazy" onerror="this.parentNode.removeChild(this)">' +
        '<div class="b-lista">' + idee.map(function (x) { return '<div class="b-item"><span class="e">🎁</span><div><p>' + esc(x[1]) + '</p>' + mods([x[0]]) + '</div></div>'; }).join('') + '</div>', 'Le idee qui sotto vengono dalle pagine del manuale (la parte “La consegna” di ogni modello).') +
      sez('Kit regalo', '<div class="b-lista">' +
        [['👧', 'Kit Prima Comunione', 'Rosario o decina + biglietto con l’Ave Maria + sacchetto di organza bianca con il cartellino “Ricordo della Prima Comunione”.'],
         ['👶', 'Kit Battesimo', 'Bomboniera-decina + biglietto con l’Angelo di Dio + sacchetto di organza e cartellino con il nome del bambino e la data.'],
         ['💍', 'Kit Sposi e testimoni', 'Il rosario della sposa in scatola regalo e un rosario uguale per i testimoni: vedi il modello 84.'],
         ['🎄', 'Kit Natale', 'Rosario in scatolina kraft + biglietto con il Padre Nostro + rametto di fiori secchi.']].map(function (k) { return '<div class="b-item"><span class="e">' + k[0] + '</span><div><b>' + esc(k[1]) + '</b><p>' + esc(k[2]) + '</p></div></div>'; }).join('') + '</div>') +
      sez('Etichette pronte da stampare', '<img class="b-img" src="/assets/bonus/etichette.webp" alt="Foglio A4 con 12 etichette regalo" loading="lazy" onerror="this.parentNode.removeChild(this)">' +
        '<div class="b-azioni"><a class="btn" href="/assets/bonus/etichette.jpg" download="etichette-rosari.jpg">' + ico('baixar') + 'Scarica</a><button class="btn claro" type="button" id="c8-st0">' + ico('pdf') + 'Stampa</button></div>', 'Foglio A4: stampa al 100% su cartoncino, ritaglia e fai un forellino.') +
      sez('Le tue etichette (modificabili)', '<div class="b-griglia"><label class="b-campo">Riga 1<input id="c8-r1" maxlength="22" value="' + esc(st.r1) + '"></label><label class="b-campo">Riga 2<input id="c8-r2" maxlength="26" value="' + esc(st.r2) + '"></label><label class="b-campo">Riga 3 (piccola)<input id="c8-r3" maxlength="30" value="' + esc(st.r3) + '" placeholder="es. il nome del tuo laboratorio"></label></div>' +
        '<div class="b-anteprima a4"><canvas id="c8-cv" width="1240" height="1754"></canvas></div>' +
        '<div class="b-azioni"><button class="btn" type="button" id="c8-giu">' + ico('baixar') + 'Scarica</button><button class="btn claro" type="button" id="c8-st">' + ico('pdf') + 'Stampa</button></div>', '12 etichette uguali su un foglio A4, con il tuo testo.') +
      sez('Biglietti con la preghiera', '<div class="b-griglia"><label class="b-campo">Preghiera<select class="sel" id="c8-pr">' + Object.keys(PREGHIERE).map(function (k) { return '<option' + (k === st.pr ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label>' +
        '<label class="b-campo">Dedica (facoltativa)<input id="c8-ded" maxlength="60" value="' + esc(st.ded) + '" placeholder="es. Ricordo del Battesimo di Sofia · 12 maggio"></label></div>' +
        '<div class="b-anteprima a4"><canvas id="c8-cv2" width="1240" height="1754"></canvas></div>' +
        '<div class="b-azioni"><button class="btn" type="button" id="c8-giu2">' + ico('baixar') + 'Scarica</button><button class="btn claro" type="button" id="c8-st2">' + ico('pdf') + 'Stampa</button></div>', '4 biglietti uguali su un foglio A4: da piegare o ritagliare e mettere nella confezione.');
    function etichette() {
      st.r1 = $('c8-r1').value; st.r2 = $('c8-r2').value; st.r3 = $('c8-r3').value; salva('etichette', st);
      var ctx = $('c8-cv').getContext('2d');
      return font().then(function () {
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1240, 1754);
        var w = 360, h = 390, gx = 30, gy = 32, x0 = (1240 - 3 * w - 2 * gx) / 2, y0 = (1754 - 4 * h - 3 * gy) / 2;
        for (var k = 0; k < 12; k++) {
          var x = x0 + (k % 3) * (w + gx), y = y0 + Math.floor(k / 3) * (h + gy), cx = x + w / 2;
          ctx.setLineDash([8, 8]); ctx.strokeStyle = '#B9B9B9'; ctx.lineWidth = 1.5; ctx.strokeRect(x - 8, y - 8, w + 16, h + 16); ctx.setLineDash([]);
          ctx.fillStyle = '#FBF6EA'; arrot(ctx, x, y, w, h, 26); ctx.fill(); ctx.strokeStyle = '#C99A3E'; ctx.lineWidth = 3; ctx.stroke();
          arrot(ctx, x + 12, y + 12, w - 24, h - 24, 18); ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, y + 42, 11, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = '#C99A3E'; ctx.lineWidth = 2; ctx.stroke();
          croce(ctx, cx, y + 110, 46, '#C99A3E');
          ctx.textAlign = 'center'; ctx.fillStyle = '#173F2E'; ctx.font = '700 40px ' + SERIF; ctx.fillText(st.r1, cx, y + 205);
          ctx.font = 'italic 400 32px ' + SERIF; ctx.fillStyle = '#8C6A2E'; ctx.fillText(st.r2, cx, y + 252);
          ctx.font = '600 22px ' + SANS; ctx.fillStyle = '#4E6B47'; ctx.fillText(st.r3, cx, y + 330);
        }
      });
    }
    function biglietti() {
      st.pr = $('c8-pr').value; st.ded = $('c8-ded').value; salva('etichette', st);
      var ctx = $('c8-cv2').getContext('2d');
      return font().then(function () {
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1240, 1754);
        var w = 560, h = 800, x0 = 40, y0 = 51;
        ctx.setLineDash([8, 8]); ctx.strokeStyle = '#B9B9B9'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(620, 20); ctx.lineTo(620, 1734); ctx.moveTo(20, 877); ctx.lineTo(1220, 877); ctx.stroke(); ctx.setLineDash([]);
        for (var k = 0; k < 4; k++) {
          var x = x0 + (k % 2) * 600, y = y0 + Math.floor(k / 2) * 852, cx = x + w / 2;
          ctx.fillStyle = '#FBF6EA'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#C99A3E'; ctx.lineWidth = 3; ctx.strokeRect(x + 16, y + 16, w - 32, h - 32); ctx.lineWidth = 1; ctx.strokeRect(x + 28, y + 28, w - 56, h - 56);
          croce(ctx, cx, y + 110, 60, '#C99A3E');
          ctx.textAlign = 'center'; ctx.fillStyle = '#173F2E'; ctx.font = '700 46px ' + SERIF; ctx.fillText(st.pr, cx, y + 210);
          ctx.fillStyle = '#C99A3E'; ctx.fillRect(cx - 50, y + 236, 100, 2);
          ctx.fillStyle = '#2B3A30'; ctx.font = '400 27px ' + SANS;
          var lungo = PREGHIERE[st.pr].length > 300;
          ctx.font = (lungo ? '400 25px ' : '400 29px ') + SANS;
          testoA(ctx, PREGHIERE[st.pr], cx, y + 300, w - 110, lungo ? 38 : 44);
          if (st.ded) { ctx.font = 'italic 400 26px ' + SERIF; ctx.fillStyle = '#8C6A2E'; testoA(ctx, st.ded, cx, y + h - 95, w - 110, 34); }
        }
      });
    }
    return { html: html, init: function () {
      var box = $('bonus-corpo'), t1 = null, t2 = null;
      box.addEventListener('input', function (e) { if (/^c8-r[123]$/.test(e.target.id)) { clearTimeout(t1); t1 = setTimeout(etichette, 200); } if (e.target.id === 'c8-ded') { clearTimeout(t2); t2 = setTimeout(biglietti, 200); } });
      $('c8-pr').onchange = biglietti;
      $('c8-st0').onclick = function () { stampa('/assets/bonus/etichette.jpg', 'Etichette'); };
      $('c8-giu').onclick = function () { etichette().then(function () { scarica($('c8-cv').toDataURL('image/jpeg', 0.93), 'le-mie-etichette.jpg'); }); };
      $('c8-st').onclick = function () { etichette().then(function () { stampa($('c8-cv').toDataURL('image/jpeg', 0.93), 'Etichette'); }); };
      $('c8-giu2').onclick = function () { biglietti().then(function () { scarica($('c8-cv2').toDataURL('image/jpeg', 0.93), 'biglietti-preghiera.jpg'); }); };
      $('c8-st2').onclick = function () { biglietti().then(function () { stampa($('c8-cv2').toDataURL('image/jpeg', 0.93), 'Biglietti'); }); };
      etichette(); biglietti();
    } };
  }

  /* ═══ 11. Dove trovare i materiali (era o bônus 9 por algumas horas em 01/11; virou o 11 quando as videoaulas chegaram) ═══
     A lista sai das 100 fichas (bonus-dati.js): cada material cai num grupo pelo nome e conta quantos modelos usam. */
  var GRUPPI = [
    ['Crocifissi e croci', /^(Crocifisso|Croce)/],
    ['Crociere e medaglie', /^(Crociera|Medaglia|Medaglietta|Sacra|Sacro)/],
    ['Filo', /^(Nylon|Acciaio 0|Cavetto|Elastico|Cordoncino|Cuoio|Filo|Paracord|Seta|Sisal|Catena)/],
    ['Schiaccini', /schiaccini/i],
    ['Distanziatori', /^Distanziatori/],
    ['Attrezzi', /^(Pinza|Pinzetta|Tronchesino|Forbic|Ago|Accendino|Vassoio|Ciotoline|Nastro di carta|Panno)/],
    ['Colla', /^Colla/],
    ['Ganci, anellini e chiusure', /^(Gancio|Moschettone|Anellin|Portachiavi|Portaprofumo|Piastrina|Infinito)/],
    ['Lettere e targhette', /^(Lettere|Targhetta)/],
    ['Confezione', /^(Scatolina|Sacchetto|Astuccio|Nastro di raso|Biglietto|Cartoncino)/]
  ];
  function gruppoDi(nome) {
    for (var i = 0; i < GRUPPI.length; i++) if (GRUPPI[i][1].test(nome)) return GRUPPI[i][0];
    return /\d+(,\d+)?\s*mm$|^(Grano|Perla|Grani)/.test(nome) ? 'Grani' : 'Altro';
  }
  function contaMateriali() {
    var g = {};
    M().forEach(function (m) {
      var visti = {};
      m.mats.forEach(function (x) {
        var nome = x[0], gr = gruppoDi(nome);
        g[gr] = g[gr] || { modelli: {}, voci: {} };
        g[gr].modelli[m.n] = 1;
        if (!visti[nome]) { visti[nome] = 1; g[gr].voci[nome] = (g[gr].voci[nome] || 0) + 1; }
        if (gr === 'Filo' && /schiaccini/i.test(nome)) { g.Schiaccini = g.Schiaccini || { modelli: {}, voci: {} }; g.Schiaccini.modelli[m.n] = 1; }
      });
    });
    return g;
  }
  function quanti(re) { return M().filter(function (m) { return m.mats.some(function (x) { return re.test(x[0]); }); }).length; }
  function b11() {
    var g = contaMateriali(), ordine = ['Crocifissi e croci', 'Crociere e medaglie', 'Attrezzi', 'Filo', 'Schiaccini', 'Grani', 'Colla', 'Distanziatori', 'Ganci, anellini e chiusure', 'Lettere e targhette', 'Confezione'];
    // misure dei grani: quante volte compare ogni misura nelle schede
    var misure = {};
    M().forEach(function (m) { m.mats.forEach(function (x) { if (gruppoDi(x[0]) !== 'Grani') return; var r = /(\d+)\s*mm$/.exec(x[0]); if (r) misure[r[1]] = (misure[r[1]] || 0) + 1; }); });
    var mis = Object.keys(misure).sort(function (a, b) { return misure[b] - misure[a]; }).slice(0, 5);
    var KIT = [
      ['Filo di nylon 0,50 mm', 'un rocchetto: 60 cm per il giro e 30 cm per il pendente', quanti(/^Nylon 0,5/)],
      ['Schiaccini da 2 mm', 'dorati e argentati: 4 per rosario, 2 per decina', quanti(/schiaccini/i)],
      ['Pinza a becchi piatti', 'per stringere gli schiaccini e chiudere gli anellini', quanti(/^Pinza/)],
      ['Forbicina', 'per tagliare il filo a filo del grano', quanti(/^Forbic/)],
      ['Grani da 6 e 8 mm', 'perle, cristallo, legno: 53 + 6 per un rosario, 10 + 1 per decina e bracciale', quanti(/(6|8) mm$/)],
      ['Crociere', 'medaglie con 3 anellini (rosario) o 2 anellini (bracciale)', quanti(/^Crociera/)],
      ['Crocifissi', 'da 2,5 a 5 cm, con l’anellino in alto', quanti(/^Crocifisso/)],
      ['Elastico di silicone 0,7 mm', 'per i bracciali-rosario', quanti(/^Elastico/)],
      ['Colla per bigiotteria', 'a punta sottile, una goccia sui nodi', quanti(/^Colla/)]
    ];
    var fatti = leggi('kit', []);
    var html =
      sez('La lista della spesa del manuale', '<div class="b-lista">' + ordine.filter(function (k) { return g[k]; }).map(function (k) {
        var v = g[k], nm = Object.keys(v.modelli).length;
        var voci = Object.keys(v.voci).sort(function (a, b) { return v.voci[b] - v.voci[a]; }).slice(0, 6);
        return '<div class="b-item"><span class="e">' + nm + '</span><div><b>' + esc(k) + '</b><p>' + (nm === 100 ? 'in tutti i modelli' : 'in ' + nm + ' modelli su 100') + '</p>' +
          '<div class="b-mods">' + voci.map(function (x) { return '<span class="b-mod"><span>' + v.voci[x] + '</span>' + esc(x) + '</span>'; }).join('') + '</div></div></div>';
      }).join('') + '</div>' +
      '<p class="b-nota">Misure dei grani più usate: ' + mis.map(function (x) { return '<b>' + x + ' mm</b> (' + misure[x] + ')'; }).join(' · ') + '. Il numero accanto a ogni materiale è quante schede lo usano.</p>',
      'Abbiamo contato i materiali delle 100 schede del manuale: ecco cosa serve davvero e quanto spesso.') +
      sez('Il kit base per iniziare', '<div id="c9-prog"></div><div class="b-check">' + KIT.map(function (k, i) {
        return '<label class="b-spunta b-kit"><input type="checkbox" class="c9" data-i="' + i + '"' + (fatti.indexOf(i) >= 0 ? ' checked' : '') + '><span><b>' + esc(k[0]) + '</b><small>' + esc(k[1]) + ' · in ' + k[2] + ' modelli</small></span></label>';
      }).join('') + '</div><div class="b-azioni">' + copia('Lista della spesa · L’Atelier del Rosario\n' + KIT.map(function (k) { return '- ' + k[0] + ' (' + k[1] + ')'; }).join('\n')).replace('>Copia<', '>Copia la lista<') + '</div>',
        'Con questo fai la maggior parte dei modelli. Spunta quello che hai già: la lista resta salvata.') +
      sez('Quanti grani comprare', '<label class="b-campo">Quanti rosari vuoi fare<input id="c9-n" inputmode="numeric" value="' + esc(leggi('kitN', '5')) + '"></label><div id="c9-ris"></div>',
        'Un rosario completo ha 53 Ave Maria e 6 Padre Nostro; una decina o un bracciale 10 + 1.') +
      sez('Dove comprare in Italia', '<div class="b-lista">' + [
        ['🧵', 'Merceria e negozio di perline o bigiotteria', 'Grani, filo di nylon, schiaccini, elastico e colla. Puoi vedere i colori e provare i fori sul filo. Chiedi se fanno un prezzo a chi compra in quantità.'],
        ['⛪', 'Negozio di articoli religiosi', 'Crociere, crocifissi e medaglie dei santi. Chiedi se vendono i componenti sfusi, non solo i rosari finiti.'],
        ['🔧', 'Ferramenta o negozio di bricolage', 'Pinza a becchi piatti e tronchesino. Meglio la pinza piccola con i becchi lisci, senza denti: non graffia il metallo.'],
        ['🛒', 'Marketplace online', 'Per le quantità e i colori che non trovi in zona. Controlla la misura in mm, il materiale e le recensioni con le foto; prima della scorta ordina poco, per prova.'],
        ['📦', 'Ingrosso di bigiotteria', 'Per le bomboniere e per produrre tanti pezzi. Molti grossisti chiedono un ordine minimo e alcuni vendono solo a chi ha la partita IVA: chiedi prima.']
      ].map(function (s) { return '<div class="b-item"><span class="e">' + s[0] + '</span><div><b>' + esc(s[1]) + '</b><p>' + esc(s[2]) + '</p></div></div>'; }).join('') + '</div>') +
      sez('Cosa chiedere in negozio', '<div class="b-tab b-tab2"><div class="b-tr b-th"><span>Ti serve</span><span>Chiedi così</span></div>' + [
        ['Il filo del rosario', '“filo di nylon da 0,50 mm”'],
        ['I tubetti da stringere', '“schiaccini da 2 mm” (online anche “crimp 2 mm”)'],
        ['La pinza', '“pinza a becchi piatti per bigiotteria”'],
        ['La medaglia centrale', '“crociera per rosario a 3 anellini”'],
        ['La croce', '“crocifisso per rosario con anellino”, da 2,5 a 5 cm'],
        ['I grani di vetro sfaccettati', '“mezzi cristalli da 6 mm”'],
        ['Le perle', '“perle di vetro cerate da 8 mm”'],
        ['L’elastico', '“filo elastico di silicone trasparente 0,7 mm”'],
        ['La colla', '“colla per bigiotteria a punta sottile”'],
        ['Gli anellini', '“anellini apribili da 5 mm”'],
        ['I separatori', '“distanziatori in metallo da 4 mm”']
      ].map(function (r) { return '<div class="b-tr"><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>') +
      sez('Risparmiare e controllare la qualità', '<div class="b-lista">' + [
        ['✨', 'Il metallo che non annerisce', 'Per crociere, crocifissi e schiaccini chiedi finiture che non si scuriscono, come l’acciaio inox o le placcature di qualità, e anallergiche (senza nichel) per i bracciali.'],
        ['🕳️', 'Il foro dei grani', 'Nei rosari il nylon torna indietro dentro gli ultimi grani: il foro deve far passare il filo due volte. Porta un pezzo di nylon in negozio e prova.'],
        ['🔍', 'Grani tutti uguali', 'Stessa misura e stesso colore, senza bolle né scheggiature. Un cristallo con lo spigolo tagliente può rovinare il filo.'],
        ['📏', 'La misura giusta degli schiaccini', 'Per il nylon 0,50 usa schiaccini da 2 mm, come nelle schede: con uno più grande il filo scivola.'],
        ['💶', 'Il prezzo per pezzo', 'Dividi il prezzo della bustina per il numero di grani e confronta così, non il prezzo della bustina.'],
        ['🧪', 'Prima la prova, poi la scorta', 'Compra poco, fai un rosario completo e solo dopo compra in quantità.']
      ].map(function (s) { return '<div class="b-item"><span class="e">' + s[0] + '</span><div><b>' + esc(s[1]) + '</b><p>' + esc(s[2]) + '</p></div></div>'; }).join('') + '</div>');
    function prog() { var n = fatti.length; $('c9-prog').innerHTML = '<div class="b-prog"><div class="mini-prog"><i style="width:' + Math.round(100 * n / KIT.length) + '%"></i></div><span>' + n + ' di ' + KIT.length + ' già pronti</span></div>'; }
    function grani() {
      var N = Math.max(1, Math.round(num($('c9-n').value)) || 1); salva('kitN', String(N));
      $('c9-ris').innerHTML = '<div class="b-righe"><span>Ave Maria (53 × ' + N + ')</span><b>' + 53 * N + '</b><span>Padre Nostro (6 × ' + N + ')</span><b>' + 6 * N + '</b><span>Con il 10% di scorta</span><b>' + Math.ceil(53 * N * 1.1) + ' + ' + Math.ceil(6 * N * 1.1) + '</b>' +
        '<span>Schiaccini da 2 mm (4 a rosario)</span><b>' + 4 * N + '</b><span>Nylon 0,50 (90 cm a rosario)</span><b>' + (Math.round(0.9 * N * 10) / 10).toLocaleString('it-IT') + ' m</b><span>Crociere e crocifissi</span><b>' + N + ' + ' + N + '</b></div>' +
        '<p class="b-nota">Misure della maggior parte dei rosari del manuale (60 + 30 cm di nylon). Per il modello preciso usa la lista del bonus 4.</p>';
    }
    return { html: html, init: function () {
      prog(); grani();
      $('bonus-corpo').addEventListener('change', function (e) {
        if (!e.target.matches('.c9')) return;
        var i = +e.target.getAttribute('data-i'); fatti = fatti.filter(function (x) { return x !== i; }); if (e.target.checked) fatti.push(i);
        salva('kit', fatti); prog();
      });
      $('bonus-corpo').addEventListener('input', function (e) { if (e.target.id === 'c9-n') grani(); });
    } };
  }

  /* ═══ 9. Le videolezioni (as 4 aulas do Heitor, 01/11/2026) ═══
     HLS em /video/lezione-N/index.m3u8 (H.264 720p, sem áudio: os originais são mudos). Toca com HLS nativo
     (Safari/iPhone) ou com hls.js (cdnjs, versão fixa), carregado só quando o bônus abre.
     A posição de cada aula fica salva por e-mail ("continua da dove eri rimasta"). */
  var LEZIONI = [
    { n: 1, tit: 'Il rosario di perle verdi', dur: '10:51', txt: 'Perle verdi e grani bianchi infilati sul filo, con la chiusura a nodo e le punte sigillate con l’accendino. Bastano forbici e accendino.', m: [12, 20] },
    { n: 2, tit: 'Il rosario a catenella', dur: '15:15', txt: 'Perle bianche con le coppette dorate, montate su perni: ogni grano si chiude ad anello con le pinze e si aggancia al successivo.', m: [90, 85], nota: 'È una tecnica diversa da quella del manuale (nylon e schiaccini): il risultato assomiglia a questi modelli.' },
    { n: 3, tit: 'Il rosario di perle bianche', dur: '14:46', txt: 'Perle bianche con i Padre Nostro rosa e azzurri, crociera e crocifisso dorati, tutto su filo.', m: [20, 85, 12] },
    { n: 4, tit: 'Il rosario con i nodi', dur: '14:47', txt: 'Perle fucsia su cordoncino nero, con un nodo tra un grano e l’altro.', m: [57, 14] }
  ];
  var HLS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.20/hls.min.js';
  function mmss(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  var VIDEO = (function () {
    var hls = null, el = null, n = 0, ult = 0;
    function stato(i) { return leggi('video:' + i, { t: 0, dur: 0, fatto: false }); }
    function salvaPos() {
      if (!el || !n || !isFinite(el.duration) || !el.duration) return;
      var st = stato(n); st.t = el.currentTime; st.dur = el.duration; if (el.currentTime > el.duration * 0.95) st.fatto = true; salva('video:' + n, st);
    }
    function ferma() { if (el) { salvaPos(); try { el.pause(); } catch (e) {} } if (hls) { hls.destroy(); hls = null; } el = null; n = 0; }
    function caricaHls() {
      if (window.Hls) return Promise.resolve(window.Hls);
      return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = HLS_URL; s.crossOrigin = 'anonymous'; s.onload = function () { ok(window.Hls); }; s.onerror = ko; document.head.appendChild(s); });
    }
    function apri(video, i, play) {
      ferma(); el = video; n = i;
      var src = '/video/lezione-' + i + '/index.m3u8', st = stato(i);
      video.poster = '/assets/video/poster-' + i + '.webp';
      video.addEventListener('loadedmetadata', function () {
        if (n !== i || el !== video) return;   // sobra de uma aula anterior que não chegou a carregar
        if (st.t > 5 && !(st.dur && st.t > st.dur - 10)) { video.currentTime = st.t; toast('Continua da dove eri rimasta: ' + mmss(st.t)); }
      }, { once: true });
      video.ontimeupdate = function () { var a = Date.now(); if (a - ult > 4000) { ult = a; salvaPos(); } };
      video.onpause = salvaPos;
      video.onended = function () { salvaPos(); toast('Lezione completata ✓'); disegnaLista(); };
      function vai() { if (play) { var p = video.play(); if (p && p.catch) p.catch(function () {}); } }
      if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = src; vai(); return; }
      caricaHls().then(function (Hls) {
        if (el !== video) return;
        if (!Hls.isSupported()) { video.src = src; vai(); return; }
        hls = new Hls({ maxBufferLength: 30 });
        hls.on(Hls.Events.ERROR, function (e, d) { if (d && d.fatal) toast('Il video non si carica. Controlla la connessione e riprova.'); });
        hls.loadSource(src); hls.attachMedia(video); vai();
      }, function () { toast('Il video non si carica. Controlla la connessione e riprova.'); });
    }
    window.addEventListener('hashchange', function () { if (location.hash !== '#bonus/9') ferma(); });
    window.addEventListener('pagehide', salvaPos);
    return { apri: apri, ferma: ferma, stato: stato, attuale: function () { return n; } };
  })();
  function disegnaLista() {
    var box = $('v9-lista'); if (!box) return;
    box.innerHTML = LEZIONI.map(function (l) {
      var st = VIDEO.stato(l.n), pct = st.dur ? Math.min(100, Math.round(100 * st.t / st.dur)) : 0, on = VIDEO.attuale() === l.n;
      return '<button type="button" class="v9-lez' + (on ? ' on' : '') + '" data-lez="' + l.n + '"><img src="/assets/video/poster-' + l.n + '.webp" alt="" width="320" height="180" loading="lazy">' +
        '<span class="t"><small>Lezione ' + l.n + ' · ' + l.dur + (st.fatto ? ' · vista ✓' : pct > 2 ? ' · ' + pct + '%' : '') + '</small><b>' + esc(l.tit) + '</b>' +
        '<span class="mini-prog"><i style="width:' + (st.fatto ? 100 : pct) + '%"></i></span></span></button>';
    }).join('');
  }
  function b9() {
    var ultima = +leggi('video:ultima', 1) || 1;
    function info(l) { return '<h3 id="v9-tit">' + esc(l.tit) + '</h3><p class="v9-txt">' + esc(l.txt) + '</p>' + (l.nota ? '<p class="b-nota">' + esc(l.nota) + '</p>' : '') + '<p class="b-nota">Nel manuale, con un aspetto simile:</p>' + mods(l.m); }
    var l0 = LEZIONI[ultima - 1] || LEZIONI[0];
    var html = '<section class="bloco b-sez v9">' +
      '<div class="v9-player"><video id="v9-video" controls playsinline preload="none" poster="/assets/video/poster-' + l0.n + '.webp"></video></div>' +
      '<div class="v9-vel" role="group" aria-label="Velocità"><span>Velocità</span>' + [0.5, 1, 1.5].map(function (v) { return '<button type="button" class="b-chip' + (v === 1 ? ' on' : '') + '" data-vel="' + v + '">' + String(v).replace('.', ',') + 'x</button>'; }).join('') + '</div>' +
      '<div id="v9-info">' + info(l0) + '</div></section>' +
      sez('Le 4 lezioni', '<div class="v9-lista" id="v9-lista"></div>', 'Tocca una lezione per guardarla. L’app ricorda il punto in cui eri rimasta in ognuna.') +
      '<p class="b-nota">Le videolezioni sono senza audio: guarda le mani e metti in pausa quando ti serve. Per i passaggi più veloci usa 0,5x.</p>';
    return { html: html, init: function () {
      var video = $('v9-video'), vel = 1;
      VIDEO.apri(video, l0.n, false); disegnaLista();
      $('bonus-corpo').addEventListener('click', function (e) {
        var b = e.target.closest('[data-lez]');
        if (b) {
          var l = LEZIONI[+b.getAttribute('data-lez') - 1]; salva('video:ultima', l.n);
          $('v9-info').innerHTML = info(l); VIDEO.apri(video, l.n, true); disegnaLista();
          $('v9-video').scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
        }
        var v = e.target.closest('[data-vel]');
        if (v) { vel = +v.getAttribute('data-vel'); video.defaultPlaybackRate = vel; video.playbackRate = vel; [].forEach.call(document.querySelectorAll('[data-vel]'), function (x) { x.classList.toggle('on', x === v); }); }
      });
      // a troca de aula recarrega a fonte e o navegador volta a 1x: reaplica a velocidade escolhida
      video.addEventListener('loadedmetadata', function () { video.playbackRate = vel; });
    } };
  }

  /* ═══ 10. Foto che vendono ═══ */
  function b10() {
    var S = [
      ['☀️', 'La luce', 'Fotografa di giorno, vicino a una finestra, senza sole diretto. Spegni il flash e le luci gialle della stanza.'],
      ['🧺', 'Lo sfondo', 'Lino, legno chiaro o un cartoncino bianco: sempre lo stesso, così le foto sembrano una collezione (come le pagine del manuale).'],
      ['📐', 'Le 4 foto di ogni rosario', 'Intero visto dall’alto · il dettaglio della crociera o della medaglia · il crocifisso · il rosario in mano, per far capire la misura.'],
      ['📱', 'Il telefono', 'Pulisci l’obiettivo. Tocca lo schermo sul rosario per mettere a fuoco e abbassa un po’ la luminosità se i grani bianchi “bruciano”. Non usare lo zoom: avvicinati.'],
      ['🖼️', 'Il formato', 'Verticale 4:5 per Instagram, quadrato per il catalogo (bonus 6) e per Etsy.'],
      ['🎨', 'Il ritocco', 'Solo luminosità e un filo di contrasto. I colori devono essere veri: chi compra vuole ricevere quello che ha visto.'],
      ['🌿', 'Un tocco in più', 'Un rametto di fiori secchi, una candela o un libro di preghiere accanto, mai davanti al rosario.']
    ];
    var C = ['La foto è luminosa e senza ombre forti', 'Il rosario è intero e ben steso', 'Si vedono bene la crociera e il crocifisso', 'Lo sfondo è pulito', 'I colori sono veri', 'C’è almeno una foto in mano, per la misura'];
    return { html: sez('Le regole', '<div class="b-lista">' + S.map(function (s) { return '<div class="b-item"><span class="e">' + s[0] + '</span><div><b>' + esc(s[1]) + '</b><p>' + esc(s[2]) + '</p></div></div>'; }).join('') + '</div>') +
      sez('Prima di pubblicare', '<div class="b-check">' + C.map(function (c) { return '<label class="b-spunta"><input type="checkbox"><span>' + esc(c) + '</span></label>'; }).join('') + '</div>', 'Controlla ogni foto con questa lista.') };
  }

  return { LISTA: LISTA, cards: cards, apri: apri };
})();
