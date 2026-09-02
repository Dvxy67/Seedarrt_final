import { useState, useEffect, useLayoutEffect, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Portfolio.module.css'
import RevealText from '../ui/RevealText'
import { useIsMobile } from '../../hooks/useIsMobile'

const ModelViewer = lazy(() => import('../three/ModelViewer'))

gsap.registerPlugin(Flip, ScrollTrigger)

// Les images du portfolio (plusieurs Mo, parfois chargées en lazy) changent la
// hauteur de leur carte à l'arrivée, ce qui décale tout ce qui suit (À propos,
// Contact…). On recalcule les positions ScrollTrigger à chaque fois, en groupant
// les recalculs rapprochés pour éviter un refresh par image.
let scrollTriggerRefreshTimeout
function scheduleScrollTriggerRefresh() {
  clearTimeout(scrollTriggerRefreshTimeout)
  scrollTriggerRefreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150)
}

const categories = ['Tous', 'Peinture', '3D', 'Graphisme']

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
        {work.modelUrl ? (
          <div ref={imgRef} data-flip-id={`work-${work.id}`} className={styles.lightbox3d}>
            <Suspense fallback={null}>
              <ModelViewer src={work.modelUrl} />
            </Suspense>
          </div>
        ) : (
          <img ref={imgRef} data-flip-id={`work-${work.id}`} src={work.src} alt={work.title} className={styles.lightboxImg} />
        )}
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

function WorkCard({ work, index, onClick, eagerFirst }) {
  const cardRef = useRef(null)
  const [modelInView, setModelInView] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    const grid = el?.parentElement
    if (!el || !grid) return

    const updateSpan = () => {
      const rowGap = parseFloat(getComputedStyle(grid).rowGap) || 0
      const rowHeight = parseFloat(getComputedStyle(grid).gridAutoRows) || 1
      const span = Math.ceil((el.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))
      el.style.setProperty('--row-span', String(span))
      scheduleScrollTriggerRefresh()
    }

    const ro = new ResizeObserver(updateSpan)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Un visualiseur 3D (contexte WebGL + parsing du .glb) coûte bien plus cher
  // qu'une image à créer : on ne le monte qu'une fois la carte proche du
  // viewport, jamais au chargement initial de toute la grille.
  useEffect(() => {
    if (!work.modelUrl || modelInView) return
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setModelInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [work.modelUrl, modelInView])

  return (
    <motion.article
      ref={cardRef}
      className={styles.card}
      data-flip-id={work.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={() => onClick(work)}
    >
      <div className={styles.thumb}>
        {work.modelUrl ? (
          modelInView ? (
            <div data-flip-id={`work-${work.id}`} className={styles.thumb3d}>
              <Suspense fallback={<div className={styles.placeholder} />}>
                <ModelViewer src={work.modelUrl} interactive={false} />
              </Suspense>
            </div>
          ) : (
            <div data-flip-id={`work-${work.id}`} className={styles.placeholder} />
          )
        ) : work.src ? (
          <img
            data-flip-id={`work-${work.id}`}
            src={work.src}
            alt={work.title}
            className={styles.image}
            loading={eagerFirst && index === 0 ? 'eager' : 'lazy'}
          />
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
  const [works, setWorks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [active, setActive] = useState('Tous')
  const [selected, setSelected] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [density, setDensity] = useState('large')
  const isMobile = useIsMobile()

  const gridRef = useRef(null)
  const flipStateRef = useRef(null)
  const isFirstRender = useRef(true)
  const heroStateRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/works')
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur')
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        setWorks(data.map(w => ({ id: w.id, title: w.title, category: w.category, year: w.year, src: w.imageUrl, modelUrl: w.modelUrl })))
        setLoaded(true)
        scheduleScrollTriggerRefresh()
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setLoaded(true)
        }
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let timeout
    const onResize = () => {
      gridRef.current?.classList.add(styles.resizing)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        gridRef.current?.classList.remove(styles.resizing)
      }, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timeout)
    }
  }, [])

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

    // Recalcule les row-span avant de mesurer l'état final : la largeur des
    // colonnes a pu changer (densité), donc la hauteur des cartes aussi,
    // avant que le ResizeObserver de chaque carte n'ait eu l'occasion de réagir.
    if (gridRef.current) {
      const rowGap = parseFloat(getComputedStyle(gridRef.current).rowGap) || 0
      const rowHeight = parseFloat(getComputedStyle(gridRef.current).gridAutoRows) || 1
      gridRef.current.querySelectorAll(`.${styles.card}`).forEach(card => {
        const span = Math.ceil((card.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))
        card.style.setProperty('--row-span', String(span))
      })
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setIsAnimating(true)
    Flip.from(flipStateRef.current, {
      duration: reduceMotion ? 0 : 0.8,
      ease: 'expo.inOut',
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
          {loaded && !loadError && (
            <span className={styles.stat}>{works.length} œuvres{yearRange ? ` · ${yearRange}` : ''}</span>
          )}
        </header>

        {loadError ? (
          <p className={styles.error}>Le portfolio n'a pas pu être chargé pour le moment.</p>
        ) : loaded && (
          <>
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
                  <WorkCard key={work.id} work={work} index={i} onClick={handleOpen} eagerFirst={isMobile} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
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
