import { motion } from 'framer-motion'
import ArtScene from '../three/ArtScene'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.canvas}>
        <ArtScene />
      </div>

      <div className={styles.content}>
        <motion.span
          className={styles.tagline}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Peinture — 3D — Graphisme
        </motion.span>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <em>Seedarrt</em>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Artiste pluridisciplinaire
        </motion.p>

        <motion.a
          href="#portfolio"
          className={styles.cta}
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
