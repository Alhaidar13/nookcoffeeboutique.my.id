import { useEffect } from 'react'
import Navbar from './sections/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import BrandIntro from './sections/BrandIntro.jsx'
import FeaturedCoffee from './sections/FeaturedCoffee.jsx'
import WhyChooseUs from './sections/WhyChooseUs.jsx'
import BrandCta from './sections/BrandCta.jsx'
import Footer from './sections/Footer.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import Toast from './components/Toast.jsx'
import useHashRoute from './hooks/useHashRoute.js'
import { CartProvider } from './context/CartContext.jsx'
import { brand } from './data/content.js'
import { getProduct } from './data/catalog.js'

function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <FeaturedCoffee />
      <WhyChooseUs />
      <BrandCta />
    </>
  )
}

export default function App() {
  const route = useHashRoute()
  const routeKey = route.page === 'detail' ? `detail:${route.id}` : route.page

  // Scroll handling: new page -> top; home anchor -> scroll to section
  useEffect(() => {
    if (route.page === 'home' && route.anchor) {
      requestAnimationFrame(() => document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [routeKey, route.anchor]) // eslint-disable-line react-hooks/exhaustive-deps

  // Document title per page
  useEffect(() => {
    const base = `${brand.name} Coffee`
    if (route.page === 'catalog') document.title = `All Coffee — ${base}`
    else if (route.page === 'detail') document.title = `${getProduct(route.id)?.name || 'Coffee'} — ${base}`
    else document.title = `${base} — Specialty Coffee Boutique`
  }, [routeKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CartProvider>
      <Navbar route={route} />
      <main key={routeKey}>
        {route.page === 'catalog' && <CatalogPage query={route.query} />}
        {route.page === 'detail' && <ProductDetailPage id={route.id} query={route.query} />}
        {route.page === 'home' && <HomePage />}
      </main>
      <Footer />
      <Toast />
    </CartProvider>
  )
}
