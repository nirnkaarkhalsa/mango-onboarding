import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import Modal from './Modal'
import { phases } from '../data/onboarding'
import { dueLabel, formatDate, formatMinutes, isOverdue } from '../lib/progress'
import { typeIcons } from './icons'

// Opens from the progress rings: every task, grouped by section, filterable
// by what's done and what's still to do.
export default function ProgressDetail({ tasks, state, initialPhase = 'all', onOpenTask, onClose }) {
  const [section, setSection] = useState(initialPhase)
  const [show, setShow] = useState('all')

  const inSection = tasks.filter((t) => section === 'all' || t.phase === section)
  const isDone = (t) => state[t.id]?.status === 'done'
  const counts = { all: inSection.length, todo: inSection.filter((t) => !isDone(t)).length, done: inSection.filter(isDone).length }
  const visible = inSection.filter((t) => show === 'all' || (show === 'done' ? isDone(t) : !isDone(t)))
  const shownPhases = phases.filter((p) => section === 'all' || p.id === section)

  return (
    <Modal title="All your tasks" subtitle={`${counts.done} of ${counts.all} done${section === 'all' ? '' : ` in ${phases.find((p) => p.id === section).name}`}.`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Section">
          {[{ id: 'all', name: 'All sections' }, ...phases].map((p) => (
            <Chip key={p.id} active={section === p.id} onClick={() => setSection(p.id)} dot={p.color}>
              {p.name}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show">
          <Chip active={show === 'todo'} onClick={() => setShow('todo')}>
            To do {counts.todo}
          </Chip>
          <Chip active={show === 'done'} onClick={() => setShow('done')}>
            Done {counts.done}
          </Chip>
          <Chip active={show === 'all'} onClick={() => setShow('all')}>
            Everything {counts.all}
          </Chip>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {shownPhases.map((phase) => {
          const list = visible.filter((t) => t.phase === phase.id).sort((a, b) => a.due.localeCompare(b.due))
          const all = tasks.filter((t) => t.phase === phase.id)
          const doneHere = all.filter(isDone).length
          return (
            <section key={phase.id} aria-label={phase.name}>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <span className="inline-block size-3 rounded-full" style={{ background: phase.color }} aria-hidden />
                {phase.name}
                <span className="font-sans text-sm font-bold text-ink-soft">
                  {doneHere} of {all.length} done
                </span>
              </h3>
              {list.length === 0 ? (
                <p className="mt-1 text-sm text-ink-soft">{show === 'todo' ? 'Nothing left here.' : 'Nothing done here yet.'}</p>
              ) : (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {list.map((t) => {
                    const done = isDone(t)
                    const overdue = isOverdue(t, state[t.id]?.status)
                    const Icon = typeIcons[t.type]
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => onOpenTask(t.id)}
                          className="flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left hover:border-stone-deep"
                          style={{ borderColor: overdue ? 'var(--color-alert)' : 'var(--color-line)' }}
                        >
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-full"
                            style={done ? { background: phase.color, color: phase.on } : { background: phase.tint, color: phase.deep }}
                            aria-hidden
                          >
                            {done ? <Check size={18} strokeWidth={3.5} /> : <Icon size={17} strokeWidth={2.5} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold leading-tight text-ink">{t.title}</span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-ink-soft">
                              <span className={overdue ? 'font-bold text-alert' : done ? 'font-bold' : ''} style={done ? { color: phase.deep } : undefined}>
                                {done ? `Done ${formatDate(state[t.id].completedAt)}` : dueLabel(t, state[t.id]?.status)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} aria-hidden /> {formatMinutes(t.minutes)}
                              </span>
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
        })}
      </div>
    </Modal>
  )
}

function Chip({ active, onClick, dot, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-extrabold"
      style={active ? { borderColor: '#1f3a2a', background: '#1f3a2a', color: '#fff' } : { borderColor: 'var(--color-line)', background: '#fff', color: 'var(--color-ink-soft)' }}
    >
      {dot && <span className="inline-block size-2 rounded-full" style={{ background: dot }} aria-hidden />}
      {children}
    </button>
  )
}
