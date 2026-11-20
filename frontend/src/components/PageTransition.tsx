import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useState, type ReactNode } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { ScrollManager } from './ScrollManager'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Congela a página no momento em que ela aparece. Sem isso, durante a
 * animação de saída a página antiga já mostraria o conteúdo da nova rota.
 */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status">
      <span className="sr-only">Carregando…</span>
      <div className="w-8 h-8 rounded-full border-2 border-caramel-deep border-t-transparent animate-spin motion-reduce:animate-none" />
    </div>
  )
}

export function Layout() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Pular para o conteúdo
      </a>
      <ScrollManager />
      <PageTransition>
        <Suspense fallback={<PageFallback />}>
          <FrozenOutlet />
        </Suspense>
      </PageTransition>
    </>
  )
}
