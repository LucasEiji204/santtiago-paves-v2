import type { CartItem } from '../context/CartContext'
import { STORE, whatsAppLink } from '../config'
import { formatCurrency } from './format'

export type PaymentMethod = 'pix' | 'dinheiro'
export type LogisticsMethod = 'delivery' | 'pickup'

export interface CheckoutData {
  name: string
  phone: string
  logistics: LogisticsMethod
  address: string
  cep: string
  complement: string
  payment: PaymentMethod
  /** Valor para troco, quando o pagamento é em dinheiro (texto livre). */
  changeFor: string
}

export function deliveryFeeFor(logistics: LogisticsMethod): number {
  return logistics === 'delivery' ? STORE.deliveryFee : 0
}

/**
 * Remove os caracteres de formatação do WhatsApp (*, _, ~, `) do texto
 * digitado pelo cliente, para que ele não quebre a formatação da mensagem.
 */
function clean(text: string): string {
  return text.replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim()
}

export function buildOrderMessage(
  items: CartItem[],
  checkout: CheckoutData,
  subtotal: number,
): string {
  const deliveryFee = deliveryFeeFor(checkout.logistics)
  const total = subtotal + deliveryFee

  const lines: string[] = [
    `*Novo Pedido — ${STORE.name}*`,
    '',
    `*Cliente*: ${clean(checkout.name)}`,
    `*Telefone*: ${clean(checkout.phone)}`,
    '',
    '*Itens*:',
  ]

  items.forEach((item) => {
    let line = `• ${item.quantity}x ${item.name} — ${formatCurrency(item.unitPrice * item.quantity)}`
    if (item.addons.length > 0) {
      line += `\n  _Adicionais: ${item.addons.map((a) => a.name).join(', ')}_`
    }
    if (item.observations) {
      line += `\n  _Obs: ${clean(item.observations)}_`
    }
    lines.push(line)
  })

  lines.push('')
  lines.push(`*Subtotal*: ${formatCurrency(subtotal)}`)

  if (checkout.logistics === 'delivery') {
    lines.push(`*Taxa de Entrega*: ${formatCurrency(deliveryFee)}`)
    lines.push(`*Endereço*: ${clean(checkout.address)}`)
    if (checkout.cep) lines.push(`*CEP*: ${clean(checkout.cep)}`)
    if (checkout.complement) lines.push(`*Complemento*: ${clean(checkout.complement)}`)
  } else {
    lines.push(`*Retirada na loja* — ${STORE.pickup.label}`)
  }

  lines.push('')
  lines.push(`*Total*: ${formatCurrency(total)}`)
  lines.push('')

  if (checkout.payment === 'pix') {
    lines.push('*Pagamento*: Pix (aguardo a chave Pix por aqui)')
  } else {
    const change = clean(checkout.changeFor)
    lines.push(`*Pagamento*: Dinheiro${change ? ` — troco para ${change}` : ' — sem troco'}`)
  }

  return lines.join('\n')
}

export function buildWhatsAppUrl(
  items: CartItem[],
  checkout: CheckoutData,
  subtotal: number,
): string {
  return whatsAppLink(buildOrderMessage(items, checkout, subtotal))
}
