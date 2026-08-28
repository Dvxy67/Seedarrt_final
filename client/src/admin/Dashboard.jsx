import { useEffect, useRef, useState } from 'react'
import { api } from './api'
import Gallery from './Gallery'
import Newsletter from './Newsletter'
import PieceDrawer from './PieceDrawer'
import Toast from './Toast'
import styles from './Dashboard.module.css'

function buildWorkFormData(fields) {
  const fd = new FormData()
  if (fields.title !== undefined) fd.append('title', fields.title)
  if (fields.category !== undefined) fd.append('category', fields.category)
  if (fields.year !== undefined) fd.append('year', fields.year)
  if (fields.description !== undefined) fd.append('description', fields.description)
  if (fields.published !== undefined) fd.append('published', String(fields.published))
  if (fields.imageFile) fd.append('image', fields.imageFile)
  if (fields.imageUrl) fd.append('imageUrl', fields.imageUrl)
  if (fields.imagePublicId) fd.append('imagePublicId', fields.imagePublicId)
  return fd
}

export default function Dashboard({ onLogout }) {
  const [view, setView] = useState('gallery')
  const [works, setWorks] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [email, setEmail] = useState('')
  const [drawer, setDrawer] = useState(null) // { mode: 'new' | 'edit', work? }
  const [drawerSaving, setDrawerSaving] = useState(false)
  const [drawerError, setDrawerError] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    const token = api.getToken()
    const payload = token && api.decodeToken(token)
    if (payload?.email) setEmail(payload.email)

    api.get('/works/all').then(setWorks).catch(() => {})
    api.get('/newsletter').then(setSubscribers).catch(() => {})

    return () => clearTimeout(toastTimer.current)
  }, [])

  const showToast = (msg, undo) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, undo: undo || null })
    toastTimer.current = setTimeout(() => setToast(null), 5000)
  }

  const closeDrawer = () => {
    setDrawer(null)
    setDrawerError('')
  }

  const handleSaveDraft = async ({ id, title, category, year, description, published, imageFile }) => {
    const cleanTitle = title.trim() || 'Sans titre'
    setDrawerError('')
    setDrawerSaving(true)
    try {
      if (id) {
        const updated = await api.patch(
          `/works/${id}`,
          buildWorkFormData({ title: cleanTitle, category, year, description, published, imageFile }),
          true
        )
        setWorks((prev) => prev.map((w) => (w.id === id ? updated : w)))
        showToast('Modifications enregistrées.')
      } else {
        if (!imageFile) {
          setDrawerError('Ajoutez une image pour cette pièce.')
          setDrawerSaving(false)
          return
        }
        const created = await api.post(
          '/works',
          buildWorkFormData({ title: cleanTitle, category, year, description, published, imageFile }),
          true
        )
        setWorks((prev) => [...prev, created])
        showToast(`« ${cleanTitle} » a été ajoutée.`)
      }
      closeDrawer()
    } catch (err) {
      setDrawerError(err.message || 'Erreur lors de l’enregistrement.')
    } finally {
      setDrawerSaving(false)
    }
  }

  const handleTogglePublish = async (work) => {
    try {
      const updated = await api.patch(
        `/works/${work.id}`,
        buildWorkFormData({ published: !work.published }),
        true
      )
      setWorks((prev) => prev.map((w) => (w.id === work.id ? updated : w)))
      showToast(
        updated.published ? `« ${work.title} » est publiée.` : `« ${work.title} » est repassée en brouillon.`
      )
    } catch (err) {
      showToast(err.message || 'Erreur lors de la mise à jour.')
    }
  }

  const handleUndoDelete = async (work) => {
    try {
      const restored = await api.post(
        '/works',
        buildWorkFormData({
          title: work.title,
          category: work.category,
          year: work.year,
          description: work.description,
          published: work.published,
          imageUrl: work.imageUrl,
          imagePublicId: work.imagePublicId,
        }),
        true
      )
      setWorks((prev) => [...prev, restored])
      showToast(`« ${work.title} » a été restaurée.`)
    } catch {
      showToast('La restauration a échoué.')
    }
  }

  const handleDelete = async (work) => {
    try {
      await api.del(`/works/${work.id}`)
      setWorks((prev) => prev.filter((w) => w.id !== work.id))
      showToast(`« ${work.title} » a été supprimée.`, () => handleUndoDelete(work))
    } catch (err) {
      showToast(err.message || 'La suppression a échoué.')
    }
  }

  const handleMove = async (id, dir) => {
    const list = works.slice()
    const i = list.findIndex((w) => w.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    const previous = works
    setWorks(list)
    try {
      await api.post('/works/reorder', { ids: list.map((w) => w.id) })
    } catch {
      setWorks(previous)
      showToast('Le réordonnancement a échoué.')
    }
  }

  const handleUnsubscribe = async (ids) => {
    try {
      await api.post('/newsletter/unsubscribe', { ids })
      setSubscribers((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, active: false } : s)))
      showToast(ids.length === 1 ? '1 adresse désinscrite.' : `${ids.length} adresses désinscrites.`)
    } catch (err) {
      showToast(err.message || 'La désinscription a échoué.')
    }
  }

  const handleExport = async () => {
    try {
      const token = api.getToken()
      const res = await fetch('/api/newsletter/export.csv', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'abonnes-seedarrt.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      showToast(`Export CSV de ${subscribers.filter((s) => s.active).length} adresses lancé.`)
    } catch {
      showToast("L'export a échoué.")
    }
  }

  const activeSubscribers = subscribers.filter((s) => s.active).length
  const openNewDrawer = () => setDrawer({ mode: 'new' })

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.mark}>Seedarrt</div>
          <div className={styles.eyebrow}>Administration</div>
        </div>

        <nav className={styles.nav}>
          <button
            className={view === 'gallery' ? styles.navItemActive : styles.navItem}
            onClick={() => setView('gallery')}
          >
            <span>Galerie</span>
            <span className={view === 'gallery' ? styles.countActive : styles.count}>
              {works.length}
            </span>
          </button>
          <button
            className={view === 'newsletter' ? styles.navItemActive : styles.navItem}
            onClick={() => setView('newsletter')}
          >
            <span>Infolettre</span>
            <span className={view === 'newsletter' ? styles.countActive : styles.count}>
              {activeSubscribers}
            </span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.siteLink}>
            Voir le site ↗
          </a>
          <div className={styles.identity}>
            <div className={styles.avatar}>{email ? email[0].toUpperCase() : 'S'}</div>
            <div className={styles.identityText}>
              <div className={styles.identityName}>Seedarrt</div>
              <div className={styles.identityEmail}>{email}</div>
            </div>
          </div>
          <button className={styles.logout} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <header className={styles.mobileHeader}>
        <div>
          <div className={styles.mark}>Seedarrt</div>
          <div className={styles.eyebrow}>Administration</div>
        </div>
        <button
          className={styles.mobileAvatar}
          onClick={() => {
            if (window.confirm('Se déconnecter ?')) onLogout()
          }}
          aria-label="Déconnexion"
        >
          {email ? email[0].toUpperCase() : 'S'}
        </button>
      </header>

      <main className={styles.content}>
        {view === 'gallery' ? (
          <Gallery
            works={works}
            onOpenNew={openNewDrawer}
            onEdit={(work) => setDrawer({ mode: 'edit', work })}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ) : (
          <Newsletter
            subscribers={subscribers}
            onUnsubscribe={handleUnsubscribe}
            onExport={handleExport}
          />
        )}
      </main>

      {view === 'gallery' && (
        <button className={styles.fab} onClick={openNewDrawer}>
          <span className={styles.fabPlus}>+</span>
          <span>Ajouter une pièce</span>
        </button>
      )}

      <nav className={styles.mobileNav}>
        <button
          className={view === 'gallery' ? styles.mobileNavItemActive : styles.mobileNavItem}
          onClick={() => setView('gallery')}
        >
          Galerie
        </button>
        <button
          className={view === 'newsletter' ? styles.mobileNavItemActive : styles.mobileNavItem}
          onClick={() => setView('newsletter')}
        >
          Infolettre
        </button>
        <a href="/" className={styles.mobileNavItem}>
          Le site ↗
        </a>
      </nav>

      {drawer && (
        <PieceDrawer
          mode={drawer.mode}
          work={drawer.work}
          onSave={handleSaveDraft}
          onClose={closeDrawer}
          saving={drawerSaving}
          error={drawerError}
        />
      )}

      <Toast
        toast={toast}
        onUndo={() => {
          clearTimeout(toastTimer.current)
          const undo = toast?.undo
          setToast(null)
          undo?.()
        }}
      />
    </div>
  )
}
