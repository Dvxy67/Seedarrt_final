import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Portfolio from './components/Portfolio/Portfolio'
import About from './components/About/About'
import Contact from './components/Contact/Contact'
import Intro from './components/Intro/Intro'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()
  const [introDone, setIntroDone] = useState(
    () => localStorage.getItem('seedarrt-intro') === '1'
  )

  const handleIntroDone = () => {
    localStorage.setItem('seedarrt-intro', '1')
    setIntroDone(true)
  }

  return (
    <>
      {!introDone && <Intro onDone={handleIntroDone} />}
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
