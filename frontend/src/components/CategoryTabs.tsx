import { motion } from 'framer-motion'
import { useRef, type KeyboardEvent } from 'react'
import type { Category } from '../data/products'
import { CATEGORIES, categoryTabId } from '../data/products'

interface CategoryTabsProps {
  active: Category
  onChange: (category: Category) => void
  /** id do painel que as abas controlam (para leitores de tela). */
  panelId: string
}

export function CategoryTabs({ active, onChange, panelId }: CategoryTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // Setas esquerda/direita, Home e End navegam entre as abas.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (index + 1) % CATEGORIES.length
    if (e.key === 'ArrowLeft') next = (index - 1 + CATEGORIES.length) % CATEGORIES.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = CATEGORIES.length - 1
    if (next === null) return
    e.preventDefault()
    onChange(CATEGORIES[next])
    refs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Categorias do cardápio"
      className="flex gap-8 overflow-x-auto no-scrollbar py-2 border-b border-surface-variant/30"
    >
      {CATEGORIES.map((category, index) => {
        const isActive = category === active
        return (
          <button
            key={category}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="tab"
            id={categoryTabId(category)}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(category)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className="relative font-label-md whitespace-nowrap transition-colors pb-2 rounded"
          >
            <span className={isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}>
              {category}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-container rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
