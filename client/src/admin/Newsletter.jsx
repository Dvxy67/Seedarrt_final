import { useMemo, useState } from 'react'
import styles from './Newsletter.module.css'

function formatDate(iso) {
  const d = new Date(iso)
  const pad = (n) => (n < 10 ? '0' : '') + n
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export default function Newsletter({ subscribers, onUnsubscribe, onExport }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return subscribers.filter((s) => !q || s.email.toLowerCase().includes(q))
  }, [subscribers, search])

  const active = subscribers.filter((s) => s.active)
  const now = new Date()
  const newThisMonth = subscribers.filter((s) => {
    const d = new Date(s.createdAt)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const lastSignup = subscribers.length
    ? formatDate(
        subscribers.reduce((latest, s) =>
          new Date(s.createdAt) > new Date(latest.createdAt) ? s : latest
        ).createdAt
      )
    : '—'

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAll = () => {
    setSelected(selected.length === shown.length ? [] : shown.map((s) => s.id))
  }

  const handleUnsubscribe = () => {
    onUnsubscribe(selected)
    setSelected([])
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Infolettre</h1>
            <p className={styles.meta}>
              {active.length} abonné{active.length !== 1 ? 's' : ''} actif
              {active.length !== 1 ? 's' : ''} sur {subscribers.length} adresse
              {subscribers.length !== 1 ? 's' : ''} enregistrée{subscribers.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <button className={styles.exportButton} onClick={onExport}>
            Exporter en CSV
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Abonnés actifs</div>
            <div className={styles.statValue}>{active.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Nouveaux ce mois</div>
            <div className={styles.statValueAccent}>{newThisMonth}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Dernière inscription</div>
            <div className={styles.statValue}>{lastSignup}</div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une adresse"
            className={styles.search}
          />
          {selected.length > 0 && (
            <div className={styles.selection}>
              <div className={styles.selectionLabel}>
                {selected.length === 1
                  ? '1 adresse sélectionnée'
                  : `${selected.length} adresses sélectionnées`}
              </div>
              <button className={styles.unsubBtn} onClick={handleUnsubscribe}>
                Désinscrire
              </button>
              <button className={styles.clearBtn} onClick={() => setSelected([])}>
                Annuler
              </button>
            </div>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.checkCol} onClick={selectAll}>
              ☐
            </div>
            <div>Adresse</div>
            <div>Inscrit le</div>
            <div>Origine</div>
            <div>Statut</div>
          </div>

          {shown.map((s) => (
            <div key={s.id} className={styles.row}>
              <div className={styles.checkCol} onClick={() => toggleSelect(s.id)}>
                {selected.includes(s.id) ? (
                  <span className={styles.checkOn}>■</span>
                ) : (
                  <span className={styles.checkOff}>☐</span>
                )}
              </div>
              <div className={styles.email}>{s.email}</div>
              <div className={styles.date}>{formatDate(s.createdAt)}</div>
              <div className={styles.origin}>{s.origin}</div>
              <div>
                {s.active ? (
                  <div className={styles.statusActive}>
                    <span className={styles.dotActive} />
                    Actif
                  </div>
                ) : (
                  <div className={styles.statusOut}>
                    <span className={styles.dotOut} />
                    Désinscrit
                  </div>
                )}
              </div>
            </div>
          ))}

          {shown.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Aucune adresse trouvée</div>
              <p className={styles.emptyText}>Aucun abonné ne correspond à cette recherche.</p>
            </div>
          )}
        </div>

        <div className={styles.mobileList}>
          {shown.map((s) => (
            <div key={s.id} className={styles.mobileRow}>
              <div className={styles.mobileRowMain}>
                <div className={styles.mobileEmail}>{s.email}</div>
                <div className={styles.mobileRowMeta}>
                  <span className={styles.mobileDate}>{formatDate(s.createdAt)}</span>
                  <span className={styles.mobileDivider} />
                  <span className={styles.mobileOrigin}>{s.origin}</span>
                </div>
              </div>
              {s.active ? (
                <button
                  className={styles.mobileUnsubBtn}
                  onClick={() => onUnsubscribe([s.id])}
                >
                  Désinscrire
                </button>
              ) : (
                <div className={styles.mobileOutBadge}>
                  <span className={styles.dotOut} />
                  Désinscrit
                </div>
              )}
            </div>
          ))}
          {shown.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Aucune adresse trouvée</div>
              <p className={styles.emptyText}>Aucun abonné ne correspond à cette recherche.</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerCount}>
            {shown.length} adresse{shown.length !== 1 ? 's' : ''} affichée
            {shown.length !== 1 ? 's' : ''}
          </div>
          <div className={styles.footerNote}>
            Une adresse désinscrite reste visible ici mais ne recevra plus rien.
          </div>
        </div>
      </section>
    </div>
  )
}
