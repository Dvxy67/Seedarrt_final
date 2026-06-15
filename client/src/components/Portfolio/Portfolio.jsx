import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Portfolio.module.css'
import RevealText from '../ui/RevealText'

const categories = ['Tous', 'Peinture', '3D', 'Graphisme']

const works = [
  { id: 4,  title: 'Directly in the cave',             category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/5_directly in the cave_oil painting_2024_100x75cm 2.JPG' },
  { id: 10, title: 'Peinture I',                       category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/FullSizeRender.JPG' },
  { id: 18, title: 'Peinture X',                       category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7172.JPG' },
  { id: 9,  title: 'Death of the giants creatures',    category: 'Peinture', year: '2025', aspect: 'portrait',  src: '/works/11_Death of the giants creatures, their death, creator of a new life_oil paintings_2025_150x100cm 2.JPG' },
  { id: 1,  title: 'I came across the rainforest',     category: 'Peinture', year: '2025', aspect: 'portrait',  src: '/works/1_I came across the rainforest_oil painting_2025_75x60cm 2.JPG' },
  { id: 2,  title: 'See these creatures propagating',  category: 'Peinture', year: '2025', aspect: 'landscape', src: '/works/2_See these creatures propagating_oil painting_2025_40x60cm 2.JPG' },
  { id: 3,  title: 'Differents ways to bloom',         category: 'Peinture', year: '2025', aspect: 'landscape', src: '/works/4_Differents ways to bloom_oil painting_2025_50x75cm 2.JPG' },
  { id: 5,  title: 'Tree of life cycle',               category: 'Peinture', year: '2025', aspect: 'landscape', src: '/works/6_Tree of life cycle, two faces, plants and mushrooms breathing_oil paintings_2025_60x85cm 2.jpg' },
  { id: 6,  title: 'Cave floor, part 1',               category: 'Peinture', year: '2025', aspect: 'portrait',  src: '/works/7_Cave floor, part 1 glowing mushroom_oil paintings_2025_80x50cm 2.JPG' },
  { id: 8,  title: 'The outcomes of this trippy life', category: 'Peinture', year: '2024', aspect: 'landscape', src: '/works/10_The outcomes of this trippy life, the strange lanscape blurred by the mist_oil paintings_2024_40x60cm 2.JPG' },
  { id: 11, title: 'Peinture II',                      category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_4681.PNG' },
  { id: 12, title: 'Peinture III',                     category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_6481 2.jpg' },
  { id: 13, title: 'Peinture IV',                      category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7101.JPG' },
  { id: 14, title: 'Peinture V',                       category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7105.JPG' },
  { id: 15, title: 'Peinture VI',                      category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7107.JPG' },
  { id: 16, title: 'Peinture VII',                     category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7132.JPG' },
  { id: 17, title: 'Peinture VIII',                    category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7145.JPG' },
  { id: 19, title: 'Peinture IX',                      category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7331.JPG' },
  { id: 20, title: 'Peinture XI',                      category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7332.JPG' },
  { id: 21, title: 'Peinture XII',                     category: 'Peinture', year: '2024', aspect: 'portrait',  src: '/works/IMG_7334.JPG' },
]

function Lightbox({ work, works, onClose, onSelect }) {
  const idx = works.findIndex(w => w.id === work.id)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onSelect(works[(idx - 1 + works.length) % works.length])
      if (e.key === 'ArrowRight') onSelect(works[(idx + 1) % works.length])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, works, onClose, onSelect])

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button className={styles.closeBtn} onClick={onClose}>×</button>

      <button
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={(e) => { e.stopPropagation(); onSelect(works[(idx - 1 + works.length) % works.length]) }}
      >‹</button>

      <motion.div
        className={styles.lightbox}
        key={work.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={work.src} alt={work.title} className={styles.lightboxImg} />
        <div className={styles.lightboxInfo}>
          <span className={styles.lightboxTitle}>{work.title}</span>
          <span className={styles.lightboxMeta}>{work.category} · {work.year}</span>
        </div>
      </motion.div>

      <button
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={(e) => { e.stopPropagation(); onSelect(works[(idx + 1) % works.length]) }}
      >›</button>
    </motion.div>
  )
}

function WorkCard({ work, index, onClick }) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={() => onClick(work)}
    >
      <div className={styles.thumb}>
        {work.src ? (
          <img src={work.src} alt={work.title} className={styles.image} loading="lazy" />
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
  const [selected, setSelected] = useState(null)

  const filtered = active === 'Tous'
    ? works
    : works.filter(w => w.category === active)

  return (
    <section className={styles.section} id="portfolio">
      <div className={styles.inner}>
        <header className={styles.header}>
          <RevealText>
            <span className={styles.label}>Œuvres</span>
          </RevealText>
          <h2 className={styles.heading}>
            <RevealText delay={0.12}>Portfolio</RevealText>
          </h2>
        </header>

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

        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} onClick={setSelected} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <Lightbox
            work={selected}
            works={filtered}
            onClose={() => setSelected(null)}
            onSelect={setSelected}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
