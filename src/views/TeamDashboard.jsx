import { ChevronRight, Search, X } from 'lucide-react'
import Mascot from '../components/Mascot'
import { arcPath } from '../components/ProgressRings'
import { managers } from '../data/roster'
import { STATUS, tenure } from '../lib/team'

const ORDER = ['completed', 'ontime', 'overdue']
const MASCOTS = {
  completed: { mood: 'cheer', hat: 'grad', caption: 'Finished onboarding' },
  ontime: { mood: 'study', hat: 'none', caption: 'Still working, nothing overdue' },
  overdue: { mood: 'worried', hat: 'none', caption: 'At least one task is past due' },
}

// Sarah's (or David's) overview: who is done, who is on track, who needs a nudge.
export default function TeamDashboard({ viewer, summaries, filter, setFilter, query, setQuery, onOpenHire }) {
  const counts = Object.fromEntries(ORDER.map((k) => [k, summaries.filter((x) => x.status === k).length]))
  const total = summaries.length
  const team = viewer.id === 'david'

  const q = query.trim().toLowerCase()
  const list = summaries
    .filter((x) => filter === 'all' || x.status === filter)
    .filter((x) => !q || x.hire.firstName.toLowerCase().includes(q))
    .sort((a, b) => a.hire.firstName.localeCompare(b.hire.firstName))

  const toggle = (k) => setFilter(filter === k ? 'all' : k)

  const bigLabel =
    filter === 'all'
      ? `${list.length === 1 ? 'person is' : 'people are'} onboarding${team ? ' on your team' : ''}`
      : filter === 'completed'
        ? `${list.length === 1 ? 'person has' : 'people have'} finished onboarding`
        : filter === 'ontime'
          ? `${list.length === 1 ? 'person is' : 'people are'} on time`
          : `${list.length === 1 ? 'person has' : 'people have'} an overdue task`

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Onboarding overview" className="rounded-3xl border-2 border-line bg-white px-5 py-5 md:px-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="lg:w-56 lg:shrink-0">
            <h1 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">Hi, {viewer.name}</h1>
            <p className="mt-1 text-ink-soft">
              {total} {total === 1 ? 'person is' : 'people are'} onboarding{team ? ' on your team' : ''}.{' '}
              {counts.overdue > 0
                ? `${counts.overdue} ${counts.overdue === 1 ? 'needs' : 'need'} a nudge.`
                : 'Nobody is behind.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-1">
            <StatusDonut counts={counts} total={total} filter={filter} onPick={toggle} />

            <ul className="grid w-full grid-cols-3 gap-2 sm:gap-3">
              {ORDER.map((k) => {
                const s = STATUS[k]
                const m = MASCOTS[k]
                const active = filter === k
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => toggle(k)}
                      aria-pressed={active}
                      className="flex h-full w-full flex-col items-center rounded-2xl border-2 px-2 pb-3 pt-2 text-center transition-colors"
                      style={{ borderColor: active ? s.color : 'var(--color-line)', background: active ? s.tint : '#ffffff' }}
                    >
                      <Mascot stage="month" mood={m.mood} hat={m.hat} size={70} className="h-auto w-14 sm:w-[70px]" />
                      <span className="mt-1 font-display text-3xl font-extrabold leading-none text-ink">{counts[k]}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-sm font-extrabold leading-tight text-ink">
                        <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden />
                        {s.label}
                      </span>
                      <span className="mt-0.5 hidden text-xs text-ink-soft sm:block">{m.caption}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="list-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl font-extrabold leading-none" style={{ color: filter === 'all' ? 'var(--color-ink)' : STATUS[filter].deep }}>
              {list.length}
            </span>
            <h2 id="list-title" className="font-display text-xl font-bold text-ink">
              {bigLabel}
            </h2>
          </div>
          {filter !== 'all' && (
            <button type="button" onClick={() => setFilter('all')} className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-extrabold text-ink-soft hover:bg-white">
              <X size={15} strokeWidth={3} aria-hidden /> Show everyone
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative block md:w-80">
            <span className="sr-only">Search by name</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full rounded-2xl border-2 border-line bg-white py-2.5 pl-10 pr-3 text-ink outline-none focus:border-[#3E9B4F]"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {['all', ...ORDER].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                aria-pressed={filter === k}
                className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-extrabold"
                style={
                  filter === k
                    ? { borderColor: k === 'all' ? '#1f3a2a' : STATUS[k].color, background: k === 'all' ? '#1f3a2a' : STATUS[k].tint, color: k === 'all' ? '#fff' : STATUS[k].deep }
                    : { borderColor: 'var(--color-line)', background: '#fff', color: 'var(--color-ink-soft)' }
                }
              >
                {k !== 'all' && <span className="inline-block size-2 rounded-full" style={{ background: STATUS[k].color }} aria-hidden />}
                {k === 'all' ? `Everyone ${total}` : `${STATUS[k].label} ${counts[k]}`}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-5 rounded-3xl border-2 border-dashed border-line p-8 text-center text-ink-soft">
            {q ? `No one named "${query.trim()}" is onboarding right now.` : 'No one here right now.'}
            {(q || filter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
                className="ml-2 font-extrabold text-[#2B7539] underline underline-offset-2"
              >
                Show everyone
              </button>
            )}
          </div>
        ) : (
          <ul className="mt-5 flex flex-col gap-2">
            {list.map((x) => (
              <HireRow key={x.hire.id} summary={x} showManager={!team} onOpen={() => onOpenHire(x.hire.id)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function HireRow({ summary, showManager, onOpen }) {
  const { hire, done, total, overdue, status } = summary
  const s = STATUS[status]
  const t = tenure(hire)
  const manager = managers[hire.managerId]

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 rounded-2xl border-2 border-line bg-white p-3 text-left hover:border-stone-deep md:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:p-4"
      >
        <span className="grid size-11 place-items-center rounded-full font-display text-lg font-bold" style={{ background: s.tint, color: s.deep }} aria-hidden>
          {hire.firstName[0]}
        </span>

        <span className="min-w-0">
          <span className="block font-display text-lg font-bold leading-tight text-ink">{hire.firstName}</span>
          <span className="block truncate text-sm text-ink-soft">
            {hire.role}, {hire.department}
            {showManager && manager ? `. Manager: ${manager.name}` : ''}
          </span>
        </span>

        <span className="col-span-3 col-start-2 row-start-2 text-sm md:col-span-1 md:col-start-auto md:row-start-auto">
          <span className="block font-extrabold text-ink">{t.label}</span>
          <span className="block text-ink-soft">{t.detail}</span>
        </span>

        <span className="col-span-3 col-start-2 row-start-3 md:col-span-1 md:col-start-auto md:row-start-auto">
          <span className="block text-sm font-bold text-ink-soft">
            {done} of {total} done
          </span>
          <span className="mt-1 block h-2 overflow-hidden rounded-full bg-stone" aria-hidden>
            <span className="block h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: s.color }} />
          </span>
        </span>

        <span className="col-start-3 row-start-1 flex items-center gap-2 md:col-start-auto md:row-start-auto">
          <span className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-extrabold" style={{ background: s.tint, color: s.deep }}>
            {status === 'overdue' ? `${overdue.length} overdue` : s.label}
          </span>
          <ChevronRight size={20} className="hidden text-ink-soft md:block" aria-hidden />
        </span>
      </button>
    </li>
  )
}

function StatusDonut({ counts, total, filter, onPick }) {
  const size = 168
  const stroke = 30
  const r = (size - stroke - 8) / 2 // leave room for the selected slice to thicken
  const gap = 3
  let cursor = 0
  const arcs = ORDER.filter((k) => counts[k] > 0).map((k) => {
    const span = (counts[k] / total) * 360
    const start = cursor + (counts[k] < total ? gap / 2 : 0)
    const end = cursor + span - (counts[k] < total ? gap / 2 : 0)
    cursor += span
    return { k, d: arcPath(size / 2, size / 2, r, start, end) }
  })

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full" role="img" aria-label={ORDER.map((k) => `${STATUS[k].label}: ${counts[k]}`).join(', ')}>
        {arcs.map(({ k, d }) => (
          <path
            key={k}
            d={d}
            stroke={STATUS[k].color}
            strokeWidth={filter === k ? stroke + 6 : stroke}
            fill="none"
            opacity={filter === 'all' || filter === k ? 1 : 0.3}
            className="cursor-pointer transition-[opacity,stroke-width]"
            onClick={() => onPick(k)}
          >
            <title>{`${STATUS[k].label}: ${counts[k]}. Click to show them.`}</title>
          </path>
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl font-extrabold leading-none text-ink">{total}</div>
          <div className="text-xs font-bold text-ink-soft">in onboarding</div>
        </div>
      </div>
    </div>
  )
}
