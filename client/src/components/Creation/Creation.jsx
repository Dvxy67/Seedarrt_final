import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { motion, AnimatePresence } from 'framer-motion'
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
  }, [])

  const handleStepClick = (index) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const scrollableRange = wrapper.offsetHeight - window.innerHeight
    const targetProgress = (index + 0.5) / steps.length
    const targetY = wrapper.offsetTop + targetProgress * scrollableRange
    setActiveStep(index)
    gsap.to(window, { scrollTo: { y: targetY, autoKill: true }, duration: 1, ease: 'power2.inOut' })
  }

  const step = steps[activeStep]

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={progressTrackRef} className={styles.progressTrack}>
        <div ref={progressFillRef} className={styles.progressFill} />
      </div>

      <section className={styles.section} id="creation">

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

        <div className={styles.right}>

          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`${styles.media} ${i === activeStep ? styles.mediaActive : ''} ${s.type === 'scene' ? styles.mediaScene : ''}`}
            >
              {s.type === 'image' ? (
                <img src={s.src} alt={s.name} className={styles.image} loading="eager" />
              ) : isMobile ? (
                <div className={styles.scenePlaceholder} />
              ) : (
                <Suspense fallback={null}>
                  <StepScene />
                </Suspense>
              )}
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}
