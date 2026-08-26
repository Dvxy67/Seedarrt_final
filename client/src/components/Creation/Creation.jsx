import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'framer-motion'
import styles from './Creation.module.css'
import { useIsMobile } from '../../hooks/useIsMobile'

const StepScene = lazy(() => import('./StepScene'))

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const steps = [
  {
    index: '01',
    name: 'Objet 3D',
    description: 'Sculpture numérique et modélisation. Des formes entre réel et imaginaire, à la frontière du vivant et du minéral.',
    type: 'scene',
    src: null,
  },
  {
    index: '02',
    name: 'Peinture',
    description: "Exploration de la matière et de la couleur à travers l'huile sur toile. Des œuvres organiques inspirées par la nature et ses cycles.",
    type: 'image',
    src: '/works/11_Death of the giants creatures, their death, creator of a new life_oil paintings_2025_150x100cm 2.JPG',
  },
  {
    index: '03',
    name: 'Graphisme',
    description: 'Direction artistique et identité visuelle. Un regard singulier mis au service de projets visuels et de communication.',
    type: 'image',
    src: '/works/IMG_4681.PNG',
  },
]

export default function Creation() {
  const [activeStep, setActiveStep] = useState(0)
  const isMobile = useIsMobile()
  const wrapperRef = useRef(null)
  const progressTrackRef = useRef(null)
  const progressFillRef = useRef(null)

  useEffect(() => {
    if (isMobile) return

    const wrapper = wrapperRef.current
    const progressTrack = progressTrackRef.current
    const progressFill = progressFillRef.current
    if (!wrapper) return

    const nav = document.querySelector('nav')
    const showProgress = () => {
      if (nav) progressTrack.style.top = `${nav.offsetHeight}px`
      gsap.to(progressTrack, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
    }
    const hideProgress = () => gsap.to(progressTrack, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onEnter:     showProgress,
      onEnterBack: showProgress,
      onLeave:     hideProgress,
      onLeaveBack: hideProgress,
      onUpdate: (self) => {
        const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
        setActiveStep(next)
        progressFill.style.width = `${self.progress * 100}%`
      },
    })

    return () => {
      trigger.kill()
      gsap.set(progressTrack, { autoAlpha: 0 })
    }
  }, [isMobile])

  const handleStepClick = (index) => {
    if (isMobile) {
      setActiveStep(index)
      return
    }
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const scrollableRange = wrapper.offsetHeight - window.innerHeight
    const targetProgress = (index + 0.5) / steps.length
    const targetY = wrapper.offsetTop + targetProgress * scrollableRange
    setActiveStep(index)
    gsap.to(window, { scrollTo: { y: targetY, autoKill: true }, duration: 1, ease: 'power2.inOut' })
  }

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, { stiffness: 320, damping: 28 })
  const hasNudged = useRef(false)

  const handlePan = (_event, info) => {
    const clamped = Math.max(-48, Math.min(48, info.offset.x))
    dragX.set(clamped * 0.4)
  }

  const handlePanEnd = (_event, info) => {
    const threshold = 60
    if (info.offset.x < -threshold) {
      setActiveStep(s => (s + 1) % steps.length)
    } else if (info.offset.x > threshold) {
      setActiveStep(s => (s - 1 + steps.length) % steps.length)
    }
    dragX.set(0)
  }

  const handleViewportEnter = () => {
    if (!isMobile || hasNudged.current) return
    hasNudged.current = true
    animate(dragX, [0, -16, 6, 0], {
      duration: 0.9,
      times: [0, 0.45, 0.75, 1],
      ease: 'easeInOut',
      delay: 0.5,
    })
  }

  const step = steps[activeStep]

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={progressTrackRef} className={styles.progressTrack}>
        <div ref={progressFillRef} className={styles.progressFill} />
      </div>

      <motion.section
        className={styles.section}
        id="creation"
        onPan={isMobile ? handlePan : undefined}
        onPanEnd={isMobile ? handlePanEnd : undefined}
        onViewportEnter={isMobile ? handleViewportEnter : undefined}
        viewport={{ once: true, amount: 0.4 }}
      >

        <div className={styles.left}>

          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowLabel}>Création</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.index}
              className={styles.headRow}
              initial={{ opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, y: -12, clipPath: 'inset(100% 0 0% 0)' }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className={styles.indexNum}>{step.index}</span>
              <h2 className={styles.stepName}>{step.name}</h2>
            </motion.div>
          </AnimatePresence>

          <div className={styles.divider} />

          <div className={styles.bottom}>
            <AnimatePresence mode="wait">
              <motion.p
                key={step.description}
                className={styles.description}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
              >
                {step.description}
              </motion.p>
            </AnimatePresence>

            <div className={styles.tabs}>
              {steps.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  className={`${styles.tab} ${i === activeStep ? styles.tabActive : ''}`}
                  onClick={() => handleStepClick(i)}
                >
                  {s.name}
                </button>
              ))}
              <span className={styles.counter}>
                {String(activeStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.right}
          style={isMobile ? { x: springX } : undefined}
        >

          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`${styles.media} ${i === activeStep ? styles.mediaActive : ''} ${s.type === 'scene' ? styles.mediaScene : ''}`}
            >
              {s.type === 'image' ? (
                <img src={s.src} alt={s.name} className={styles.image} loading="eager" />
              ) : isMobile ? (
                <div className={styles.scenePlaceholder}>
                  <span>Aperçu 3D — bientôt disponible</span>
                </div>
              ) : (
                <Suspense fallback={null}>
                  <StepScene />
                </Suspense>
              )}
            </div>
          ))}

          {isMobile && (
            <>
              <button
                type="button"
                className={`${styles.navArrow} ${styles.navArrowLeft}`}
                onClick={() => handleStepClick((activeStep - 1 + steps.length) % steps.length)}
                aria-label="Étape précédente"
              >‹</button>
              <button
                type="button"
                className={`${styles.navArrow} ${styles.navArrowRight}`}
                onClick={() => handleStepClick((activeStep + 1) % steps.length)}
                aria-label="Étape suivante"
              >›</button>
              <div className={styles.mobileCaption}>
                <span className={styles.mobileCaptionIndex}>{step.index}</span>
                <span className={styles.mobileCaptionName}>{step.name}</span>
              </div>
            </>
          )}
        </motion.div>

        {isMobile && (
          <div className={styles.dotsWrap}>
            <div className={styles.dotsRow} role="tablist" aria-label="Étapes">
              {steps.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  role="tab"
                  className={`${styles.dot} ${i === activeStep ? styles.dotActive : ''}`}
                  aria-label={s.name}
                  aria-selected={i === activeStep}
                  onClick={() => handleStepClick(i)}
                >
                  <span className={styles.dotVisual} />
                </button>
              ))}
            </div>
            <span className={styles.swipeHint}>Glisser pour changer d'étape</span>
          </div>
        )}

      </motion.section>
    </div>
  )
}
