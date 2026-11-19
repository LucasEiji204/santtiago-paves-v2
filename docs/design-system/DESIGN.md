# Atelier du Pavé — Design System 2.0

**Direção:** "private banking" aplicado à confeitaria. A sobriedade e a confiança das instituições
financeiras premium (títulos serifados grandes e leves, muito espaço, filetes finos, paleta contida),
com o calor de uma confeitaria (tons de cacau, creme e caramelo).

A fonte da verdade dos tokens é o bloco `@theme` em [`frontend/src/index.css`](../../frontend/src/index.css).
Este documento explica como usá-los.

---

## 1. Tipografia

| Papel | Fonte | Por quê |
|---|---|---|
| Títulos, números grandes de destaque, citações | **Newsreader** (Google Fonts, variável, com itálico) | Serifada editorial com eixo de tamanho óptico. É a alternativa gratuita mais próxima da Tiempos Headline, muito usada em bancos privados e marcas premium. |
| Texto, botões, menus, formulários, preços | **Inter** (Google Fonts, variável) | Padrão das fintechs (é a alternativa gratuita mais próxima da Söhne, usada pela Stripe). Foi desenhada para tela e tem algarismos tabulares. |

Recursos ligados no `<html>`: `cv11` (a de um andar) e `ss01` (algarismos abertos) da Inter.

### Escala

| Classe | Tamanho / altura | Peso | Uso |
|---|---|---|---|
| `text-display-xl` | 88 / 0.98 | 360 | Só o título principal da página inicial (desktop) |
| `text-display-lg` | 60 / 1.04 | 380 | Títulos de seção e de página (desktop) |
| `text-display-lg-mobile` | 40 / 1.08 | 400 | Os mesmos títulos no celular |
| `text-headline-md` | 40 / 1.1 | 400 | Títulos secundários |
| `text-headline-sm` | 24 / 1.25 | 500 | Títulos de card e de bloco |
| `text-body-lg` | 18 / 1.6 | 400 | Parágrafos de destaque |
| `text-body-md` | 16 / 1.6 | 400 | Texto corrido |
| `text-label-md` | 14 / 20 | 500 | Rótulos, botões pequenos |
| `text-label-sm` | 12 / 16 | 500 | Legendas |
| `.eyebrow` | 12 / 16, caixa alta, +0.18em | 600 | Rótulo acima de títulos |

**Regras**
- Títulos em Newsreader com peso leve (360–400) e espaçamento negativo. Peso alto em serifada fica "jornal popular", não "banco".
- Use `<em>` (itálico da Newsreader) para destacar a segunda metade de um título, geralmente na cor `cream-200` (fundo escuro) ou `caramel-deep` (fundo claro).
- **Todo preço usa a classe `.price`**: Inter com algarismos tabulares, para os valores ficarem alinhados.
- `text-wrap: balance` nos títulos e `pretty` nos parágrafos já vem aplicado globalmente.

## 2. Cores

### Neutros
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#1f1714` | Texto principal (15,8:1 sobre `paper`) |
| `ink-soft` | `#5a4b44` | Texto secundário (7,4:1) |
| `ink-muted` / `outline` | `#7a6a62` | Placeholders e legendas (4,6:1) |
| `paper` / `background` | `#f7f2ea` | Fundo das páginas |
| `surface-container-lowest` | `#ffffff` | Cards |
| `surface-container-low` | `#f2ece2` | Seções alternadas, campos |
| `line` | `#e2d8ca` | Filetes e bordas de 1px |

### Cacau (seções escuras)
`cocoa-950 #17100d` · `cocoa-900 #241915` · `cocoa-800 #2b1f1a` (botão primário) · `cocoa-700 #3d2c25`

Sobre fundo escuro, o texto é `cream-50 #faf6f0`. Para texto secundário, use `cream-50/70`.

### Acentos
| Token | Hex | Uso |
|---|---|---|
| `caramel-deep` | `#8a5a3b` | Acento sobre fundo claro: links, rótulos (5,2:1) |
| `caramel-rich` | `#c99a6e` | Acento sobre fundo escuro (7,5:1 no `cocoa-950`) |
| `gold` | `#b8956a` | Só filetes decorativos (`.rule-gold`), nunca texto |
| `cream-200` | `#e9dccb` | Itálicos de destaque sobre fundo escuro |
| `pistachio-deep` | `#5e6b47` | Confirmação ("adicionado") |
| `whatsapp` | `#1a7f4b` | Botão de enviar pedido |
| `error` | `#a33a2e` | Erros de formulário |

