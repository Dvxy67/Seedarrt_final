import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Creation from './components/Creation/Creation'
import Portfolio from './components/Portfolio/Portfolio'
import About from './components/About/About'
import Contact from './components/Contact/Contact'
import Intro from './components/Intro/Intro'
import GrainOverlay from './components/GrainOverlay/GrainOverlay'
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
      <GrainOverlay />
      {!introDone && <Intro onDone={handleIntroDone} />}
      <Navbar />
      <main>
        <Hero />
        <Creation />
        <Portfolio />
        <About />
        <Contact />
      </main>
    </>
  )
}
