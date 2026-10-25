import { useCallback, useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { CalendarDays, CircleCheck, Mail, Map as MapIcon, RotateCcw } from 'lucide-react'
import { DEMO_TODAY, messages, newHire, phases, tasks } from './data/onboarding'
import { usePersistentState } from './lib/usePersistentState'
import { daysBetween, formatDate, isOverdue, nextTask, phaseById, phaseStats } from './lib/progress'
import ProgressHeader from './components/ProgressHeader'
import FocusCard from './components/FocusCard'
import Path from './components/Path'
import TaskDetail from './components/TaskDetail'
import MailTab from './components/MailTab'
import CompletedTab from './components/CompletedTab'
import CalendarTab from './components/CalendarTab'
import Celebration from './components/Celebration'
import Mascot from './components/Mascot'
import MascotBurst, { MOVES } from './components/MascotBurst'

// Bump the version when the sample data changes, so old saved progress doesn't mix with new data.
const TASKS_KEY = 'mango-onboarding:tasks:v2'
const MAIL_KEY = 'mango-onboarding:mail:v2'

const initialTaskState = Object.fromEntries(tasks.map((t) => [t.id, { status: t.status, completedAt: t.completedAt ?? null }]))
const initialRead = messages.filter((m) => m.read).map((m) => m.id)
const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]))

const cheers = [
  'Nice work! That is {done} of {total} done.',
  'One more down. You are on a roll!',
  'Look at you go. {left} left, and no rush.',
  'Done and dusted. Your mango is proud of you.',
]

// The mango grows one size each time Emily fully completes a section:
// small and green until Before Day 1 is done, bigger and yellow-green until
// First Week is done, then fully ripe. Its stage is the first unfinished section.
function stageFor(state) {
  const open = phases.find((p) => tasks.some((t) => t.phase === p.id && state[t.id]?.status !== 'done'))
  return open ? open.id : 'month'
}

const countWord = (n) => ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][n] ?? String(n)

function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k])
}

