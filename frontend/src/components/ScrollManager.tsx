import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ao trocar de página, volta ao topo. Se o link tiver âncora (#favoritos),
 * rola até a seção — esperando a transição de página terminar.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0
    let timer: number | undefined

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (attempts++ < 20) timer = window.setTimeout(tryScroll, 50)
    }
    tryScroll()

    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}
