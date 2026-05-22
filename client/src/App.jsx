import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Portfolio from './components/Portfolio/Portfolio'
import About from './components/About/About'
import Contact from './components/Contact/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Contact />
      </main>
    </>
  )
}
