# Atelier du Pavé — Frontend

React 19 + Vite + Tailwind CSS 4 + Framer Motion. Veja o [README principal](../README.md) para
instruções de instalação, configuração e deploy.

## Rotas

| Rota | Tela |
|------|------|
| `/` | Página inicial |
| `/cardapio` | Cardápio com abas de categoria e busca |
| `/produto/:id` | Detalhe do produto (adicionais e observações) |
| `/carrinho` | Sacola |
| `/finalizar` | Dados do pedido e envio pelo WhatsApp |
| `/pedido-enviado` | Confirmação e próximos passos (Pix) |
| `/privacidade` | Política de Privacidade |
| `*` | Página não encontrada |

## Organização

```
src/
  config.ts          Dados da loja (WhatsApp, taxa, endereço, contatos)
  data/products.ts   Produtos, categorias e adicionais
  context/           Sacola (CartContext, salva no localStorage)
  components/        Header, Footer, BottomNav, ProductCard, TextField...
  pages/             Uma página por rota
  utils/             Formatação (moeda, máscaras) e mensagem do WhatsApp
  hooks/             Hooks reutilizáveis
```

## Fluxo do pedido

1. O cliente adiciona produtos à sacola (com adicionais e observações, se quiser).
2. Em `/finalizar`, informa nome, telefone, entrega/retirada e forma de pagamento.
3. Ao finalizar, o WhatsApp abre com o pedido já escrito (`utils/whatsapp.ts`) e o site mostra a tela
   `/pedido-enviado`. A sacola é esvaziada.
4. A loja envia a chave Pix pela conversa e confirma o pedido.

## Ícones

Os ícones são do Material Symbols e o `index.html` carrega **só os usados**. Ao usar um ícone novo em
`<Icon name="..." />`, acrescente o nome ao parâmetro `icon_names` do link no `index.html`
(em ordem alfabética).

## Imagens

As fotos ainda são carregadas de `lh3.googleusercontent.com` (geradas pelo Stitch). Esses links podem
expirar: o ideal é salvar as fotos reais em `public/images/` (de preferência em `.webp`) e trocar os
endereços em `data/products.ts` e nas páginas.
