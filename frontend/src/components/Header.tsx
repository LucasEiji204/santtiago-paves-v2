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
}

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/#historia', label: 'Nossa História' },
  { to: '/#favoritos', label: 'Favoritos' },
  { to: '/cardapio', label: 'Cardápio' },
  { to: '/#contato', label: 'Contato' },
]

export function Header({ showBack, showMenu, showNav, subtitle }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

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
      className="bg-background/80 backdrop-blur-md w-full sticky top-0 z-50"
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex items-center gap-4 min-w-10">
          {showBack ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              aria-label="Voltar"
              className="text-primary hover:opacity-80 transition-opacity p-1 -m-1 rounded-full"
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
              className="text-primary text-2xl hover:opacity-80 transition-opacity md:hidden p-1 -m-1 rounded-full"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </motion.button>
          ) : null}
        </div>

        <Link
          to="/"
          className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary tracking-tight"
        >
          {STORE.name}
        </Link>

        <div className="flex items-center gap-4 min-w-10 justify-end">
          {showNav && (
            <nav aria-label="Principal" className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.filter((l) => l.to !== '/cardapio').map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`hover:opacity-80 transition-opacity ${
                    link.to === '/' ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {subtitle && (
            <span className="hidden md:block text-on-surface-variant font-label-md">{subtitle}</span>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/carrinho')}
            aria-label={cartLabel}
            className="relative text-primary hover:opacity-80 transition-opacity p-1 -m-1 rounded-full"
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
            className="md:hidden overflow-hidden border-t border-surface-variant/50 bg-background"
          >
            <ul className="flex flex-col px-margin-mobile py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-body-lg text-primary hover:text-caramel-deep transition-colors"
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
