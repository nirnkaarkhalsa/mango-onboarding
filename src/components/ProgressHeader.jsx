import { CircleAlert, CircleCheck } from 'lucide-react'
import { PhaseRing, SegmentedRing } from './ProgressRings'
import { formatDate } from '../lib/progress'

export default function ProgressHeader({ stats, overdue, dayNumber, onOpenTask, newHire }) {
  const done = stats.reduce((s, x) => s + x.done, 0)
  const total = stats.reduce((s, x) => s + x.total, 0)

  return (
    <section
      aria-label="Your progress"
      className="rounded-3xl border-2 border-line bg-white px-5 py-5 md:px-7"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="lg:w-52 lg:shrink-0">
          <h1 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
            Hi, {newHire.firstName}
          </h1>
          <p className="mt-1 text-ink-soft">
            Day {dayNumber} of your onboarding.
            <span className="hidden sm:inline">
              {' '}You started {formatDate(newHire.startDate, { weekday: 'long', month: 'short', day: 'numeric' })}.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4 lg:flex lg:flex-1 lg:gap-x-6">
          <SegmentedRing
            className="size-24 md:size-[124px]"
            size={124}
            stroke={15}
            label={`${done} of ${total} onboarding tasks done`}
            segments={stats.map(({ phase, done, total }) => ({
              label: phase.name,
              done,
              total,
              color: phase.color,
              tint: phase.tint,
            }))}
          >
            <div>
              <div className="font-display text-2xl font-extrabold leading-none text-ink md:text-3xl">{done}</div>
              <div className="text-xs font-bold text-ink-soft">of {total} done</div>
            </div>
          </SegmentedRing>

          <ul className="col-span-2 flex justify-around gap-2 lg:col-span-1 lg:justify-start lg:gap-5">
            {stats.map(({ phase, done, total }) => (
              <li key={phase.id} className="flex w-28 flex-col items-center gap-2 text-center">
                <PhaseRing phase={phase} done={done} total={total} />
                <div className="leading-tight">
                  <div className="flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-extrabold text-ink">
                    <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: phase.color }} aria-hidden />
                    {phase.name}
                  </div>
                  <div className="text-sm text-ink-soft">
                    {done === total ? 'All done' : `${total - done} to go`}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="row-start-1 col-start-2 lg:order-last lg:ml-auto">
            {overdue.length > 0 ? (
              <button
                type="button"
                onClick={() => onOpenTask(overdue[0].id)}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-alert/25 bg-alert-tint px-4 py-3 text-left hover:border-alert/50"
              >
                <span className="font-display text-4xl font-extrabold leading-none text-alert">{overdue.length}</span>
                <span className="leading-tight">
                  <span className="flex items-center gap-1 text-sm font-extrabold text-alert">
                    <CircleAlert size={16} strokeWidth={2.75} aria-hidden />
                    {overdue.length === 1 ? 'Task needs attention' : 'Tasks need attention'}
                  </span>
                  <span className="text-sm text-ink-soft">Past due. Open it to catch up.</span>
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-line bg-paper px-4 py-3">
                <span className="font-display text-4xl font-extrabold leading-none text-ink">0</span>
                <span className="leading-tight">
                  <span className="flex items-center gap-1 text-sm font-extrabold text-[#2b7539]">
                    <CircleCheck size={16} strokeWidth={2.75} aria-hidden />
                    Nothing overdue
                  </span>
                  <span className="text-sm text-ink-soft">You are right on track.</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
