import { useState } from 'react'
import { ArrowLeft, Inbox } from 'lucide-react'
import { formatDate } from '../lib/progress'

const avatarColors = {
  Sarah: { bg: '#FCE6C2', fg: '#8F5200' },
  David: { bg: '#D9EED8', fg: '#2B7539' },
  'IT Help Desk': { bg: '#E6EBE3', fg: '#4F6656' },
}

function Avatar({ name }) {
  const c = avatarColors[name] ?? avatarColors['IT Help Desk']
  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-full font-display text-lg font-bold"
      style={{ background: c.bg, color: c.fg }}
      aria-hidden
    >
      {name === 'IT Help Desk' ? 'IT' : name[0]}
    </span>
  )
}

export default function MailTab({ messages, readIds, onRead, tasksById, onOpenTask }) {
  const [openId, setOpenId] = useState(null)
  const open = messages.find((m) => m.id === openId)

  const select = (id) => {
    setOpenId(id)
    onRead(id)
  }

  return (
    <section aria-labelledby="mail-title">
      <h1 id="mail-title" className="font-display text-3xl font-bold text-ink">
        Mail
      </h1>
      <p className="mt-1 text-ink-soft">Updates from Sarah in HR, your manager and IT. Nothing here is a task.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
        <ul className={`flex flex-col gap-2 ${open ? 'hidden md:flex' : ''}`}>
          {messages.map((m) => {
            const unread = !readIds.includes(m.id)
            const active = m.id === openId
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => select(m.id)}
                  className={`flex w-full gap-3 rounded-2xl border-2 bg-white p-3 text-left ${
                    active ? 'border-[#3E9B4F]' : 'border-line hover:border-stone-deep'
                  }`}
                >
                  <Avatar name={m.from} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`truncate ${unread ? 'font-extrabold' : 'font-bold'} text-ink`}>{m.from}</span>
                      <span className="shrink-0 text-xs text-ink-soft">{formatDate(m.date, { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className={`block truncate text-sm ${unread ? 'font-extrabold text-ink' : 'text-ink-soft'}`}>
                      {unread && <span className="mr-1.5 inline-block size-2 rounded-full bg-[#E8590C] align-middle" aria-label="Unread" />}
                      {m.subject}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className={open ? '' : 'hidden md:block'}>
          {open ? (
            <article className="rounded-3xl border-2 border-line bg-white p-5 md:p-7">
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="mb-4 flex items-center gap-1.5 text-sm font-bold text-ink-soft md:hidden"
              >
                <ArrowLeft size={16} aria-hidden /> All mail
              </button>
              <div className="flex items-center gap-3">
                <Avatar name={open.from} />
                <div>
                  <div className="font-extrabold text-ink">{open.from}</div>
                  <div className="text-sm text-ink-soft">
                    {open.fromTitle}, {formatDate(open.date)} at {open.time}
                  </div>
                </div>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-ink">{open.subject}</h2>
              <div className="mt-3 flex max-w-prose flex-col gap-3 leading-relaxed text-ink">
                {open.body.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
              {open.relatedTask && tasksById[open.relatedTask] && (
                <button
                  type="button"
                  onClick={() => onOpenTask(open.relatedTask)}
                  className="btn-chunky mt-6 rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white"
                  style={{ '--btn-deep': '#1f3a2a' }}
                >
                  Open task: {tasksById[open.relatedTask].title}
                </button>
              )}
            </article>
          ) : (
            <div className="grid h-full min-h-64 place-items-center rounded-3xl border-2 border-dashed border-line p-8 text-center text-ink-soft">
              <div>
                <Inbox size={32} className="mx-auto mb-2" aria-hidden />
                Pick a message to read it.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
