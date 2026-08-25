import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Newsletter.module.css'
import RevealText from '../ui/RevealText'

const CONTENTS = [
  { label: 'Rythme', text: 'Trois à quatre lettres par an, jamais plus.' },
  { label: 'Contenu', text: 'Les pièces terminées, les dates d’exposition, un aperçu de ce qui est en cours.' },
  { label: 'Sortie', text: 'Un lien de désinscription dans chaque envoi. Aucune adresse partagée.' },
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(data.error || 'Une erreur est survenue. Réessayez.')
        setStatus('error')
        return
      }
      setStatus('success')
      setEmail('')
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.')
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} id="newsletter">
      <div className={styles.inner}>

        <div className={styles.left}>
          <div className={styles.kicker}>
            <span className={styles.rule} />
            <span>Newsletter</span>
          </div>

          <h2 className={styles.heading}>
            <RevealText>Recevoir l'atelier</RevealText>
            <RevealText delay={0.1}><em>par écrit</em></RevealText>
          </h2>

          <ul className={styles.contents}>
            {CONTENTS.map((c, i) => (
              <motion.li
                key={c.label}
                className={styles.contentRow}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              >
                <span className={styles.contentLabel}>{c.label}</span>
                <span className={styles.contentText}>{c.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className={styles.card}>
            {status === 'success' ? (
              <div className={styles.success} role="status" aria-live="polite">
                <div className={styles.successHead}>
                  <span className={styles.successRule} />
                  <span className={styles.successTitle}>C'est noté.</span>
                </div>
                <p className={styles.successBody}>
                  Un email de confirmation vient de partir. La prochaine lettre arrive bientôt.
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <span className={styles.cardLabel}>Une seule information suffit</span>

                <label htmlFor="newsletter-email" className={styles.visuallyHidden}>
                  Votre adresse email
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="votre adresse email"
                  className={`${styles.input} ${status === 'error' ? styles.inputError : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                {/* Honeypot anti-spam — masqué visuellement et aux lecteurs d'écran */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className={styles.honeypot}
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />

                <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi…' : 'Recevoir les nouveautés'}
                </button>

                <div className={styles.liveRegion} aria-live="polite">
                  {status === 'error'
                    ? <p className={styles.errorNote}>{errorMsg}</p>
                    : <p className={styles.note}>Trois à quatre envois par an. Pas de spam, désinscription en un clic.</p>}
                </div>
              </form>
            )}
          </div>

          <div className={styles.altContact}>
            <span>Une commande ou une exposition à discuter ?</span>
            <a href="#contact" className={styles.altLink}>Écrire directement</a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
