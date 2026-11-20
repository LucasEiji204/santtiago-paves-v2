import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Um booleano que volta a `false` sozinho depois de `duration` ms.
 * O timer é limpo se o componente sair da tela antes.
 */
export function useTemporaryFlag(duration = 2000) {
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trigger = useCallback(
    (onEnd?: () => void) => {
      window.clearTimeout(timer.current)
      setActive(true)
      timer.current = window.setTimeout(() => {
        setActive(false)
        onEnd?.()
      }, duration)
    },
    [duration],
  )

  return [active, trigger] as const
}
