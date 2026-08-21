import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import styles from './Portfolio.module.css'
import RevealText from '../ui/RevealText'

gsap.registerPlugin(Flip)

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

function Lightbox({ work, works, onClose, gridRef, heroState, onSelect }) {
  const idx = works.findIndex(w => w.id === work.id)
  const dialogRef = useRef(null)
  const imgRef = useRef(null)
  const heroPlayed = useRef(false)

  const handleClose = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const thumb = gridRef.current?.querySelector(`[data-flip-id="work-${work.id}"]`)
    if (thumb && imgRef.current && !reduceMotion) {
      const state = Flip.getState(imgRef.current)
      const prevTransition = thumb.style.transition
      thumb.style.transition = 'none'
      Flip.from(state, {
        targets: thumb,
        duration: 0.5,
        ease: 'power3.inOut',
        scale: true,
        onComplete: () => { thumb.style.transition = prevTransition },
      })
    }
    onClose()
  }

  useLayoutEffect(() => {
    if (heroPlayed.current || !heroState || !imgRef.current) return
    heroPlayed.current = true
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    Flip.from(heroState, {
      targets: imgRef.current,
      duration: reduceMotion ? 0 : 0.55,
      ease: 'power3.out',
      scale: true,
    })
  }, [heroState])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') onSelect(works[(idx - 1 + works.length) % works.length])
      if (e.key === 'ArrowRight') onSelect(works[(idx + 1) % works.length])

      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [idx, works, onSelect])

  return (
    <motion.div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} — visionneuse`}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClose}
    >
      <span className={styles.lightboxCounter}>
        {String(idx + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
      </span>

      <button className={styles.closeBtn} onClick={handleClose} aria-label="Fermer">×</button>

      <button
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={(e) => { e.stopPropagation(); onSelect(works[(idx - 1 + works.length) % works.length]) }}
        aria-label="Œuvre précédente"
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
        <img ref={imgRef} data-flip-id={`work-${work.id}`} src={work.src} alt={work.title} className={styles.lightboxImg} />
        <div className={styles.lightboxInfo}>
          <span className={styles.lightboxTitle}>{work.title}</span>
          <span className={styles.lightboxMeta}>{work.category} · {work.year}</span>
        </div>
      </motion.div>

      <button
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={(e) => { e.stopPropagation(); onSelect(works[(idx + 1) % works.length]) }}
        aria-label="Œuvre suivante"
      >›</button>

      <span className={styles.lightboxHint}>← → naviguer · échap pour fermer</span>
    </motion.div>
  )
}

function WorkCard({ work, index, onClick }) {
  return (
    <motion.article
      className={styles.card}
      data-flip-id={work.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={() => onClick(work)}
    >
      <div className={styles.thumb}>
        {work.src ? (
          <img data-flip-id={`work-${work.id}`} src={work.src} alt={work.title} className={styles.image} loading="lazy" />
        ) : (
          <div data-flip-id={`work-${work.id}`} className={styles.placeholder} />
        )}
      </div>
      <div className={styles.caption}>
        <span className={styles.workTitle}>{work.title}</span>
        <span className={styles.workMeta}>{work.category} · {work.year}</span>
      </div>
    </motion.article>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState('Tous')
  const [selected, setSelected] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [density, setDensity] = useState('large')

  const gridRef = useRef(null)
  const flipStateRef = useRef(null)
  const isFirstRender = useRef(true)
  const heroStateRef = useRef(null)

  const filtered = active === 'Tous'
    ? works
    : works.filter(w => w.category === active)

  const counts = Object.fromEntries(
    categories.map(cat => [cat, cat === 'Tous' ? works.length : works.filter(w => w.category === cat).length])
  )

  const handleFilterClick = (cat) => {
    if (cat === active || isAnimating) return

    const nextFiltered = cat === 'Tous' ? works : works.filter(w => w.category === cat)
    const nextIds = new Set(nextFiltered.map(w => w.id))
    const survivorIds = filtered.filter(w => nextIds.has(w.id)).map(w => w.id)

    if (survivorIds.length && gridRef.current) {
      const selector = survivorIds.map(id => `[data-flip-id="${id}"]`).join(',')
      const cards = gridRef.current.querySelectorAll(selector)
      if (cards.length) flipStateRef.current = Flip.getState(cards)
    }

    setActive(cat)
  }

  const handleDensityClick = (mode) => {
    if (mode === density || isAnimating) return

    if (gridRef.current) {
      const selector = filtered.map(w => `[data-flip-id="${w.id}"]`).join(',')
      const cards = gridRef.current.querySelectorAll(selector)
      if (cards.length) flipStateRef.current = Flip.getState(cards)
    }

    setDensity(mode)
  }

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!flipStateRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setIsAnimating(true)
    Flip.from(flipStateRef.current, {
      duration: reduceMotion ? 0 : 0.7,
      ease: 'power3.inOut',
      stagger: 0.03,
      onComplete: () => setIsAnimating(false),
    })
    flipStateRef.current = null
  }, [active, density])

  const handleOpen = (work) => {
    const thumb = gridRef.current?.querySelector(`[data-flip-id="work-${work.id}"]`)
    heroStateRef.current = thumb ? Flip.getState(thumb) : null
    setSelected(work)
  }

  const years = works.map(w => Number(w.year)).filter(Boolean)
  const yearRange = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : ''

  return (
    <section className={styles.section} id="portfolio">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <RevealText>
              <span className={styles.label}>Œuvres</span>
            </RevealText>
            <h2 className={styles.heading}>
              <RevealText delay={0.12}>Portfolio</RevealText>
            </h2>
          </div>
          <span className={styles.stat}>{works.length} œuvres{yearRange ? ` · ${yearRange}` : ''}</span>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.filters} role="group" aria-label="Filtrer par catégorie">
            {categories.map(cat => {
              const count = counts[cat]
              const disabled = cat !== 'Tous' && count === 0
              return disabled ? (
                <span key={cat} className={styles.filterDisabled} aria-disabled="true">
                  {cat} <span className={styles.filterCount}>—</span>
                </span>
              ) : (
                <button
                  key={cat}
                  className={`${styles.filter} ${active === cat ? styles.filterActive : ''}`}
                  onClick={() => handleFilterClick(cat)}
                  aria-pressed={active === cat}
                  disabled={isAnimating}
                >
                  {cat} <span className={styles.filterCount}>{count}</span>
                </button>
              )
            })}
          </div>

          <div className={styles.viewToggle} role="group" aria-label="Densité d'affichage">
            <button
              className={`${styles.viewBtn} ${density === 'large' ? styles.viewActive : ''}`}
              onClick={() => handleDensityClick('large')}
              aria-pressed={density === 'large'}
              aria-label="Vue large"
              disabled={isAnimating}
            >
              <span className={styles.viewIcon}><span /><span /><span /></span>
            </button>
            <button
              className={`${styles.viewBtn} ${density === 'medium' ? styles.viewActive : ''}`}
              onClick={() => handleDensityClick('medium')}
              aria-pressed={density === 'medium'}
              aria-label="Vue moyenne"
              disabled={isAnimating}
            >
              <span className={styles.viewIcon}><span /><span /><span /><span /></span>
            </button>
            <button
              className={`${styles.viewBtn} ${density === 'compact' ? styles.viewActive : ''}`}
              onClick={() => handleDensityClick('compact')}
              aria-pressed={density === 'compact'}
              aria-label="Vue compacte"
              disabled={isAnimating}
            >
              <span className={styles.viewIcon}><span /><span /><span /><span /><span /></span>
            </button>
          </div>
        </div>

        <div
          className={`${styles.grid} ${density === 'medium' ? styles.gridMedium : ''} ${density === 'compact' ? styles.gridCompact : ''}`}
          ref={gridRef}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} onClick={handleOpen} />
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
            gridRef={gridRef}
            heroState={heroStateRef.current}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
