import { useCallback, useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { DEMO_TODAY, phases } from '../data/onboarding'
import { contactFor } from '../data/roster'
import { daysBetween, formatDate, isOverdue, nextTask, phaseById, phaseStats, stageFor } from '../lib/progress'
import ProgressHeader from '../components/ProgressHeader'
import FocusCard from '../components/FocusCard'
import Path from '../components/Path'
import TaskDetail from '../components/TaskDetail'
import MailTab from '../components/MailTab'
import CompletedTab from '../components/CompletedTab'
import CalendarTab from '../components/CalendarTab'
import Celebration from '../components/Celebration'
import MascotBurst, { MOVES } from '../components/MascotBurst'

const cheers = [
  'Nice work! That is {done} of {total} done.',
  'One more down. You are on a roll!',
  'Look at you go. {left} left, and no rush.',
  'Done and dusted. Your mango is proud of you.',
]

const countWord = (n) => ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][n] ?? String(n)
const fill = (template, vars) => template.replace(/\{(\w+)\}/g, (_, k) => vars[k])

// Emily's view: her path, calendar, mail and completed tasks.
export default function NewHireView({ hire, tasks, taskState, setTaskState, messages, readIds, onRead, tab, goTo }) {
  const [openId, setOpenId] = useState(null)
  const [celebration, setCelebration] = useState(null)
  const [cheer, setCheer] = useState({ count: 0, message: null })
  const [cheering, setCheering] = useState(false)
  const [burst, setBurst] = useState(null)
  const [flashId, setFlashId] = useState(null)

  const tasksById = useMemo(() => Object.fromEntries(tasks.map((t) => [t.id, t])), [tasks])

  // The mascot cheers for a moment after each completed task, then relaxes.
  useEffect(() => {
    if (!cheer.count) return
    setCheering(true)
    const t = setTimeout(() => setCheering(false), 2200)
    return () => clearTimeout(t)
  }, [cheer.count])

  const stats = useMemo(() => phaseStats(tasks, taskState), [tasks, taskState])
  const next = nextTask(tasks, taskState)
  const overdue = tasks.filter((t) => isOverdue(t, taskState[t.id]?.status))
  const dayNumber = daysBetween(hire.startDate, DEMO_TODAY) + 1
  const graduated = !next
  const stage = graduated ? 'month' : stageFor(tasks, taskState)

  const hello = `Happy ${formatDate(DEMO_TODAY, { weekday: 'long' })}, ${hire.firstName}! It is Day ${dayNumber}.`
  const defaultMessage = !next
    ? `You graduated, ${hire.firstName}! Every onboarding task is done.`
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

  // "Show me where": scroll the path to the current task and flash it.
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
              confetti({ particleCount: 140, spread: 120, origin: { x: [0.2, 0.8, 0.5][i], y: 0.45 }, colors, disableForReducedMotion: true }),
            delay,
          ),
        )
      }, 350)
    } else if (phaseDone) {
      // Finished a section. The task stays open underneath so "Start <next section>"
      // can jump straight to the next task.
      const upcoming = nextTask(tasks, updated)
      const nextPhase = phaseById(upcoming.phase)
      const grew = stageFor(tasks, updated) !== stageFor(tasks, taskState)
      setTimeout(() => {
        setCelebration({ kind: 'phase', finished: phase, next: nextPhase, grew, fromStage: stageFor(tasks, taskState) })
        confetti({ particleCount: 120, spread: 120, origin: { y: 0.4 }, colors: [nextPhase.color, nextPhase.light, '#ffffff'], disableForReducedMotion: true })
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

  return (
    <>
      {tab === 'path' && (
        <div className="flex flex-col gap-8">
          <ProgressHeader stats={stats} overdue={overdue} dayNumber={dayNumber} onOpenTask={openTask} newHire={hire} />
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
            <Path tasks={tasks} state={taskState} stats={stats} currentId={next?.id} flashId={flashId} onOpen={openTask} />
          </div>
        </div>
      )}

      {tab === 'calendar' && <CalendarTab tasks={tasks} state={taskState} onOpen={openTask} />}

      {tab === 'mail' && (
        <MailTab messages={messages} readIds={readIds} onRead={onRead} tasksById={tasksById} onOpenTask={openTask} />
      )}

      {tab === 'done' && <CompletedTab tasks={tasks} state={taskState} onOpen={openTask} onGoToPath={() => goTo('path')} />}

      {openId && tasksById[openId] && (
        <TaskDetail
          key={openId}
          task={tasksById[openId]}
          entry={taskState[openId]}
          contact={contactFor(tasksById[openId].owner, hire)}
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
    </>
  )
}
