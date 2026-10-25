import { useEffect, useRef, useState } from 'react'
import { AtSign, Calendar, ChevronDown, CircleCheck, Clock, ExternalLink, Hash, MapPin, Phone, User, X } from 'lucide-react'
import { owners } from '../data/onboarding'
import { formatDate, formatMinutes, isOverdue, phaseById, relativeDue } from '../lib/progress'
import { typeIcons } from './icons'

export default function TaskDetail({ task, entry, nextTask, onClose, onToggleDone, onOpenNext }) {
  const phase = phaseById(task.phase)
  const owner = owners[task.owner]
  const Icon = typeIcons[task.type]
  const done = entry?.status === 'done'
  const overdue = isOverdue(task, entry?.status)
  const closeRef = useRef(null)
  const [note, setNote] = useState(null)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center md:p-6">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-title"
        className="sheet-enter relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white md:max-w-2xl md:rounded-3xl"
      >
        {/* Header band in the phase color */}
        <div className="relative px-6 pb-5 pt-6" style={{ background: phase.tint }}>
          <div className="flex items-start gap-4">
            <div
              className="grid size-14 shrink-0 place-items-center rounded-2xl"
              style={{ background: phase.color, color: phase.on, boxShadow: `0 4px 0 ${phase.deep}` }}
            >
              <Icon size={28} strokeWidth={2.5} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 pr-8 sm:pr-44">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold" style={{ color: phase.deep }}>
                <span>{phase.name}</span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-extrabold text-ink-soft">{task.type}</span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-extrabold text-ink-soft">{task.tag}</span>
              </div>
              <h2 id="task-title" className="mt-1 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
                {task.title}
              </h2>
            </div>
          </div>

          {/* "Task completed?" box in the corner. Once done, it becomes the way forward. */}
          {done ? (
            <div className="mt-4 flex flex-col items-stretch gap-1.5 sm:absolute sm:right-16 sm:top-6 sm:mt-0 sm:items-end">
              <NextButton nextTask={nextTask} onOpenNext={onOpenNext} onClose={onClose} />
              <span className="flex items-center justify-center gap-1.5 text-sm font-bold" style={{ color: phase.deep }}>
                <CircleCheck size={16} strokeWidth={2.75} aria-hidden /> Completed
              </span>
            </div>
          ) : (
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-white px-4 py-2.5 sm:absolute sm:right-16 sm:top-6 sm:mt-0">
              <span className="text-sm font-extrabold text-ink">Task completed?</span>
              <input
                type="checkbox"
                checked={false}
                onChange={(e) => onToggleDone(task.id, e.target.checked)}
                className="size-6 cursor-pointer rounded-md"
                style={{ accentColor: phase.deep }}
              />
              <span className="text-sm font-bold text-ink-soft">Yes</span>
            </label>
          )}

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-ink-soft hover:bg-white/70"
            aria-label="Close task"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pb-7 pt-5">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <Meta icon={Calendar} label="Due">
              <span className={overdue ? 'font-extrabold text-alert' : ''}>
                {done ? `Completed ${formatDate(entry.completedAt)}` : `${formatDate(task.due)}`}
              </span>
              {!done && <span className={`block ${overdue ? 'text-alert' : 'text-ink-soft'}`}>{relativeDue(task)}</span>}
            </Meta>
            <Meta icon={Clock} label="Takes about">
              {formatMinutes(task.minutes)}
            </Meta>
            <Meta icon={User} label="Questions?">
              <button
                type="button"
                onClick={() => setShowContact((v) => !v)}
                aria-expanded={showContact}
                aria-controls="contact-card"
                className="flex items-center gap-1 font-bold underline decoration-2 underline-offset-2"
                style={{ textDecorationColor: phase.color }}
              >
                {owner.name}
                <ChevronDown size={16} strokeWidth={2.75} className={`transition-transform ${showContact ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              <span className="block font-normal text-ink-soft">{owner.title}</span>
            </Meta>
          </dl>

          {showContact && (
            <div id="contact-card" className="pop-enter mt-3 rounded-2xl border-2 p-4" style={{ borderColor: phase.tint }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-full font-display text-lg font-bold"
                    style={{ background: phase.tint, color: phase.deep }}
                    aria-hidden
                  >
                    {owner.name === 'IT Help Desk' ? 'IT' : owner.name[0]}
                  </span>
                  <div className="leading-tight">
                    <div className="font-extrabold text-ink">{owner.name}</div>
                    <div className="text-sm text-ink-soft">{owner.title}</div>
                  </div>
                </div>
                <a
                  href={`mailto:${owner.email}?subject=${encodeURIComponent(`Question about: ${task.title}`)}`}
                  className="btn-chunky rounded-xl px-4 py-2 font-display font-bold text-white"
                  style={{ background: phase.deep, '--btn-deep': '#1f3a2a' }}
                >
                  Email {owner.name === 'IT Help Desk' ? 'IT' : owner.name}
                </a>
              </div>
              <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <ContactRow icon={AtSign} label="Email">{owner.email}</ContactRow>
                <ContactRow icon={Hash} label="Slack">{owner.slack}</ContactRow>
                <ContactRow icon={Phone} label="Phone">{owner.phone}</ContactRow>
                <ContactRow icon={MapPin} label="Find them">{owner.where}</ContactRow>
              </ul>
              <p className="mt-3 text-sm text-ink-soft">{owner.hours}.</p>
            </div>
          )}

          <p className="mt-5 max-w-prose text-base leading-relaxed text-ink">{task.summary}</p>

          <h3 className="mt-6 font-display text-lg font-bold text-ink">What to do</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {task.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white"
                  style={{ background: phase.deep }}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed text-ink">{step}</span>
              </li>
            ))}
          </ol>

          {task.resources.length > 0 && (
            <>
              <h3 className="mt-6 font-display text-lg font-bold text-ink">Links and documents</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {task.resources.map((r) => (
                  <li key={r.label}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setNote(r.label)
                      }}
                      className="flex items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 py-3 hover:border-stone-deep"
                    >
                      <span>
                        <span className="font-bold text-ink">{r.label}</span>
                        <span className="ml-2 text-sm text-ink-soft">{r.kind}</span>
                      </span>
                      <ExternalLink size={18} className="shrink-0 text-ink-soft" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
              {note && (
                <p className="mt-2 text-sm text-ink-soft" role="status">
                  "{note}" is a sample link. In the real portal it would open the document from BrightPath's HR system.
                </p>
              )}
            </>
          )}

          {done ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <NextButton nextTask={nextTask} onOpenNext={onOpenNext} onClose={onClose} wide />
              <button
                type="button"
                onClick={() => onToggleDone(task.id, false)}
                className="text-sm font-bold text-ink-soft underline-offset-2 hover:underline"
              >
                Not done yet? Undo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onToggleDone(task.id, true)}
              className="btn-chunky mt-8 w-full rounded-2xl py-3 font-display text-xl font-bold text-white"
              style={{ background: phase.deep, '--btn-deep': '#1f3a2a' }}
            >
              Mark as complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function NextButton({ nextTask, onOpenNext, onClose, wide }) {
  const next = nextTask ? phaseById(nextTask.phase) : null
  if (!nextTask) {
    return (
      <button
        type="button"
        onClick={onClose}
        className={`btn-chunky rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white ${wide ? 'w-full py-3 text-xl' : ''}`}
        style={{ '--btn-deep': '#1f3a2a' }}
      >
        Back to my path
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onOpenNext(nextTask.id)}
      className={`btn-chunky rounded-2xl px-5 font-display font-bold text-white ${wide ? 'w-full py-3 text-center' : 'py-2.5 text-left'}`}
      style={{ background: next.deep, '--btn-deep': '#1f3a2a' }}
      aria-label={`Next task: ${nextTask.title}`}
    >
      <span className={`block leading-tight ${wide ? 'text-xl' : 'text-lg'}`}>Next task</span>
      {wide && <span className="block text-sm font-semibold opacity-90">{nextTask.title}</span>}
    </button>
  )
}

function ContactRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2">
      <Icon size={16} className="shrink-0 text-ink-soft" aria-hidden />
      <span className="sr-only">{label}: </span>
      <span className="truncate font-bold text-ink">{children}</span>
    </li>
  )
}

function Meta({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-2.5 rounded-2xl bg-paper px-3 py-2.5">
      <Icon size={18} className="mt-0.5 shrink-0 text-ink-soft" aria-hidden />
      <div>
        <dt className="text-xs font-bold text-ink-soft">{label}</dt>
        <dd className="font-bold text-ink">{children}</dd>
      </div>
    </div>
  )
}
