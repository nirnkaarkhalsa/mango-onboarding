import { useId } from 'react'

// An original mango character that grows and ripens with the new hire:
// small and green before Day 1, bigger and yellow-green in the first week,
// fully ripe in the first month, and wearing a cap once onboarding is done.
export const mascotStages = {
  before: {
    scale: 0.68,
    highlight: '#D2EC97',
    mid: '#7DBE4E',
    edge: '#3F8F3C',
    outline: '#2B6E36',
    blush: '#F2C14E',
    blushOpacity: 0.3,
    stemGreen: 0,
  },
  week: {
    scale: 0.84,
    highlight: '#F6F1A0',
    mid: '#CFCB3C',
    edge: '#93A22A',
    outline: '#5F6B00',
    blush: '#F5A623',
    blushOpacity: 0.4,
    stemGreen: 0.55,
  },
  month: {
    scale: 1,
    highlight: '#FFE9A8',
    mid: '#F8B934',
    edge: '#E2800F',
    outline: '#9A5800',
    blush: '#F0661E',
    blushOpacity: 0.38,
    stemGreen: 0.3,
  },
}

export default function Mascot({ stage = 'before', mood = 'happy', hat = 'none', size = 96, className = '' }) {
  const id = useId().replace(/:/g, '')
  const s = mascotStages[stage] ?? mascotStages.month
  const cheer = mood === 'cheer'

  return (
    <svg
      viewBox="0 -18 120 158"
      width={size}
      height={(size * 158) / 120}
      className={className}
      role="img"
      aria-label={hat === 'grad' ? 'Mango, wearing a graduation cap' : 'Mango, your onboarding guide'}
    >
      <defs>
        <radialGradient id={`body-${id}`} cx="0.36" cy="0.32" r="0.82">
          <stop offset="0" stopColor={s.highlight} />
          <stop offset="0.55" stopColor={s.mid} />
          <stop offset="1" stopColor={s.edge} />
        </radialGradient>
        {/* green fading down from the stem, like a mango that is still ripening */}
        <linearGradient id={`stem-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5DAA45" stopOpacity={s.stemGreen} />
          <stop offset="0.45" stopColor="#5DAA45" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d="M60 26 C 88 24 106 48 104 82 C 102 112 82 130 56 128 C 30 126 14 106 16 78 C 18 50 34 28 60 26 Z" />
        </clipPath>
      </defs>

      {/* shadow */}
      <ellipse cx="60" cy="134" rx="30" ry="4.5" fill="#1f3a2a" opacity="0.1" />

      {/* arms */}
      <g stroke={s.outline} strokeWidth="7" strokeLinecap="round" fill="none">
        {cheer ? (
          <>
            <path d="M22 76 Q 8 62 12 44" />
            <path d="M98 76 Q 112 62 108 44" />
          </>
        ) : (
          <>
            <path d="M20 86 Q 9 94 13 106" />
            <path d="M100 86 Q 111 94 107 106" />
          </>
        )}
      </g>

      {/* feet */}
      <ellipse cx="45" cy="128" rx="10" ry="5" fill={s.outline} />
      <ellipse cx="75" cy="128" rx="10" ry="5" fill={s.outline} />

      {/* stem and leaf (hidden under the graduation cap) */}
      {hat !== 'grad' && (
        <>
          <path d="M59 28 C 58 20 60 15 65 11" stroke="#6b4a2b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M64 16 C 72 2 94 0 104 9 C 94 22 76 26 64 16 Z" fill="#3e9b4f" stroke="#2b7539" strokeWidth="2.5" />
          <path d="M68 15 C 78 12 88 10 98 9" stroke="#2b7539" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* body */}
      <path
        d="M60 26 C 88 24 106 48 104 82 C 102 112 82 130 56 128 C 30 126 14 106 16 78 C 18 50 34 28 60 26 Z"
        fill={`url(#body-${id})`}
      />
      <g clipPath={`url(#clip-${id})`}>
        <rect x="0" y="20" width="120" height="110" fill={`url(#stem-${id})`} />
        <ellipse cx="88" cy="96" rx="18" ry="24" fill={s.blush} opacity={s.blushOpacity} />
      </g>
      <path
        d="M60 26 C 88 24 106 48 104 82 C 102 112 82 130 56 128 C 30 126 14 106 16 78 C 18 50 34 28 60 26 Z"
        fill="none"
        stroke={s.outline}
        strokeWidth="3"
      />
      {/* shine */}
      <ellipse cx="40" cy="48" rx="10" ry="6" fill="#ffffff" opacity="0.45" transform="rotate(-30 40 48)" />

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

      {hat === 'party' && (
        <g transform="rotate(-14 60 20)">
          <path d="M60 -14 L 44 30 Q 60 36 76 30 Z" fill="#3E9B4F" stroke="#1f3a2a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M53 6 L 67 6 M 49 18 L 71 18" stroke="#F8B934" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="-14" r="6" fill="#F0661E" stroke="#1f3a2a" strokeWidth="2" />
        </g>
      )}

      {hat === 'grad' && (
        <g>
          <path d="M38 36 Q 60 44 82 36 L 82 22 Q 60 28 38 22 Z" fill="#1f2a22" />
          <path d="M60 2 L 106 18 L 60 34 L 14 18 Z" fill="#2c3530" stroke="#1f2a22" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="60" cy="18" r="3" fill="#F8B934" />
          <path d="M60 18 L 96 24 L 96 44" stroke="#F8B934" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M92 42 L 100 42 L 102 56 L 90 56 Z" fill="#F8B934" />
        </g>
      )}
    </svg>
  )
}
