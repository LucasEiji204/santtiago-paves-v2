import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <>
        <PageTitle title="Sacola" />
        <Header showBack />
        <main id="conteudo" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center text-center"
          >
            <div className="w-64 h-64 mb-8 relative">
              <div className="absolute inset-0 bg-primary-container/5 rounded-full scale-125 blur-3xl" />
              <img
                className="w-full h-full object-contain relative z-10"
                alt=""
                width={256}
                height={256}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKVY7kUAgUDaqYfJH4QYbOffIm2oQnuR7GvoFCXNH6qHHo6yGzrSY1hR_FGs-mJFNdhfjulYj-z3ZAaRW1-15vlckbC2UrjXpNTVDkHrvHJegoyHTUI3U4LTzA59McQD3LiRjdNgTh-Kc81roqIsJdz63n6YvM5g1Lz5pozEsPYo4qfDjgR-L5skTmNHenIEIUxZHg0Z2nqBfeiY96BkBKgBT55s0wkRp72EkCW1uCN0tP0aT7W4Lw"
              />
            </div>
            <h1 className="font-headline-md text-headline-md text-primary mb-4">Sua sacola está vazia</h1>
            <p className="text-on-surface-variant text-body-lg max-w-md mx-auto mb-10">
              Parece que você ainda não escolheu suas doçuras artesanais. Que tal explorar nosso cardápio de hoje?
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/cardapio"
                className="bg-primary-container text-white px-10 py-4 rounded-xl font-label-md hover:bg-primary transition-soft shadow-lg flex items-center gap-3"
              >
                <Icon name="restaurant_menu" />
                Ver Cardápio
              </Link>
            </motion.div>
          </motion.div>
        </main>
        <Footer compact />
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <PageTitle title="Sacola" />
      <Header showBack subtitle="Passo 1 de 2: Sacola" />
      <main id="conteudo" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-baseline justify-between mb-8">
              <h1 className="font-headline-md text-headline-md text-primary">Minha Sacola</h1>
              <span className="text-on-surface-variant font-label-md" aria-live="polite">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <ul className="space-y-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-surface-container-lowest rounded-2xl shadow-[0_10px_30px_rgba(74,49,45,0.04)] hover:shadow-lg transition-soft border border-surface-variant/30"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt=""
                        src={item.image}
                        loading="lazy"
                        decoding="async"
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h2 className="font-headline-sm text-headline-sm text-primary">
                            <Link to={`/produto/${item.productId}`} className="hover:underline underline-offset-4">
                              {item.name}
                            </Link>
                          </h2>
                          {item.addons.length > 0 && (
                            <p className="text-on-surface-variant text-body-md mt-1">
                              + {item.addons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                          {item.observations && (
                            <p className="text-on-surface-variant text-label-sm mt-1 italic break-words">
                              Obs.: {item.observations}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-primary text-body-lg whitespace-nowrap">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-surface-container rounded-full px-2 py-1" role="group" aria-label={`Quantidade de ${item.name}`}>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            aria-label={item.quantity === 1 ? `Remover ${item.name}` : `Diminuir quantidade de ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white rounded-full transition-colors"
                          >
                            <Icon name="remove" className="text-[18px]" />
                          </motion.button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="px-4 font-label-md text-primary"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white rounded-full transition-colors disabled:opacity-40"
                          >
                            <Icon name="add" className="text-[18px]" />
                          </motion.button>
                        </div>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.cartId)}
                          aria-label={`Remover ${item.name} da sacola`}
                          className="text-error flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity font-label-md p-1 rounded"
                        >
                          <Icon name="delete" className="text-[20px]" />
                          <span className="hidden md:inline" aria-hidden="true">Remover</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <Link to="/cardapio" className="inline-flex items-center gap-2 text-caramel-deep font-label-md hover:underline underline-offset-4">
              <Icon name="add" /> Adicionar mais itens
            </Link>
          </div>

          <div className="lg:col-span-4">
            <motion.section
              aria-labelledby="resumo-sacola"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary-container p-8 rounded-2xl sticky top-28 shadow-xl"
            >
              <h2 id="resumo-sacola" className="font-headline-sm text-headline-sm mb-6 text-cream-vanilla">Resumo do Pedido</h2>
              <div className="space-y-4 font-body-md border-b border-cream-vanilla/20 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-cream-vanilla/80">Itens</span>
                  <span className="text-cream-vanilla">{itemCount}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-cream-vanilla/80">Entrega</span>
                  <span className="text-cream-vanilla/80 text-right text-label-sm">Calculada na próxima etapa</span>
                </div>
              </div>
              <div className="pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-headline-sm text-cream-vanilla font-headline-sm">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-headline-sm text-cream-vanilla font-bold"
                  >
                    {formatCurrency(subtotal)}
                  </motion.span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/finalizar"
                  className="w-full bg-cream-vanilla text-primary-container py-4 rounded-xl font-label-md hover:bg-white transition-soft flex justify-center items-center gap-2 group"
                >
                  Continuar para o Pedido
                  <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <p className="text-center text-cream-vanilla/80 text-label-sm mt-6">
                O pagamento é combinado pelo WhatsApp, via Pix ou dinheiro.
              </p>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer compact />
      <BottomNav />
    </>
  )
}
