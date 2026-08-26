import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Navbar.module.css'

const links = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = e => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo} onClick={() => setMenuOpen(false)}>
        <span className={styles.logoAccent}>S</span>eedarrt
      </a>

      <ul className={styles.links}>
        {links.map(link => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ul className={styles.mobileLinks}>
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
                >
                  <a
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.mobileLinkIndex}>{String(i + 1).padStart(2, '0')}</span>
                    <span>{link.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className={styles.mobileSocials}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className={styles.mobileSocialsLabel}>Suivre</span>
              <div className={styles.mobileSocialsRow}>
                <a href="https://www.instagram.com/seedarrt" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://x.com/seedarrt" target="_blank" rel="noopener noreferrer">X</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
