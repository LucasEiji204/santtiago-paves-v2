export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara de telefone: (18) 99731-4496 ou (18) 3222-1234 */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Máscara de CEP: 19000-000 */
export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function isValidPhone(value: string): boolean {
  const len = onlyDigits(value).length
  return len === 10 || len === 11
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8
}
