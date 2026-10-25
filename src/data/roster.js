// Everyone currently onboarding at BrightPath, the managers they report to,
// and the department templates their plans are built from. All sample data.

import { DEMO_TODAY, messages as emilyMessages, newHire, tasks as emilyTasks } from './onboarding'

const DAY = 86400000
const toUtc = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))
export const addDays = (iso, n) => new Date(toUtc(iso) + n * DAY).toISOString().slice(0, 10)
const offsetOf = (iso, from) => Math.round((toUtc(iso) - toUtc(from)) / DAY)

export const hr = {
  id: 'sarah',
  name: 'Sarah',
  title: 'HR Manager',
  email: 'sarah@brightpath.example',
  slack: '@sarah-hr',
  phone: '(206) 555-0142',
  where: 'People team, 2nd floor',
  hours: 'Usually replies within a few hours, Mon to Fri',
}

export const itDesk = {
  name: 'IT Help Desk',
  title: 'IT',
  email: 'helpdesk@brightpath.example',
  slack: '#it-help',
  phone: '(206) 555-0110',
  where: 'Next to the kitchen, 1st floor',
  hours: 'Open 7 am to 7 pm, Mon to Fri',
}

export const managers = {
  david: { id: 'david', name: 'David', title: 'Engineering Manager', email: 'david@brightpath.example', slack: '@david', phone: '(206) 555-0178', where: 'Engineering, 3rd floor', hours: 'Usually replies within the hour' },
  priya: { id: 'priya', name: 'Priya', title: 'Marketing Manager', email: 'priya@brightpath.example', slack: '@priya', phone: '(206) 555-0163', where: 'Marketing, 2nd floor', hours: 'Usually replies the same day' },
  marcus: { id: 'marcus', name: 'Marcus', title: 'Sales Manager', email: 'marcus@brightpath.example', slack: '@marcus', phone: '(206) 555-0185', where: 'Sales, 1st floor', hours: 'Usually replies between calls' },
  lena: { id: 'lena', name: 'Lena', title: 'General Counsel', email: 'lena@brightpath.example', slack: '@lena', phone: '(206) 555-0131', where: 'Legal, 3rd floor', hours: 'Usually replies the same day' },
  omar: { id: 'omar', name: 'Omar', title: 'Operations Manager', email: 'omar@brightpath.example', slack: '@omar', phone: '(206) 555-0157', where: 'Operations, 2nd floor', hours: 'Usually replies within a few hours' },
}

// Who to ask about a task, resolved for a specific new hire.
export function contactFor(owner, hire) {
  if (owner === 'hr') return hr
  if (owner === 'it') return itDesk
  return managers[hire.managerId] ?? hr
}

export const departments = [
  { id: 'Engineering', manager: 'david', icon: 'Laptop' },
  { id: 'Marketing', manager: 'priya', icon: 'Megaphone' },
  { id: 'Sales', manager: 'marcus', icon: 'Handshake' },
  { id: 'Legal', manager: 'lena', icon: 'Scale' },
  { id: 'Business Operations', manager: 'omar', icon: 'Briefcase' },
  { id: 'Other', manager: null, icon: 'Building2' },
]

// ---------- Templates ----------
// Company-wide steps and engineering steps come from Emily's plan, with dates
// turned into "days from start date" and David's name turned into a placeholder.
const fromEmily = (t) => {
  const swap = (x) => x.replace(/David/g, '{manager}')
  return {
    key: t.id,
    phase: t.phase,
    offset: offsetOf(t.due, newHire.startDate),
    title: swap(t.title),
    type: t.type,
    tag: t.tag,
    minutes: t.minutes,
    owner: t.owner,
    summary: swap(t.summary),
    steps: t.steps.map(swap),
    resources: t.resources,
  }
}

const companyWide = emilyTasks.filter((t) => t.tag === 'Company-wide').map(fromEmily)
const engineering = emilyTasks.filter((t) => t.tag === 'Engineering').map(fromEmily)

const step = (key, phase, offset, title, type, minutes, summary, steps, resource) => ({
  key,
  phase,
  offset,
  title,
  type,
  minutes,
  owner: 'manager',
  summary,
  steps,
  resources: resource ? [resource] : [],
})

