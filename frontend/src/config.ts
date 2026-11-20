/**
 * Configurações da loja — edite aqui em vez de procurar pelo código.
 *
 * Campos vazios ('') são escondidos automaticamente no site.
 * Itens marcados com TODO precisam ser confirmados com a loja.
 */

/**
 * Número do WhatsApp que recebe os pedidos (formato internacional, só dígitos).
 * Vem da variável de ambiente VITE_WHATSAPP_NUMBER (arquivo .env.local no seu
 * computador; Settings → Environment Variables na Vercel). Veja .env.example.
 */
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

if (!WHATSAPP_NUMBER) {
  console.error(
    '[config] VITE_WHATSAPP_NUMBER não está definida: os pedidos não terão para onde ir. ' +
      'Crie o arquivo frontend/.env.local (veja .env.example) ou cadastre a variável na Vercel.',
  )
}

export const STORE = {
  name: 'Atelier du Pavê',
  tagline: 'Artesanalmente doce',

  whatsappNumber: WHATSAPP_NUMBER,

  /** Taxa fixa de entrega em reais. */
  deliveryFee: 8,

  /** Endereço para retirada. TODO: confirmar o endereço real. */
  pickup: {
    label: 'Atelier du Pavê — Unidade Matriz',
    address: 'Rua das Amêndoas, 124 - Jardim Europa',
    eta: 'Disponível para retirada em 45-60 min após a confirmação.',
  },

  /** Cidade exibida no rodapé. TODO: preencher (ex.: 'Presidente Prudente, SP'). */
  city: '',

  /** E-mail de contato. TODO: preencher ou deixar vazio para esconder. */
  email: '',

  /** Links das redes sociais (URL completa). Vazio = escondido. */
  social: {
    instagram: '',
  },
} as const

/** Formata o número do WhatsApp para exibição: 5511999999999 → (11) 99999-9999 */
export function formatWhatsAppDisplay(number: string = STORE.whatsappNumber): string {
  const local = number.startsWith('55') ? number.slice(2) : number
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : number
}

export function whatsAppLink(text?: string): string {
  const base = `https://wa.me/${STORE.whatsappNumber}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
