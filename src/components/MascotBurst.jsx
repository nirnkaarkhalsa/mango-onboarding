import { useEffect } from 'react'
import Mascot from './Mascot'

export const MOVES = [
  { id: 'dance', say: 'Happy dance!', hat: 'none' },
  { id: 'backflip', say: 'Backflip time!', hat: 'none' },
  { id: 'party', say: 'Party time!', hat: 'party' },
]

// Mango pops into the corner and celebrates after a completed task.
export default function MascotBurst({ move, stage, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="pointer-events-none fixed right-3 top-20 z-[60] flex flex-col items-center md:bottom-10 md:right-10 md:top-auto"
      aria-hidden
    >
      <div className="burst-bubble mb-1 rounded-2xl border-2 border-line bg-white px-3 py-1.5 font-display text-base font-extrabold text-ink shadow-[0_4px_0_#e2e9de]">
        {move.say}
      </div>
      <div className={`burst-${move.id}`}>
        <Mascot stage={stage} mood="cheer" hat={move.hat} size={120} className="h-auto w-24 md:w-[120px]" />
      </div>
    </div>
  )
}
