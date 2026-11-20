import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { getProductById, type Addon, type Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useTemporaryFlag } from '../hooks/useTemporaryFlag'
import { formatCurrency } from '../utils/format'

const MAX_OBSERVATIONS = 200

/**
 * Rota /produto/:id. A `key` faz o formulário (quantidade, adicionais,
 * observações) recomeçar do zero ao trocar de produto.
 */
export function ProductDetailRoute() {
  const { id = '' } = useParams<{ id: string }>()
  const product = getProductById(id)

  if (!product) {
    return (
      <>
        <PageTitle title="Produto não encontrado" />
        <Header showBack />
        <main id="conteudo" className="min-h-[60vh] flex items-center justify-center px-margin-mobile">
          <div className="text-center">
            <h1 className="font-headline-md text-headline-md text-primary mb-4">Produto não encontrado</h1>
            <p className="text-on-surface-variant mb-6">Este item pode ter saído do cardápio.</p>
            <Link to="/cardapio" className="text-caramel-deep font-label-md underline underline-offset-4">
              Voltar ao cardápio
            </Link>
          </div>
        </main>
      </>
    )
  }

  return <ProductDetailPage key={product.id} product={product} />
}

function ProductDetailPage({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([])
  const [observations, setObservations] = useState('')
  const [added, flashAdded] = useTemporaryFlag(1200)

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const unitTotal = product.price + addonsTotal
  const displayTotal = unitTotal * quantity

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    )
  }

  const handleAddToCart = () => {
    if (added) return
    addItem({
      productId: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      basePrice: product.price,
      quantity,
      addons: selectedAddons,
      observations,
    })
    flashAdded(() => navigate('/cardapio'))
  }

  return (
    <>
      <PageTitle title={product.name} />
      <Header showBack />
      <main id="conteudo" className="max-w-container-max mx-auto pb-48 md:pb-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group overflow-hidden rounded-xl h-[400px] md:h-[600px]"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={product.name}
              src={product.image}
              fetchPriority="high"
              width={800}
              height={600}
            />
            {product.badge && (
              <span className="absolute top-4 right-4 text-label-sm px-3 py-1 rounded-full bg-pistachio-accent/95 text-primary">
                {product.badge}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col space-y-8"
          >
            <div>
              {product.tagline && (
                <span className="text-caramel-deep font-label-md uppercase tracking-widest mb-2 block">{product.tagline}</span>
              )}
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">{product.name}</h1>
              <p className="price text-primary text-headline-sm">{formatCurrency(product.price)}</p>
              <p className="mt-6 text-on-surface-variant font-body-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="h-px bg-outline-variant/30" />

            {product.addons && product.addons.length > 0 && (
              <fieldset>
                <legend className="font-headline-sm text-headline-sm text-primary mb-6">Personalize seu momento</legend>
                <div className="grid grid-cols-1 gap-4">
                  {product.addons.map((addon) => {
                    const checked = selectedAddons.some((a) => a.id === addon.id)
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-4 rounded-lg bg-surface-container-low border cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-caramel-deep ${
                          checked ? 'border-caramel-deep/60 bg-caramel-rich/5' : 'border-transparent hover:border-caramel-rich/30'
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddon(addon)}
                            className="w-5 h-5 rounded accent-primary-container"
                          />
                          <span className="font-body-md text-primary">{addon.name}</span>
                        </span>
                        <span className="price text-on-surface-variant font-label-md">+ {formatCurrency(addon.price)}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )}

            <section>
              <label htmlFor="observacoes" className="font-headline-sm text-headline-sm text-primary mb-4 block">
                Observações
              </label>
              <textarea
                id="observacoes"
                value={observations}
                onChange={(e) => setObservations(e.target.value.slice(0, MAX_OBSERVATIONS))}
                maxLength={MAX_OBSERVATIONS}
                aria-describedby="observacoes-contador"
                className="w-full min-h-[100px] p-4 bg-surface-container-low border-2 border-transparent rounded-lg outline-none focus-visible:border-caramel-deep placeholder:text-outline text-on-surface font-body-md resize-none"
                placeholder="Alguma restrição ou pedido especial? Escreva aqui..."
              />
              <p id="observacoes-contador" className="text-label-sm text-on-surface-variant text-right mt-1">
                {observations.length}/{MAX_OBSERVATIONS}
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur-lg border-t border-outline-variant/10 px-margin-mobile md:px-margin-desktop py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] z-50">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-surface-container-high rounded-full p-1 w-full md:w-auto justify-between md:justify-start">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Diminuir quantidade"
              className="w-12 h-12 flex items-center justify-center text-primary hover:bg-surface-container-lowest rounded-full transition-colors disabled:opacity-40"
            >
              <Icon name="remove" />
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              aria-live="polite"
              className="w-12 text-center text-primary font-bold text-lg"
            >
              <span className="sr-only">Quantidade: </span>
              {quantity}
            </motion.span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={quantity >= 99}
              aria-label="Aumentar quantidade"
              className="w-12 h-12 flex items-center justify-center text-primary hover:bg-surface-container-lowest rounded-full transition-colors disabled:opacity-40"
            >
              <Icon name="add" />
            </motion.button>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`w-full md:w-auto md:min-w-[320px] text-on-primary py-4 px-10 rounded-lg font-body-lg font-semibold flex items-center justify-center gap-3 shadow-lg shadow-primary-container/20 transition-colors duration-300 ${
              added ? 'bg-pistachio-deep' : 'bg-primary-container hover:bg-primary'
            }`}
          >
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
            >
              {added ? 'Adicionado à sacola!' : 'Adicionar à Sacola'}
            </motion.span>
            {!added && (
              <>
                <span aria-hidden="true" className="opacity-40">•</span>
                <span className="price">{formatCurrency(displayTotal)}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </>
  )
}
