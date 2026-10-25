import { Clock } from 'lucide-react'
import Mascot, { mascotStages } from './Mascot'
import { dueLabel, formatMinutes, isOverdue, phaseById } from '../lib/progress'

export default function FocusCard({ task, status, stage, graduated, mood, message, hopKey, onShow, onOpen }) {
  const phase = task ? phaseById(task.phase) : null
  const overdue = task && isOverdue(task, status)
  const scale = mascotStages[stage]?.scale ?? 1

  return (
    <section aria-label="What to focus on" className="flex items-end gap-3 md:gap-5">
      {/* Fixed-size spot so the card doesn't shift as the mango grows */}
      <div className="flex w-16 shrink-0 justify-center sm:w-[110px]">
        <div className="mascot-grow" style={{ transform: `scale(${scale})` }}>
          <div key={hopKey} className={hopKey ? 'mascot-hop' : ''}>
            <Mascot stage={stage} mood={mood} hat={graduated ? 'grad' : 'none'} size={110} className="h-auto w-16 sm:w-[110px]" />
          </div>
        </div>
      </div>

      <div className="relative mb-4 flex-1 rounded-3xl border-2 border-line bg-white p-4 md:p-5">
        {/* speech-bubble tail */}
        <span
          aria-hidden
          className="absolute -left-[11px] bottom-6 size-5 rotate-45 border-b-2 border-l-2 border-line bg-white"
        />
        <p className="font-display text-lg font-bold leading-snug text-ink sm:text-xl md:text-2xl" aria-live="polite">
          {message}
        </p>

        {task && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center" style={{ background: phase.tint }}>
            <button type="button" onClick={() => onOpen(task.id)} className="flex-1 rounded-xl text-left">
              <span className="block text-sm font-bold" style={{ color: phase.deep }}>
                {overdue ? 'Start with this one' : 'Up next'}
              </span>
              <span className="block font-display text-lg font-bold leading-tight text-ink hover:underline">{task.title}</span>
              <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-ink-soft">
                <span className={overdue ? 'font-bold text-alert' : ''}>{dueLabel(task, status)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden /> About {formatMinutes(task.minutes)}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onShow(task.id)}
              className="btn-chunky shrink-0 rounded-2xl px-5 py-2.5 font-display text-lg font-bold text-white"
              style={{ background: phase.deep, '--btn-deep': '#1f3a2a' }}
            >
              Show me where
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
