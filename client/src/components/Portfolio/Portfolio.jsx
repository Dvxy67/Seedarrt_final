import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Portfolio.module.css'

const categories = ['Tous', 'Peinture', '3D', 'Graphisme']

// Replace src values with actual artwork images — drop files in client/public/works/
const works = [
  { id: 1, title: 'Série Lumineuse I',   category: 'Peinture',   year: '2024', aspect: 'portrait',  src: null },
  { id: 2, title: 'Fragment',             category: '3D',         year: '2024', aspect: 'square',    src: null },
  { id: 3, title: 'Identité Visuelle',    category: 'Graphisme',  year: '2023', aspect: 'landscape', src: null },
  { id: 4, title: 'Série Lumineuse II',   category: 'Peinture',   year: '2023', aspect: 'portrait',  src: null },
  { id: 5, title: 'Éclat',               category: '3D',         year: '2024', aspect: 'square',    src: null },
  { id: 6, title: 'Affiche',             category: 'Graphisme',  year: '2023', aspect: 'portrait',  src: null },
]

function WorkCard({ work, index }) {
  return (
    <motion.article
      className={`${styles.card} ${styles[work.aspect]}`}
      layout
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <div className={styles.thumb}>
        {work.src ? (
          <img src={work.src} alt={work.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay}>
          <span className={styles.workTitle}>{work.title}</span>
          <span className={styles.workMeta}>{work.category} · {work.year}</span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState('Tous')

  const filtered = active === 'Tous'
    ? works
    : works.filter(w => w.category === active)

  return (
    <section className={styles.section} id="portfolio">
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85 }}
        >
          <span className={styles.label}>Œuvres</span>
          <h2 className={styles.heading}>Portfolio</h2>
        </motion.header>

        <div className={styles.filters} role="group" aria-label="Filtrer par catégorie">
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filter} ${active === cat ? styles.filterActive : ''}`}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div className={styles.grid} layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
