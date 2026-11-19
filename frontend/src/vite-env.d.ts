/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Número do WhatsApp que recebe os pedidos (ex.: 5518997314496). */
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
