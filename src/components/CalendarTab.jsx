import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { DEMO_TODAY, newHire, phases } from '../data/onboarding'
import { formatMinutes, isOverdue, phaseById } from '../lib/progress'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const pad = (n) => String(n).padStart(2, '0')
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

// The months that onboarding spans, from the earliest to the latest due date.
function monthsFor(tasks) {
  const dates = tasks.map((t) => t.due).sort()
  const [y0, m0] = dates[0].split('-').map(Number)
  const [y1, m1] = dates[dates.length - 1].split('-').map(Number)
  const out = []
  for (let y = y0, m = m0 - 1; y < y1 || (y === y1 && m <= m1 - 1); m === 11 ? (y++, (m = 0)) : m++) {
    out.push({ y, m })
  }
  return out
}

export default function CalendarTab({ tasks, state, onOpen }) {
  const months = monthsFor(tasks)
  const [todayY, todayM] = DEMO_TODAY.split('-').map(Number)
  const todayIndex = Math.max(0, months.findIndex((x) => x.y === todayY && x.m === todayM - 1))
  const [index, setIndex] = useState(todayIndex)
  const { y, m } = months[index]

  const byDate = {}
  tasks.forEach((t) => (byDate[t.due] ??= []).push(t))

  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)

  const monthName = new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const monthTasks = Object.keys(byDate)
    .filter((d) => d.startsWith(`${y}-${pad(m + 1)}`))
    .sort()

  return (
    <section aria-labelledby="cal-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="cal-title" className="font-display text-3xl font-bold text-ink">
            Calendar
          </h1>
          <p className="mt-1 text-ink-soft">Every onboarding task on the day it's due.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex(todayIndex)}
            className="rounded-xl border-2 border-line bg-white px-3 py-1.5 text-sm font-extrabold text-ink-soft hover:border-stone-deep"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="grid size-9 place-items-center rounded-xl border-2 border-line bg-white text-ink disabled:opacity-35"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} strokeWidth={2.75} />
          </button>
          <div className="w-36 text-center font-display text-xl font-bold text-ink" aria-live="polite">
            {monthName}
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            disabled={index === months.length - 1}
            className="grid size-9 place-items-center rounded-xl border-2 border-line bg-white text-ink disabled:opacity-35"
            aria-label="Next month"
          >
            <ChevronRight size={20} strokeWidth={2.75} />
          </button>
        </div>
      </div>

      <Legend />

      {/* Month grid on larger screens */}
      <div className="mt-4 hidden overflow-hidden rounded-3xl border-2 border-line bg-white md:block">
        <div className="grid grid-cols-7 border-b-2 border-line bg-paper">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-3 py-2 text-sm font-extrabold text-ink-soft">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const date = day ? iso(y, m, day) : null
            const list = date ? byDate[date] ?? [] : []
            const today = date === DEMO_TODAY
            const start = date === newHire.startDate
            return (
              <div
                key={i}
                className={`min-h-28 border-line p-2 ${i % 7 ? 'border-l-2' : ''} ${i >= 7 ? 'border-t-2' : ''} ${
                  day ? '' : 'bg-paper/60'
                }`}
              >
                {day && (
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span
                      className={`grid size-7 place-items-center rounded-full text-sm font-extrabold ${
                        today ? 'bg-[#2B7539] text-white' : 'text-ink-soft'
                      }`}
                    >
                      {day}
                    </span>
                    {today && <span className="text-xs font-extrabold text-[#2B7539]">Today</span>}
                    {start && !today && <span className="text-xs font-extrabold text-ink-soft">Day 1</span>}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {list.map((t) => (
                    <TaskChip key={t.id} task={t} status={state[t.id]?.status} onOpen={onOpen} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day-by-day list on phones, where a 7-column grid is too cramped */}
      <ol className="mt-4 flex flex-col gap-4 md:hidden">
        {monthTasks.map((date) => (
          <li key={date}>
            <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-ink">
              {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {date === DEMO_TODAY && (
                <span className="rounded-full bg-[#2B7539] px-2 py-0.5 font-sans text-xs font-extrabold text-white">Today</span>
              )}
            </h2>
            <div className="flex flex-col gap-1.5">
              {byDate[date].map((t) => (
                <TaskChip key={t.id} task={t} status={state[t.id]?.status} onOpen={onOpen} roomy />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function TaskChip({ task, status, onOpen, roomy }) {
  const phase = phaseById(task.phase)
  const done = status === 'done'
  const overdue = isOverdue(task, status)

  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      className={`flex w-full items-start gap-1.5 rounded-lg border-2 text-left font-bold leading-tight ${
        roomy ? 'px-3 py-2.5 text-sm' : 'px-1.5 py-1 text-xs'
      }`}
      style={{
        background: done ? phase.color : phase.tint,
        color: done ? phase.on : '#1f3a2a',
        borderColor: overdue ? 'var(--color-alert)' : done ? phase.color : phase.tint,
      }}
      title={task.title}
      aria-label={`${task.title}. ${phase.name}. ${done ? 'Done' : overdue ? 'Overdue' : 'To do'}.`}
    >
      {done ? (
        <Check size={roomy ? 16 : 13} strokeWidth={3.5} className="mt-px shrink-0" aria-hidden />
      ) : overdue ? (
        <span className="mt-px shrink-0 font-extrabold text-alert" aria-hidden>
          !
        </span>
      ) : null}
      <span className={roomy ? '' : 'line-clamp-2'}>
        {task.title}
        {roomy && <span className="ml-2 font-semibold opacity-75">{formatMinutes(task.minutes)}</span>}
      </span>
    </button>
  )
}

function Legend() {
  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
      {phases.map((p) => (
        <li key={p.id} className="flex items-center gap-1.5 font-bold">
          <span className="inline-block size-3 rounded-full" style={{ background: p.color }} aria-hidden />
          {p.name}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded" style={{ background: phases[0].color }} aria-hidden />
        Done
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded" style={{ background: phases[0].tint }} aria-hidden />
        To do
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded border-2 border-alert bg-white" aria-hidden />
        Overdue
      </li>
    </ul>
  )
}
