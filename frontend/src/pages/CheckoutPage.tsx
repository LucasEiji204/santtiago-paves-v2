import { motion } from 'framer-motion'
import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { TextField } from '../components/TextField'
import { useCart } from '../context/CartContext'
import { STORE } from '../config'
import { formatCurrency, isValidCep, isValidPhone, maskCep, maskPhone } from '../utils/format'
import {
  buildWhatsAppUrl,
  deliveryFeeFor,
  type CheckoutData,
  type LogisticsMethod,
  type PaymentMethod,
} from '../utils/whatsapp'
import type { OrderSentState } from './OrderSentPage'

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.412 2.503 1.112 3.487l-.751 2.234 2.301-.733c.944.576 2.056.912 3.106.912 3.183 0 5.768-2.587 5.769-5.767 0-3.181-2.587-5.767-5.769-5.767zm3.391 8.221c-.142.399-.715.763-1.141.817-.355.045-.81.077-1.308-.083-.331-.106-1.181-.395-2.023-1.129-.739-.643-1.233-1.425-1.381-1.681-.148-.256-.015-.394.113-.522.115-.115.256-.298.384-.447.128-.149.17-.256.256-.426.085-.17.043-.32-.021-.447-.064-.128-.575-1.385-.788-1.895-.208-.499-.42-.43-.575-.438-.148-.008-.32-.01-.49-.01-.17 0-.447.064-.68.32-.234.256-.894.873-.894 2.129 0 1.256.915 2.47 1.043 2.64.128.17 1.8 2.75 4.359 3.854.61.263 1.084.42 1.454.539.612.195 1.168.167 1.607.102.49-.074 1.503-.615 1.716-1.21.213-.595.213-1.106.15-1.212-.064-.107-.234-.17-.511-.308zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
    </svg>
  )
}

const PAYMENT_OPTIONS: { id: PaymentMethod; icon: string; label: string; desc: string }[] = [
  { id: 'pix', icon: 'qr_code_2', label: 'Pix', desc: 'Enviamos a chave pelo WhatsApp' },
  { id: 'dinheiro', icon: 'payments', label: 'Dinheiro', desc: 'Na entrega ou retirada' },
]

const LOGISTICS_OPTIONS: { id: LogisticsMethod; icon: string; label: string }[] = [
  { id: 'delivery', icon: 'delivery_dining', label: 'Entrega' },
  { id: 'pickup', icon: 'storefront', label: 'Retirada' },
]

type FieldErrors = Partial<Record<'name' | 'phone' | 'address' | 'cep', string>>

