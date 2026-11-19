import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { formatCurrency } from '../utils/format'
import { QuickAddButton } from './QuickAddButton'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="relative bg-surface-container-lowest rounded-xl overflow-hidden card-shadow group transition-all duration-300 focus-within:ring-2 focus-within:ring-caramel-deep"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={600}
          height={450}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-4 right-4 text-label-sm px-3 py-1 rounded-full backdrop-blur-sm bg-pistachio-accent/95 text-primary">
            {product.badge}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-headline-sm text-primary">
            {/* O link cobre o card inteiro (::after), mas só o nome é lido como texto do link. */}
            <Link
              to={`/produto/${product.id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {product.name}
            </Link>
          </h3>
          <span className="font-headline-sm text-caramel-deep whitespace-nowrap">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="text-on-surface-variant font-body-md line-clamp-2">{product.description}</p>
        <div className="flex justify-end mt-4">
          <QuickAddButton product={product} />
        </div>
      </div>
    </motion.article>
  )
}
