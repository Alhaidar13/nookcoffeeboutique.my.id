// Ikon biji kopi (gaya indikator kekuatan pada kemasan kopi kaleng)
function Bean({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${filled ? 'text-coffee' : 'text-coffee/20'}`} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.5C6.6 1.5 4 6.2 4 11.6c0 5.9 3.2 10.9 8 10.9s8-5 8-10.9C20 6.2 17.4 1.5 12 1.5Z"
        transform="rotate(35 12 12)"
      />
      <path
        fill="none"
        stroke={filled ? '#FAF5EE' : '#FFFFFF'}
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M13.4 3.2c-3 2.6 2.6 5.3-.6 8.2-3 2.7 1.8 5.4-1 9.2"
        transform="rotate(35 12 12)"
      />
    </svg>
  )
}

export default function RoastMeter({ level = 3, max = 5 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Roast level ${level} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Bean key={i} filled={i < level} />
      ))}
    </span>
  )
}
