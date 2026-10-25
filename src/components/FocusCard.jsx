import { Clock } from 'lucide-react'
import Mascot from './Mascot'
import { dueLabel, formatMinutes, isOverdue, phaseById } from '../lib/progress'

export default function FocusCard({ task, status, mascotPhase, mood, message, hopKey, onOpen }) {
  const phase = task ? phaseById(task.phase) : mascotPhase
  const overdue = task && isOverdue(task, status)

  return (
    <section aria-label="What to focus on" className="flex items-end gap-3 md:gap-5">
      <div key={hopKey} className={hopKey ? 'mascot-hop shrink-0' : 'shrink-0'}>
        <Mascot phase={mascotPhase} mood={mood} size={104} className="h-auto w-16 sm:w-[104px]" />
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
            <div className="flex-1">
              <div className="text-sm font-bold" style={{ color: phase.deep }}>
                {overdue ? 'Start with this one' : 'Up next'}
              </div>
              <div className="font-display text-lg font-bold leading-tight text-ink">{task.title}</div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-ink-soft">
                <span className={overdue ? 'font-bold text-alert' : ''}>{dueLabel(task, status)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden /> About {formatMinutes(task.minutes)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpen(task.id)}
              className="btn-chunky rounded-2xl px-5 py-2.5 font-display text-lg font-bold text-white"
              style={{ background: phase.deep, '--btn-deep': '#1f3a2a' }}
            >
              {status === 'in_progress' ? 'Continue' : 'Start task'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
