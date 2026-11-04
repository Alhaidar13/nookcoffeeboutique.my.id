import Icon from './Icon.jsx'

export default function FeatureItem({ index, icon, title, description }) {
  return (
    <article className="feature-item group relative flex h-full flex-col rounded-3xl border border-coffee/10 bg-white/60 p-8 transition-all duration-500 hover:border-coffee/20 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(59,36,24,0.4)] sm:p-10">
      <span className="absolute right-8 top-8 font-heading text-sm font-medium text-coffee/25">
        {String(index).padStart(2, '0')}
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-coffee transition-colors duration-500 group-hover:bg-coffee group-hover:text-cream">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-coffee">{title}</h3>
      <p className="mt-3 leading-relaxed text-coffee/70">{description}</p>
    </article>
  )
}
