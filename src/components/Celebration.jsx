import { useEffect, useRef } from 'react'
import Mascot from './Mascot'

// Shown when Emily finishes a whole phase. The mascot takes on the next
// phase's color: the mango is ripening.
export default function Celebration({ finished, next, onClose }) {
  const buttonRef = useRef(null)
  const color = next ?? finished

  useEffect(() => {
    buttonRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebrate-title"
        className="pop-enter relative w-full max-w-md rounded-3xl bg-white px-6 pb-7 pt-8 text-center"
      >
        <div className="mx-auto w-fit rounded-full p-4" style={{ background: color.tint }}>
          <Mascot phase={color} mood="cheer" size={132} className="mascot-hop" />
        </div>
        <h2 id="celebrate-title" className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink">
          {next ? `${finished.name}, done!` : 'You finished onboarding!'}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">
          {next
            ? `Your mango is ripening. Next up: ${next.name}. ${next.blurb}`
            : 'Your mango is fully ripe. Welcome to BrightPath, for real this time.'}
        </p>
        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="btn-chunky mt-6 w-full rounded-2xl py-3 font-display text-xl font-bold text-white"
          style={{ background: color.deep, '--btn-deep': '#1f3a2a' }}
        >
          {next ? `Start ${next.name}` : 'Celebrate'}
        </button>
      </div>
    </div>
  )
}
