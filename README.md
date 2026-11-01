# L'Atelier del Rosario — app de membros (ITALIANO)

Entrega do produto **L'Atelier del Rosario** (nome provisório): 100 modelos de terços artesanais, apostila de
203 páginas (capa + índice 1–2 + 100 modelos × 2), vendida na Itália. Todo o texto do app está em italiano.
Mesma interface do app das Carteiras (clubedanina.vercel.app), pela versão das Guias de Contas (apostila de
2 páginas por modelo, sem videoaulas), com a paleta das páginas: verde-sálvia #5D734F / #4E6B47, verde profundo
#173F2E nos títulos, dourado #C99A3E e creme #FBF6EA; títulos em Playfair Display.

    node servidor.cjs     # http://localhost:4261  (a 4260 está com o app Piccole Stiliste)

**Login:** QUALQUER e-mail com formato válido entra (pedido do Heitor, 01/11/2026). Não consulta o Supabase.

## Como é montado

O `index.html` **não se edita à mão**: ele é gerado.

    node scripts/ros-app-arquivos.cjs          # tudo: páginas webp, capa, fotos do login, ícones e os 2 PDFs
    node scripts/ros-app-arquivos.cjs capas    # só capa, login e ícones
    node scripts/ros-app-arquivos.cjs paginas  # só as 203 páginas webp
    node scripts/ros-app-arquivos.cjs pdf 72   # só os PDFs (72 = qualidade do JPEG)
    node scripts/ros-app-bonus.cjs             # bonus-dati.js (dados do manual) + capas e folhas dos bônus
    node scripts/ros-app-montar.cjs            # referencia/guias.html -> index.html (e confere sobras de português)

(os `scripts/` ficam no repo de trabalho "Visual St - Claude")

- `referencia/guias.html`: o `index.html` do app das Guias congelado em 01/11/2026. O montador troca bloco a bloco
  com conferência: se a referência mudar e um trecho sumir, ele para com "não achei".
- No fim, o montador lista as palavras em português que sobraram no texto visível (HTML, atributos e strings do JS).
  As únicas "sobras" esperadas são ids e rotas internas (`/api/perfil`, `m-sair`…).

## Conteúdo

| no app | origem |
|---|---|
| Páginas `assets/livros/principal/pag-001…203.webp` (1055×1491) | `Downloads/Rosarios/Entregável/Paginas-IT/`: `capa.png`, `indice-1/2.png`, `pag-001…200.png` |
| PDF `pdf/L-Atelier-del-Rosario-parte-1.pdf` (19,8 MB, 103 págs.: capa, índice e modelli 1–50) | as mesmas páginas, JPEG q72 |
| PDF `pdf/L-Atelier-del-Rosario-parte-2.pdf` (19,9 MB, 100 págs.: modelli 51–100) | idem |
| Índice "Modelli" e busca | títulos de `entregaveis/tercos-artesanais/producao/conteudo-it/NNN.json`, nas 11 categorias do índice impresso |
| Capa dos cartões `assets/capas/principal-*.webp` | `capa.png`, em pé sobre o fundo desfocado |
| Fotos do login `assets/login/r*.webp` | recorte da foto da pág. 1 dos modelos 78, 11, 93, 1, 94 e 3 |
| Ícone `assets/icon-ar-*.png`, `logo-ar-192.webp` | desenhado no script (terço em círculo, verde-sálvia e dourado) |

- Modelo N = páginas 2N+2 (scheda) e 2N+3 (montaggio) no app. A numeração mostrada (leitor, índice, busca) é a
  **impressa** nas páginas (página do app − 3); as 3 primeiras aparecem como "Copertina" e "Indice".
- O PDF inteiro (`Downloads/Rosarios/Entregável/L-Atelier-del-Rosario.pdf`, 56 MB) não vai para o app: passa dos
  50 MB que o GitHub aceita sem aviso. As 2 partes somam 40 MB.
- **Sem** aba Aulas (as 4 videoaulas ficam no bônus 9), **sem** upsell e **sem** order bumps (não existem neste produto). Os 11 bônus: seção abaixo.

## O que o app faz

