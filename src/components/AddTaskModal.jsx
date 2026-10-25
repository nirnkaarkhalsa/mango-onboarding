import { useState } from 'react'
import Modal, { fieldClass, labelClass } from './Modal'
import { phaseById } from '../lib/progress'
import { DEMO_TODAY } from '../data/onboarding'
import { typeIcons } from './icons'

const TYPES = Object.keys(typeIcons)

// Sarah or David adds a task to one section of a new hire's plan.
export default function AddTaskModal({ phaseId, hireName, defaultDue, managerName, addedBy, onSave, onClose }) {
  const phase = phaseById(phaseId)
  const [form, setForm] = useState({ title: '', type: 'Read', due: defaultDue, minutes: 30, owner: 'hr', summary: '' })
  const [tried, setTried] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const valid = form.title.trim() && form.due && Number(form.minutes) > 0

  const save = (e) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    onSave({
      id: `added-${Date.now().toString(36)}`,
      phase: phaseId,
      title: form.title.trim(),
      type: form.type,
      tag: 'Company-wide',
      due: form.due,
      minutes: Number(form.minutes),
      owner: form.owner,
      summary: form.summary.trim() || `Added to your plan by ${addedBy}.`,
      steps: [],
      resources: [],
      addedBy,
    })
  }

  return (
    <Modal
      title={`Add a task to ${phase.name}`}
      subtitle={hireName ? `It shows up on ${hireName}'s path right away.` : 'It will be part of the plan you publish.'}
      tint={phase.tint}
      onClose={onClose}
    >
      <form onSubmit={save} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="t-title" className={labelClass}>
            Task name
          </label>
          <input id="t-title" value={form.title} onChange={set('title')} className={fieldClass} placeholder="Meet the support team" autoFocus />
          {tried && !form.title.trim() && <p className="mt-1 text-sm font-bold text-alert">Give the task a name.</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="t-type" className={labelClass}>
              Type
            </label>
            <select id="t-type" value={form.type} onChange={set('type')} className={fieldClass}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="t-due" className={labelClass}>
              Due date
            </label>
            <input id="t-due" type="date" value={form.due} onChange={set('due')} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="t-min" className={labelClass}>
              Minutes
            </label>
            <input id="t-min" type="number" min="5" step="5" value={form.minutes} onChange={set('minutes')} className={fieldClass} />
          </div>
        </div>

        {form.due && form.due < DEMO_TODAY && (
          <p className="-mt-2 text-sm font-bold text-alert">That date has already passed, so this task will show as overdue right away.</p>
        )}

        <div>
          <label htmlFor="t-owner" className={labelClass}>
            Who to ask
          </label>
          <select id="t-owner" value={form.owner} onChange={set('owner')} className={fieldClass}>
            <option value="hr">Sarah, HR Manager</option>
            <option value="manager">{managerName ? `${managerName}, their manager` : 'Their manager'}</option>
            <option value="it">IT Help Desk</option>
          </select>
        </div>

        <div>
          <label htmlFor="t-summary" className={labelClass}>
            Details <span className="font-semibold text-ink-soft">(optional)</span>
          </label>
          <textarea id="t-summary" value={form.summary} onChange={set('summary')} rows={3} className={fieldClass} placeholder="What should they do, and why does it matter?" />
        </div>

        <button
          type="submit"
          className="btn-chunky rounded-2xl py-3 font-display text-xl font-bold text-white"
          style={{ background: phase.deep, '--btn-deep': '#1f3a2a' }}
        >
          Add task
        </button>
      </form>
    </Modal>
  )
}