Os nomes antigos (`primary`, `primary-container`, `surface-*`, `on-surface-variant`…) continuam existindo,
agora apontando para a nova paleta. Em código novo, prefira os nomes da tabela acima.

## 3. Espaço, forma e profundidade

- **Grade:** largura máxima de `1240px` (`max-w-container-max`), margens de `20px` no celular e `64px` no desktop, gutter de `24px`.
- **Ritmo vertical:** seções com `py-24` no celular e `py-32` no desktop. Na dúvida, mais espaço.
- **Raios:** `sm 6` · `md 10` · `lg 12` · `xl 16` · `2xl 20` (cards) · `3xl 28` · `full` (botões e chips).
- **Sombras:** `--shadow-card` (cards em repouso) e `--shadow-raised` (hover e botões em destaque). As duas são tingidas de cacau, nunca preto puro.
- **Filetes:** bordas de 1px na cor `line` ou `cream-50/15` organizam o conteúdo, como nos sites de bancos. Prefira filetes a caixas cheias.

## 4. Componentes

### Botões (`.btn` + variante)
| Classe | Aparência | Onde |
|---|---|---|
| `btn btn-primary` | Cacau sólido, texto creme | Ação principal sobre fundo claro |
| `btn btn-light` | Creme sólido, texto tinta | Ação principal sobre fundo escuro ou vídeo |
| `btn btn-outline` | Borda na cor do texto | Ação secundária sobre fundo escuro |
| `btn btn-outline-dark` | Borda tinta, fica cheio no hover | Ação secundária sobre fundo claro |

Todos têm 48px de altura mínima (área de toque), formato de pílula e Inter 15px/500.

### Cabeçalho
- Padrão: fixo no topo, fundo `paper` translúcido com desfoque e filete inferior.
- `overlay` (só na página inicial): transparente sobre o vídeo, vidro escuro enquanto a abertura está na tela e claro depois dela (`#apos-abertura`).

### Card de produto
Fundo branco, `rounded-2xl`, borda `line`, imagem 4:3 que aproxima levemente no hover, nome em Newsreader 22px,
preço `.price` e botão "+" redondo, com filete separando o rodapé do card.

### Assinaturas visuais
- `.eyebrow` + `.rule-gold`: rótulo em caixa alta precedido de um filete dourado de 40px. Abre toda seção.
- Numeração `01 02 03` em `.price` nas etapas.

## 5. Movimento

- Curva padrão: `--ease-out-soft` (`cubic-bezier(0.22, 1, 0.36, 1)`), com durações de 0,5–0,8 s.
- Elementos entram com opacidade e um deslocamento de 24–40px, uma vez, quando aparecem na tela.
- **Abertura da página inicial (`HeroStory`):** o vídeo fica fixo enquanto 4 "camadas" de informação aparecem uma por vez com o scroll (feito à mão, personalização, como pedir, pagamento e entrega).
- **Respeite "reduzir movimento":** o app inteiro usa `MotionConfig reducedMotion="user"`. A abertura vira uma sequência estática com a imagem do pôster, sem vídeo.

## 6. Vídeo de fundo

- Arquivos: `frontend/public/media/hero.mp4` (1920×1080, 16 s em loop, cerca de 1 MB) e `hero-poster.jpg`.
- Gerado por código: [`docs/video/render.py`](../video/render.py). As camadas de creme, ganache e biscoito ondulam devagar, uma luz quente passeia e partículas de cacau sobem. Para mudar cores ou ritmo, edite as constantes do script e rode `python3 render.py video hero.mp4` (precisa de numpy, Pillow e ffmpeg).
- O vídeo é decorativo (`aria-hidden`), não tem som e pausa quando sai da tela.

## 7. Acessibilidade (obrigatório)

- Contraste mínimo de 4,5:1 para texto. As combinações acima já foram conferidas.
- Foco visível: contorno de 2px na cor `caramel-deep` em todo elemento focável.
- Ícones são decorativos (`aria-hidden`). Botões só com ícone precisam de `aria-label`.
- Área de toque mínima de 44–48px.
