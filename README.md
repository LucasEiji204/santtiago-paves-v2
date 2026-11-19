# Atelier du Pavé — Cardápio Digital

Cardápio online do **Atelier du Pavé**, confeitaria de pavês artesanais. O cliente navega pelo cardápio,
monta a sacola e finaliza o pedido pelo **WhatsApp**, onde o pagamento é combinado (Pix ou dinheiro).

O site não tem backend nem banco de dados: nenhum dado pessoal fica salvo. Detalhes em
[Privacidade](#privacidade).

## Estrutura

```
frontend/   App React + Vite + Tailwind (é o que vai para o ar)
docs/
  design-system/   Tokens e regras visuais (DESIGN.md)
  video/           Script que gera o vídeo de fundo da página inicial
  templates/       Telas originais exportadas do Stitch (referência, não usadas no build)
```

## Rodando localmente

Requer Node 22 (veja `.nvmrc`).

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Outros comandos: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run preview`.

## Configuração da loja

Telefone, taxa de entrega, endereço de retirada, cidade, e-mail e redes sociais ficam em
[`frontend/src/config.ts`](frontend/src/config.ts). Campos vazios são escondidos no site.

O número do WhatsApp também pode ser definido pela variável `VITE_WHATSAPP_NUMBER`
(veja `frontend/.env.example`).

Produtos, preços e adicionais: [`frontend/src/data/products.ts`](frontend/src/data/products.ts).

## Deploy (Vercel)

- **Root Directory:** `frontend`
- Build: `npm run build` · Output: `dist`
- O `frontend/vercel.json` redireciona todas as rotas para o `index.html`, para que links diretos
  (ex.: `/cardapio`, `/produto/pave-classico`) funcionem ao recarregar a página.

## Fluxo de trabalho

- `main` é o que está no ar; o desenvolvimento acontece em `dev` ou em branches a partir dela.
- Mudanças entram por Pull Request. O GitHub Actions roda lint e build em cada PR.
- Mensagens de commit no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
  `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`.

## Privacidade

- Nome, telefone e endereço digitados no checkout **não são enviados a nenhum servidor**: o site só monta
  a mensagem e abre o WhatsApp; o cliente decide se envia.
- A sacola (apenas produtos, sem dados pessoais) fica no `localStorage` do navegador do cliente.
- A política completa está na página `/privacidade` do site
  ([`PrivacyPage.tsx`](frontend/src/pages/PrivacyPage.tsx)). Se o site passar a guardar dados
  (cadastro, banco de dados, analytics), ela precisa ser atualizada.
