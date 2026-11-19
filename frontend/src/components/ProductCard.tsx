import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { formatCurrency } from '../utils/format'
import { QuickAddButton } from './QuickAddButton'

interface ProductCardProps {
  product: Product
  index?: number
  /** Anima quando o card entra na tela (em vez de ao carregar a página). */
  inView?: boolean
}

export function ProductCard({ product, index = 0, inView = false }: ProductCardProps) {
  const delay = Math.min(index, 6) * 0.08
  const animation = inView
    ? {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <motion.article
      {...animation}
      className="relative flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden border border-line/80 card-shadow group transition-shadow duration-500 hover:shadow-[var(--shadow-raised)] focus-within:ring-2 focus-within:ring-caramel-deep"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative bg-surface-container">
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 eyebrow text-[10px] px-3 py-1.5 rounded-full bg-cream-50/95 text-ink backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6 gap-3">
        <h3 className="font-serif text-[22px] leading-tight font-normal tracking-[-0.01em] text-ink">
          {/* O link cobre o card inteiro (::after), mas só o nome é lido como texto do link. */}
          <Link to={`/produto/${product.id}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="text-ink-soft text-[15px] leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-line/70">
          <span className="price text-lg font-medium text-ink">{formatCurrency(product.price)}</span>
          <QuickAddButton product={product} size="md" />
        </div>
      </div>
    </motion.article>
  )
}
