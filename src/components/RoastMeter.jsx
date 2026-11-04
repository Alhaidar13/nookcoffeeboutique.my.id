export default function RoastMeter({ level = 3, max = 5 }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Roast level ${level} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`h-1.5 w-4 rounded-full ${i < level ? 'bg-coffee' : 'bg-coffee/15'}`} />
      ))}
    </span>
  )
}
