import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'
import RevealText from '../ui/RevealText'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const bgInterp   = gsap.utils.interpolate('#0f0b08', '#f2ede6')
    const textInterp = gsap.utils.interpolate('#f2ede6', '#0f0b08')

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        gsap.set('body', {
          backgroundColor: bgInterp(self.progress),
          color: textInterp(self.progress),
        })
      },
      onLeave: () => gsap.to('body', {
        backgroundColor: '#0f0b08', color: '#f2ede6',
        duration: 0.8, ease: 'power2.inOut',
      }),
      onLeaveBack: () => gsap.to('body', {
        backgroundColor: '#0f0b08', color: '#f2ede6',
        duration: 0.5, ease: 'power2.inOut',
      }),
    })

    return () => {
      trigger.kill()
      gsap.set('body', { clearProps: 'backgroundColor,color' })
    }
  }, [])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
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
              <RevealText delay={0.2}><em>entre blablabla</em></RevealText>
              <RevealText delay={0.3}>et blablabla</RevealText>
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
    </div>
  )
}
