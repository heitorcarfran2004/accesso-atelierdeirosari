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
- **Sem** aba Aulas, **sem** bônus, **sem** upsell e **sem** order bumps (não existem neste produto).

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

Tamanho do deploy: ~81 MB (páginas 40 MB + PDFs 40 MB + resto < 1 MB). `capturas/` (12 MB) fica fora do deploy.

## Capturas

`capturas/390-*.png` (celular) e `capturas/desktop-*.png`: login, pergunta do nome, Home, busca, índice, visor,
visor com zoom, PDF, Home com preferiti, perfil, assistência, app e notificações.
