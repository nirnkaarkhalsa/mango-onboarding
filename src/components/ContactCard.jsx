import { AtSign, Hash, MapPin, Phone } from 'lucide-react'

// Email, Slack, phone and where to find someone. Used in task details and Mail.
export default function ContactCard({ contact, tint = '#D9EED8', deep = '#2B7539', emailSubject, id }) {
  const short = contact.name === 'IT Help Desk' ? 'IT' : contact.name
  return (
    <div id={id} className="pop-enter rounded-2xl border-2 p-4" style={{ borderColor: tint }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full font-display text-lg font-bold" style={{ background: tint, color: deep }} aria-hidden>
            {contact.name === 'IT Help Desk' ? 'IT' : contact.name[0]}
          </span>
          <div className="leading-tight">
            <div className="font-extrabold text-ink">{contact.name}</div>
            <div className="text-sm text-ink-soft">{contact.title}</div>
          </div>
        </div>
        <a
          href={`mailto:${contact.email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ''}`}
          className="btn-chunky rounded-xl px-4 py-2 font-display font-bold text-white"
          style={{ background: deep, '--btn-deep': '#1f3a2a' }}
        >
          Email {short}
        </a>
      </div>
      <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <Row icon={AtSign} label="Email">{contact.email}</Row>
        <Row icon={Hash} label="Slack">{contact.slack}</Row>
        <Row icon={Phone} label="Phone">{contact.phone}</Row>
        <Row icon={MapPin} label="Find them">{contact.where}</Row>
      </ul>
      <p className="mt-3 text-sm text-ink-soft">{contact.hours}.</p>
    </div>
  )
}

function Row({ icon: Icon, label, children }) {
  return (
    <li className="flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2">
      <Icon size={16} className="shrink-0 text-ink-soft" aria-hidden />
      <span className="sr-only">{label}: </span>
      <span className="truncate font-bold text-ink">{children}</span>
    </li>
  )
}
