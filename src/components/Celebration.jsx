import { useEffect, useRef } from 'react'
import Mascot, { mascotStages } from './Mascot'

// The celebrations play in a fixed order, so a demo is predictable:
// a dance, a backflip, a party, then graduation for the last task.
export const MOVES = ['dance', 'backflip', 'party']

// Shown after every completed task. One click returns Emily to her path,
// where the next task is waiting.
//   kind 'task':     a regular task
//   kind 'phase':    she finished a section, and Mango grows
//   kind 'graduate': she finished everything
export default function Celebration({ kind, move, stage, fromStage, grew, finished, next, message, onClose }) {
  const buttonRef = useRef(null)
  const graduate = kind === 'graduate'
  const theme = graduate ? finished : (next ?? finished)
  const anim = graduate ? 'graduate' : move

  useEffect(() => {
    buttonRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const title = graduate ? 'You graduated from onboarding!' : kind === 'phase' ? `${finished.name}, done!` : 'Task complete!'
  const body = graduate
    ? 'You are a full-grown mango now, ripe and ready for everything BrightPath has in store.'
    : kind === 'phase'
      ? grew
        ? `Your mango is growing and ripening. Next up: ${next.name}.`
        : `Nice work. Your mango grows once every earlier section is done too. Next up: ${next.name}.`
      : message

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebrate-title"
        className="pop-enter relative w-full max-w-md rounded-3xl bg-white px-6 pb-7 pt-8 text-center"
      >
        {graduate && <p className="font-display text-xl font-extrabold text-[#8F5200]">Congratulations, Emily!</p>}
        <div className="mx-auto mt-2 grid size-48 place-items-end justify-center rounded-full pb-4" style={{ background: theme.tint }}>
          {/* Mango grows from his old size to his new one when a section is done */}
          <div
            className={kind === 'phase' && grew ? 'grow-up' : ''}
            style={{
              '--from': mascotStages[fromStage ?? stage]?.scale ?? 1,
              transform: `scale(${mascotStages[stage]?.scale ?? 1})`,
              transformOrigin: 'bottom center',
            }}
          >
            <div className={`burst-${anim}`}>
              <Mascot stage={stage} mood="cheer" hat={graduate ? 'grad' : anim === 'party' ? 'party' : 'none'} size={140} />
            </div>
          </div>
        </div>
        <h2 id="celebrate-title" className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">{body}</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="btn-chunky mt-6 w-full rounded-2xl py-3 font-display text-xl font-bold text-white"
          style={{ background: theme.deep, '--btn-deep': '#1f3a2a' }}
        >
          {graduate ? 'Thanks, Mango!' : 'Back to my path'}
        </button>
      </div>
    </div>
  )
}
