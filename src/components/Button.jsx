import Icon from './Icon.jsx'

const base =
  'group inline-flex items-center justify-center gap-3 rounded-full font-body text-sm font-medium tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]'

const variants = {
  primary:
    'px-7 py-3.5 bg-coffee text-cream hover:bg-coffee-light hover:shadow-[0_12px_30px_-10px_rgba(59,36,24,0.55)] hover:-translate-y-0.5 focus-visible:ring-coffee focus-visible:ring-offset-cream',
  outline:
    'px-7 py-3.5 border border-coffee/30 text-coffee hover:border-coffee hover:bg-coffee/5 focus-visible:ring-coffee focus-visible:ring-offset-cream',
  light:
    'px-7 py-3.5 bg-cream text-coffee hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] focus-visible:ring-cream focus-visible:ring-offset-coffee',
  text: 'py-1 text-coffee underline-offset-8 hover:underline focus-visible:ring-coffee',
}

export default function Button({ href = '#', variant = 'primary', withArrow = false, className = '', children, ...props }) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {withArrow && (
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </a>
  )
}
