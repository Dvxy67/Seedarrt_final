import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Contact.module.css'
import RevealText from '../ui/RevealText'

const INITIAL = { name: '', email: '', message: '' }
const MARQUEE = '— Seedarrt — Peinture — 3D — Graphisme — Disponible pour commandes   '

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState(null)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm(INITIAL)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} id="contact">

      {/* Marquee */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          <span>{MARQUEE}</span>
          <span aria-hidden="true">{MARQUEE}</span>
        </div>
      </div>

      <div className={styles.inner}>

        {/* Titre pleine largeur */}
        <div className={styles.titleBlock}>
          <RevealText>
            <span className={styles.label}>Contact</span>
          </RevealText>
          <h2 className={styles.heading}>
            <RevealText delay={0.1}>Travaillons</RevealText>
            <RevealText delay={0.22}><em>ensemble</em></RevealText>
          </h2>
        </div>

        {/* Email + form */}
        <div className={styles.bottom}>

          <div className={styles.left}>
            <motion.a
              href="mailto:seedarrt@gmail.com"
              className={styles.emailBig}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              seedarrt@gmail.com
            </motion.a>

            <motion.div
              className={styles.socials}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.2 }}
            >
              <a href="https://www.instagram.com/seedarrt" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                <span>Instagram</span>
              </a>
              <a href="https://x.com/seedarrt" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X</span>
              </a>
            </motion.div>
          </div>

          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15 }}
            noValidate
          >
            <Field id="name"    label="Nom"     type="text"     value={form.name}    onChange={handleChange} />
            <Field id="email"   label="Email"   type="email"    value={form.email}   onChange={handleChange} />
            <Field id="message" label="Message" type="textarea" value={form.message} onChange={handleChange} />

            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi…' : 'Envoyer'}
            </button>

            {status === 'sent'  && <p className={styles.success}>Message envoyé. Merci !</p>}
            {status === 'error' && <p className={styles.error}>Une erreur est survenue. Réessayez.</p>}
          </motion.form>

        </div>
      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Seedarrt — Tous droits réservés</p>
      </footer>
    </section>
  )
}

function Field({ id, label, type, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea className={`${styles.input} ${styles.textarea}`} id={id} name={id} required rows={4} value={value} onChange={onChange} />
      ) : (
        <input className={styles.input} id={id} name={id} type={type} required value={value} onChange={onChange} />
      )}
    </div>
  )
}
