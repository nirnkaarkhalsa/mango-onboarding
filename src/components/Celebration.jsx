import { useEffect, useRef } from 'react'
import Mascot from './Mascot'

// Shown when Emily finishes a whole phase (the mango grows and ripens),
// or her last task (the mango graduates).
export default function Celebration({ kind, stage, grew, finished, next, onContinue, onClose }) {
  const buttonRef = useRef(null)
  const graduate = kind === 'graduate'
  const theme = next ?? finished

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
        {graduate && (
          <p className="font-display text-xl font-extrabold text-[#8F5200]">Congratulations, Emily!</p>
        )}
        <div className="mx-auto mt-2 w-fit rounded-full p-4" style={{ background: theme.tint }}>
          <div className="burst-dance">
            <Mascot
              stage={graduate ? 'month' : stage}
              mood="cheer"
              hat={graduate ? 'grad' : 'none'}
              size={140}
            />
          </div>
        </div>
        <h2 id="celebrate-title" className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink">
          {graduate ? 'You graduated from onboarding!' : `${finished.name}, done!`}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">
          {graduate
            ? 'You are a full-grown mango now, ripe and ready for everything BrightPath has in store.'
            : grew
              ? `Your mango is growing and ripening. Next up: ${next.name}. ${next.blurb}`
              : `You're all caught up on ${finished.name}. Next up: ${next.name}.`}
        </p>
        <button
          ref={buttonRef}
          type="button"
          onClick={graduate ? onClose : onContinue}
          className="btn-chunky mt-6 w-full rounded-2xl py-3 font-display text-xl font-bold text-white"
          style={{ background: theme.deep, '--btn-deep': '#1f3a2a' }}
        >
          {graduate ? 'Thanks, Mango!' : `Start ${next.name}`}
        </button>
      </div>
    </div>
  )
}
