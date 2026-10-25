import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, subtitle, onClose, children, tint = '#F6FAF2', labelId = 'modal-title' }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="sheet-enter relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white md:max-w-xl md:rounded-3xl"
      >
        <div className="relative px-6 pb-4 pt-6" style={{ background: tint }}>
          <h2 id={labelId} className="pr-10 font-display text-2xl font-bold leading-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-ink-soft hover:bg-white/70"
            aria-label="Close"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-6 pb-7 pt-5">{children}</div>
      </div>
    </div>
  )
}

export const fieldClass =
  'mt-1 w-full rounded-xl border-2 border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-[#3E9B4F]'
export const labelClass = 'block text-sm font-extrabold text-ink'
