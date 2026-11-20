import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { CartBar } from '../components/CartBar'
import { CategoryTabs } from '../components/CategoryTabs'
import { ProductCard } from '../components/ProductCard'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { CATEGORIES, PRODUCTS, categoryTabId, type Category } from '../data/products'

const PANEL_ID = 'painel-produtos'

/** Compara sem diferenciar maiúsculas nem acentos ("pave" encontra "Pavê"). */
function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0])
  const [search, setSearch] = useState('')
  const query = normalize(search.trim())

  // Com busca, procura em todas as categorias; sem busca, mostra a aba ativa.
  const filteredProducts = useMemo(() => {
    if (query) {
      return PRODUCTS.filter(
        (p) => normalize(p.name).includes(query) || normalize(p.description).includes(query),
      )
    }
    return PRODUCTS.filter((p) => p.category === activeCategory)
  }, [activeCategory, query])

  return (
    <>
      <PageTitle title="Cardápio" />
      <Header />
      <main id="conteudo" className="max-w-container-max mx-auto pb-40">
        <div className="px-margin-mobile md:px-margin-desktop pt-10 md:pt-16 pb-2">
          <p className="eyebrow text-caramel-deep mb-4 flex items-center gap-4">
            <span className="rule-gold" aria-hidden="true" /> Cardápio
          </p>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-ink">Escolha o seu pavê</h1>
        </div>
        <section aria-label="Buscar" className="px-margin-mobile md:px-margin-desktop py-6">
          <div className="relative group">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-caramel-deep transition-colors" />
            <label htmlFor="busca" className="sr-only">Buscar no cardápio</label>
            <input
              id="busca"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-2 border-transparent rounded-xl font-body-md text-on-surface placeholder:text-outline outline-none focus-visible:border-caramel-deep transition-colors"
              placeholder="Encontre seu pavê favorito..."
              type="search"
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-on-surface-variant hover:text-primary"
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        </section>

        {!query && (
          <section aria-label="Categorias" className="px-margin-mobile md:px-margin-desktop mb-8">
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} panelId={PANEL_ID} />
          </section>
        )}

        <section
          id={PANEL_ID}
          {...(query
            ? { 'aria-label': `Resultados da busca por ${search.trim()}` }
            : { role: 'tabpanel', 'aria-labelledby': categoryTabId(activeCategory) })}
          className="px-margin-mobile md:px-margin-desktop"
        >
          <p className="sr-only" role="status">
            {query
              ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`
              : ''}
          </p>
          <motion.div
            key={query ? `busca:${query}` : activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Icon name="search_off" className="text-4xl text-outline mb-4" />
                <p className="text-on-surface-variant font-body-md">Nenhum produto encontrado.</p>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <CartBar />
      <Footer compact />
      <BottomNav />
    </>
  )
}
