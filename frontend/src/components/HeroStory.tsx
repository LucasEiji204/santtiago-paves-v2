import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { STORE } from '../config'
import { DEFAULT_ADDONS } from '../data/products'
import { formatCurrency } from '../utils/format'
import { Icon } from './Icon'

const VIDEO_SRC = '/media/hero.mp4'
const POSTER_SRC = '/media/hero-poster.jpg'

interface Step {
  id: string
  label: string
  title: ReactNode
  body: ReactNode
}

/**
 * As informações que aparecem, uma por vez, enquanto a pessoa rola a página.
 * Cada uma é uma "camada" — como as camadas de um pavê.
 */
const STEPS: Step[] = [
  {
    id: 'artesanal',
    label: 'Feito à mão',
    title: <>Cada camada no <em>seu tempo.</em></>,
    body: (
      <p>
        Montamos nossos pavês à mão, camada por camada, respeitando o descanso de cada creme. Produzimos em lotes
        pequenos para que tudo chegue fresco até você.
      </p>
    ),
  },
  {
    id: 'personalize',
    label: 'Do seu jeito',
    title: <>Personalize o <em>seu pavê.</em></>,
    body: (
      <>
        <p>Escolha adicionais e deixe observações para restrições ou pedidos especiais.</p>
        <ul className="mt-6 divide-y divide-cream-50/15 border-y border-cream-50/15">
          {DEFAULT_ADDONS.map((addon) => (
            <li key={addon.id} className="flex justify-between gap-6 py-3 text-[15px]">
              <span>{addon.name}</span>
              <span className="price text-caramel-rich">+ {formatCurrency(addon.price)}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'pedido',
    label: 'Peça em minutos',
    title: <>Do cardápio ao <em>WhatsApp.</em></>,
    body: (
      <ol className="space-y-4">
        {[
          'Escolha seus pavês no cardápio online.',
          'Informe entrega ou retirada e a forma de pagamento.',
          'O WhatsApp abre com o pedido pronto: é só enviar.',
        ].map((text, i) => (
          <li key={text} className="flex gap-4 items-baseline">
            <span className="price text-caramel-rich text-sm">0{i + 1}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: 'pagamento',
    label: 'Pagamento e entrega',
    title: <>Pix, sem <em>complicação.</em></>,
    body: (
      <>
        <p>Depois que você envia o pedido, mandamos a chave Pix pelo WhatsApp. Também aceitamos dinheiro.</p>
        <dl className="mt-6 grid grid-cols-2 gap-px bg-cream-50/15 border border-cream-50/15 rounded-xl overflow-hidden">
          <div className="bg-cocoa-950/60 p-4">
            <dt className="eyebrow text-cream-50/60">Entrega</dt>
            <dd className="price text-xl mt-1">{formatCurrency(STORE.deliveryFee)}</dd>
          </div>
          <div className="bg-cocoa-950/60 p-4">
            <dt className="eyebrow text-cream-50/60">Retirada</dt>
            <dd className="price text-xl mt-1">Grátis</dd>
          </div>
        </dl>
      </>
    ),
  },
]

const N = STEPS.length

/** Vídeo de fundo: sem som, em loop, pausa quando sai da tela. */
function BackgroundVideo({ play }: { play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (!play) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [play])

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover"
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      loop
      playsInline
      autoPlay={play}
      preload={play ? 'auto' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

function HeroCopy() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-caramel-rich mb-6 flex items-center gap-4">
        <span className="rule-gold" aria-hidden="true" />
        Confeitaria artesanal
      </p>
      <h1 className="font-serif text-display-lg-mobile md:text-display-xl text-cream-50">
        A arte do pavê, <em className="text-cream-200">em camadas.</em>
      </h1>
      <p className="mt-8 max-w-xl text-body-lg text-cream-50/80">
        Pavês feitos à mão, com ingredientes selecionados e o tempo que a excelência exige. Monte seu pedido online e
        finalize pelo WhatsApp.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link to="/cardapio" className="btn btn-light">
          Ver cardápio
          <Icon name="arrow_forward" className="text-[20px]" />
        </Link>
        <Link to="/#favoritos" className="btn btn-outline text-cream-50">
          Nossos favoritos
        </Link>
      </div>
    </div>
  )
}

function StepContent({ step, index }: { step: Step; index: number }) {
  return (
    <div className="max-w-xl">
      <p className="eyebrow text-caramel-rich mb-6 flex items-center gap-4">
        <span className="price tracking-normal">{String(index + 1).padStart(2, '0')}</span>
        <span className="rule-gold" aria-hidden="true" />
        {step.label}
      </p>
      <h2 className="font-serif text-display-lg-mobile md:text-display-lg text-cream-50 [&_em]:text-cream-200">
        {step.title}
      </h2>
      <div className="mt-8 text-body-lg text-cream-50/80">{step.body}</div>
    </div>
  )
}

/** Faz uma camada aparecer e sumir num trecho do scroll. */
function useStepVisibility(progress: MotionValue<number>, index: number) {
  const f = (x: number) => x / N
  const last = index === N - 1
  const input = last
    ? [f(index + 0.35), f(index + 0.65)]
    : [f(index + 0.35), f(index + 0.65), f(index + 1.0), f(index + 1.3)]
  const opacity = useTransform(progress, input, last ? [0, 1] : [0, 1, 1, 0])
  const y = useTransform(progress, input, last ? [40, 0] : [40, 0, 0, -40])
  return { opacity, y }
}

function AnimatedStep({ step, index, progress }: { step: Step; index: number; progress: MotionValue<number> }) {
  const { opacity, y } = useStepVisibility(progress, index)
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'))
  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="absolute inset-0 flex items-center">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <StepContent step={step} index={index} />
      </div>
    </motion.div>
  )
}

/**
 * Abertura da página inicial: o vídeo fica fixo ao fundo e as informações
 * importantes aparecem uma de cada vez conforme a pessoa rola.
 * Com "reduzir movimento" ligado, vira uma sequência simples, sem vídeo.
 */
export function HeroStory() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const f = p * N
    setActive(f < 0.5 ? -1 : Math.min(N - 1, Math.floor(f - 0.15)))
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.35 / N], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.35 / N], [0, -60])
  const shade = useTransform(scrollYProgress, [0, 0.4 / N], [0.35, 0.62])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15 / N], [1, 0])
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduceMotion) {
    return (
      <div className="bg-cocoa-950 text-cream-50">
        <section className="relative min-h-[100svh] flex items-center overflow-hidden">
          <img src={POSTER_SRC} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa-950/90 via-cocoa-950/50 to-transparent" />
          <div className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24">
            <HeroCopy />
          </div>
        </section>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 grid gap-20 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <section key={step.id} aria-label={step.label}>
              <StepContent step={step} index={i} />
            </section>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative bg-cocoa-950" style={{ height: `${(N + 1) * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden text-cream-50">
        <BackgroundVideo play />
        {/* Escurece o vídeo à esquerda (legibilidade) e um pouco mais conforme o scroll. */}
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa-950/85 via-cocoa-950/40 to-transparent" />
        <motion.div className="absolute inset-0 bg-cocoa-950" style={{ opacity: shade }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex items-center">
          <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16">
            <HeroCopy />
          </div>
        </motion.div>

        {STEPS.map((step, i) => (
          <AnimatedStep key={step.id} step={step} index={i} progress={scrollYProgress} />
        ))}

        {/* Índice das camadas (desktop) */}
        <nav
          aria-hidden="true"
          className="hidden lg:flex flex-col gap-4 absolute right-[max(4rem,calc((100vw_-_1240px)/2_+_4rem))] top-1/2 -translate-y-1/2"
        >
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4 justify-end">
              <span className={`text-sm transition-all duration-500 ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                {step.label}
              </span>
              <span
                className={`block h-px transition-all duration-500 ${
                  active === i ? 'w-10 bg-caramel-rich' : 'w-5 bg-cream-50/40'
                }`}
              />
            </div>
          ))}
        </nav>

        {/* Barra de progresso (celular) */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: barScale }}
          className="lg:hidden absolute top-16 left-0 right-0 h-px origin-left bg-caramel-rich/80"
        />

        {/* Convite para rolar */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream-50/70"
        >
          <span className="eyebrow">Role para descobrir</span>
          <span className="relative block w-px h-10 overflow-hidden bg-cream-50/20">
            <span className="absolute inset-x-0 top-0 h-1/3 bg-cream-50 animate-scroll-cue" />
          </span>
        </motion.div>
      </div>
    </div>
  )
}
