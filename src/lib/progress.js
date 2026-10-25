import { DEMO_TODAY, phases } from '../data/onboarding'

const toDate = (iso) => new Date(`${iso}T12:00:00`)

export function formatDate(iso, opts = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return toDate(iso).toLocaleDateString('en-US', opts)
}

export function daysBetween(fromIso, toIso) {
  return Math.round((toDate(toIso) - toDate(fromIso)) / 86400000)
}

export function isOverdue(task, status) {
  return status !== 'done' && task.due < DEMO_TODAY
}

export function dueLabel(task, status) {
  if (status === 'done') return `Done`
  const diff = daysBetween(DEMO_TODAY, task.due)
  if (diff < 0) return `Was due ${formatDate(task.due)}`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `Due ${formatDate(task.due)}`
}

export function relativeDue(task) {
  const diff = daysBetween(DEMO_TODAY, task.due)
  if (diff < 0) return `Past due by ${-diff} ${diff === -1 ? 'day' : 'days'}`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

export function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

// The single task Emily should focus on: the earliest-due task that isn't done.
export function nextTask(tasks, state) {
  return [...tasks]
    .filter((t) => state[t.id]?.status !== 'done')
    .sort((a, b) => a.due.localeCompare(b.due))[0]
}

export function phaseStats(tasks, state) {
  return phases.map((phase) => {
    const list = tasks.filter((t) => t.phase === phase.id)
    const done = list.filter((t) => state[t.id]?.status === 'done').length
    return { phase, total: list.length, done }
  })
}

export function phaseById(id) {
  return phases.find((p) => p.id === id)
}
