import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo}>
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
    </nav>
  )
}
