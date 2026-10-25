import { useState } from 'react'
import { contactFor, managers } from '../data/roster'
import { formatDate, isOverdue, phaseById } from '../lib/progress'
import { summarize } from '../lib/team'
import TeamDashboard from './TeamDashboard'
import HireDetail from './HireDetail'
import CreateHire, { defaultDueFor } from './CreateHire'
import TeamMail from './TeamMail'
import TaskDetail from '../components/TaskDetail'
import AddTaskModal from '../components/AddTaskModal'
import ComposeModal from '../components/ComposeModal'

// Sarah's HR view (everyone) or David's manager view (only his team).
export default function TeamView({ viewer, store, tab, goTo, openHireId, setOpenHireId, actions }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [openTask, setOpenTask] = useState(null)
  const [adding, setAdding] = useState(null)
  const [composing, setComposing] = useState(null)

  const hires = viewer.id === 'david' ? store.hires.filter((h) => h.managerId === 'david') : store.hires
  const summaries = hires.map((h) => summarize(h, store.plans[h.id], store.progress[h.id]))
  const hire = openHireId ? hires.find((h) => h.id === openHireId) : null
  const plan = hire ? store.plans[hire.id] : []
  const progress = hire ? store.progress[hire.id] : {}

  const openHire = (id) => {
    setOpenHireId(id)
    window.scrollTo({ top: 0 })
  }

  const reminderBody = () => {
    const overdue = plan.filter((t) => isOverdue(t, progress[t.id]?.status))
    return {
      subject: `Reminder: ${overdue.length} overdue onboarding ${overdue.length === 1 ? 'task' : 'tasks'}`,
      body: [
        `Hi ${hire.firstName},`,
        '',
        `Quick reminder that ${overdue.length === 1 ? 'this onboarding task is' : 'these onboarding tasks are'} past due:`,
        ...overdue.map((t) => `• ${t.title} (was due ${formatDate(t.due)})`),
        '',
        `You can find ${overdue.length === 1 ? 'it' : 'them'} at the top of your onboarding path. Let me know if anything is getting in the way.`,
        '',
        viewer.name,
      ].join('\n'),
      relatedTask: overdue[0]?.id,
    }
  }

  return (
    <>
      {tab === 'people' &&
        (hire ? (
          <HireDetail
            hire={hire}
            plan={plan}
            progress={progress}
            backLabel={viewer.id === 'david' ? 'My team' : 'All new hires'}
            onBack={() => setOpenHireId(null)}
            onOpenTask={(id) => setOpenTask(id)}
            onAddTask={(phaseId) => setAdding(phaseId)}
            onRemind={() => setComposing({ kind: 'reminder', ...reminderBody() })}
            onMessage={() => setComposing({ kind: 'note', subject: '', body: `Hi ${hire.firstName},\n\n\n\n${viewer.name}` })}
          />
        ) : (
          <TeamDashboard
            viewer={viewer}
            summaries={summaries}
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            onOpenHire={openHire}
          />
        ))}

      {tab === 'create' && (
        <CreateHire
          onPublish={actions.publishHire}
          onViewHire={(id) => {
            goTo('people')
            openHire(id)
          }}
        />
      )}

      {tab === 'mail' && <TeamMail viewer={viewer} hires={hires} messages={store.messages} onSend={actions.sendMessage} />}

      {hire && openTask && plan.find((t) => t.id === openTask) && (
        <TaskDetail
          key={openTask}
          mode="team"
          task={plan.find((t) => t.id === openTask)}
          entry={progress[openTask]}
          contact={contactFor(plan.find((t) => t.id === openTask).owner, hire)}
          hireName={hire.firstName}
          onClose={() => setOpenTask(null)}
          onSendMessage={(task, text) =>
            actions.sendMessage({ to: [hire.id], subject: `About: ${task.title}`, body: text, relatedTask: task.id }, `Message sent to ${hire.firstName}.`)
          }
        />
      )}

      {hire && adding && (
        <AddTaskModal
          phaseId={adding}
          hireName={hire.firstName}
          managerName={managers[hire.managerId]?.name}
          addedBy={viewer.name}
          defaultDue={defaultDueFor(adding, hire.startDate)}
          onClose={() => setAdding(null)}
          onSave={(task) => {
            actions.addTask(hire.id, task, `Added "${task.title}" to ${hire.firstName}'s ${phaseById(adding).name}.`)
            setAdding(null)
          }}
        />
      )}

      {hire && composing && (
        <ComposeModal
          title={composing.kind === 'reminder' ? 'Send an overdue reminder' : `Message ${hire.firstName}`}
          toName={hire.firstName}
          initialSubject={composing.subject}
          initialBody={composing.body}
          onClose={() => setComposing(null)}
          onSend={({ subject, body }) => {
            actions.sendMessage({ to: [hire.id], subject, body, relatedTask: composing.relatedTask }, `Message sent to ${hire.firstName}.`)
            setComposing(null)
          }}
        />
      )}
    </>
  )
}
