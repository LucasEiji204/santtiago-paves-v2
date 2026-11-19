import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useCart } from '../context/CartContext'
import { STORE } from '../config'

interface HeaderProps {
  showBack?: boolean
  showMenu?: boolean
  showNav?: boolean
  subtitle?: string
  /**
   * Transparente e com texto claro, por cima do vídeo da página inicial.
   * Ganha fundo sólido assim que a pessoa começa a rolar a página.
   */
  overlay?: boolean
}

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/#historia', label: 'Nossa História' },
  { to: '/#favoritos', label: 'Favoritos' },
  { to: '/cardapio', label: 'Cardápio' },
  { to: '/#contato', label: 'Contato' },
]

export function Header({ showBack, showMenu, showNav, subtitle, overlay = false }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  // No modo overlay: 'clear' no topo, 'dark' enquanto estiver sobre a abertura
  // escura da página inicial, 'light' depois dela (elemento #apos-abertura).
  const [tone, setTone] = useState<'clear' | 'dark' | 'light'>('clear')

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => {
      const y = window.scrollY
      const boundary = document.getElementById('apos-abertura')?.offsetTop ?? Infinity
      setTone(y < 24 ? 'clear' : y < boundary - 72 ? 'dark' : 'light')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [overlay])

  const style = !overlay || menuOpen || tone === 'light'
    ? 'bg-background/85 backdrop-blur-xl text-ink border-b border-line/70'
    : tone === 'dark'
      ? 'bg-cocoa-950/60 backdrop-blur-xl text-cream-50 border-b border-cream-50/10'
      : 'bg-transparent text-cream-50 border-b border-transparent'

  // Fecha o menu ao navegar e com a tecla Esc.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const goBack = () => {
    // Se a pessoa chegou direto nesta página (link compartilhado), não há
    // histórico do site para voltar: leva ao cardápio.
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/cardapio')
  }

  const cartLabel =
    itemCount > 0
      ? `Abrir sacola, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
      : 'Abrir sacola, vazia'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full top-0 z-50 transition-colors duration-500 ${overlay ? 'fixed inset-x-0' : 'sticky'} ${style}`}
    >
      <div className="max-w-container-max mx-auto flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 md:h-20">
        <div className="flex items-center gap-4 min-w-10">
          {showBack ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              aria-label="Voltar"
              className="hover:opacity-70 transition-opacity p-1 -m-1 rounded-full"
            >
              <Icon name="arrow_back" className="text-2xl" />
            </motion.button>
          ) : showMenu ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="text-2xl hover:opacity-70 transition-opacity md:hidden p-1 -m-1 rounded-full"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </motion.button>
          ) : null}
        </div>

        <Link to="/" className="font-display text-[20px] md:text-[22px] font-semibold tracking-[-0.03em] leading-none">
          {STORE.name}
        </Link>

        <div className="flex items-center gap-4 min-w-10 justify-end">
          {showNav && (
            <nav aria-label="Principal" className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.filter((l) => l.to !== '/').map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[15px] opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {subtitle && (
            <span className="hidden md:block eyebrow opacity-70">{subtitle}</span>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/carrinho')}
            aria-label={cartLabel}
            className="relative hover:opacity-70 transition-opacity p-1 -m-1 rounded-full"
          >
            <Icon name="shopping_bag" className="text-2xl" />
            {itemCount > 0 && (
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-caramel-deep text-white text-[11px] min-w-5 h-5 px-1 flex items-center justify-center rounded-full font-bold"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showMenu && menuOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-line bg-background text-ink"
          >
            <ul className="flex flex-col px-margin-mobile py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-display text-2xl hover:text-caramel-deep transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
