# Atelier du Pavê — Design System 2.0

**Direção:** a solidez e a clareza dos bancos digitais (títulos sans-serif firmes, muito espaço, filetes
finos, paleta contida), com o calor de uma confeitaria (tons de cacau, creme e caramelo).
**Mobile-first:** todo estilo parte do celular. Tamanhos maiores entram com `md:` (768px) e `xl:` (1280px).

A fonte da verdade dos tokens é o bloco `@theme` em [`frontend/src/index.css`](../../frontend/src/index.css).
Este documento explica como usá-los.

---

## 1. Tipografia

| Papel | Fonte | Por quê |
|---|---|---|
| Títulos e destaques (`font-display`) | **Inter Tight** (Google Fonts) | Versão compacta da Inter, feita para tamanhos grandes. Firme e moderna, no estilo das marcas de bancos digitais. |
| Texto, botões, menus, formulários, preços | **Inter** (Google Fonts, variável) | Padrão das fintechs (é a alternativa gratuita mais próxima da Söhne, usada pela Stripe). Foi desenhada para tela e tem algarismos tabulares. |

Recursos ligados no `<html>`: `cv11` (a de um andar) e `ss01` (algarismos abertos) da Inter.

### Escala (celular → desktop)

| Classe | Tamanho / altura | Peso | Uso |
|---|---|---|---|
| `text-display-lg-mobile` | 36 / 1.08 | 500 | Títulos principais no celular (base) |
| `md:text-display-lg` | 52 / 1.04 | 500 | Os mesmos títulos a partir de 768px |
| `xl:text-display-xl` | 76 / 1.0 | 500 | Só o título de abertura, a partir de 1280px |
| `text-headline-md` | 32 / 1.12 | 500 | Títulos de seção no celular |
| `text-headline-sm` | 22 / 1.3 | 600 | Títulos de card e de bloco |
| `text-body-lg` | 18 / 1.6 | 400 | Parágrafos de destaque (desktop) |
| `text-body-md` | 16 / 1.6 | 400 | Texto corrido (base no celular) |
| `text-label-md` | 14 / 20 | 500 | Rótulos, botões pequenos |
| `text-label-sm` | 12 / 16 | 500 | Legendas |
| `.eyebrow` | 12 / 16, caixa alta, +0.18em | 600 | Rótulo acima de títulos |

**Regras**
- Títulos com peso médio (500–600) e espaçamento negativo (-0.02 a -0.04em). Nada de negrito pesado nem de itálico.
- Para destacar parte de um título, use `<em>`: ele aparece só com outra cor (`cream-200` no escuro, `caramel-deep` no claro), sem itálico.
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
Fundo branco, `rounded-2xl`, borda `line`, imagem 4:3 que aproxima levemente no hover, nome em Inter Tight 20px semibold,
preço `.price` e botão "+" redondo, com filete separando o rodapé do card.

### Assinaturas visuais
- `.eyebrow` + `.rule-gold`: rótulo em caixa alta precedido de um filete dourado de 40px. Abre toda seção.
- Numeração `01 02 03` em `.price` nas etapas.

## 5. Movimento

- Curva padrão: `--ease-out-soft` (`cubic-bezier(0.22, 1, 0.36, 1)`), com durações de 0,5–0,8 s.
- Elementos entram com opacidade e um deslocamento de 24–40px, uma vez, quando aparecem na tela.
- **Abertura da página inicial (`HeroStory`):** o vídeo fica fixo e cada tela de rolagem mostra **um único texto**: primeiro a apresentação, depois 4 informações (feito à mão, personalização, como pedir, pagamento e entrega). A troca espera o texto anterior sair, então nunca há dois textos sobrepostos. No celular o texto fica na parte de baixo da tela; no desktop, à esquerda.
- **Respeite "reduzir movimento":** o app inteiro usa `MotionConfig reducedMotion="user"`. Na abertura, as camadas deixam de depender da rolagem e aparecem em sequência; o vídeo continua (é lento e suave), com o botão de pausar.

## 6. Vídeo de fundo

- Arquivos: `frontend/public/media/hero.mp4` (1920×1080, 16 s em loop, cerca de 1 MB) e `hero-poster.jpg`.
- Gerado por código: [`docs/video/render.py`](../video/render.py). As camadas de creme, ganache e biscoito ondulam devagar, uma luz quente passeia e partículas de cacau sobem. Para mudar cores ou ritmo, edite as constantes do script e rode `python3 render.py video hero.mp4` (precisa de numpy, Pillow e ffmpeg).
- O vídeo é decorativo (`aria-hidden`), não tem som e pausa quando sai da tela.
- Sempre há um botão de pausar/reproduzir no canto inferior direito (WCAG 2.2.2). A escolha fica salva no navegador da pessoa.

## 7. Acessibilidade (obrigatório)

- Contraste mínimo de 4,5:1 para texto. As combinações acima já foram conferidas.
- Foco visível: contorno de 2px na cor `caramel-deep` em todo elemento focável.
- Ícones são decorativos (`aria-hidden`). Botões só com ícone precisam de `aria-label`.
- Área de toque mínima de 44–48px.
