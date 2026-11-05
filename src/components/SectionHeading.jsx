export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', tone = 'dark', className = '' }) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'
  const titleColor = tone === 'dark' ? 'text-coffee' : 'text-cream'
  const mutedColor = tone === 'dark' ? 'text-coffee/70' : 'text-cream/75'

  return (
    <header className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span className={`mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] ${mutedColor}`}>
          <span className={`h-px w-8 ${tone === 'dark' ? 'bg-coffee/40' : 'bg-cream/50'}`} />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-[1.85rem] font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${titleColor}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${mutedColor}`}>{subtitle}</p>}
    </header>
  )
}
