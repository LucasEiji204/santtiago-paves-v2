interface IconProps {
  name: string
  className?: string
  filled?: boolean
}

/**
 * Ícone do Material Symbols. É decorativo (aria-hidden): o botão ou link
 * que o contém deve ter um texto visível ou um aria-label.
 */
export function Icon({ name, className = '', filled = false }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${filled ? 'material-symbols-filled' : ''} ${className}`}
    >
      {name}
    </span>
  )
}
