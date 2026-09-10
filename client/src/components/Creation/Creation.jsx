import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Creation.module.css'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'
import {
  CREATION_VIDEO_URL,
  CREATION_VIDEO_POSTER_URL,
  CREATION_STEP_3D_IMAGE_URL,
  CREATION_STEP_PEINTURE_IMAGE_URL,
  CREATION_STEP_GRAPHISME_IMAGE_URL,
  CREATION_STEP_3D_MODEL_URL,
} from '../../lib/siteAssets'

const StepScene = lazy(() => import('./StepScene'))

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

const steps = [
  {
    index: '01',
    name: 'Objet 3D',
    description: 'Sculpture numérique et modélisation. Des formes entre réel et imaginaire, à la frontière du vivant et du minéral.',
    type: 'scene',
    modelUrl: CREATION_STEP_3D_MODEL_URL,
    modelScale: 0.75,
    modelRotationY: Math.PI - 0.22,
    modelPositionY: -1,
    src: CREATION_STEP_3D_IMAGE_URL,
    imagePosition: 'top',
  },
  {
    index: '02',
    name: 'Peinture',
    description: "Exploration de la matière et de la couleur à travers l'huile sur toile. Des œuvres organiques inspirées par la nature et ses cycles.",
    type: 'image',
    src: CREATION_STEP_PEINTURE_IMAGE_URL,
    imagePosition: 'center 35%',
  },
  {
    index: '03',
    name: 'Graphisme',
    description: 'Direction artistique et identité visuelle. Un regard singulier mis au service de projets visuels et de communication.',
    type: 'image',
    src: CREATION_STEP_GRAPHISME_IMAGE_URL,
  },
  {
    index: '04',
    name: 'Animation',
    description: 'Mise en mouvement des volumes : lumière, matière et caméra deviennent des outils de récit.',
    type: 'video',
    src: CREATION_VIDEO_URL,
  },
]

function VideoStep({ src, poster }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    videoRef.current?.play()
  }

  return (
    <div className={styles.videoWrap}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button type="button" className={styles.playButton} aria-label="Lire la vidéo" onClick={handlePlay}>
          <span className={styles.playIcon} />
        </button>
      )}
    </div>
  )
}

export default function Creation() {
  const [activeStep, setActiveStep] = useState(0)
  const isMobile = useIsMobile()
  const wrapperRef = useRef(null)
  const inView = useInView(wrapperRef)
  const progressTrackRef = useRef(null)
  const progressFillRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const progressTrack = progressTrackRef.current
    const progressFill = progressFillRef.current
    if (!wrapper) return

    const nav = document.querySelector('nav')
    const showProgress = () => {
      if (nav && !isMobile) progressTrack.style.top = `${nav.offsetHeight}px`
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
      {!isMobile && (
        <div ref={progressTrackRef} className={styles.progressTrack}>
          <div ref={progressFillRef} className={styles.progressFill} />
        </div>
      )}

      <motion.section
        className={styles.section}
        id="creation"
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

        <motion.div className={styles.right}>

          {steps.map((s, i) => {
            const fullBleed = s.type === 'video' || (s.type === 'scene' && !(isMobile && s.src))
            return (
              <div
                key={s.name}
                className={`${styles.media} ${i === activeStep ? styles.mediaActive : ''} ${fullBleed ? styles.mediaScene : ''}`}
              >
                {s.type === 'video' ? (
                  <VideoStep src={s.src} poster={CREATION_VIDEO_POSTER_URL} />
                ) : s.type === 'image' || (isMobile && s.src) ? (
                  <img
                    src={s.src}
                    alt={s.name}
                    className={styles.image}
                    style={{
                      ...(s.imagePosition && { objectPosition: s.imagePosition }),
                      ...(!isMobile && s.imageAlign && { alignSelf: s.imageAlign }),
                      ...(!isMobile && s.imageMarginTop && {
                        marginTop: s.imageMarginTop,
                        height: `calc(100% - ${s.imageMarginTop})`,
                      }),
                    }}
                    loading="eager"
                  />
                ) : isMobile ? (
                  <div className={styles.scenePlaceholder}>
                    <span>Aperçu 3D — bientôt disponible</span>
                  </div>
                ) : (
                  <Suspense fallback={null}>
                    <StepScene modelUrl={s.modelUrl} scale={s.modelScale} rotationY={s.modelRotationY} positionY={s.modelPositionY} active={inView} />
                  </Suspense>
                )}
              </div>
            )
          })}

          {isMobile && (
            <div className={styles.mobileCaption}>
              <span className={styles.mobileCaptionIndex}>{step.index}</span>
              <span className={styles.mobileCaptionName}>{step.name}</span>
            </div>
          )}
        </motion.div>

        {isMobile && (
          <div className={styles.dotsWrap}>
            <div ref={progressTrackRef} className={styles.progressTrack}>
              <div ref={progressFillRef} className={styles.progressFill} />
            </div>
          </div>
        )}

      </motion.section>
    </div>
  )
}
