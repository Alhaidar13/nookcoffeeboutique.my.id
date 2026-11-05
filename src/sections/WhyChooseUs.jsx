import SectionHeading from '../components/SectionHeading.jsx'
import FeatureItem from '../components/FeatureItem.jsx'
import Reveal from '../components/Reveal.jsx'
import { features } from '../data/content.js'

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-beige pb-20 pt-4 sm:pb-32 sm:pt-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Promise"
            title="Why Choose Our Coffee?"
            subtitle="Every bag reflects our commitment to origin, craft, and freshness."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-16 md:grid-cols-3 lg:gap-8">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 120} variant="zoom" className="h-full">
              <FeatureItem index={i + 1} {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
