import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Intro.module.css'

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('iris'), 900)
    const t2 = setTimeout(onDone, 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
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
          ? { duration: 1.1, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0 }
      }
    >
      <motion.img
        src="/works/IMG_4681.PNG"
        alt="Seedarrt"
        className={styles.logo}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'iris' ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}