const departmentSteps = {
  Engineering: engineering,
  Marketing: [
    step('brand-kit', 'week', 2, 'Get access to the brand kit and design tools', 'Setup', 30, 'Get into the tools the team uses to make anything customers see.', ['Request access to the design tools.', 'Download the brand kit.'], { label: 'Brand kit', kind: 'Link' }),
    step('meet-creative', 'week', 3, 'Meet the content and design teams', 'Meeting', 45, 'Put faces to names on the teams you will work with most.', ['Find the invite on your calendar.', 'Ask each team what they are working on this quarter.']),
    step('voice-guide', 'month', 8, 'Read the brand voice guide', 'Read', 40, 'How BrightPath sounds in everything from emails to ads.', ['Read the guide.', 'Rewrite one old email in the new voice for practice.'], { label: 'Brand voice guide', kind: 'Document' }),
    step('campaign-shadow', 'month', 14, 'Shadow a campaign launch', 'Meeting', 60, 'See a campaign go live from the final review to the first results.', ['Join the launch channel.', 'Sit in on the launch-day standup.']),
    step('first-brief', 'month', 20, 'Write your first campaign brief', 'Project', 120, 'Pull together a short brief for a small campaign and share it with the team.', ['Use the brief template.', 'Share it with {manager} for feedback.'], { label: 'Campaign brief template', kind: 'Document' }),
  ],
  Sales: [
    step('crm', 'week', 1, 'Set up your CRM account', 'Setup', 20, 'The CRM is where every customer conversation lives.', ['Sign in with your BrightPath account.', 'Connect your email and calendar.'], { label: 'CRM setup guide', kind: 'Guide' }),
    step('call-shadow', 'week', 4, 'Shadow three customer calls', 'Meeting', 90, 'Listen in on real calls to hear how customers talk about their problems.', ['Pick three calls from the team calendar.', 'Write down the questions customers ask most.']),
    step('product-demo', 'month', 9, 'Learn the product demo', 'Training', 60, 'Learn the standard demo so you can run it yourself.', ['Watch the recorded demo.', 'Practice it with your buddy.'], { label: 'Demo recording', kind: 'Course' }),
    step('pitch-cert', 'month', 15, 'Pass the pitch certification', 'Training', 45, 'Give your pitch to {manager} and get signed off to run calls on your own.', ['Book a slot with {manager}.', 'Deliver the pitch and the demo.']),
    step('territory', 'month', 20, 'Review your territory plan', 'Meeting', 45, 'Agree on the accounts you will own and your goals for next quarter.', ['Find the invite on your calendar.', 'Bring three accounts you want to start with.']),
  ],
  Legal: [
    step('clm', 'week', 2, 'Get access to the contract system', 'Setup', 15, 'Every BrightPath contract is stored and tracked here.', ['Request access.', 'Find three recent customer contracts.'], { label: 'Contract system', kind: 'Link' }),
    step('playbook', 'week', 4, 'Read the contract playbook', 'Read', 60, 'Our standard positions on the clauses that come up most.', ['Read the playbook.', 'Note anything you would push back on.'], { label: 'Contract playbook', kind: 'Document' }),
    step('privacy', 'month', 14, 'Complete privacy and data protection training', 'Training', 60, 'Required for anyone who reviews customer data terms.', ['Start the course.', 'Pass the quiz at the end.'], { label: 'Privacy course', kind: 'Course' }),
    step('negotiation', 'month', 20, 'Shadow a contract negotiation', 'Meeting', 60, 'Sit in on a live negotiation with a customer.', ['Join the call with {manager}.', 'Debrief afterward.']),
  ],
  'Business Operations': [
    step('fin-tools', 'week', 2, 'Get access to finance and planning tools', 'Setup', 15, 'The tools behind budgets, forecasts and reports.', ['Request access.', 'Open last month\'s report.'], { label: 'Access request form', kind: 'Form' }),
    step('metrics', 'week', 4, 'Review the company metrics dashboard', 'Read', 30, 'The numbers leadership looks at every week.', ['Open the dashboard.', 'Pick one metric and find out how it is calculated.'], { label: 'Metrics dashboard', kind: 'Link' }),
    step('planning', 'month', 10, 'Learn the quarterly planning process', 'Training', 45, 'How teams set goals and budgets each quarter.', ['Read the planning guide.', 'Sit in on a planning review.'], { label: 'Planning guide', kind: 'Guide' }),
    step('vendor', 'month', 17, 'Shadow a vendor review', 'Meeting', 45, 'See how we decide whether to renew a vendor.', ['Join the review with {manager}.', 'Write down the criteria used.']),
  ],
  Other: [],
}

// Build a plan for a department from its template.
export function templateFor(department, startDate, managerName = 'your manager') {
  const fill = (x) => x.replace(/\{manager\}/g, managerName)
  const extra = (departmentSteps[department] ?? []).map((t) => ({ ...t, tag: department }))
  return [...companyWide, ...extra]
    .map((t) => ({
      id: t.key,
      phase: t.phase,
      title: fill(t.title),
      type: t.type,
      tag: t.tag ?? 'Company-wide',
      due: addDays(startDate, t.offset),
      minutes: t.minutes,
      owner: t.owner,
      summary: fill(t.summary),
      steps: t.steps.map(fill),
      resources: t.resources,
    }))
    .sort((a, b) => a.due.localeCompare(b.due))
}

