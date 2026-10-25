import { DEMO_TODAY } from '../data/onboarding'
import { daysBetween, formatDate, isOverdue } from './progress'

export const STATUS = {
  completed: { id: 'completed', label: 'Completed', long: 'finished onboarding', color: '#3E9B4F', tint: '#D9EED8', deep: '#2B7539' },
  ontime: { id: 'ontime', label: 'On time', long: 'still working, nothing overdue', color: '#C4B81A', tint: '#F4F0C0', deep: '#5F6B00' },
  overdue: { id: 'overdue', label: 'Has an overdue task', long: 'have an overdue task', color: '#C23B3B', tint: '#FDE4E1', deep: '#A12F2F' },
}

export function summarize(hire, plan, progress) {
  const done = plan.filter((t) => progress[t.id]?.status === 'done').length
  const overdue = plan.filter((t) => isOverdue(t, progress[t.id]?.status))
  const status = done === plan.length ? 'completed' : overdue.length ? 'overdue' : 'ontime'
  return { hire, done, total: plan.length, overdue, status }
}

export function tenure(hire) {
  const diff = daysBetween(hire.startDate, DEMO_TODAY)
  if (diff < 0) {
    const n = -diff
    return { label: `Starts in ${n} ${n === 1 ? 'day' : 'days'}`, detail: `Starts ${formatDate(hire.startDate)}` }
  }
  if (diff === 0) return { label: 'Day 1', detail: 'Starts today' }
  return { label: `Day ${diff + 1}`, detail: `Started ${formatDate(hire.startDate)}` }
}

export function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
}
