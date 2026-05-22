import { motion } from 'framer-motion'
import styles from './About.module.css'

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
          <motion.span
            className={styles.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            À propos
          </motion.span>

          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Une démarche
            <br />
            <em>entre matière</em>
            <br />
            et lumière
          </motion.h2>

          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.2 }}
          >
            <p>
              À remplir — biographie de l'artiste : formation, démarche, ce qui l'inspire,
              les outils et matériaux qu'il ou elle utilise au quotidien.
            </p>
            <p>
              Second paragraphe — évolution du travail, expositions, collaborations
              ou projets marquants qui ont jalonné le parcours.
            </p>
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
