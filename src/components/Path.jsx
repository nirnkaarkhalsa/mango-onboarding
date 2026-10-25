import { Check, Clock, PartyPopper } from 'lucide-react'
import { phases } from '../data/onboarding'
import Mascot from './Mascot'
import { dueLabel, formatMinutes, isOverdue } from '../lib/progress'
import { typeIcons } from './icons'

const ZIGZAG = [0, -1, -1.5, -1, 0, 1, 1.5, 1]

export default function Path({ tasks, state, stats, currentId, flashId, onOpen }) {
  let index = 0
  const doneAll = stats.reduce((n, x) => n + x.done, 0)
  const totalAll = stats.reduce((n, x) => n + x.total, 0)
  const graduated = doneAll === totalAll

  return (
    <div className="flex flex-col gap-10">
      {phases.map((phase, p) => {
        const list = tasks.filter((t) => t.phase === phase.id).sort((a, b) => a.due.localeCompare(b.due))
        const { done, total } = stats[p]
        const complete = done === total

        return (
          <section key={phase.id} aria-labelledby={`phase-${phase.id}`}>
            <header
              className="flex items-center gap-4 rounded-3xl px-5 py-4 md:px-6"
              style={{ background: phase.banner, color: phase.onBanner }}
            >
              <div className="flex-1">
                <div className="text-sm font-bold opacity-85">
                  Section {p + 1} of {phases.length}
                </div>
                <h2 id={`phase-${phase.id}`} className="font-display text-2xl font-bold leading-tight">
                  {phase.name}
                </h2>
                <p className="text-sm font-semibold opacity-85">{phase.blurb}</p>
              </div>
              <div className="shrink-0 text-right">
                {complete ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-sm font-extrabold">
                    <PartyPopper size={16} aria-hidden /> Complete
                  </span>
                ) : (
                  <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-extrabold">
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
                    flash={task.id === flashId}
                    off={off}
                    onOpen={onOpen}
                  />
                )
              })}
            </ol>
          </section>
        )
      })}

      {/* The finish line: a ghost of the graduated mango, as a teaser of what Emily is working toward */}
      <section aria-label="Finish line" className="flex flex-col items-center pb-4 pt-2 text-center">
        <div className="mb-3 flex flex-col items-center gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-stone-deep" />
          ))}
        </div>
        <div
          className="transition-[opacity,filter] duration-700"
          style={{ opacity: graduated ? 1 : 0.32, filter: graduated ? 'none' : 'saturate(0.6)' }}
        >
          <Mascot stage="month" hat="grad" mood={graduated ? 'cheer' : 'happy'} size={150} />
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">{graduated ? 'You graduated!' : 'Your finish line'}</h2>
        <p className="mt-1 max-w-md text-ink-soft">
          {graduated
            ? 'Every task is done. Mango is fully grown, and so are you.'
            : `Finish all ${totalAll} tasks and Mango graduates with you. ${totalAll - doneAll} to go.`}
        </p>
      </section>
    </div>
  )
}

function PathStep({ task, phase, status, current, flash, off, onOpen }) {
  const Icon = typeIcons[task.type]
  const done = status === 'done'
  const inProgress = status === 'in_progress'
  const overdue = isOverdue(task, status)
  const upcoming = !done && !current && !inProgress

  // Done tasks are full color. Everything else is a light "ghost" of its
  // phase color, so finished work visibly fills in as Emily goes.
  const ghost = {
    bg: phase.tint,
    deep: `color-mix(in srgb, ${phase.color} 38%, ${phase.tint})`,
    fg: `color-mix(in srgb, ${phase.color} 60%, transparent)`,
  }
  let look
  if (done) look = { bg: phase.color, deep: phase.deep, fg: phase.on, border: 'transparent' }
  else if (current) look = { ...ghost, fg: phase.deep, border: phase.color, borderStyle: 'solid' }
  else if (inProgress) look = { ...ghost, fg: phase.deep, border: phase.color, borderStyle: 'dashed' }
  else look = { ...ghost, border: 'transparent' }

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
          id={`stone-${task.id}`}
          onClick={() => onOpen(task.id)}
          className={`stone ${current ? 'is-current' : ''} ${flash ? 'stone-flash' : ''}`}
          style={{
            '--stone-bg': look.bg,
            '--stone-deep': look.deep,
            '--stone-fg': look.fg,
            '--ring': `color-mix(in srgb, ${phase.color} 40%, transparent)`,
            borderColor: look.border,
            borderStyle: look.borderStyle ?? 'solid',
          }}
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
