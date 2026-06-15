import { motion } from 'framer-motion'
import styles from './About.module.css'
import RevealText from '../ui/RevealText'

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>

        <div className={styles.imageCol}>
          <motion.div
            className={styles.imageWrap}
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Replace with: <img src="/portrait.jpg" alt="Nom de l'artiste" className={styles.photo} /> */}
            <div className={styles.photoPlaceholder} />
            <div className={styles.frame} />
          </motion.div>
        </div>

        <div className={styles.textCol}>
          <RevealText>
            <span className={styles.label}>À propos</span>
          </RevealText>

          <h2 className={styles.heading}>
            <RevealText delay={0.1}>Une démarche</RevealText>
            <RevealText delay={0.2}><em>entre matière</em></RevealText>
            <RevealText delay={0.3}>et lumière</RevealText>
          </h2>

          <motion.div
            className={styles.body}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className={styles.wip}>Work in progress</p>
          </motion.div>

          <motion.div
            className={styles.disciplines}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            {['Peinture', '3D & Modélisation', 'Graphisme'].map(d => (
              <span key={d} className={styles.discipline}>{d}</span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
