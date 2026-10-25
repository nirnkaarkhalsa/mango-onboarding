import { Check, Clock, PartyPopper } from 'lucide-react'
import { phases } from '../data/onboarding'
import { dueLabel, formatMinutes, isOverdue } from '../lib/progress'
import { typeIcons } from './icons'

const ZIGZAG = [0, -1, -1.5, -1, 0, 1, 1.5, 1]

export default function Path({ tasks, state, stats, currentId, onOpen }) {
  let index = 0

  return (
    <div className="flex flex-col gap-10">
      {phases.map((phase, p) => {
        const list = tasks.filter((t) => t.phase === phase.id).sort((a, b) => a.due.localeCompare(b.due))
        const { done, total } = stats[p]
        const complete = done === total

        return (
          <section key={phase.id} aria-labelledby={`phase-${phase.id}`}>
            <header
              className="flex items-center gap-4 rounded-3xl px-5 py-4 text-white md:px-6"
              style={{ background: phase.deep }}
            >
              <div className="flex-1">
                <div className="text-sm font-bold opacity-90">
                  Section {p + 1} of {phases.length}
                </div>
                <h2 id={`phase-${phase.id}`} className="font-display text-2xl font-bold leading-tight">
                  {phase.name}
                </h2>
                <p className="text-sm opacity-90">{phase.blurb}</p>
              </div>
              <div className="shrink-0 text-right">
                {complete ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-extrabold">
                    <PartyPopper size={16} aria-hidden /> Complete
                  </span>
                ) : (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-extrabold">
                    {done} of {total} done
                  </span>
                )}
              </div>
            </header>

            <ol className="mt-8 flex flex-col gap-7">
              {list.map((task) => {
                const off = ZIGZAG[index++ % ZIGZAG.length]
                return (
                  <PathStep
                    key={task.id}
                    task={task}
                    phase={phase}
                    status={state[task.id]?.status}
                    current={task.id === currentId}
                    off={off}
                    onOpen={onOpen}
                  />
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}

function PathStep({ task, phase, status, current, off, onOpen }) {
  const Icon = typeIcons[task.type]
  const done = status === 'done'
  const inProgress = status === 'in_progress'
  const overdue = isOverdue(task, status)
  const upcoming = !done && !current && !inProgress

  let look
  if (done || current) look = { bg: phase.color, deep: phase.deep, fg: '#ffffff' }
  else if (inProgress) look = { bg: phase.tint, deep: phase.color, fg: phase.deep }
  else look = { bg: 'var(--color-stone)', deep: 'var(--color-stone-deep)', fg: 'var(--color-stone-icon)' }

  const statusText = done ? 'Done' : overdue ? 'Overdue' : inProgress ? 'In progress' : current ? 'Up next' : 'Coming up'

  return (
    <li className={`path-row ${off > 0 ? 'label-left' : ''} ${current ? 'mt-9' : ''}`} style={{ '--off': off }}>
      <div className="stone-wrap relative flex justify-center">
        {current && (
          <span
            className="start-bubble absolute -top-11 left-1/2 z-10 whitespace-nowrap rounded-xl border-2 border-line bg-white px-3 py-1 font-display text-sm font-extrabold"
            style={{ color: phase.deep }}
            aria-hidden
          >
            Start here
            <span className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-line bg-white" />
          </span>
        )}
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className={`stone ${current ? 'is-current' : ''}`}
          style={{ '--stone-bg': look.bg, '--stone-deep': look.deep, '--stone-fg': look.fg, '--ring': phase.tint }}
          aria-label={`${task.title}. ${statusText}. ${dueLabel(task, status)}. About ${formatMinutes(task.minutes)}.`}
        >
          {done ? <Check size={36} strokeWidth={3.5} aria-hidden /> : <Icon size={30} strokeWidth={2.5} aria-hidden />}
          {overdue && (
            <span
              className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border-[3px] border-paper bg-alert font-display text-sm font-extrabold text-white"
              aria-hidden
            >
              !
            </span>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(task.id)}
        className={`step-label rounded-xl text-left ${upcoming ? 'opacity-70' : ''}`}
        tabIndex={-1}
        aria-hidden
      >
        <div className="font-display text-lg font-bold leading-snug text-ink hover:underline">{task.title}</div>
        <div className="step-meta mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          {done ? (
            <span className="font-bold" style={{ color: phase.deep }}>
              Done
            </span>
          ) : (
            <span className={overdue ? 'font-bold text-alert' : ''}>{dueLabel(task, status)}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden />
            {formatMinutes(task.minutes)}
          </span>
          {inProgress && (
            <span className="rounded-full px-2 py-0.5 text-xs font-extrabold" style={{ background: phase.tint, color: phase.deep }}>
              In progress
            </span>
          )}
          {task.tag !== 'Company-wide' && (
            <span className="rounded-full border border-line bg-white px-2 py-0.5 text-xs font-bold text-ink-soft">
              {task.tag}
            </span>
          )}
        </div>
      </button>
    </li>
  )
}
