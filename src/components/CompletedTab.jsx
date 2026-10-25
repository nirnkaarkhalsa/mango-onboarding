import { Check } from 'lucide-react'
import { formatDate, formatMinutes, phaseById } from '../lib/progress'

export default function CompletedTab({ tasks, state, onOpen, onGoToPath }) {
  const done = tasks
    .filter((t) => state[t.id]?.status === 'done')
    .sort((a, b) => (state[b.id].completedAt ?? '').localeCompare(state[a.id].completedAt ?? '') || b.due.localeCompare(a.due))

  return (
    <section aria-labelledby="done-title">
      <h1 id="done-title" className="font-display text-3xl font-bold text-ink">
        Completed
      </h1>
      <p className="mt-1 text-ink-soft">
        {done.length === 0
          ? 'Nothing here yet.'
          : `${done.length} ${done.length === 1 ? 'task' : 'tasks'} done. Open any of them to look at the details again.`}
      </p>

      {done.length === 0 ? (
        <button
          type="button"
          onClick={onGoToPath}
          className="btn-chunky mt-6 rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white"
          style={{ '--btn-deep': '#1f3a2a' }}
        >
          Go to your first task
        </button>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {done.map((t) => {
            const phase = phaseById(t.phase)
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onOpen(t.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border-2 border-line bg-white p-3 text-left hover:border-stone-deep"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: phase.color, boxShadow: `0 3px 0 ${phase.deep}` }}
                    aria-hidden
                  >
                    <Check size={22} strokeWidth={3.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold leading-tight text-ink">{t.title}</span>
                    <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-ink-soft">
                      <span className="font-bold" style={{ color: phase.deep }}>
                        {phase.name}
                      </span>
                      <span>Completed {formatDate(state[t.id].completedAt)}</span>
                      <span>{formatMinutes(t.minutes)}</span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
