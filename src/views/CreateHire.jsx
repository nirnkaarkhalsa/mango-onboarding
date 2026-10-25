import { useMemo, useState } from 'react'
import { Briefcase, Building2, Clock, Handshake, Laptop, Megaphone, Plus, Scale, Send, X } from 'lucide-react'
import { DEMO_TODAY, phases } from '../data/onboarding'
import { addDays, departments, managers, templateFor } from '../data/roster'
import { formatDate, formatMinutes } from '../lib/progress'
import { fieldClass, labelClass } from '../components/Modal'
import AddTaskModal from '../components/AddTaskModal'
import Mascot from '../components/Mascot'

const icons = { Laptop, Megaphone, Handshake, Scale, Briefcase, Building2 }

// Suggested due date for a task Sarah adds: the end of that section, but never
// sooner than three days from today, so a new task doesn't start out overdue.
export function defaultDueFor(phaseId, startDate) {
  const end = phaseId === 'before' ? addDays(startDate, -1) : phaseId === 'week' ? addDays(startDate, 4) : addDays(startDate, 28)
  const soonest = addDays(DEMO_TODAY, 3)
  return end < soonest ? soonest : end
}

// Sarah builds a plan for someone new: pick a department, get its template,
// adjust it, publish it. Publishing "sends" a welcome email.
export default function CreateHire({ onPublish, onViewHire }) {
  const [form, setForm] = useState({ firstName: '', role: '', department: '', managerId: '', startDate: '2026-11-30', email: '' })
  const [emailTouched, setEmailTouched] = useState(false)
  const [removed, setRemoved] = useState([])
  const [extras, setExtras] = useState([])
  const [adding, setAdding] = useState(null)
  const [tried, setTried] = useState(false)
  const [published, setPublished] = useState(null)

  const manager = managers[form.managerId]
  const autoEmail = form.firstName.trim() ? `${form.firstName.trim().toLowerCase().replace(/[^a-z]/g, '')}@brightpath.example` : ''
  const email = emailTouched ? form.email : autoEmail

  const template = useMemo(
    () => (form.department ? templateFor(form.department, form.startDate, manager?.name ?? 'your manager') : []),
    [form.department, form.startDate, manager],
  )
  const plan = [...template.filter((t) => !removed.includes(t.id)), ...extras].sort((a, b) => a.due.localeCompare(b.due))

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const pickDepartment = (d) => {
    setForm((f) => ({ ...f, department: d.id, managerId: d.manager ?? f.managerId }))
    setRemoved([])
  }

  const errors = {
    firstName: !form.firstName.trim() && 'Add their first name.',
    role: !form.role.trim() && 'Add their job title.',
    department: !form.department && 'Pick a department to start from its template.',
    managerId: !form.managerId && 'Pick their manager.',
    startDate: !form.startDate && 'Pick a start date.',
  }
  const valid = !Object.values(errors).some(Boolean)

  const publish = () => {
    setTried(true)
    if (!valid) return
    const id = `${form.firstName.trim().toLowerCase().replace(/[^a-z]/g, '') || 'hire'}-${Date.now().toString(36)}`
    const hire = {
      id,
      firstName: form.firstName.trim(),
      role: form.role.trim(),
      department: form.department,
      managerId: form.managerId,
      startDate: form.startDate,
      email,
    }
    onPublish(hire, plan)
    setPublished(hire)
  }

  const startOver = () => {
    setForm({ firstName: '', role: '', department: '', managerId: '', startDate: '2026-11-30', email: '' })
    setEmailTouched(false)
    setRemoved([])
    setExtras([])
    setTried(false)
    setPublished(null)
  }

  if (published) {
    return (
      <section className="mx-auto flex max-w-lg flex-col items-center py-8 text-center" aria-live="polite">
        <div className="pop-enter rounded-full bg-[#D9EED8] p-5">
          <Mascot stage="before" mood="cheer" size={120} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">{published.firstName}'s plan is live</h1>
        <p className="mt-2 text-ink-soft">
          A welcome email is on its way to <strong className="text-ink">{published.email}</strong> with a link to their path. Their first tasks are due before{' '}
          {formatDate(published.startDate)}.
        </p>
        <p className="mt-2 text-sm text-ink-soft">This is a prototype, so no real email was sent.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onViewHire(published.id)}
            className="btn-chunky rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white"
            style={{ '--btn-deep': '#1f3a2a' }}
          >
            View {published.firstName}'s plan
          </button>
          <button type="button" onClick={startOver} className="rounded-2xl border-2 border-line bg-white px-5 py-2.5 font-display text-lg font-bold text-ink hover:border-stone-deep">
            Add another new hire
          </button>
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Add a new hire</h1>
        <p className="mt-1 text-ink-soft">Start from their department's template, adjust it, then publish it to send them a welcome email.</p>
      </div>

      <section aria-labelledby="who" className="rounded-3xl border-2 border-line bg-white p-5 md:p-7">
        <h2 id="who" className="font-display text-xl font-bold text-ink">
          Who's joining?
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field id="n-first" label="First name" error={tried && errors.firstName}>
            <input id="n-first" value={form.firstName} onChange={set('firstName')} className={fieldClass} placeholder="Jordan" />
          </Field>
          <Field id="n-role" label="Job title" error={tried && errors.role}>
            <input id="n-role" value={form.role} onChange={set('role')} className={fieldClass} placeholder="Backend Engineer" />
          </Field>
          <Field id="n-start" label="Start date" error={tried && errors.startDate}>
            <input id="n-start" type="date" min={DEMO_TODAY} value={form.startDate} onChange={set('startDate')} className={fieldClass} />
          </Field>
          <Field id="n-email" label="Work email">
            <input
              id="n-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmailTouched(true)
                setForm((f) => ({ ...f, email: e.target.value }))
              }}
              className={fieldClass}
              placeholder="jordan@brightpath.example"
            />
          </Field>
        </div>

        <fieldset className="mt-5">
          <legend className={labelClass}>Department</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {departments.map((d) => {
              const Icon = icons[d.icon]
              const active = form.department === d.id
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pickDepartment(d)}
                  aria-pressed={active}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-center font-extrabold"
                  style={active ? { borderColor: '#3E9B4F', background: '#D9EED8', color: '#2B7539' } : { borderColor: 'var(--color-line)', color: 'var(--color-ink)' }}
                >
                  <Icon size={24} strokeWidth={2.25} aria-hidden />
                  <span className="text-sm leading-tight">{d.id === 'Other' ? 'Other (company-wide only)' : d.id}</span>
                </button>
              )
            })}
          </div>
          {tried && errors.department && <p className="mt-1 text-sm font-bold text-alert">{errors.department}</p>}
        </fieldset>

        <div className="mt-5 md:w-1/2">
          <Field id="n-manager" label="Manager" error={tried && errors.managerId}>
            <select id="n-manager" value={form.managerId} onChange={set('managerId')} className={fieldClass}>
              <option value="">Choose a manager</option>
              {Object.values(managers).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}, {m.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section aria-labelledby="plan" className="rounded-3xl border-2 border-line bg-white p-5 md:p-7">
        <h2 id="plan" className="font-display text-xl font-bold text-ink">
          Their onboarding plan
        </h2>
        {!form.department ? (
          <p className="mt-2 text-ink-soft">Pick a department above and its template appears here.</p>
        ) : (
          <>
            <p className="mt-1 text-ink-soft">
              {plan.length} tasks from the {form.department === 'Other' ? 'company-wide' : form.department} template. Remove anything that doesn't apply, or add your own.
            </p>
            <div className="mt-5 flex flex-col gap-6">
              {phases.map((phase) => {
                const list = plan.filter((t) => t.phase === phase.id)
                return (
                  <div key={phase.id}>
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                      <span className="inline-block size-3 rounded-full" style={{ background: phase.color }} aria-hidden />
                      {phase.name}
                      <span className="font-sans text-sm font-bold text-ink-soft">{list.length} tasks</span>
                    </h3>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {list.map((t) => (
                        <li key={t.id} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: phase.tint }}>
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold leading-tight text-ink">{t.title}</span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-ink-soft">
                              <span>Due {formatDate(t.due)}</span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} aria-hidden /> {formatMinutes(t.minutes)}
                              </span>
                              {t.addedBy ? (
                                <span className="rounded-full bg-white px-2 text-xs font-extrabold text-[#8F5200]">Added by you</span>
                              ) : (
                                t.tag !== 'Company-wide' && <span className="rounded-full bg-white px-2 text-xs font-bold">{t.tag}</span>
                              )}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => (t.addedBy ? setExtras((x) => x.filter((e) => e.id !== t.id)) : setRemoved((r) => [...r, t.id]))}
                            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-white"
                            aria-label={`Remove ${t.title}`}
                          >
                            <X size={18} strokeWidth={2.75} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setAdding(phase.id)}
                      className="mt-2 flex items-center gap-1.5 rounded-xl border-2 border-dashed px-3 py-2 text-sm font-extrabold"
                      style={{ borderColor: phase.color, color: phase.deep }}
                    >
                      <Plus size={16} strokeWidth={3} aria-hidden /> Add a task to {phase.name}
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          onClick={publish}
          className="btn-chunky flex items-center justify-center gap-2 rounded-2xl bg-[#2B7539] px-6 py-3 font-display text-xl font-bold text-white"
          style={{ '--btn-deep': '#1f3a2a' }}
        >
          <Send size={18} strokeWidth={2.75} aria-hidden /> Publish plan and send welcome email
        </button>
        {tried && !valid && <p className="text-sm font-bold text-alert">Fill in the missing details above, then publish.</p>}
      </div>

      {adding && (
        <AddTaskModal
          phaseId={adding}
          hireName={null}
          managerName={manager?.name}
          addedBy="Sarah"
          defaultDue={defaultDueFor(adding, form.startDate)}
          onClose={() => setAdding(null)}
          onSave={(task) => {
            setExtras((x) => [...x, task])
            setAdding(null)
          }}
        />
      )}
    </div>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm font-bold text-alert">{error}</p>}
    </div>
  )
}
