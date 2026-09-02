import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Intro.module.css'

const TOTAL_MS = 5000
const FADE_IN_MS = 800
const IRIS_MS = 1400

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), FADE_IN_MS)
    const t2 = setTimeout(() => setPhase('iris'), TOTAL_MS - IRIS_MS)
    const t3 = setTimeout(onDone, TOTAL_MS)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <motion.div
      className={styles.overlay}
      animate={{
        clipPath: phase === 'iris'
          ? 'circle(0% at 50% 50%)'
          : 'circle(150% at 50% 50%)',
      }}
      transition={
        phase === 'iris'
          ? { duration: IRIS_MS / 1000, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0 }
      }
    >
      <motion.img
        src="/works/IMG_4681.PNG"
        alt="Seedarrt"
        className={styles.logo}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'iris' ? 0 : 1 }}
        transition={{ duration: phase === 'iris' ? 0.6 : FADE_IN_MS / 1000 }}
      />
    </motion.div>
  )
}
