import Navbar from './sections/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import BrandIntro from './sections/BrandIntro.jsx'
import FeaturedCoffee from './sections/FeaturedCoffee.jsx'
import WhyChooseUs from './sections/WhyChooseUs.jsx'
import BrandCta from './sections/BrandCta.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandIntro />
        <FeaturedCoffee />
        <WhyChooseUs />
        <BrandCta />
      </main>
      <Footer />
    </>
  )
}
