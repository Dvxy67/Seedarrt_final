import { useEffect, useRef, useState } from 'react'
import { api } from './api'
import styles from './Login.module.css'

const MONTHS = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc']
const pad = (n) => (n < 10 ? '0' : '') + n

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Login({ onLogin }) {
  const now = useClock()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'done'
  const [error, setError] = useState('')
  const redirectTimer = useRef(null)

  useEffect(() => () => clearTimeout(redirectTimer.current), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status !== 'idle') return

    if (!email.trim() || !password) {
      setError('Renseignez votre adresse et votre mot de passe.')
      return
    }
    if (!email.includes('@')) {
      setError('Cette adresse ne ressemble pas à une adresse email.')
      return
    }

    setError('')
    setStatus('loading')
    try {
      const { token } = await api.login(email.trim(), password)
      setStatus('done')
      redirectTimer.current = setTimeout(() => onLogin(token, remember), 2600)
    } catch (err) {
      setStatus('idle')
      setError(err.message || 'Identifiants invalides')
    }
  }

  const stamp = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  return (
    <div className={styles.screen}>
      <div className={styles.left}>
        <div className={styles.leftTexture} />
        <div className={styles.leftLine} />

        <div className={styles.leftHeader}>
          <div>
            <div className={styles.wordmark}>Seedarrt</div>
            <div className={styles.eyebrowAccent}>Espace privé</div>
          </div>
          <div className={styles.dateStamp}>
            {stamp}
            <br />
            {clock}
          </div>
        </div>

        <div className={styles.leftBody}>
          <div className={styles.leftKicker}>
            <span className={styles.kickerLine} />
            <span>Accès réservé</span>
          </div>
          <div className={styles.leftTitle}>L'atelier,</div>
          <div className={styles.leftTitleMuted}>côté coulisses</div>
          <p className={styles.leftText}>
            La galerie, les pièces, les abonnés. Tout ce que le public ne voit pas se règle ici.
          </p>
        </div>

        <div className={styles.leftFooter}>
          <div className={styles.leftFooterLine} />
          <div className={styles.leftFooterText}>Un seul compte, celui de l'artiste.</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.cornerLabel}>Connexion</div>

        <div className={styles.formArea}>
          <form
            className={`${styles.form} ${status === 'done' ? styles.formOut : ''}`}
            onSubmit={handleSubmit}
          >
            <div className={styles.eyebrow}>01 . Identification</div>
            <h1 className={styles.title}>
              Bonjour, <span className={styles.titleMuted}>Seedarrt</span>
            </h1>

            <div className={styles.field}>
              <label htmlFor="admin-email">Adresse</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="bonjour@seedarrt.fr"
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHead}>
                <label htmlFor="admin-password">Mot de passe</label>
                <button
                  type="button"
                  className={styles.pwToggle}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="button"
              className={styles.remember}
              onClick={() => setRemember((v) => !v)}
            >
              <span className={remember ? styles.checkOn : styles.checkOff}>
                {remember && '✓'}
              </span>
              <span className={styles.rememberLabel}>Rester connecté</span>
            </button>

            <button type="submit" className={styles.submit} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <span className={styles.spinner} />
                  <span>Vérification</span>
                </>
              ) : (
                <>
                  <span>Entrer</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {status === 'done' && (
            <div className={styles.done}>
              <div className={styles.doneStamp}>
                <span className={styles.doneRing} />
                <span className={styles.doneRingStatic} />
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path
                    d="M8 18.2 L14.4 24.2 L26 10.4"
                    stroke="#c4623a"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                    strokeDasharray="34"
                    className={styles.doneTick}
                  />
                </svg>
              </div>
              <div className={styles.doneEyebrow}>Accès accordé</div>
              <div className={styles.doneTitle}>
                Bienvenue, <span>Seedarrt</span>
              </div>
              <div className={styles.doneText}>
                {remember
                  ? 'Vous restez connecté sur cet appareil.'
                  : "Session valable jusqu'à la fermeture du navigateur."}
              </div>
              <div className={styles.doneBarTrack}>
                <div className={styles.doneBar} />
              </div>
              <div className={styles.doneFooter}>Ouverture du tableau de bord</div>
            </div>
          )}
        </div>

        <div className={styles.bottomBar}>
          <div>Seedarrt · administration</div>
          <div>Connexion chiffrée</div>
        </div>
      </div>
    </div>
  )
}
