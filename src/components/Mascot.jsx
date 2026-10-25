import { useId } from 'react'

// An original mango character. Its color follows the phase Emily is in,
// so the mango "ripens" from green to gold to orange as she progresses.
export default function Mascot({ phase, mood = 'happy', size = 96, className = '' }) {
  const id = useId().replace(/:/g, '')
  const cheer = mood === 'cheer'

  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      className={className}
      role="img"
      aria-label="Mango, your onboarding guide"
    >
      <defs>
        <radialGradient id={`body-${id}`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor={phase.light} />
          <stop offset="0.65" stopColor={phase.color} />
          <stop offset="1" stopColor={phase.deep} />
        </radialGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="60" cy="134" rx="30" ry="4.5" fill="#1f3a2a" opacity="0.1" />

      {/* arms */}
      {cheer ? (
        <g stroke={phase.deep} strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M22 76 Q 8 62 12 44" />
          <path d="M98 76 Q 112 62 108 44" />
        </g>
      ) : (
        <g stroke={phase.deep} strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M20 86 Q 9 94 13 106" />
          <path d="M100 86 Q 111 94 107 106" />
        </g>
      )}

      {/* feet */}
      <ellipse cx="45" cy="128" rx="10" ry="5" fill={phase.deep} />
      <ellipse cx="75" cy="128" rx="10" ry="5" fill={phase.deep} />

      {/* stem and leaf */}
      <path d="M59 28 C 58 20 60 15 65 11" stroke="#6b4a2b" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M64 16 C 72 2 94 0 104 9 C 94 22 76 26 64 16 Z" fill="#3e9b4f" stroke="#2b7539" strokeWidth="2.5" />
      <path d="M68 15 C 78 12 88 10 98 9" stroke="#2b7539" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* body */}
      <path
        d="M60 26 C 88 24 106 48 104 82 C 102 112 82 130 56 128 C 30 126 14 106 16 78 C 18 50 34 28 60 26 Z"
        fill={`url(#body-${id})`}
        stroke={phase.deep}
        strokeWidth="3"
      />
      {/* blush of ripeness */}
      <ellipse cx="86" cy="96" rx="14" ry="20" fill="#e8590c" opacity="0.2" />
      {/* shine */}
      <ellipse cx="40" cy="48" rx="10" ry="6" fill="#ffffff" opacity="0.4" transform="rotate(-30 40 48)" />

      {/* eyes */}
      <ellipse cx="46" cy="72" rx="11" ry="13" fill="#ffffff" />
      <ellipse cx="74" cy="72" rx="11" ry="13" fill="#ffffff" />
      {cheer ? (
        <g stroke="#1f2a22" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M39 74 Q 46 66 53 74" />
          <path d="M67 74 Q 74 66 81 74" />
        </g>
      ) : (
        <g>
          <circle cx="48" cy="74" r="6.5" fill="#1f2a22" />
          <circle cx="76" cy="74" r="6.5" fill="#1f2a22" />
          <circle cx="50.5" cy="71" r="2.2" fill="#ffffff" />
          <circle cx="78.5" cy="71" r="2.2" fill="#ffffff" />
        </g>
      )}

      {/* cheeks */}
      <ellipse cx="34" cy="92" rx="6.5" ry="4" fill="#ff7a6b" opacity="0.5" />
      <ellipse cx="86" cy="92" rx="6.5" ry="4" fill="#ff7a6b" opacity="0.5" />

      {/* mouth */}
      {cheer ? (
        <g>
          <path d="M47 90 Q 60 110 73 90 Z" fill="#7a2e1f" stroke="#1f2a22" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M53 99 Q 60 104 67 99 Q 60 96 53 99 Z" fill="#ff7a6b" />
        </g>
      ) : (
        <path d="M50 92 Q 60 101 70 92" stroke="#1f2a22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  )
}
