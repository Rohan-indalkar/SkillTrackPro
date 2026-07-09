import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => remove(id), 3500)
    },
    [remove]
  )

  const toast = {
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="position-fixed d-flex flex-column gap-2"
        style={{ bottom: 20, right: 20, zIndex: 2000, maxWidth: 340 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="st-card d-flex align-items-start gap-2"
            style={{
              padding: '0.75rem 1rem',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `3px solid ${t.type === 'error' ? 'var(--red)' : t.type === 'info' ? 'var(--ink-muted)' : 'var(--success)'}`,
              animation: 'st-toast-in 0.2s ease',
            }}
          >
            <i
              className={`bi ${t.type === 'error' ? 'bi-x-circle' : t.type === 'info' ? 'bi-info-circle' : 'bi-check-circle'}`}
              style={{ color: t.type === 'error' ? 'var(--red)' : t.type === 'info' ? 'var(--ink-muted)' : 'var(--success)', marginTop: 2 }}
            />
            <span style={{ fontSize: '0.85rem' }}>{t.message}</span>
            <button
              className="btn-close btn-close-sm ms-auto"
              style={{ fontSize: '0.65rem' }}
              onClick={() => remove(t.id)}
              aria-label="Dismiss"
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
