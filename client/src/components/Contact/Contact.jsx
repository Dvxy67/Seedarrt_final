import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Contact.module.css'
import RevealText from '../ui/RevealText'

const TOPICS = ['3D', 'Peinture', 'Animation 3D', 'Graphisme']
const MAX_LEN = 1000

const emailOk = v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef(null)

  useEffect(() => () => clearTimeout(copyTimeout.current), [])

  const show = field => submitted || touched[field]

  const errName = show('name') && !name.trim() ? 'Indiquez votre nom.' : null
  const errEmail = show('email')
    ? (!email.trim() ? 'Indiquez un email pour la réponse.' : (!emailOk(email) ? 'Cet email semble incomplet.' : null))
    : null
  const errMessage = show('message') && message.trim().length < 10 ? 'Quelques mots de plus sur le projet ?' : null

  const blur = field => () => setTouched(prev => ({ ...prev, [field]: true }))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('seedarrt@gmail.com')
    } catch {
      /* ignore */
    }
    setCopied(true)
    clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitted(true)
    const ok = name.trim() && emailOk(email) && message.trim().length >= 10
    if (!ok) return

    setSending(true)
    setServerError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: `[${topic}] ${message}` }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setServerError(true)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setName('')
    setEmail('')
    setMessage('')
    setTopic(TOPICS[0])
    setTouched({})
    setSubmitted(false)
    setSent(false)
    setServerError(false)
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>

        <div className={styles.bottom}>

          <div className={styles.left}>
            <div className={styles.titleBlock}>
              <RevealText>
                <span className={styles.label}>Contact</span>
              </RevealText>
              <h2 className={styles.heading}>
                <RevealText delay={0.1}>Travaillons</RevealText>
                <RevealText delay={0.22}><em>ensemble</em></RevealText>
              </h2>
              <motion.p
                className={styles.intro}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.3 }}
              >
                3D, peinture, animation 3D, graphisme. Racontez-moi le projet en quelques lignes — je réponds à chaque message.
              </motion.p>
            </div>

            <motion.div
              className={styles.block}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <span className={styles.blockLabel}>Écrire directement</span>
              <div className={styles.emailRow}>
                <a href="mailto:seedarrt@gmail.com" className={styles.emailBig}>
                  seedarrt@gmail.com
                </a>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? 'Copié ✓' : 'Copier'}
                </button>
              </div>
            </motion.div>

            <motion.div
              className={styles.block}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.15 }}
            >
              <span className={styles.blockLabel}>Ailleurs</span>
              <div className={styles.socials}>
                <a href="https://www.instagram.com/seedarrt" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Instagram" title="Instagram">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.1" />
                    <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://x.com/seedarrt" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="X" title="X">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <path d="M4 4 L20 20" />
                    <path d="M20 4 L4 20" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          <div className={styles.divider} />

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  className={styles.sentPanel}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.sentStamp}>
                    <span className={styles.sentRing} />
                    <span className={styles.sentRingStatic} />
                    <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
                      <path
                        d="M8 18.2 L14.4 24.2 L26 10.4"
                        stroke="var(--color-accent-light)"
                        strokeWidth="1.8"
                        strokeLinecap="square"
                        strokeDasharray="34"
                        className={styles.sentTick}
                      />
                    </svg>
                  </div>
                  <span className={styles.sentTag}>Message envoyé</span>
                  <p className={styles.sentTitle}>Merci {name}, c'est bien reçu.</p>
                  <p className={styles.sentText}>Je reviens vers vous à {email} sous 24 heures ouvrées.</p>
                  <button type="button" className={styles.ghostBtn} onClick={reset}>
                    Écrire un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className={styles.form}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  noValidate
                >
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Votre projet</label>
                    <div className={styles.chips}>
                      {TOPICS.map(t => (
                        <button
                          key={t}
                          type="button"
                          className={`${styles.chip} ${topic === t ? styles.chipActive : ''}`}
                          onClick={() => setTopic(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="c-name" className={styles.fieldLabel}>Nom</label>
                    <input
                      id="c-name"
                      className={styles.input}
                      type="text"
                      autoComplete="name"
                      placeholder="Votre nom"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onBlur={blur('name')}
                    />
                    {errName && <span className={styles.errText}>{errName}</span>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="c-email" className={styles.fieldLabel}>Email</label>
                    <input
                      id="c-email"
                      className={styles.input}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="votre@email.fr"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={blur('email')}
                    />
                    {errEmail && <span className={styles.errText}>{errEmail}</span>}
                  </div>

                  <div className={styles.field}>
                    <div className={styles.fieldHead}>
                      <label htmlFor="c-message" className={styles.fieldLabel}>Message</label>
                      <span className={styles.count}>{message.length} / {MAX_LEN}</span>
                    </div>
                    <textarea
                      id="c-message"
                      className={styles.textarea}
                      rows={4}
                      placeholder="Le projet, le calendrier, le budget si vous l'avez en tête…"
                      value={message}
                      onChange={e => setMessage(e.target.value.slice(0, MAX_LEN))}
                      onBlur={blur('message')}
                    />
                    {errMessage && <span className={styles.errText}>{errMessage}</span>}
                  </div>

                  <div className={styles.submitRow}>
                    <button type="submit" className={styles.submit} disabled={sending}>
                      {sending ? 'Envoi…' : 'Envoyer'}
                      <span className={styles.arrow}>→</span>
                    </button>
                    <span className={styles.disclaimer}>
                      Réponse sous 24&nbsp;h ouvrées.<br />Vos informations ne sont jamais partagées.
                    </span>
                  </div>

                  {serverError && <p className={styles.error}>Une erreur est survenue. Réessayez ou écrivez directement par email.</p>}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
