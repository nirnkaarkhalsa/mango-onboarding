import { useState } from 'react'
import Mascot from '../components/Mascot'
import { PLAN_SIZE, davidHistory, taskTitles } from '../data/history'
import { formatDate, isOverdue } from '../lib/progress'

const GREEN = '#3E9B4F'
const SLATE = '#6B7F70'

const quarterOf = (iso) => `${iso.slice(0, 4)} Q${Math.floor((+iso.slice(5, 7) - 1) / 3) + 1}`
const pct = (x) => `${Math.round(x * 100)}%`

// David's view of how past engineers on his team did with onboarding.
export default function TeamHistory({ hires, store }) {
  const history = davidHistory
  const n = history.length
  const onTime = history.reduce((sum, h) => sum + (PLAN_SIZE - h.late.length), 0)
  const rate = onTime / (n * PLAN_SIZE)
  const avgDays = history.reduce((sum, h) => sum + h.daysToFinish, 0) / n

  // On-time rate for each start quarter
  const quarters = []
  history.forEach((h) => {
    const q = quarterOf(h.start)
    let row = quarters.find((x) => x.label === q)
    if (!row) quarters.push((row = { label: q, people: [], onTime: 0, total: 0 }))
    row.people.push(h.name)
    row.onTime += PLAN_SIZE - h.late.length
    row.total += PLAN_SIZE
  })
  quarters.forEach((q) => (q.rate = q.onTime / q.total))

  // Which tasks are most often late
  const lateBy = {}
  history.forEach((h) => h.late.forEach((id) => (lateBy[id] ??= []).push(h.name)))
  const lateTasks = Object.entries(lateBy)
    .map(([id, people]) => ({ id, title: taskTitles[id], people }))
    .sort((a, b) => b.people.length - a.people.length)
    .slice(0, 6)
  const top = lateTasks[0]

  // Who on the team has that task overdue right now
  const overdueNow = hires
    .filter((h) => {
      const t = store.plans[h.id]?.find((x) => x.id === top.id)
      return t && isOverdue(t, store.progress[h.id]?.[t.id]?.status)
    })
    .map((h) => h.firstName)

  const first = quarters[0]
  const last = quarters[quarters.length - 1]
  const recentFirst = [...history].sort((a, b) => b.start.localeCompare(a.start))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Team history</h1>
        <p className="mt-1 text-ink-soft">
          How the {n} engineers who joined your team since {formatDate(history[0].start, { month: 'long', year: 'numeric' })} did with onboarding. Sample data.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat value={pct(rate)} label="of onboarding tasks finished on time" />
        <Stat value={`${Math.round(avgDays)} days`} label="on average to finish onboarding" note="Plans are built for about 30" />
        <Stat value={n} label="engineers onboarded" note={`Since ${formatDate(history[0].start, { month: 'short', year: 'numeric' })}`} />
        <Stat value={top.title} small label={`most often late: ${top.people.length} of ${n} engineers`} />
      </ul>

      <section aria-label="What stands out" className="flex items-start gap-4 rounded-3xl border-2 border-line bg-white p-5">
        <Mascot stage="month" mood="study" size={72} className="hidden h-auto w-[72px] shrink-0 sm:block" />
        <div>
          <h2 className="font-display text-xl font-bold text-ink">What stands out</h2>
          <p className="mt-1 max-w-prose leading-relaxed text-ink">
            On-time rate has climbed from {pct(first.rate)} for engineers who started in {first.label} to {pct(last.rate)} in {last.label}.{' '}
            {top.title} is still the most common slip: it was late for {top.people.length} of {n} past engineers
            {overdueNow.length ? `, and it's overdue right now for ${listNames(overdueNow)}` : ''}.
          </p>
          <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
            Worth trying: schedule it during orientation on Day 1, so it doesn't compete with laptop and dev environment setup later in the week.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <OnTimeByQuarter quarters={quarters} />
        <MostOftenLate tasks={lateTasks} n={n} />
      </div>

      <section aria-labelledby="past-title">
        <h2 id="past-title" className="font-display text-xl font-bold text-ink">
          Past engineers
        </h2>
        <p className="mt-1 text-ink-soft">Most recent first.</p>
        <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper text-ink-soft">
              <tr>
                <th scope="col" className="px-4 py-3 font-extrabold">Name</th>
                <th scope="col" className="px-4 py-3 font-extrabold">Started</th>
                <th scope="col" className="px-4 py-3 text-right font-extrabold">Days to finish</th>
                <th scope="col" className="px-4 py-3 text-right font-extrabold">Tasks on time</th>
                <th scope="col" className="px-4 py-3 font-extrabold">Finished late</th>
              </tr>
            </thead>
            <tbody>
              {recentFirst.map((h) => {
                const ok = PLAN_SIZE - h.late.length
                return (
                  <tr key={h.name} className="border-t-2 border-line align-top">
                    <th scope="row" className="px-4 py-3 font-normal">
                      <span className="block font-extrabold text-ink">{h.name}</span>
                      <span className="block text-ink-soft">{h.role}</span>
                    </th>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{formatDate(h.start, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-ink">{h.daysToFinish}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-ink">
                      <span className="font-bold">{pct(ok / PLAN_SIZE)}</span>
                      <span className="text-ink-soft"> ({ok} of {PLAN_SIZE})</span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{h.late.map((id) => taskTitles[id]).join(', ')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function listNames(names) {
  if (names.length < 3) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

function Stat({ value, label, note, small }) {
  return (
    <li className="rounded-3xl border-2 border-line bg-white p-4">
      <div className={`font-display font-extrabold leading-tight text-ink ${small ? 'text-xl' : 'text-4xl'}`}>{value}</div>
      <div className="mt-1 text-sm font-bold text-ink-soft">{label}</div>
      {note && <div className="mt-0.5 text-xs text-muted">{note}</div>}
    </li>
  )
}

// Vertical bars: share of tasks finished on time, by the quarter people started.
function OnTimeByQuarter({ quarters }) {
  const [hover, setHover] = useState(null)
  const ticks = [0, 50, 100]

  return (
    <section aria-labelledby="otq-title" className="rounded-3xl border-2 border-line bg-white p-5">
      <h2 id="otq-title" className="font-display text-xl font-bold text-ink">
        Tasks finished on time
      </h2>
      <p className="text-sm text-ink-soft">By the quarter each engineer started</p>

      <div className="mt-6 flex gap-2">
        <div className="relative h-52 w-9 shrink-0 text-right text-xs text-ink-soft" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0" style={{ bottom: `${t}%`, transform: 'translateY(50%)' }}>
              {t}%
            </span>
          ))}
        </div>
        <div className="relative h-52 flex-1">
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-line" style={{ bottom: `${t}%` }} aria-hidden />
          ))}
          <ul className="absolute inset-0 flex items-end gap-1.5 sm:gap-2.5">
            {quarters.map((q, i) => {
              const labeled = i === 0 || i === quarters.length - 1
              const active = hover === i
              return (
                <li
                  key={q.label}
                  tabIndex={0}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${q.label}: ${pct(q.rate)} of tasks on time. ${q.people.join(', ')}.`}
                  className="relative flex h-full flex-1 cursor-default items-end justify-center rounded-md outline-offset-2"
                >
                  <div
                    className="relative w-full max-w-11 rounded-t transition-opacity"
                    style={{ height: `${q.rate * 100}%`, background: GREEN, opacity: hover === null || active ? 1 : 0.55 }}
                  >
                    {labeled && !active && (
                      <span className="absolute inset-x-0 -top-5 text-center text-xs font-extrabold text-ink">{pct(q.rate)}</span>
                    )}
                  </div>
                  {active && (
                    <Tooltip align={i > quarters.length / 2 ? 'right' : 'left'} style={{ bottom: `calc(${q.rate * 100}% + 8px)` }}>
                      <span className="block font-extrabold">{q.label}</span>
                      <span className="block">{pct(q.rate)} of tasks on time</span>
                      <span className="block text-white/75">{q.people.join(', ')}</span>
                    </Tooltip>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="ml-11 mt-2 flex gap-1.5 sm:gap-2.5" aria-hidden>
        {quarters.map((q) => (
          <span key={q.label} className="flex-1 text-center text-[11px] font-bold leading-tight text-ink-soft">
            {q.label.split(' ')[1]}
            <span className="block font-normal">{q.label.split(' ')[0]}</span>
          </span>
        ))}
      </div>
    </section>
  )
}

// Horizontal bars: how many past engineers finished each task late.
function MostOftenLate({ tasks, n }) {
  const [hover, setHover] = useState(null)

  return (
    <section aria-labelledby="mol-title" className="rounded-3xl border-2 border-line bg-white p-5">
      <h2 id="mol-title" className="font-display text-xl font-bold text-ink">
        Tasks most often finished late
      </h2>
      <p className="text-sm text-ink-soft">Number of the {n} past engineers who finished each one late</p>

      <ul className="mt-5 flex flex-col gap-3">
        {tasks.map((t, i) => {
          const active = hover === i
          return (
            <li
              key={t.id}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${t.title}: late for ${t.people.length} of ${n}. ${t.people.join(', ')}.`}
              className="relative cursor-default rounded-md outline-offset-2"
            >
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-bold text-ink">{t.title}</span>
                <span className="shrink-0 tabular-nums text-ink-soft">
                  <span className="font-extrabold text-ink">{t.people.length}</span> of {n}
                </span>
              </div>
              <div className="mt-1 h-3 rounded-r bg-stone/60">
                <div
                  className="h-full rounded-r transition-opacity"
                  style={{ width: `${(t.people.length / n) * 100}%`, background: SLATE, opacity: hover === null || active ? 1 : 0.55 }}
                />
              </div>
              {active && (
                <Tooltip align="left" style={{ bottom: 'calc(100% + 6px)' }}>
                  <span className="block font-extrabold">Late for {t.people.length} of {n}</span>
                  <span className="block text-white/75">{t.people.join(', ')}</span>
                </Tooltip>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Tooltip({ children, align, style }) {
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute z-10 w-max max-w-56 rounded-xl bg-ink px-3 py-2 text-left text-xs leading-snug text-white shadow-[0_3px_0_#0d1f15] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
      style={style}
    >
      {children}
    </span>
  )
}
