// Sample history for David's team: engineers who finished onboarding before
// the current group. Every plan had the same 19 Engineering tasks; `late`
// lists the ones each person finished after the due date.

import { tasks } from './onboarding'

export const PLAN_SIZE = 19

export const taskTitles = Object.fromEntries(tasks.map((t) => [t.id, t.title]))

export const davidHistory = [
  { name: 'Alex', role: 'Backend Engineer', start: '2025-01-13', daysToFinish: 41, late: ['dev-env', 'security', 'first-pr', 'handbook', 'architecture', 'oncall-shadow'] },
  { name: 'Ben', role: 'Frontend Engineer', start: '2025-02-03', daysToFinish: 38, late: ['dev-env', 'security', 'harassment', 'first-pr', 'benefits'] },
  { name: 'Chloe', role: 'Data Engineer', start: '2025-04-07', daysToFinish: 37, late: ['dev-env', 'dev-access', 'security', 'first-pr', 'oncall-shadow'] },
  { name: 'Diego', role: 'Site Reliability Engineer', start: '2025-05-12', daysToFinish: 35, late: ['dev-env', 'security', 'harassment', 'handbook'] },
  { name: 'Ellie', role: 'Backend Engineer', start: '2025-07-14', daysToFinish: 34, late: ['dev-env', 'first-pr', 'security', 'benefits'] },
  { name: 'Felix', role: 'Mobile Engineer', start: '2025-08-04', daysToFinish: 33, late: ['dev-env', 'security', 'oncall-shadow'] },
  { name: 'Hana', role: 'QA Engineer', start: '2025-09-08', daysToFinish: 32, late: ['handbook', 'harassment', 'oncall-shadow'] },
  { name: 'Ivan', role: 'Backend Engineer', start: '2025-10-20', daysToFinish: 33, late: ['dev-env', 'security', 'first-pr'] },
  { name: 'Jade', role: 'Frontend Engineer', start: '2025-11-17', daysToFinish: 31, late: ['dev-env', 'security'] },
  { name: 'Leo', role: 'Platform Engineer', start: '2026-01-12', daysToFinish: 31, late: ['security', 'harassment'] },
  { name: 'Nora', role: 'Data Engineer', start: '2026-02-23', daysToFinish: 30, late: ['security', 'first-pr'] },
  { name: 'Quinn', role: 'Backend Engineer', start: '2026-04-13', daysToFinish: 29, late: ['oncall-shadow'] },
  { name: 'Ravi', role: 'Security Engineer', start: '2026-05-18', daysToFinish: 30, late: ['handbook', 'benefits'] },
  { name: 'Sofia', role: 'Frontend Engineer', start: '2026-08-10', daysToFinish: 28, late: ['security'] },
]
