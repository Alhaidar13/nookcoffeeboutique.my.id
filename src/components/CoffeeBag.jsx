// Illustrated premium coffee pouch (SVG) – renders a consistent product
// packshot for every product using its own name, origin & label colour.
export default function CoffeeBag({ product, className = '' }) {
  const gid = `bag-${product.id}`
  return (
    <svg viewBox="0 0 260 340" className={className} role="img" aria-label={`${product.name} coffee bag`}>
      <defs>
        <linearGradient id={`${gid}-body`} x1="0" x2="1">
          <stop offset="0" stopColor="#2c1a11" />
          <stop offset="0.18" stopColor="#4a2f20" />
          <stop offset="0.5" stopColor="#3B2418" />
          <stop offset="0.85" stopColor="#2f1d13" />
          <stop offset="1" stopColor="#24150d" />
        </linearGradient>
        <linearGradient id={`${gid}-shine`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${gid}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3B2418" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3B2418" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="130" cy="322" rx="100" ry="12" fill={`url(#${gid}-shadow)`} />

      {/* pouch body */}
      <path d="M42 40 L218 40 L226 300 Q226 314 212 314 L48 314 Q34 314 34 300 Z" fill={`url(#${gid}-body)`} />
      {/* top seal */}
      <rect x="40" y="26" width="180" height="22" rx="3" fill="#2a190f" />
      <g stroke="#E8DCC8" strokeOpacity="0.12" strokeWidth="1">
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={46 + i * 8} y1="30" x2={46 + i * 8} y2="44" />
        ))}
      </g>
      {/* valve */}
      <circle cx="130" cy="74" r="7" fill="none" stroke="#E8DCC8" strokeOpacity="0.25" />
      <circle cx="130" cy="74" r="2.5" fill="#E8DCC8" fillOpacity="0.25" />
      {/* side folds */}
      <path d="M42 48 L50 300" stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M218 48 L210 300" stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
      <rect x="34" y="40" width="192" height="274" fill={`url(#${gid}-shine)`} />

      {/* label */}
      <rect x="66" y="104" width="128" height="170" rx="4" fill="#E8DCC8" />
      <rect x="66" y="104" width="128" height="6" rx="2" fill={product.label} />
      <text x="130" y="134" textAnchor="middle" fontFamily="Montserrat" fontSize="8" letterSpacing="3.5" fill="#3B2418" fillOpacity="0.7">
        ARUNIKA
      </text>
      <line x1="112" y1="143" x2="148" y2="143" stroke="#3B2418" strokeOpacity="0.3" />
      <text x="130" y="172" textAnchor="middle" fontFamily="Montserrat" fontWeight="600" fontSize="15" fill="#3B2418">
        {product.name.split(' ')[0].toUpperCase()}
      </text>
      <text x="130" y="190" textAnchor="middle" fontFamily="Montserrat" fontWeight="500" fontSize="10" letterSpacing="2" fill="#3B2418">
        {(product.name.split(' ')[1] || 'Single Origin').toUpperCase()}
      </text>
      {/* bean mark */}
      <g transform="translate(130 216)" fill="none" stroke={product.label} strokeWidth="1.6" strokeLinecap="round">
        <ellipse rx="6" ry="9" transform="rotate(25)" />
        <path d="M-3 -7c3 4 2 8 6 14" />
      </g>
      <text x="130" y="246" textAnchor="middle" fontFamily="Poppins" fontSize="6.5" letterSpacing="1.5" fill="#3B2418" fillOpacity="0.75">
        {product.roast.toUpperCase()}
      </text>
      <text x="130" y="261" textAnchor="middle" fontFamily="Poppins" fontSize="6" letterSpacing="1.2" fill="#3B2418" fillOpacity="0.55">
        SPECIALTY · {product.weight.toUpperCase()}
      </text>
    </svg>
  )
}
