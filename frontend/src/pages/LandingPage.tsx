import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { HeroStory } from '../components/HeroStory'
import { PageTitle } from '../components/PageTitle'
import { ProductCard } from '../components/ProductCard'
import { FAVORITES } from '../data/products'
import { LANDING_IMAGES } from '../data/landingImages'

/** Aparece suavemente quando entra na tela (uma vez). */
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
}

const PILLARS = [
  {
    icon: 'eco',
    title: 'Ingredientes conscientes',
    desc: 'Trabalhamos com produtores locais e cacau de origem controlada.',
  },
  {
    icon: 'timer',
    title: 'Paciência artesanal',
    desc: 'Nossos doces levam até 24 horas de preparo para atingir a textura certa.',
  },
  {
    icon: 'workspace_premium',
    title: 'Lotes limitados',
    desc: 'Produção diária em pequena escala, para garantir o frescor.',
  },
]

export function LandingPage() {
  return (
    <>
      <PageTitle />
      <Header showMenu showNav overlay />
      <main id="conteudo">
        <HeroStory />

        {/* Favoritos */}
        <section id="apos-abertura" className="bg-background">
          <div id="favoritos" className="scroll-mt-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
            <motion.div {...reveal} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
              <div>
                <p className="eyebrow text-caramel-deep mb-4 flex items-center gap-4">
                  <span className="rule-gold" aria-hidden="true" /> Mais pedidos
                </p>
                <h2 className="font-display text-headline-md md:text-display-lg text-ink">Nossos favoritos</h2>
              </div>
              <Link to="/cardapio" className="btn btn-outline-dark self-start md:self-auto">
                Ver cardápio completo
                <Icon name="arrow_forward" className="text-[20px]" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {FAVORITES.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} inView />
              ))}
            </div>
          </div>
        </section>

        {/* História */}
        <section id="historia" className="scroll-mt-20 bg-surface-container-low border-y border-line">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            <motion.div {...reveal} className="md:col-span-6">
              <p className="eyebrow text-caramel-deep mb-4 flex items-center gap-4">
                <span className="rule-gold" aria-hidden="true" /> Nossa história
              </p>
              <h2 className="font-display text-headline-md md:text-display-lg text-ink mb-8">
                Um clássico brasileiro, <em className="text-caramel-deep">com alma de alta confeitaria.</em>
              </h2>
              <div className="space-y-5 text-body-lg text-ink-soft">
                <p>
                  O Atelier du Pavé nasceu do desejo de levar o pavê, sobremesa de família, ao patamar da confeitaria
                  internacional. O que começou numa pequena cozinha, com receitas passadas de geração em geração,
                  virou um ateliê dedicado a uma única arte.
                </p>
                <p>
                  Nossa técnica respeita o tempo de cada camada, para que o creme de baunilha, o chocolate belga e as
                  frutas frescas se encontrem em equilíbrio.
                </p>
              </div>
              <figure className="mt-10 flex items-center gap-4 border-t border-line pt-8">
                <img
                  src={LANDING_IMAGES.chef}
                  alt=""
                  loading="lazy"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <figcaption>
                  <blockquote className="font-display text-xl font-medium tracking-[-0.01em] text-ink">
                    “O segredo está no silêncio entre as camadas.”
                  </blockquote>
                  <p className="text-label-sm text-ink-soft mt-1">Chef fundadora</p>
                </figcaption>
              </figure>
            </motion.div>
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <motion.img
                {...reveal}
                src={LANDING_IMAGES.ingredientes}
                alt="Ingredientes frescos para o pavê"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover rounded-2xl translate-y-10"
              />
              <motion.img
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.15 }}
                src={LANDING_IMAGES.preparo}
                alt="Preparo artesanal do pavê"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Pilares */}
        <section className="bg-cocoa-950 text-cream-50">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
            <motion.div {...reveal} className="max-w-2xl mb-16">
              <p className="eyebrow text-caramel-rich mb-4 flex items-center gap-4">
                <span className="rule-gold" aria-hidden="true" /> A experiência do ateliê
              </p>
              <h2 className="font-display text-headline-md md:text-display-lg">
                Excelência que se sente <em className="text-cream-200">na primeira colherada.</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-cream-50/15">
              {PILLARS.map((item, i) => (
                <motion.div
                  key={item.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.12 }}
                  className="py-10 md:pr-10 md:[&:not(:first-child)]:pl-10 md:[&:not(:last-child)]:border-r border-b md:border-b-0 border-cream-50/15"
                >
                  <Icon name={item.icon} className="text-caramel-rich text-3xl mb-6" />
                  <h3 className="font-display text-headline-sm mb-3">{item.title}</h3>
                  <p className="text-cream-50/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="relative overflow-hidden bg-cocoa-900 text-cream-50">
          <img
            src={LANDING_IMAGES.embalagem}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950 via-cocoa-950/60 to-cocoa-950/30" />
          <motion.div
            {...reveal}
            className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-28 md:py-36 text-center"
          >
            <h2 className="font-display text-display-lg-mobile md:text-display-lg max-w-3xl mx-auto">
              Pronto para o seu <em className="text-cream-200">momento doce?</em>
            </h2>
            <p className="mt-6 text-body-lg text-cream-50/75 max-w-xl mx-auto">
              Monte seu pedido em poucos minutos e finalize pelo WhatsApp. O pagamento é por Pix ou dinheiro.
            </p>
            <Link to="/cardapio" className="btn btn-light mt-10">
              Fazer meu pedido
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
