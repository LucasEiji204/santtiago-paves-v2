import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import type { PaymentMethod } from '../utils/whatsapp'

export interface OrderSentState {
  whatsappUrl: string
  total: number
  payment: PaymentMethod
}

function isOrderSentState(value: unknown): value is OrderSentState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.whatsappUrl === 'string' && v.whatsappUrl.startsWith('https://wa.me/') && typeof v.total === 'number'
}

export function OrderSentPage() {
  const location = useLocation()
  const { clearCart } = useCart()
  const order = isOrderSentState(location.state) ? location.state : null

  // O pedido já está na mensagem do WhatsApp: esvazia a sacola.
  useEffect(() => {
    if (order) clearCart()
  }, [order, clearCart])

  if (!order) return <Navigate to="/cardapio" replace />

  return (
    <>
      <PageTitle title="Pedido pronto" />
      <Header />
      <main id="conteudo" className="max-w-2xl mx-auto px-margin-mobile py-16 pb-32 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-pistachio-accent/30 flex items-center justify-center"
        >
          <Icon name="check" className="text-4xl text-primary" />
        </motion.div>
        <h1 className="font-headline-md text-headline-md text-primary mb-4">Seu pedido está pronto!</h1>
        <p className="text-body-lg text-on-surface-variant mb-10">
          Abrimos o WhatsApp com o pedido já escrito. <strong className="text-primary">Confira e toque em enviar</strong> para
          que a gente receba.
        </p>

        <ol className="text-left space-y-4 bg-surface-container-low rounded-2xl p-6 mb-10">
          <li className="flex gap-3">
            <span aria-hidden="true" className="w-7 h-7 shrink-0 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center text-label-sm font-bold">1</span>
            <span>Envie a mensagem do pedido no WhatsApp.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="w-7 h-7 shrink-0 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center text-label-sm font-bold">2</span>
            <span>
              {order.payment === 'pix'
                ? <>Você recebe a chave Pix por lá. Pague <strong>{formatCurrency(order.total)}</strong> e mande o comprovante na conversa.</>
                : <>O pagamento de <strong>{formatCurrency(order.total)}</strong> é em dinheiro, na entrega ou na retirada.</>}
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="w-7 h-7 shrink-0 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center text-label-sm font-bold">3</span>
            <span>Confirmamos o pedido e o horário pelo WhatsApp.</span>
          </li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={order.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp text-white px-8 py-4 rounded-xl font-label-md flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg"
          >
            <Icon name="open_in_new" />
            O WhatsApp não abriu? Toque aqui
          </a>
          <Link
            to="/cardapio"
            className="border-2 border-primary-container text-primary px-8 py-4 rounded-xl font-label-md hover:bg-primary-container hover:text-white transition-all"
          >
            Voltar ao cardápio
          </Link>
        </div>
      </main>
      <Footer compact />
      <BottomNav />
    </>
  )
}
