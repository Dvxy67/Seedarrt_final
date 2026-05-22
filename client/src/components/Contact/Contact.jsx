import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Contact.module.css'

const INITIAL = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

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
      <div className={styles.inner}>

        <motion.div
          className={styles.left}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <span className={styles.label}>Contact</span>
          <h2 className={styles.heading}>
            Travaillons
            <br />
            <em>ensemble</em>
          </h2>
          <p className={styles.intro}>
            Pour toute demande de collaboration, commande ou renseignement,
            n'hésitez pas à prendre contact.
          </p>
          <a href="mailto:email@example.com" className={styles.email}>
            email@example.com
          </a>
        </motion.div>

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.15 }}
          noValidate
        >
          <Field id="name" label="Nom" type="text" value={form.name} onChange={handleChange} />
          <Field id="email" label="Email" type="email" value={form.email} onChange={handleChange} />
          <Field id="message" label="Message" type="textarea" value={form.message} onChange={handleChange} />

          <button
            type="submit"
            className={styles.submit}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Envoi…' : 'Envoyer'}
          </button>

          {status === 'sent'  && <p className={styles.success}>Message envoyé. Merci !</p>}
          {status === 'error' && <p className={styles.error}>Une erreur est survenue. Réessayez.</p>}
        </motion.form>

      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} — Tous droits réservés</p>
      </footer>
    </section>
  )
}

function Field({ id, label, type, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id={id}
          name={id}
          required
          rows={5}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className={styles.input}
          id={id}
          name={id}
          type={type}
          required
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  )
}
