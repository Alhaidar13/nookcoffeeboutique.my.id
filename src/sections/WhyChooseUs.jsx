import SectionHeading from '../components/SectionHeading.jsx'
import FeatureItem from '../components/FeatureItem.jsx'
import Reveal from '../components/Reveal.jsx'
import { features } from '../data/content.js'

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Promise"
            title="Why Choose Our Coffee?"
            subtitle="Every bag reflects our commitment to origin, craft, and freshness."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3 lg:gap-8">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100} className="h-full">
              <FeatureItem index={i + 1} {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
