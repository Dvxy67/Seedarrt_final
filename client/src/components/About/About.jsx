import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'
import RevealText from '../ui/RevealText'
import { useIsMobile } from '../../hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

// Sur mobile, un flick de scroll couvre la distance de la transition bien plus
// vite qu'un scroll bureau : le blanc n'est jamais "tenu", il est atteint pile
// au moment de quitter la section puis repart aussitôt. On sature la courbe
// plus tôt (à 55% du scroll) pour que le blanc reste stable jusqu'à la sortie,
// sans changer la longueur du scroll elle-même.
const MOBILE_HOLD_AT = 0.55

export default function About() {
  const wrapperRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const bgInterp    = gsap.utils.interpolate('#0f0b08', '#f2ede6')
    const textInterp  = gsap.utils.interpolate('#f2ede6', '#0f0b08')
    // Le texte "atténué" (--color-text-muted) doit lui aussi passer du clair
    // (lisible sur fond sombre) au foncé (lisible sur fond clair) — sans ça,
    // il reste gris clair sur fond clair en fin de scroll (contraste ~2,7:1).
    const mutedInterp = gsap.utils.interpolate('#9a8f85', '#4a4038')

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const t = isMobile ? Math.min(1, self.progress / MOBILE_HOLD_AT) : self.progress
        gsap.set('body', {
          backgroundColor: bgInterp(t),
          color: textInterp(t),
        })
        gsap.set(wrapper, { '--color-text-muted': mutedInterp(t) })
      },
      onLeave: () => {
        gsap.to('body', {
          backgroundColor: '#0f0b08', color: '#f2ede6',
          duration: 0.8, ease: 'power2.inOut',
        })
        gsap.to(wrapper, { '--color-text-muted': '#9a8f85', duration: 0.8, ease: 'power2.inOut' })
      },
      onLeaveBack: () => {
        gsap.to('body', {
          backgroundColor: '#0f0b08', color: '#f2ede6',
          duration: 0.5, ease: 'power2.inOut',
        })
        gsap.to(wrapper, { '--color-text-muted': '#9a8f85', duration: 0.5, ease: 'power2.inOut' })
      },
    })

    return () => {
      trigger.kill()
      gsap.set('body', { clearProps: 'backgroundColor,color' })
      gsap.set(wrapper, { clearProps: '--color-text-muted' })
    }
  }, [isMobile])

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
              {/* Peinture en attendant un vrai portrait de l'artiste */}
              <img
                src="/works/5_directly in the cave_oil painting_2024_100x75cm 2.JPG"
                alt=""
                className={styles.photo}
              />
              <div className={styles.frame} />
            </motion.div>
          </div>

          <div className={styles.textCol}>
            <RevealText>
              <span className={styles.label}>À propos</span>
            </RevealText>

            <h2 className={styles.heading}>
              <RevealText delay={0.1}>Une démarche</RevealText>
              <RevealText delay={0.2}><em>entre le vivant</em></RevealText>
              <RevealText delay={0.3}>et le minéral</RevealText>
            </h2>

            <motion.div
              className={styles.body}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <p>
                Peinture, sculpture numérique et graphisme se répondent dans une même recherche :
                donner forme à ce qui hésite entre organique et minéral, entre ce qui pousse et ce
                qui se fige. Je pars d'une intuition, d'une texture ou d'une couleur, et je laisse
                chaque pièce se construire lentement, sans idée arrêtée de son point d'arrivée.
              </p>
              <p>
                Peintre depuis 2018, j'explore aujourd'hui les mêmes obsessions à travers plusieurs
                médiums, en cherchant toujours le moins mais mieux plutôt que l'accumulation.
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
    </div>
  )
}
