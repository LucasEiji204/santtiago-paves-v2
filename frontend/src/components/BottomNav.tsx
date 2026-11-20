import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Icon } from './Icon'

interface NavItem {
  to: string
  icon: string
  label: string
  isActive: (pathname: string, hash: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: 'home', label: 'Início', isActive: (p, h) => p === '/' && h !== '#favoritos' },
  { to: '/cardapio', icon: 'restaurant_menu', label: 'Cardápio', isActive: (p) => p === '/cardapio' || p.startsWith('/produto/') },
  { to: '/#favoritos', icon: 'favorite', label: 'Favoritos', isActive: (p, h) => p === '/' && h === '#favoritos' },
  { to: '/carrinho', icon: 'shopping_bag', label: 'Sacola', isActive: (p) => p === '/carrinho' || p === '/finalizar' },
]

export function BottomNav() {
  const { pathname, hash } = useLocation()
  const { itemCount } = useCart()

  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed bottom-0 left-0 w-full z-[60] flex justify-around items-center px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden bg-surface-container shadow-[0_-4px_20px_0_rgba(74,49,45,0.06)] rounded-t-xl"
    >
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(pathname, hash)
        const showBadge = item.to === '/carrinho' && itemCount > 0

        return (
          <Link key={item.label} to={item.to} aria-current={active ? 'page' : undefined} className="rounded-full">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
                active
                  ? 'bg-primary text-on-primary rounded-full px-4 py-1 shadow-md'
                  : 'text-on-surface-variant hover:bg-primary-container/10 px-3 py-1 rounded-lg'
              }`}
            >
              <Icon name={item.icon} filled={active} />
              <span className="font-label-sm text-[11px] mt-0.5">
                {item.label}
                {showBadge && <span className="sr-only">, {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>}
              </span>
              {showBadge && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 right-1 bg-caramel-deep text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-bold"
                >
                  {itemCount}
                </span>
              )}
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
