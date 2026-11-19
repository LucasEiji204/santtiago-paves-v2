import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  label: string
  error?: string
  hint?: string
  className?: string
}

export function TextField({ label, error, hint, className = '', required, ...inputProps }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="font-label-md text-on-surface-variant ml-1 block">
        {label}
        {required && <span className="text-error" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-4 text-on-surface placeholder:text-outline outline-none transition-colors focus-visible:border-caramel-deep ${
          error ? 'border-error' : 'border-transparent'
        }`}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="text-label-sm text-on-surface-variant ml-1">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-label-sm text-error ml-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
