import { useState } from 'react'
import { Send } from 'lucide-react'
import Modal, { fieldClass, labelClass } from './Modal'

// A message to one new hire: a general note, or the pre-filled overdue reminder.
export default function ComposeModal({ title, toName, initialSubject = '', initialBody = '', onSend, onClose }) {
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const valid = subject.trim() && body.trim()

  return (
    <Modal title={title} subtitle={`To ${toName}. It arrives in their Mail tab.`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) onSend({ subject: subject.trim(), body: body.trim() })
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="c-subject" className={labelClass}>
            Subject
          </label>
          <input id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="c-body" className={labelClass}>
            Message
          </label>
          <textarea id="c-body" value={body} onChange={(e) => setBody(e.target.value)} rows={9} className={fieldClass} />
        </div>
        <button
          type="submit"
          disabled={!valid}
          className="btn-chunky flex items-center justify-center gap-2 rounded-2xl bg-[#2B7539] py-3 font-display text-xl font-bold text-white disabled:opacity-40"
          style={{ '--btn-deep': '#1f3a2a' }}
        >
          <Send size={18} strokeWidth={2.75} aria-hidden /> Send to {toName}
        </button>
      </form>
    </Modal>
  )
}
