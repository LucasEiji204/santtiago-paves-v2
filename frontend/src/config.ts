/**
 * Configurações da loja — edite aqui em vez de procurar pelo código.
 *
 * Campos vazios ('') são escondidos automaticamente no site.
 * Itens marcados com TODO precisam ser confirmados com a loja.
 */

/** Número do WhatsApp que recebe os pedidos (formato internacional, só dígitos). */
const ENV_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined

export const STORE = {
  name: 'Atelier du Pavé',
  tagline: 'Artesanalmente doce',

  whatsappNumber: (ENV_WHATSAPP ?? '5518997314496').replace(/\D/g, ''),

  /** Taxa fixa de entrega em reais. */
  deliveryFee: 8,

  /** Endereço para retirada. TODO: confirmar o endereço real. */
  pickup: {
    label: 'Atelier du Pavé — Unidade Matriz',
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

/** Formata o número do WhatsApp para exibição: (18) 99731-4496 */
export function formatWhatsAppDisplay(number: string = STORE.whatsappNumber): string {
  const local = number.startsWith('55') ? number.slice(2) : number
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : number
}

export function whatsAppLink(text?: string): string {
  const base = `https://wa.me/${STORE.whatsappNumber}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
