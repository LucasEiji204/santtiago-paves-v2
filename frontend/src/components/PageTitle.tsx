import { STORE } from '../config'

/** Define o título da aba do navegador (React 19 leva o <title> para o <head>). */
export function PageTitle({ title }: { title?: string }) {
  return <title>{title ? `${title} | ${STORE.name}` : `${STORE.name} | ${STORE.tagline}`}</title>
}