function validate(data: CheckoutData): FieldErrors {
  const errors: FieldErrors = {}
  if (data.name.trim().length < 2) errors.name = 'Informe seu nome.'
  if (!isValidPhone(data.phone)) errors.phone = 'Informe um telefone com DDD, ex.: (18) 99999-9999.'
  if (data.logistics === 'delivery') {
    if (data.address.trim().length < 5) errors.address = 'Informe rua, número e bairro.'
    if (data.cep && !isValidCep(data.cep)) errors.cep = 'CEP incompleto.'
  }
  return errors
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal } = useCart()
  const formRef = useRef<HTMLFormElement>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [logistics, setLogistics] = useState<LogisticsMethod>('delivery')
  const [address, setAddress] = useState('')
  const [cep, setCep] = useState('')
  const [complement, setComplement] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [changeFor, setChangeFor] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/carrinho" replace />
  }

  const deliveryFee = deliveryFeeFor(logistics)
  const total = subtotal + deliveryFee

  const data: CheckoutData = { name, phone, logistics, address, cep, complement, payment, changeFor }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Leva o foco ao primeiro campo com erro.
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    const url = buildWhatsAppUrl(items, data, subtotal)
    // Abre o WhatsApp já com o pedido escrito; o cliente só precisa enviar.
    window.open(url, '_blank', 'noopener,noreferrer')
    const state: OrderSentState = { whatsappUrl: url, total, payment }
    navigate('/pedido-enviado', { replace: true, state })
  }

  // Depois da primeira tentativa de envio, os erros se atualizam enquanto a pessoa
  // digita. Recebe os valores novos porque o estado só muda no próximo render.
  const revalidate = (patch: Partial<CheckoutData>) => {
    if (submitted) setErrors(validate({ ...data, ...patch }))
  }

  const errorCount = Object.keys(errors).length

  return (
    <>
      <PageTitle title="Finalizar Pedido" />
      <Header showBack subtitle="Passo 2 de 2: Finalizar" />
      <main id="conteudo" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 pb-32">
        <h1 className="sr-only">Finalizar pedido</h1>
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            {errorCount > 0 && (
              <div role="alert" className="p-4 rounded-xl bg-error/5 border border-error/30 text-error font-body-md">
                Confira {errorCount === 1 ? 'o campo destacado' : `os ${errorCount} campos destacados`} abaixo.
              </div>
            )}

            {/* Identificação */}
            <fieldset>
              <legend className="flex items-center gap-3 mb-6">
                <span aria-hidden="true" className="w-8 h-8 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center font-bold">1</span>
                <span className="font-headline-sm text-headline-sm text-primary">Identificação</span>
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Nome"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    revalidate({ name: e.target.value })
                  }}
                  error={errors.name}
                  placeholder="Como deseja ser chamado?"
                  autoComplete="name"
                  maxLength={80}
                />
                <TextField
                  label="WhatsApp / Telefone"
                  required
                  value={phone}
                  onChange={(e) => {
                    const v = maskPhone(e.target.value)
                    setPhone(v)
                    revalidate({ phone: v })
                  }}
                  error={errors.phone}
                  placeholder="(00) 00000-0000"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>
            </fieldset>

            {/* Entrega */}
            <fieldset>
              <legend className="flex items-center gap-3 mb-6">
                <span aria-hidden="true" className="w-8 h-8 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center font-bold">2</span>
                <span className="font-headline-sm text-headline-sm text-primary">Entrega ou Retirada</span>
              </legend>
              <div role="radiogroup" aria-label="Entrega ou retirada" className="bg-surface-container-low p-1.5 rounded-2xl flex mb-8 max-w-sm">
                {LOGISTICS_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex-1 py-3 px-4 rounded-xl font-label-md transition-all flex items-center justify-center gap-2 cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-caramel-deep ${
                      logistics === option.id
                        ? 'bg-primary text-on-primary shadow-lg'
                        : 'text-on-surface-variant hover:bg-surface-variant/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="logistics"
                      value={option.id}
                      checked={logistics === option.id}
                      onChange={() => {
                        setLogistics(option.id)
                        revalidate({ logistics: option.id })
                      }}
                      className="sr-only"
                    />
                    <Icon name={option.icon} className="text-[20px]" />
                    {option.label}
                  </label>
                ))}
              </div>

              <motion.div
                key={logistics}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {logistics === 'delivery' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <TextField
                        className="md:col-span-2"
                        label="Endereço de Entrega"
                        required
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value)
                          revalidate({ address: e.target.value })
                        }}
                        error={errors.address}
                        placeholder="Rua, Número, Bairro"
                        autoComplete="street-address"
                        maxLength={150}
                      />
                      <TextField
                        label="CEP"
                        value={cep}
                        onChange={(e) => {
                          const v = maskCep(e.target.value)
                          setCep(v)
                          revalidate({ cep: v })
                        }}
                        error={errors.cep}
                        placeholder="00000-000"
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                    </div>
                    <TextField
                      label="Complemento / Ponto de Referência"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apt, Bloco, fundos..."
                      autoComplete="address-line2"
                      maxLength={100}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 p-6 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest">
                    <div className="flex items-start gap-4">
                      <Icon name="location_on" className="text-caramel-deep" />
                      <div>
                        <p className="font-label-md text-primary">{STORE.pickup.label}</p>
                        <p className="text-body-md text-on-surface-variant">{STORE.pickup.address}</p>
                        <p className="text-label-sm text-on-surface-variant mt-2">{STORE.pickup.eta}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </fieldset>

            {/* Pagamento */}
            <fieldset>
              <legend className="flex items-center gap-3 mb-6">
                <span aria-hidden="true" className="w-8 h-8 rounded-full bg-primary-container text-cream-vanilla flex items-center justify-center font-bold">3</span>
                <span className="font-headline-sm text-headline-sm text-primary">Forma de Pagamento</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_OPTIONS.map((option) => (
                  <motion.label
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl cursor-pointer transition-all text-center"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={payment === option.id}
                      onChange={() => setPayment(option.id)}
                      className="sr-only peer"
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-2xl border-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-caramel-deep peer-focus-visible:ring-offset-2 ${
                        payment === option.id ? 'border-caramel-deep bg-primary-container/5' : 'border-transparent'
                      }`}
                    />
                    {payment === option.id && (
                      <Icon name="check_circle" filled className="absolute top-3 right-3 text-caramel-deep z-10" />
                    )}
                    <Icon name={option.icon} className="text-caramel-deep mb-2 relative z-10" />
                    <span className="font-label-md text-primary relative z-10">{option.label}</span>
                    <span className="text-label-sm text-on-surface-variant relative z-10">{option.desc}</span>
                  </motion.label>
                ))}
              </div>
              {payment === 'dinheiro' && (
                <TextField
                  className="mt-6 max-w-sm"
                  label="Precisa de troco? Para quanto?"
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  placeholder="Ex.: R$ 100"
                  inputMode="decimal"
                  maxLength={20}
                  hint="Deixe em branco se não precisar de troco."
                />
              )}
              {payment === 'pix' && (
                <p className="mt-6 text-body-md text-on-surface-variant flex items-start gap-2">
                  <Icon name="info" className="text-caramel-deep text-[20px] mt-0.5" />
                  Depois de enviar o pedido, você recebe a chave Pix pelo WhatsApp para fazer o pagamento.
                </p>
              )}
            </fieldset>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-6">
              <section aria-labelledby="resumo-pedido" className="bg-white rounded-3xl p-8 checkout-card border border-surface-variant/30">
                <h2 id="resumo-pedido" className="font-headline-sm text-headline-sm text-primary mb-8 border-b border-surface-variant pb-4">Resumo do Pedido</h2>
                <ul className="space-y-6 mb-8">
                  {items.map((item) => (
                    <li key={item.cartId} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" alt="" src={item.image} loading="lazy" width={80} height={80} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-label-md text-primary">{item.name}</h3>
                          <span className="font-label-md text-primary whitespace-nowrap">{formatCurrency(item.unitPrice * item.quantity)}</span>
                        </div>
                        {item.addons.length > 0 && (
                          <p className="text-label-sm text-on-surface-variant">+ {item.addons.map((a) => a.name).join(', ')}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-label-sm bg-surface-container px-2 py-0.5 rounded-full">Qtd: {item.quantity}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3 pt-6 border-t border-surface-variant">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>{logistics === 'delivery' ? 'Taxa de Entrega' : 'Retirada na loja'}</span>
                    <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}</span>
                  </div>
                  <div className="flex justify-between text-display-lg-mobile font-display-lg-mobile text-primary pt-4">
                    <span>Total</span>
                    <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                      {formatCurrency(total)}
                    </motion.span>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 w-full bg-whatsapp text-white py-5 rounded-2xl font-label-md flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:brightness-110 transition-all"
                >
                  <WhatsAppIcon />
                  Finalizar e enviar pelo WhatsApp
                </motion.button>
                <p className="text-center text-label-sm text-on-surface-variant mt-4">
                  O WhatsApp abre com o pedido já escrito — é só tocar em enviar.
                </p>
              </section>

              <p className="flex items-start gap-3 px-2 text-on-surface-variant text-label-sm">
                <Icon name="info" className="text-[18px]" />
                <span>
                  Seus dados não ficam guardados no site: vão apenas na mensagem que você envia pelo WhatsApp.{' '}
                  <Link to="/privacidade" className="underline underline-offset-2 hover:text-primary">Saiba mais</Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </main>
      <Footer compact />
      <BottomNav />
    </>
  )
}
