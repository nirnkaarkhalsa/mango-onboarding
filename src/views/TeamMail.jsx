import { useState } from 'react'
import { CircleCheck, Send } from 'lucide-react'
import { departments } from '../data/roster'
import { formatDate } from '../lib/progress'
import { fieldClass, labelClass } from '../components/Modal'

// Sarah (or David) sends general updates to new hires and sees what she has sent.
export default function TeamMail({ viewer, hires, messages, onSend }) {
  const team = viewer.id === 'david'
  const [mode, setMode] = useState('all')
  const [dept, setDept] = useState(departments[0].id)
  const [picked, setPicked] = useState([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sentNote, setSentNote] = useState(null)
  const [openId, setOpenId] = useState(null)

  const people = [...hires].sort((a, b) => a.firstName.localeCompare(b.firstName))
  const deptsInUse = departments.filter((d) => hires.some((h) => h.department === d.id))
  const recipients =
    mode === 'all' ? people.map((h) => h.id) : mode === 'dept' ? people.filter((h) => h.department === dept).map((h) => h.id) : picked
  const valid = recipients.length > 0 && subject.trim() && body.trim()
  const nameOf = (id) => hires.find((h) => h.id === id)?.firstName ?? 'a new hire'
  const toLabel = (ids) => (ids.length === 1 ? nameOf(ids[0]) : `${ids.length} people`)

  const sent = messages.filter((m) => m.from === viewer.name)

  const send = (e) => {
    e.preventDefault()
    if (!valid) return
    onSend({ to: recipients, subject: subject.trim(), body: body.trim() })
    setSentNote(`Sent to ${toLabel(recipients)}.`)
    setSubject('')
    setBody('')
    setPicked([])
  }

  return (
    <section aria-labelledby="tm-title">
      <h1 id="tm-title" className="font-display text-3xl font-bold text-ink">
        Mail
      </h1>
      <p className="mt-1 text-ink-soft">Send updates to new hires. They arrive in each person's Mail tab.</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <form onSubmit={send} className="flex flex-col gap-4 rounded-3xl border-2 border-line bg-white p-5 md:p-6">
          <h2 className="font-display text-xl font-bold text-ink">Send an update</h2>

          <fieldset>
            <legend className={labelClass}>To</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ['all', team ? `My whole team (${hires.length})` : `Everyone onboarding (${hires.length})`],
                ...(team ? [] : [['dept', 'A department']]),
                ['pick', 'Choose people'],
              ].map(([id, label]) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-extrabold"
                  style={mode === id ? { borderColor: '#3E9B4F', background: '#D9EED8', color: '#2B7539' } : { borderColor: 'var(--color-line)', color: 'var(--color-ink-soft)' }}
                >
                  <input type="radio" name="to" value={id} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
            {mode === 'dept' && (
              <select value={dept} onChange={(e) => setDept(e.target.value)} className={`${fieldClass} mt-3`} aria-label="Department">
                {deptsInUse.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} ({hires.filter((h) => h.department === d.id).length})
                  </option>
                ))}
              </select>
            )}
            {mode === 'pick' && (
              <div className="mt-3 grid max-h-48 grid-cols-2 gap-1 overflow-y-auto rounded-xl border-2 border-line p-2 sm:grid-cols-3">
                {people.map((h) => (
                  <label key={h.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-paper">
                    <input
                      type="checkbox"
                      checked={picked.includes(h.id)}
                      onChange={(e) => setPicked((p) => (e.target.checked ? [...p, h.id] : p.filter((x) => x !== h.id)))}
                      className="size-4"
                      style={{ accentColor: '#2B7539' }}
                    />
                    <span className="font-bold text-ink">{h.firstName}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor="tm-subject" className={labelClass}>
              Subject
            </label>
            <input id="tm-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass} placeholder="Holiday schedule for new hires" />
          </div>
          <div>
            <label htmlFor="tm-body" className={labelClass}>
              Message
            </label>
            <textarea id="tm-body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} className={fieldClass} placeholder="Hi everyone," />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!valid}
              className="btn-chunky flex items-center gap-2 rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white disabled:opacity-40"
              style={{ '--btn-deep': '#1f3a2a' }}
            >
              <Send size={17} strokeWidth={2.75} aria-hidden /> Send{recipients.length ? ` to ${toLabel(recipients)}` : ''}
            </button>
            {sentNote && (
              <span className="flex items-center gap-1.5 font-bold text-[#2B7539]" role="status">
                <CircleCheck size={17} strokeWidth={2.75} aria-hidden /> {sentNote}
              </span>
            )}
          </div>
        </form>

        <div>
          <h2 className="font-display text-xl font-bold text-ink">Sent</h2>
          {sent.length === 0 ? (
            <p className="mt-2 rounded-2xl border-2 border-dashed border-line p-6 text-center text-ink-soft">Nothing sent yet. Your updates will be listed here.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {sent.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === m.id ? null : m.id)}
                    aria-expanded={openId === m.id}
                    className="w-full rounded-2xl border-2 border-line bg-white p-3 text-left hover:border-stone-deep"
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-extrabold text-ink">{m.subject}</span>
                      <span className="shrink-0 text-xs text-ink-soft">{formatDate(m.date, { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className="block text-sm text-ink-soft">To {toLabel(m.to)}</span>
                    {openId === m.id && (
                      <span className="mt-3 flex flex-col gap-2 border-t-2 border-line pt-3 text-ink">
                        {m.body.map((p, i) => (
                          <span key={i} className="block whitespace-pre-line">
                            {p}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
