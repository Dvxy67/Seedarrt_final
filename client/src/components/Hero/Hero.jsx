import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ArtScene from '../three/ArtScene'
import styles from './Hero.module.css'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Canvas 3D — zoom in fort + ancré
  const canvasY     = useTransform(scrollYProgress, [0, 1], [0, -60])
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.55])

  // Logo peint — recul cinématique accentué
  const logoY     = useTransform(scrollYProgress, [0, 1], [0, -380])
  const logoScale = useTransform(scrollYProgress, [0, 1], [1.18, 0.72])

  // Textes — sortie rapide
  const textY    = useTransform(scrollYProgress, [0, 1], [0, -520])
  const fadeOut  = useTransform(scrollYProgress, [0, 0.28], [1, 0])

  return (
    <section className={styles.hero} id="hero" ref={ref}>

      <motion.div
        className={styles.canvas}
        style={{ y: canvasY, scale: canvasScale }}
      >
        <ArtScene />
      </motion.div>

      <div className={styles.content}>
        <motion.span
          className={styles.tagline}
          style={{ y: textY, opacity: fadeOut }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Peinture — 3D — Graphisme
        </motion.span>

        <motion.div
          className={styles.logoWrap}
          style={{ y: logoY, scale: logoScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img src="/works/IMG_4681.PNG" alt="Seedarrt" className={styles.logo} />
        </motion.div>

        <motion.p
          className={styles.subtitle}
          style={{ y: textY, opacity: fadeOut }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Artiste pluridisciplinaire
        </motion.p>

        <motion.a
          href="#portfolio"
          className={styles.cta}
          style={{ y: textY, opacity: fadeOut }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Découvrir le travail
        </motion.a>
      </div>

      <div className={styles.scrollIndicator}>
        <span />
      </div>
    </section>
  )
}
