/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Número do WhatsApp que recebe os pedidos, só dígitos com DDI e DDD (ex.: 5511999999999). */
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
