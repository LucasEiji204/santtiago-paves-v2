import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
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

const PAUSE_KEY = 'atelier-du-pave:video-pausado'

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(PAUSE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Vídeo de fundo: sem som, em loop, pausa sozinho quando sai da tela.
 * Toca para todos (é lento e suave), mas tem botão de pausar — exigência
 * de acessibilidade para vídeos que tocam sozinhos (WCAG 2.2.2). A escolha
 * de pausar fica guardada no navegador da pessoa.
 */
function useBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(readPaused)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (paused) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [paused])

  const toggle = () => {
    setPaused((p) => {
      try {
        window.localStorage.setItem(PAUSE_KEY, p ? '0' : '1')
      } catch {
        // sem armazenamento: a escolha vale só para esta visita
      }
      return !p
    })
  }

  return { ref, paused, toggle }
}

function BackgroundVideo({ video, className = '' }: { video: ReturnType<typeof useBackgroundVideo>; className?: string }) {
  return (
    <video
      ref={video.ref}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      loop
      playsInline
      autoPlay={!video.paused}
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

function VideoToggle({ video, className = '' }: { video: ReturnType<typeof useBackgroundVideo>; className?: string }) {
  return (
    <button
      type="button"
      onClick={video.toggle}
      aria-label={video.paused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo'}
      aria-pressed={video.paused}
      className={`z-10 w-11 h-11 rounded-full flex items-center justify-center bg-cocoa-950/50 backdrop-blur-md border border-cream-50/20 text-cream-50 hover:bg-cocoa-950/80 transition-colors ${className}`}
    >
      <Icon name={video.paused ? 'play_arrow' : 'pause'} className="text-[22px]" />
    </button>
  )
}

function HeroCopy({ titleAs: Title = 'h1' }: { titleAs?: 'h1' | 'p' }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow text-caramel-rich mb-5 flex items-center gap-4">
        <span className="rule-gold" aria-hidden="true" />
        Confeitaria artesanal
      </p>
      <Title className="text-display-lg-mobile md:text-display-lg xl:text-display-xl text-cream-50">
        A arte do pavê, <em className="text-cream-200">em camadas.</em>
      </Title>
      <p className="mt-6 md:mt-8 max-w-xl text-body-md md:text-body-lg text-cream-50/80">
        Pavês feitos à mão, com ingredientes selecionados e o tempo que a excelência exige. Monte seu pedido online e
        finalize pelo WhatsApp.
      </p>
      <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3">
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

function StepContent({ step, index, titleAs: Title = 'h2' }: { step: Step; index: number; titleAs?: 'h2' | 'p' }) {
  return (
    <div className="max-w-xl">
      <p className="price text-sm text-caramel-rich mb-5 flex items-center gap-4">
        {String(index + 1).padStart(2, '0')}
        <span className="rule-gold" aria-hidden="true" />
        <span className="text-cream-50/50">{String(N).padStart(2, '0')}</span>
      </p>
      <Title className="text-display-lg-mobile md:text-display-lg text-cream-50 [&_em]:text-cream-200">
        {step.title}
      </Title>
      <div className="mt-6 md:mt-8 text-body-md md:text-body-lg text-cream-50/80">{step.body}</div>
    </div>
  )
}

const swap = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
}

/**
 * Abertura da página inicial: o vídeo fica fixo ao fundo e, a cada "tela" de
 * rolagem, um único texto aparece — primeiro a apresentação, depois as
 * informações importantes, uma por vez (nunca dois textos sobrepostos).
 * Com "reduzir movimento" ligado, o vídeo continua (com botão de pausar),
 * mas as informações aparecem em sequência, sem depender da rolagem.
 */
export function HeroStory() {
  const reduceMotion = useReducedMotion()
  const video = useBackgroundVideo()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Fase atual: -1 = apresentação; 0..N-1 = informações. Cada fase ocupa uma tela de rolagem.
  const phaseFrom = (p: number) => Math.min(N, Math.floor(p * (N + 1))) - 1
  const [phase, setPhase] = useState(() => phaseFrom(scrollYProgress.get()))
  useMotionValueEvent(scrollYProgress, 'change', (p) => setPhase(phaseFrom(p)))

  const shade = useTransform(scrollYProgress, [0, 1 / (N + 1)], [0.3, 0.6])
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduceMotion) {
    return (
      <div className="bg-cocoa-950 text-cream-50">
        <section className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden">
          <BackgroundVideo video={video} className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-cocoa-950/95 via-cocoa-950/50 to-cocoa-950/10" />
          <div className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-28 md:pb-0">
            <HeroCopy />
          </div>
          <VideoToggle video={video} className="absolute right-5 bottom-24 md:right-8 md:bottom-8" />
        </section>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24 grid gap-16 md:gap-20 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <section key={step.id} aria-label={step.label}>
              <StepContent step={step} index={i} />
            </section>
          ))}
        </div>
      </div>
    )
  }

  const step = phase >= 0 ? STEPS[phase] : null

  return (
    <div ref={ref} className="relative bg-cocoa-950" style={{ height: `${(N + 2) * 100}svh` }}>
      {/* Leitores de tela recebem todas as informações de uma vez, sem depender da rolagem. */}
      <div className="sr-only">
        {STEPS.map((s, i) => (
          <section key={s.id} aria-label={s.label}>
            <StepContent step={s} index={i} />
          </section>
        ))}
      </div>

      <div className="sticky top-0 h-[100svh] overflow-hidden text-cream-50">
        <BackgroundVideo video={video} />
        {/* No celular o texto fica embaixo (escurece de baixo para cima); no desktop, à esquerda. */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-cocoa-950/95 via-cocoa-950/45 to-cocoa-950/5" />
        <motion.div className="absolute inset-0 bg-cocoa-950" style={{ opacity: shade }} />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-40 md:py-0">
            <AnimatePresence mode="wait" initial={false}>
              {step ? (
                <motion.div key={step.id} {...swap} aria-hidden="true">
                  <StepContent step={step} index={phase} titleAs="p" />
                </motion.div>
              ) : (
                <motion.div key="apresentacao" {...swap}>
                  <HeroCopy />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progresso da abertura */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: barScale }}
          className="absolute top-16 md:top-20 left-0 right-0 h-px origin-left bg-caramel-rich/80"
        />

        <VideoToggle video={video} className="absolute right-5 bottom-24 md:right-8 md:bottom-8" />

        {/* Convite para rolar */}
        <AnimatePresence>
          {phase < 0 && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream-50/70"
            >
              <span className="eyebrow hidden md:block">Role para descobrir</span>
              <span className="relative block w-px h-10 overflow-hidden bg-cream-50/20">
                <span className="absolute inset-x-0 top-0 h-1/3 bg-cream-50 animate-scroll-cue" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
