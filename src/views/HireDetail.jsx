import { useState } from 'react'
import { ArrowDown, ArrowLeft, Mail as MailIcon } from 'lucide-react'
import { DEMO_TODAY } from '../data/onboarding'
import { managers } from '../data/roster'
import { formatDate, isOverdue, nextTask, phaseStats } from '../lib/progress'
import { STATUS, summarize, tenure } from '../lib/team'
import ProgressHeader from '../components/ProgressHeader'
import Path from '../components/Path'

// Sarah's (or David's) view of one new hire: their progress, their path,
// and the "+" stones for adding tasks.
export default function HireDetail({ hire, plan, progress, backLabel, onBack, onOpenTask, onAddTask, onRemind, onMessage }) {
  const stats = phaseStats(plan, progress)
  const overdue = plan.filter((t) => isOverdue(t, progress[t.id]?.status))
  const next = nextTask(plan, progress)
  const { status } = summarize(hire, plan, progress)
  const s = STATUS[status]
  const t = tenure(hire)
  const manager = managers[hire.managerId]
  const [flashId, setFlashId] = useState(null)
  const [jumps, setJumps] = useState(0)

  // Clicking "N overdue" scrolls to an unfinished overdue task and flashes it.
  // With several, each click moves on to the next one.
  const jumpToOverdue = () => {
    const task = overdue[jumps % overdue.length]
    setJumps((n) => n + 1)
    const el = document.getElementById(`stone-${task.id}`)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
    setFlashId(null)
    requestAnimationFrame(() => setFlashId(task.id))
    setTimeout(() => setFlashId((f) => (f === task.id ? null : f)), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-1.5 rounded-xl px-2 py-1 font-extrabold text-ink-soft hover:bg-white">
        <ArrowLeft size={18} strokeWidth={2.75} aria-hidden /> {backLabel}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full font-display text-2xl font-bold" style={{ background: s.tint, color: s.deep }} aria-hidden>
            {hire.firstName[0]}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink">{hire.firstName}</h1>
            <p className="text-ink-soft">
              {hire.role}, {hire.department}
              {manager ? `. Manager: ${manager.name}` : ''}
            </p>
          </div>
          {overdue.length > 0 ? (
            <button
              type="button"
              onClick={jumpToOverdue}
              title={overdue.length > 1 ? 'Jump to the next overdue task' : 'Jump to the overdue task'}
              className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-extrabold hover:border-current"
              style={{ background: s.tint, color: s.deep, borderColor: s.tint }}
            >
              {overdue.length} overdue
              <ArrowDown size={15} strokeWidth={3} aria-hidden />
              <span className="sr-only">: jump to {overdue.length > 1 ? 'the next one' : 'it'} on the path</span>
            </button>
          ) : (
            <span className="rounded-full px-3 py-1 text-sm font-extrabold" style={{ background: s.tint, color: s.deep }}>
              {s.label}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onMessage}
          className="btn-chunky flex items-center gap-2 rounded-2xl bg-[#2B7539] px-5 py-2.5 font-display text-lg font-bold text-white"
          style={{ '--btn-deep': '#1f3a2a' }}
        >
          <MailIcon size={18} strokeWidth={2.75} aria-hidden /> Message {hire.firstName}
        </button>
      </div>

      <ProgressHeader
        stats={stats}
        overdue={overdue}
        newHire={hire}
        heading={t.label}
        intro={
          hire.startDate > DEMO_TODAY
            ? `${t.detail}. Pre-boarding tasks are underway.`
            : `${hire.firstName} started ${formatDate(hire.startDate, { weekday: 'long', month: 'short', day: 'numeric' })}.`
        }
        onOverdueClick={onRemind}
        overdueHint="Click to send a reminder."
        onOpenTask={onOpenTask}
      />

      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-6 text-center text-ink-soft">
          {hire.firstName}'s path, exactly as they see it. Open any task to message them about it, or use a <strong className="text-ink">+</strong> stone to add a task.
        </p>
        <Path tasks={plan} state={progress} stats={stats} currentId={next?.id} flashId={flashId} onOpen={onOpenTask} mode="team" onAdd={onAddTask} />
      </div>
    </div>
  )
}
