import { motion } from 'framer-motion'
import type { Product } from '../data/products'
import { productToCartParams } from '../data/products'
import { useCart } from '../context/CartContext'
import { useTemporaryFlag } from '../hooks/useTemporaryFlag'
import { Icon } from './Icon'

interface QuickAddButtonProps {
  product: Product
  size?: 'md' | 'lg'
}

/** Botão "+" que adiciona 1 unidade do produto (sem adicionais) ao carrinho. */
export function QuickAddButton({ product, size = 'lg' }: QuickAddButtonProps) {
  const { addItem } = useCart()
  const [added, flashAdded] = useTemporaryFlag(2000)

  const handleAdd = () => {
    addItem(productToCartParams(product))
    flashAdded()
  }

  const dimensions = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'

  return (
    <>
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={handleAdd}
      aria-label={added ? `${product.name} adicionado à sacola` : `Adicionar ${product.name} à sacola`}
      className={`${dimensions} relative z-10 rounded-full text-white flex items-center justify-center shadow-md transition-colors duration-300 ${
        added ? 'bg-pistachio-deep' : 'bg-primary-container hover:bg-primary'
      }`}
    >
      <motion.span
        key={added ? 'check' : 'add'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500 }}
        className="flex"
      >
        <Icon name={added ? 'check' : 'add'} />
      </motion.span>
    </motion.button>
    <span className="sr-only" role="status">
      {added ? `${product.name} adicionado à sacola` : ''}
    </span>
    </>
  )
}