export default function App() {
  const [taskState, setTaskState] = usePersistentState(TASKS_KEY, initialTaskState)
  const [readIds, setReadIds] = usePersistentState(MAIL_KEY, initialRead)
  const [tab, setTab] = useState('path')
  const [openId, setOpenId] = useState(null)
  const [celebration, setCelebration] = useState(null)
  const [cheer, setCheer] = useState({ count: 0, message: null })
  const [cheering, setCheering] = useState(false)
  const [burst, setBurst] = useState(null)
  const [flashId, setFlashId] = useState(null)

  // The mascot cheers for a moment after each completed task, then relaxes.
  useEffect(() => {
    if (!cheer.count) return
    setCheering(true)
    const t = setTimeout(() => setCheering(false), 2200)
    return () => clearTimeout(t)
  }, [cheer.count])

  const stats = useMemo(() => phaseStats(tasks, taskState), [taskState])
  const next = nextTask(tasks, taskState)
  const overdue = tasks.filter((t) => isOverdue(t, taskState[t.id]?.status))
  const doneCount = stats.reduce((s, x) => s + x.done, 0)
  const unread = messages.filter((m) => !readIds.includes(m.id)).length
  const dayNumber = daysBetween(newHire.startDate, DEMO_TODAY) + 1
  const graduated = !next
  const stage = graduated ? 'month' : stageFor(taskState)

  const hello = `Happy ${formatDate(DEMO_TODAY, { weekday: 'long' })}, Emily! It is Day ${dayNumber}.`
  const defaultMessage = !next
    ? 'You graduated, Emily! Every onboarding task is done.'
    : isOverdue(next, taskState[next.id]?.status)
      ? overdue.length === 1
        ? `${hello} One task slipped through the cracks. Let's knock it out first.`
        : `${hello} ${countWord(overdue.length)} tasks slipped through the cracks. Let's knock them out, starting with this one.`
      : `${hello} Here is the one thing to focus on.`

  const openTask = useCallback(
    (id) => {
      setTaskState((s) => (s[id]?.status === 'todo' ? { ...s, [id]: { ...s[id], status: 'in_progress' } } : s))
      setOpenId(id)
    },
    [setTaskState],
  )

  const closeTask = useCallback(() => setOpenId(null), [])
  const endBurst = useCallback(() => setBurst(null), [])
  const closeCelebration = useCallback(() => setCelebration(null), [])

  // "Show me where": scroll the path to Emily's current task and flash it.
  const showOnPath = (id) => {
    const el = document.getElementById(`stone-${id}`)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
    setFlashId(null)
    requestAnimationFrame(() => setFlashId(id))
    setTimeout(() => setFlashId((f) => (f === id ? null : f)), 1500)
  }

  const toggleDone = (id, done) => {
    const task = tasksById[id]
    const updated = {
      ...taskState,
      [id]: done ? { status: 'done', completedAt: DEMO_TODAY } : { status: 'in_progress', completedAt: null },
    }
    setTaskState(updated)
    if (!done) return

    const phase = phaseById(task.phase)
    const phaseDone = tasks.filter((t) => t.phase === phase.id).every((t) => updated[t.id].status === 'done')
    const total = tasks.length
    const nowDone = tasks.filter((t) => updated[t.id].status === 'done').length
    const allDone = nowDone === total

    confetti({
      particleCount: phaseDone ? 160 : 70,
      spread: phaseDone ? 100 : 65,
      origin: { y: 0.55 },
      colors: [phase.color, phase.light, phase.deep, '#ffffff'],
      disableForReducedMotion: true,
    })

    setCheer((c) => ({
      count: c.count + 1,
      message: fill(cheers[c.count % cheers.length], { done: nowDone, total, left: total - nowDone }),
    }))

    if (allDone) {
      // Last task: the mango graduates.
      setOpenId(null)
      setTimeout(() => {
        setCelebration({ kind: 'graduate', finished: phase, next: null })
        const colors = phases.flatMap((x) => [x.color, x.light])
        ;[0, 250, 500].forEach((delay, i) =>
          setTimeout(
            () =>
              confetti({
                particleCount: 140,
                spread: 120,
                origin: { x: [0.2, 0.8, 0.5][i], y: 0.45 },
                colors,
                disableForReducedMotion: true,
              }),
            delay,
          ),
        )
      }, 350)
    } else if (phaseDone) {
      // Finished a phase. The task stays open underneath so "Start <next phase>"
      // can jump straight to the next task. If the mango grew, say so; if Emily
      // was catching up on an earlier phase, say that instead.
      const upcoming = nextTask(tasks, updated)
      const nextPhase = phaseById(upcoming.phase)
      const grew = stageFor(updated) !== stageFor(taskState)
      setTimeout(() => {
        setCelebration({ kind: 'phase', finished: phase, next: nextPhase, grew, fromStage: stageFor(taskState) })
        confetti({
          particleCount: 120,
          spread: 120,
          origin: { y: 0.4 },
          colors: [nextPhase.color, nextPhase.light, '#ffffff'],
          disableForReducedMotion: true,
        })
      }, 350)
    } else {
      // A regular task: Mango pops out to dance, flip or party.
      setBurst({ key: Date.now(), move: MOVES[Math.floor(Math.random() * MOVES.length)] })
    }
  }

  const continueAfterCelebration = () => {
    setCelebration(null)
    if (next) openTask(next.id)
  }

  const markRead = (id) => setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]))

  const resetDemo = () => {
    setTaskState(initialTaskState)
    setReadIds(initialRead)
    setCheer({ count: 0, message: null })
    setCheering(false)
    setCelebration(null)
    setBurst(null)
    setOpenId(null)
    setTab('path')
  }

  const goTo = (id) => {
    setTab(id)
    window.scrollTo({ top: 0 })
  }

  const navItems = [
    { id: 'path', label: 'My path', icon: MapIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'mail', label: 'Mail', icon: Mail, badge: unread },
    { id: 'done', label: 'Completed', icon: CircleCheck, count: doneCount },
  ]

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b-2 border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Mascot stage={stage} hat={graduated ? 'grad' : 'none'} size={34} />
            <div className="leading-none">
              <div className="font-display text-xl font-extrabold text-ink">BrightPath</div>
              <div className="text-xs font-bold text-ink-soft">Onboarding</div>
            </div>
          </div>

          <nav aria-label="Main" className="ml-6 hidden gap-1 md:flex">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} active={tab === item.id} onClick={() => goTo(item.id)} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <div className="font-extrabold text-ink">{newHire.firstName}</div>
              <div className="text-xs text-ink-soft">
                {newHire.role}, {newHire.department}
              </div>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-[#FBEBC2] font-display text-lg font-bold text-[#8F6200]" aria-hidden>
              E
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
        {tab === 'path' && (
          <div className="flex flex-col gap-8">
            <ProgressHeader
              stats={stats}
              overdue={overdue}
              dayNumber={dayNumber}
              onOpenTask={openTask}
              newHire={newHire}
            />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
              <FocusCard
                task={next}
                status={next ? taskState[next.id]?.status : null}
                stage={stage}
                graduated={graduated}
                mood={cheering || graduated ? 'cheer' : 'happy'}
                message={graduated ? defaultMessage : (cheer.message ?? defaultMessage)}
                hopKey={cheer.count}
                onShow={showOnPath}
                onOpen={openTask}
              />
              <Path
                tasks={tasks}
                state={taskState}
                stats={stats}
                currentId={next?.id}
                flashId={flashId}
                onOpen={openTask}
              />
            </div>
          </div>
        )}

        {tab === 'calendar' && <CalendarTab tasks={tasks} state={taskState} onOpen={openTask} />}

        {tab === 'mail' && (
          <MailTab messages={messages} readIds={readIds} onRead={markRead} tasksById={tasksById} onOpenTask={openTask} />
        )}

        {tab === 'done' && (
          <CompletedTab tasks={tasks} state={taskState} onOpen={openTask} onGoToPath={() => goTo('path')} />
        )}

        <footer className="mt-14 flex flex-col items-center gap-2 border-t-2 border-line pt-5 text-center text-sm text-ink-soft sm:flex-row sm:justify-between sm:text-left">
          <span>
            Prototype with sample data. Demo date: {formatDate(DEMO_TODAY, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
          </span>
          <button
            type="button"
            onClick={resetDemo}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold text-ink-soft hover:bg-white"
          >
            <RotateCcw size={15} aria-hidden /> Reset demo
          </button>
        </footer>
      </main>

      {/* Bottom tab bar on phones */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 flex border-t-2 border-line bg-white md:hidden">
        {navItems.map((item) => (
          <NavButton key={item.id} item={item} active={tab === item.id} onClick={() => goTo(item.id)} mobile />
        ))}
      </nav>

      {openId && (
        <TaskDetail
          key={openId}
          task={tasksById[openId]}
          entry={taskState[openId]}
          nextTask={next && next.id !== openId ? next : null}
          onClose={closeTask}
          onToggleDone={toggleDone}
          onOpenNext={openTask}
        />
      )}

      {celebration && (
        <Celebration
          kind={celebration.kind}
          stage={stage}
          grew={celebration.grew}
          fromStage={celebration.fromStage}
          finished={celebration.finished}
          next={celebration.next}
          onContinue={continueAfterCelebration}
          onClose={closeCelebration}
        />
      )}

      {burst && <MascotBurst key={burst.key} move={burst.move} stage={stage} onDone={endBurst} />}
    </div>
  )
}

function NavButton({ item, active, onClick, mobile }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={
        mobile
          ? `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-extrabold ${active ? 'text-[#2B7539]' : 'text-ink-soft'}`
          : `flex items-center gap-2 rounded-xl border-2 px-3.5 py-1.5 font-extrabold ${
              active ? 'border-[#8FD28F] bg-[#D9EED8] text-[#2B7539]' : 'border-transparent text-ink-soft hover:bg-paper'
            }`
      }
    >
      <span className="relative">
        <Icon size={mobile ? 24 : 19} strokeWidth={2.5} aria-hidden />
        {item.badge > 0 && (
          <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-[#E8590C] px-1 text-[10px] font-extrabold leading-4 text-white">
            {item.badge}
          </span>
        )}
      </span>
      <span>
        {item.label}
        {item.count > 0 && !mobile && <span className="ml-1 font-bold text-muted">{item.count}</span>}
        {item.badge > 0 && <span className="sr-only"> ({item.badge} unread)</span>}
      </span>
    </button>
  )
}
