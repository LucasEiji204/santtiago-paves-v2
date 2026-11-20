# Atelier du Pavê — Cardápio Digital

Cardápio online do **Atelier du Pavê**, confeitaria de pavês artesanais. O cliente navega pelo cardápio,
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

Taxa de entrega, endereço de retirada, cidade, e-mail e redes sociais ficam em
[`frontend/src/config.ts`](frontend/src/config.ts). Campos vazios são escondidos no site.

Produtos, preços e adicionais: [`frontend/src/data/products.ts`](frontend/src/data/products.ts).

## Variáveis de ambiente (.env)

Dados que não devem ficar escritos no código (hoje, o número do WhatsApp) vêm de **variáveis de ambiente**.
A lista completa, com explicações, está em [`frontend/.env.example`](frontend/.env.example).

| Onde | Como configurar |
|---|---|
| **Seu computador** | Copie `frontend/.env.example` para `frontend/.env.local` e preencha. Esse arquivo não vai para o GitHub (`.gitignore`). Reinicie o `npm run dev` depois de alterar. |
| **Vercel** | Project → Settings → Environment Variables. Depois de alterar, faça um novo deploy. |
| **GitHub Actions (CI)** | Settings → Secrets and variables → Actions → *New repository secret*. O `ci.yml` repassa o valor para o build. |

> **Importante:** este site roda inteiro no navegador. Toda variável `VITE_*` é embutida no JavaScript
> publicado e **qualquer visitante consegue ler**. A `.env` serve para tirar dados do código-fonte e mudar
> valores sem editar código, mas **não esconde segredos**. Senhas, tokens e chaves de API privadas só podem
> ser usados num backend (por exemplo, uma função serverless na Vercel), nunca com o prefixo `VITE_`.

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
