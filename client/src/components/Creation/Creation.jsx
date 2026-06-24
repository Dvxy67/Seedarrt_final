import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Creation.module.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    index: '01',
    name: 'Peinture',
    description: "Exploration de la matière et de la couleur à travers l'huile sur toile. Des œuvres organiques inspirées par la nature et ses cycles.",
    type: 'image',
    src: '/works/1_I came across the rainforest_oil painting_2025_75x60cm 2.JPG',
  },
  {
    index: '02',
    name: '3D',
    description: 'Sculpture numérique et modélisation. Des formes entre réel et imaginaire, à la frontière du vivant et du minéral.',
    type: 'scene',
    src: null,
  },
  {
    index: '03',
    name: 'Graphisme',
    description: 'Direction artistique et identité visuelle. Un regard singulier mis au service de projets visuels et de communication.',
    type: 'image',
    src: '/works/IMG_4681.PNG',
  },
]

function StepModel() {
  const { scene: source } = useGLTF('/models/Project%205.glb')
  const scene = useMemo(() => SkeletonUtils.clone(source), [source])
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const rot = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const targetX = -mouse.current.y * 0.4
    const targetY = mouse.current.x * 0.6
    vel.current.x += (targetX - rot.current.x) * 0.08
    vel.current.y += (targetY - rot.current.y) * 0.08
    vel.current.x *= 0.8
    vel.current.y *= 0.8
    rot.current.x += vel.current.x
    rot.current.y += vel.current.y
    groupRef.current.rotation.x = rot.current.x
    groupRef.current.rotation.y = rot.current.y
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <primitive ref={groupRef} object={scene} scale={0.42} position={[0, 0, 0]} />
  )
}

function StepScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 6, 4]} intensity={1.2} color="#f5f0ea" />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#c4623a" />
      <Environment preset="night" />
      <StepModel />
      <EffectComposer>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.9} intensity={0.35} mipmapBlur />
      </EffectComposer>
      <Preload all />
    </Canvas>
  )
}

export default function Creation() {
  const [activeStep, setActiveStep] = useState(0)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
        setActiveStep(next)
      },
    })

    return () => trigger.kill()
  }, [])

  const step = steps[activeStep]

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <section className={styles.section} id="creation">

        <div className={styles.left}>
          <span className={styles.label}>Création</span>

          <div className={styles.stepInfo}>
            <AnimatePresence mode="wait">
              <motion.span
                key={step.index}
                className={styles.index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step.index}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h2
                key={step.name}
                className={styles.name}
                initial={{ opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                exit={{ opacity: 0, y: -16, clipPath: 'inset(100% 0 0% 0)' }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {step.name}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className={styles.divider} />

          <AnimatePresence mode="wait">
            <motion.p
              key={step.description}
              className={styles.description}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {step.description}
            </motion.p>
          </AnimatePresence>

          <div className={styles.dots}>
            {steps.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === activeStep ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.right}>
          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`${styles.media} ${i === activeStep ? styles.mediaActive : ''}`}
            >
              {s.type === 'image'
                ? <img src={s.src} alt={s.name} className={styles.image} loading="eager" />
                : <StepScene />
              }
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}