// ---------- People ----------
// profile: 'completed', or a list of task keys that are still open past their due date.
const people = [
  { id: 'aiden', firstName: 'Aiden', role: 'Account Executive', department: 'Sales', managerId: 'marcus', startDate: '2026-10-22', profile: 'completed' },
  { id: 'bianca', firstName: 'Bianca', role: 'Marketing Coordinator', department: 'Marketing', managerId: 'priya', startDate: '2026-10-26', profile: [] },
  { id: 'carlos', firstName: 'Carlos', role: 'Data Engineer', department: 'Engineering', managerId: 'david', startDate: '2026-11-09', profile: ['security'] },
  { id: 'dana', firstName: 'Dana', role: 'Paralegal', department: 'Legal', managerId: 'lena', startDate: '2026-11-16', profile: [] },
  { id: 'farah', firstName: 'Farah', role: 'Operations Analyst', department: 'Business Operations', managerId: 'omar', startDate: '2026-11-02', profile: ['metrics'] },
  { id: 'grace', firstName: 'Grace', role: 'Content Strategist', department: 'Marketing', managerId: 'priya', startDate: '2026-11-16', profile: ['handbook'] },
  { id: 'hiro', firstName: 'Hiro', role: 'Frontend Engineer', department: 'Engineering', managerId: 'david', startDate: '2026-10-23', profile: 'completed' },
  { id: 'isabel', firstName: 'Isabel', role: 'Sales Development Rep', department: 'Sales', managerId: 'marcus', startDate: '2026-11-09', profile: [] },
  { id: 'jamal', firstName: 'Jamal', role: 'Contracts Manager', department: 'Legal', managerId: 'lena', startDate: '2026-10-26', profile: ['privacy', 'negotiation'] },
  { id: 'kenji', firstName: 'Kenji', role: 'Site Reliability Engineer', department: 'Engineering', managerId: 'david', startDate: '2026-11-30', profile: [] },
  { id: 'lucia', firstName: 'Lucia', role: 'Financial Analyst', department: 'Business Operations', managerId: 'omar', startDate: '2026-10-23', profile: 'completed' },
  { id: 'maya', firstName: 'Maya', role: 'Product Marketing Manager', department: 'Marketing', managerId: 'priya', startDate: '2026-11-23', profile: [] },
]

function progressFor(plan, profile) {
  return Object.fromEntries(
    plan.map((t) => {
      if (profile === 'completed' || (t.due < DEMO_TODAY && !profile.includes(t.id))) {
        return [t.id, { status: 'done', completedAt: t.due <= DEMO_TODAY ? t.due : DEMO_TODAY }]
      }
      return [t.id, { status: 'todo', completedAt: null }]
    }),
  )
}

export function buildSeed() {
  const emily = {
    id: 'emily',
    firstName: newHire.firstName,
    role: newHire.role,
    department: newHire.department,
    managerId: 'david',
    startDate: newHire.startDate,
    email: 'emily@brightpath.example',
  }
  const hires = [emily]
  const plans = { emily: emilyTasks.map(({ status, completedAt, ...t }) => t) }
  const progress = {
    emily: Object.fromEntries(emilyTasks.map((t) => [t.id, { status: t.status, completedAt: t.completedAt ?? null }])),
  }

  people.forEach(({ profile, ...p }) => {
    const hire = { ...p, email: `${p.id}@brightpath.example` }
    const plan = templateFor(p.department, p.startDate, managers[p.managerId].name)
    hires.push(hire)
    plans[p.id] = plan
    progress[p.id] = progressFor(plan, profile)
  })

  return {
    viewer: 'emily',
    hires,
    plans,
    progress,
    messages: emilyMessages.map(({ read, ...m }) => ({ ...m, to: ['emily'] })),
    readIds: emilyMessages.filter((m) => m.read).map((m) => m.id),
  }
}

export const viewers = {
  emily: { id: 'emily', name: 'Emily', title: 'Software Engineer, Engineering', role: 'newhire', initial: 'E', bg: '#FBEBC2', fg: '#8F6200' },
  sarah: { id: 'sarah', name: 'Sarah', title: 'HR Manager', role: 'hr', initial: 'S', bg: '#FCE6C2', fg: '#8F5200' },
  david: { id: 'david', name: 'David', title: 'Engineering Manager', role: 'manager', initial: 'D', bg: '#D9EED8', fg: '#2B7539' },
}