- Home: continuar de onde parou, busca (nome, número, categoria, material: "perle", "auto", "Santa Rita"…), o manual,
  **preferiti** (estrela), as 11 categorias e 5 dicas "Prima di iniziare" (tiradas das próprias páginas).
- Leitor: páginas uma embaixo da outra, índice por categoria com filtro "Preferiti", estrela no modelo da página,
  **zoom** (botão "Zoom" ou toque duplo na página, centraliza no ponto tocado) e PDF em 2 partes.
- Perfil: nome, nível (Principiante / Intermedia / Esperta), foto e o progresso. Depois do 1º login o app pergunta
  o nome (uma vez por e-mail; dá pra pular).
- Sininho só com avisos locais (boas-vindas, dica dos preferiti e de instalar o app).
- Perfil, favoritos, página onde parou e sininho ficam no `localStorage`, **separados por e-mail** e por aparelho
  (outro celular começa sem favoritos; isso está dito nas FAQ).

## Os 11 bônus (01/11/2026)

Seção "I tuoi 10 bonus" na Home; cada um abre em `#bonus/N`. A lógica está em **`bonus.js` (escrito à mão,
edite direto)**; `bonus-dati.js` é gerado por `scripts/ros-app-bonus.cjs` com nome, categoria, tempo, materiais e as
notas finais ("La consegna"…) de cada modelo, lidos de `conteudo-it/NNN.json`. O que a cliente digita fica no
localStorage por e-mail (`ar:b:<email>:...`). O montador também confere o português que sobrou no `bonus.js`.

| # | bônus | o que tem |
|---|---|---|
| 1 | Guida per vendere + messaggi pronti | 7 canais na Itália (parrocchia, catechismo, negozi in conto vendita, mercatini, WhatsApp, Instagram, Etsy) + 8 mensagens com botão Copia |
| 2 | Prezzi + Calcolatrice | escolhe o modelo → materiais e tempo da scheda; ela digita os custos; €/hora, confezione e margem → preço arredondado a 0,50 € |
| 3 | Calendario religioso | 22 datas italianas com contagem e "inizia a preparare entro" (Pasqua e Pentecoste calculadas, Festa della Mamma, Pompei 8/5 e 1ª dom. de outubro, Santa Rita, Padre Pio, Ognissanti, Immacolata, Natale…) + 5 períodos; links para os modelos |
| 4 | Prima Comunione e Battesimo | bomboniere: lista de compras × N pezzi (+10% de scorta), horas totais, como fazer em série, orçamento com sconto e acconto 30% para copiar |
| 5 | Il significato dei colori | 8 cores (litúrgicas e tradição) + 8 paletas, cada uma um modelo do manual |
| 6 | Catalogo per WhatsApp | exemplo pronto (ChatGPT) + editor: 6 modelos ou fotos dela, nome, preço → JPG 1080x1350 para baixar ou compartilhar |
| 7 | Piano di 7 giorni | 7 dias com checklist salva e o texto de cada post para copiar |
| 8 | Confezioni, kit ed etichette | folha de ideias (ChatGPT) + ideias tiradas das páginas + 4 kits + folha A4 de 12 etiquetas (ChatGPT) + editor de etiquetas A4 + biglietti A4 com a oração exata (Ave Maria, Padre Nostro, Gloria, Angelo di Dio) e dedica |
| 9 | Le videolezioni | as 4 aulas do Heitor (Downloads/Aula 1–4.mp4), em HLS dentro do repo: player com pôster, velocidade 0,5x/1x/1,5x, "continua da dove eri rimasta" por aula (salvo por e-mail) e o modelo do manual com aspecto parecido |
| 10 | Foto che vendono | 7 regras + checklist antes de publicar |
| 11 | Dove trovare i materiali | lista de compras contada nas 100 fichas por grupo de material, kit base com checklist salva e botão Copia, quantos grãos para N terços, onde comprar na Itália por tipo de loja (sem marcas), como pedir cada item, economia e qualidade |

Imagens do ChatGPT (01/11, conta logada no Chrome 9222, 13 imagens em ~5 min com 3 abas): prompts e originais em
`entregaveis/tercos-artesanais/bonus/` (`prompts.cjs`, `fila.cjs`, `gpt/`): 10 capas 3:4 em italiano, `etichette`,
`confezioni` e `catalogo` (exemplo). No app: `assets/bonus/` e `assets/capas/b01…b10-480/800.webp`.

