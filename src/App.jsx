import { useCallback, useState } from 'react'
import { CalendarDays, CircleCheck, Mail, Map as MapIcon, RotateCcw, Send, UserPlus, Users } from 'lucide-react'
import { DEMO_TODAY } from './data/onboarding'
import { buildSeed, viewers } from './data/roster'
import { usePersistentState } from './lib/usePersistentState'
import { formatDate, nextTask, stageFor } from './lib/progress'
import { nowTime } from './lib/team'
import Mascot from './components/Mascot'
import ViewSwitcher from './components/ViewSwitcher'
import NewHireView from './views/NewHireView'
import TeamView from './views/TeamView'

// Bump the version when the sample data changes, so old saved progress doesn't mix with new data.
const STORE_KEY = 'mango-onboarding:store:v3'
const seed = buildSeed()

const firstTab = { emily: 'path', sarah: 'people', david: 'people' }

export default function App() {
  const [store, setStore] = usePersistentState(STORE_KEY, seed)
  const [tabs, setTabs] = useState(firstTab)
  const [openHireId, setOpenHireId] = useState(null)
  const [toast, setToast] = useState(null)
  const [resetCount, setResetCount] = useState(0)

  const viewerId = store.viewer
  const viewer = viewers[viewerId]
  const tab = tabs[viewerId]

  // ---------- Emily ----------
  const emily = store.hires.find((h) => h.id === 'emily')
  const emilyTasks = store.plans.emily
  const emilyState = store.progress.emily
  const emilyMail = store.messages.filter((m) => m.to.includes('emily'))
  const unread = emilyMail.filter((m) => !store.readIds.includes(m.id)).length
  const emilyDone = emilyTasks.filter((t) => emilyState[t.id]?.status === 'done').length
  const graduated = !nextTask(emilyTasks, emilyState)
  const stage = viewerId === 'emily' ? (graduated ? 'month' : stageFor(emilyTasks, emilyState)) : 'month'

  const setEmilyState = useCallback(
    (updater) =>
      setStore((s) => ({
        ...s,
        progress: { ...s.progress, emily: typeof updater === 'function' ? updater(s.progress.emily) : updater },
      })),
    [setStore],
  )

  const markRead = (id) => setStore((s) => (s.readIds.includes(id) ? s : { ...s, readIds: [...s.readIds, id] }))

  // ---------- Shared actions for Sarah and David ----------
  const showToast = (text) => {
    setToast({ text, key: Date.now() })
    setTimeout(() => setToast((t) => (t && t.text === text ? null : t)), 3200)
  }

  const message = (from, { to, subject, body, relatedTask }) => ({
    id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    from: from.name,
    fromTitle: from.title,
    date: DEMO_TODAY,
    time: nowTime(),
    subject,
    body: body.split(/\n\s*\n/),
    relatedTask,
    to,
  })

  const actions = {
    sendMessage: (msg, note) => {
      setStore((s) => ({ ...s, messages: [message(viewer, msg), ...s.messages] }))
      showToast(note ?? `Sent to ${msg.to.length === 1 ? store.hires.find((h) => h.id === msg.to[0])?.firstName : `${msg.to.length} people`}.`)
    },
    addTask: (hireId, task, note) => {
      setStore((s) => ({
        ...s,
        plans: { ...s.plans, [hireId]: [...s.plans[hireId], task].sort((a, b) => a.due.localeCompare(b.due)) },
        progress: { ...s.progress, [hireId]: { ...s.progress[hireId], [task.id]: { status: 'todo', completedAt: null } } },
      }))
      showToast(note)
    },
    publishHire: (hire, plan) => {
      const welcome = message(viewers.sarah, {
        to: [hire.id],
        subject: `Welcome to BrightPath, ${hire.firstName}!`,
        body: `Hi ${hire.firstName},\n\nWelcome aboard! Everything you need before and after your first day is now in one place: your onboarding path.\n\nYou'll only see what to focus on next, so you never have to wonder what's important. Your first tasks are due before ${formatDate(hire.startDate)}.\n\nSarah`,
      })
      setStore((s) => ({
        ...s,
        hires: [...s.hires, hire],
        plans: { ...s.plans, [hire.id]: plan },
        progress: { ...s.progress, [hire.id]: Object.fromEntries(plan.map((t) => [t.id, { status: 'todo', completedAt: null }])) },
        messages: [welcome, ...s.messages],
      }))
    },
  }

  // ---------- Navigation ----------
  const goTo = (id) => {
    setTabs((t) => ({ ...t, [viewerId]: id }))
    setOpenHireId(null)
    window.scrollTo({ top: 0 })
  }

  const switchViewer = (id) => {
    setStore((s) => ({ ...s, viewer: id }))
    setOpenHireId(null)
    window.scrollTo({ top: 0 })
  }

  const resetDemo = () => {
    setStore({ ...buildSeed(), viewer: viewerId })
    setTabs(firstTab)
    setOpenHireId(null)
    setResetCount((n) => n + 1)
  }

  const navItems =
    viewerId === 'emily'
      ? [
          { id: 'path', label: 'My path', icon: MapIcon },
          { id: 'calendar', label: 'Calendar', icon: CalendarDays },
          { id: 'mail', label: 'Mail', icon: Mail, badge: unread },
          { id: 'done', label: 'Completed', icon: CircleCheck, count: emilyDone },
        ]
      : viewerId === 'sarah'
        ? [
            { id: 'people', label: 'New hires', icon: Users },
            { id: 'create', label: 'Add new hire', icon: UserPlus },
            { id: 'mail', label: 'Mail', icon: Send },
          ]
        : [
            { id: 'people', label: 'My team', icon: Users },
            { id: 'mail', label: 'Mail', icon: Send },
          ]

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b-2 border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Mascot stage={stage} hat={viewerId === 'emily' && graduated ? 'grad' : 'none'} size={34} />
            <div className="leading-none">
              <div className="font-display text-xl font-extrabold text-ink">BrightPath</div>
              <div className="text-xs font-bold text-ink-soft">{viewerId === 'emily' ? 'Onboarding' : viewerId === 'sarah' ? 'Onboarding for HR' : 'Onboarding for managers'}</div>
            </div>
          </div>

          <nav aria-label="Main" className="ml-6 hidden gap-1 md:flex">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} active={tab === item.id} onClick={() => goTo(item.id)} />
            ))}
          </nav>

          <ViewSwitcher viewer={viewerId} onChange={switchViewer} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
        {viewerId === 'emily' ? (
          <NewHireView
            key={`emily-${resetCount}`}
            hire={emily}
            tasks={emilyTasks}
            taskState={emilyState}
            setTaskState={setEmilyState}
            messages={emilyMail}
            readIds={store.readIds}
            onRead={markRead}
            tab={tab}
            goTo={goTo}
          />
        ) : (
          <TeamView
            key={`${viewerId}-${resetCount}`}
            viewer={viewer}
            store={store}
            tab={tab}
            goTo={goTo}
            openHireId={openHireId}
            setOpenHireId={setOpenHireId}
            actions={actions}
          />
        )}

        <footer className="mt-14 flex flex-col items-center gap-2 border-t-2 border-line pt-5 text-center text-sm text-ink-soft sm:flex-row sm:justify-between sm:text-left">
          <span>
            Prototype with sample data. Demo date: {formatDate(DEMO_TODAY, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. Switch views from the profile menu.
          </span>
          <button type="button" onClick={resetDemo} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold text-ink-soft hover:bg-white">
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

      {toast && (
        <div
          key={toast.key}
          role="status"
          className="pop-enter fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-2xl bg-ink px-5 py-3 font-bold text-white shadow-[0_4px_0_#0d1f15] md:bottom-8"
        >
          {toast.text}
        </div>
      )}
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
