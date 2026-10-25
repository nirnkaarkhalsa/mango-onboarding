// Donut charts drawn as SVG arcs. Completed work is the phase's full color,
// remaining work is its light tint, with a small gap between segments.

function polar(cx, cy, r, angle) {
  const a = ((angle - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function arcPath(cx, cy, r, start, end) {
  if (end - start <= 0.01) return null
  if (end - start >= 359.9) end = start + 359.9
  const [x1, y1] = polar(cx, cy, r, start)
  const [x2, y2] = polar(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

function Arc({ start, end, color, size, stroke, title }) {
  const r = (size - stroke) / 2
  const d = arcPath(size / 2, size / 2, r, start, end)
  if (!d) return null
  return (
    <path d={d} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="butt">
      {title && <title>{title}</title>}
    </path>
  )
}

// segments: [{ label, done, total, color, tint }]
export function SegmentedRing({ segments, size = 128, stroke = 16, gap = 3, children, label, className }) {
  const total = segments.reduce((s, x) => s + x.total, 0)
  let cursor = 0
  const arcs = []
  segments.forEach((seg, i) => {
    const span = (seg.total / total) * 360
    const start = cursor + gap / 2
    const end = cursor + span - gap / 2
    const doneEnd = start + ((end - start) * seg.done) / seg.total
    const title = `${seg.label}: ${seg.done} of ${seg.total} done`
    arcs.push(<Arc key={`${i}-d`} start={start} end={doneEnd} color={seg.color} size={size} stroke={stroke} title={title} />)
    arcs.push(
      <Arc
        key={`${i}-r`}
        start={doneEnd + (seg.done > 0 && seg.done < seg.total ? gap / 2 : 0)}
        end={end}
        color={seg.tint}
        size={size}
        stroke={stroke}
        title={title}
      />,
    )
    cursor += span
  })

  return (
    <div className={`relative shrink-0 ${className ?? ''}`} style={className ? undefined : { width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full" role="img" aria-label={label}>
        {arcs}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function PhaseRing({ phase, done, total, size = 64, stroke = 9 }) {
  return (
    <SegmentedRing
      className="size-14 md:size-16"
      segments={[{ label: phase.name, done, total, color: phase.color, tint: phase.tint }]}
      size={size}
      stroke={stroke}
      gap={done > 0 && done < total ? 3 : 0}
      label={`${phase.name}: ${done} of ${total} done`}
    >
      <span className="font-display text-lg font-bold leading-none text-ink">
        {done}
        <span className="text-sm font-semibold text-muted">/{total}</span>
      </span>
    </SegmentedRing>
  )
}
