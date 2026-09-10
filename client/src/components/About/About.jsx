import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'
import RevealText from '../ui/RevealText'
import { useIsMobile } from '../../hooks/useIsMobile'
import { ABOUT_IMAGE_URL } from '../../lib/siteAssets'

gsap.registerPlugin(ScrollTrigger)

// Desktop : le fond clair doit apparaître tôt dans le scroll de la section et
// rester stable jusqu'à la sortie plutôt que d'arriver pile à la fin. On
// sature la courbe de transition à 30% du scroll : le blanc est atteint dès
// ce point, puis tenu jusqu'à la sortie, sans changer la longueur du scroll.
const DESKTOP_HOLD_AT = 0.3

export default function About() {
  const wrapperRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    // Sur mobile, la section garde le fond sombre par défaut : pas de
    // transition de couleur au scroll.
    if (isMobile) return

    const bgInterp    = gsap.utils.interpolate('#171210', '#ede6de')
    const textInterp  = gsap.utils.interpolate('#ede6de', '#171210')
    // Le texte "atténué" (--color-text-muted) doit lui aussi passer du clair
    // (lisible sur fond sombre) au foncé (lisible sur fond clair) — sans ça,
    // il reste gris clair sur fond clair en fin de scroll (contraste ~2,7:1).
    const mutedInterp = gsap.utils.interpolate('#a2958a', '#52463d')

    const applyColors = (t) => {
      gsap.set('body', {
        backgroundColor: bgInterp(t),
        color: textInterp(t),
      })
      gsap.set(wrapper, { '--color-text-muted': mutedInterp(t) })
    }

    const resetColors = (duration) => {
      gsap.to('body', {
        backgroundColor: '#171210', color: '#ede6de',
        duration, ease: 'power2.inOut',
      })
      gsap.to(wrapper, { '--color-text-muted': '#a2958a', duration, ease: 'power2.inOut' })
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => applyColors(Math.min(1, self.progress / DESKTOP_HOLD_AT)),
      onLeave: () => resetColors(0.8),
      onLeaveBack: () => resetColors(0.5),
    })

    // Filet de sécurité indépendant de GSAP : si un scroll rapide fait sauter
    // le seuil exact où onLeave/onLeaveBack se déclenchent, le fond peut
    // rester bloqué clair. On détecte ici, via IntersectionObserver (donc
    // sans dépendre des positions en pixels que GSAP a pu calculer), le
    // moment où la section quitte complètement l'écran et on force le
    // retour au fond sombre.
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) resetColors(0)
    })
    io.observe(wrapper)

    return () => {
      trigger.kill()
      io.disconnect()
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
              <img
                src={ABOUT_IMAGE_URL}
                alt="Chevalet en extérieur, au bord de l'eau"
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
