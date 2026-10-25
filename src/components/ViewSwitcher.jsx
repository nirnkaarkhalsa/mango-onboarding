import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { viewers } from '../data/roster'

const descriptions = {
  emily: 'New hire: her onboarding path',
  sarah: 'HR: everyone who is onboarding',
  david: 'Manager: only his team',
}

// The profile menu in the top corner doubles as the prototype's view switch.
export default function ViewSwitcher({ viewer, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const me = viewers[viewer]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-paper"
      >
        <span className="hidden text-right leading-tight sm:block">
          <span className="block font-extrabold text-ink">{me.name}</span>
          <span className="block text-xs text-ink-soft">{me.title}</span>
        </span>
        <Avatar v={me} />
        <ChevronDown size={18} strokeWidth={2.75} className={`text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        <span className="sr-only">Switch view</span>
      </button>

      {open && (
        <div role="menu" className="pop-enter absolute right-0 top-14 z-40 w-72 rounded-2xl border-2 border-line bg-white p-2 shadow-[0_6px_0_#e2e9de]">
          <div className="px-3 pb-1 pt-2 text-xs font-extrabold text-ink-soft">View the prototype as</div>
          {Object.values(viewers).map((v) => (
            <button
              key={v.id}
              type="button"
              role="menuitemradio"
              aria-checked={v.id === viewer}
              onClick={() => {
                onChange(v.id)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${v.id === viewer ? 'bg-paper' : 'hover:bg-paper'}`}
            >
              <Avatar v={v} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block font-extrabold text-ink">
                  {v.name}, {v.title.split(',')[0]}
                </span>
                <span className="block text-sm text-ink-soft">{descriptions[v.id]}</span>
              </span>
              {v.id === viewer && <Check size={18} strokeWidth={3} className="shrink-0 text-[#2B7539]" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Avatar({ v }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full font-display text-lg font-bold" style={{ background: v.bg, color: v.fg }} aria-hidden>
      {v.initial}
    </span>
  )
}