Bônus 11: a lista é calculada no próprio app (bonus.js, GRUPPI) a partir de bonus-dati.js. Capas: `gpt/capa-09.png` (videoaulas) e `gpt/capa-11.png` (materiais, selo corrigido para BONUS #11); a de "Le 4 tecniche in video" ficou em `gpt/capa-09-video-antiga.png`.

### Videoaulas (bônus 9)
- Originais: 1280x720 HEVC, ~10–15 min, filmados de cima, só mãos. **Áudio mudo** (-91 dB nas 4): sem narração e sem texto na tela, então não há legenda; o áudio foi tirado.
- Reencode: H.264 High 720p, CRF 26, preset slow, maxrate 3 Mb/s, keyframe a cada 6 s, HLS VOD com segmentos de 6 s em `video/lezione-N/index.m3u8` + `seg-NNN.ts` (todos bem abaixo de 100 MB). Comando no fim desta seção.
- Toca com HLS nativo (Safari/iPhone) ou hls.js 1.5.20 do cdnjs, carregado só ao abrir o bônus. Pôsteres em `assets/video/poster-N.webp` (gerados pelo `ros-app-bonus.cjs`, quadro 8 s antes do fim).
- `vercel.json`: `.m3u8` com Content-Type HLS e cache de 1 dia; `.ts` como video/mp2t, cache imutável. O `servidor.cjs` local também serve esses tipos.

    ffmpeg -i "Aula N.mp4" -an -c:v libx264 -preset slow -crf 26 -profile:v high -level 4.0 -pix_fmt yuv420p \n      -force_key_frames "expr:gte(t,n_forced*6)" -sc_threshold 0 -maxrate 3000k -bufsize 6000k \n      -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename "seg-%03d.ts" index.m3u8

## Suporte e push

- As Edge Functions (`membros-suporte`, `membros-push`) só aceitam e-mail com compra paga, então o app **não usa**.
  Nada foi alterado no Supabase.
- **Suporte:** cada assunto mostra a resposta rápida. O canal de contato fica em `CONTATTO` no começo do catálogo
  (bloco `/* ═══ CATÁLOGO` do `scripts/ros-app-montar.cjs`):

      var CONTATTO = { email: '', whatsapp: '' };

  Vazio (hoje) = aviso "Il contatto diretto sarà disponibile qui a breve". Com `email`, o botão abre o app de e-mail
  com a mensagem pronta; com `whatsapp` (só números, com DDI 39…), abre o WhatsApp. Troque no montador e rode de novo.
- **Push:** desligado (sem botão de notificações; o `sw.js` só deixa o app instalável).
- Garantia/reembolso: não aparece no app (o prazo da oferta italiana não está definido). Acrescentar nas FAQ quando
  a oferta tiver checkout.

## Publicar (ainda não)

Nada foi publicado: sem repositório, sem push, sem Vercel. Para subir:
1. O Heitor cria o repositório (o token do `gh` desta máquina não cria) e importa na Vercel (o MCP não cria projeto).
2. `.vercelignore` tira do ar `referencia/`, `capturas/`, `servidor.cjs` e `README.md`.
3. Antes: preencher `CONTATTO`, confirmar o nome final do produto e, se quiser login só para quem comprou,
   seguir o modelo do `apps/guias-membros` (Edge Function `membros-acesso` + webhook).

Tamanho do deploy: ~464 MB (vídeos HLS 379 MB + páginas 40 MB + PDFs 40 MB + bônus 3,5 MB + resto < 1 MB; 558 segmentos .ts de no máximo 1,3 MB). `capturas/` fica fora do deploy. Atenção à banda da Vercel: assistir às 4 aulas inteiras baixa ~380 MB.

## Capturas

`capturas/390-*.png` (celular) e `capturas/desktop-*.png`: login, pergunta do nome, Home, busca, índice, visor,
visor com zoom, PDF, Home com preferiti, perfil, assistência, app e notificações.
