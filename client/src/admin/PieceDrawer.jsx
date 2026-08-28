import { useEffect, useRef, useState } from 'react'
import styles from './PieceDrawer.module.css'

const CATEGORIES = ['Peinture', '3D', 'Graphisme']

export default function PieceDrawer({ mode, work, onSave, onClose, saving, error }) {
  const isNew = mode === 'new'
  const [title, setTitle] = useState(work?.title || '')
  const [category, setCategory] = useState(work?.category || 'Peinture')
  const [year, setYear] = useState(work?.year || String(new Date().getFullYear()))
  const [description, setDescription] = useState(work?.description || '')
  const [published, setPublished] = useState(work ? work.published : false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(work?.imageUrl || null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!imageFile) return
    const url = URL.createObjectURL(imageFile)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const pickFile = (file) => {
    if (file && file.type.startsWith('image/')) setImageFile(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: work?.id ?? null,
      title,
      category,
      year,
      description,
      published,
      imageFile,
    })
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div>
            <div className={styles.kicker}>{isNew ? 'Nouvelle pièce' : 'Modifier'}</div>
            <div className={styles.title}>{isNew ? 'Ajouter une pièce' : work?.title}</div>
          </div>
          <button type="button" className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} id="piece-drawer-form">
          <div>
            <div className={styles.label}>Visuel</div>
            <div
              className={styles.dropzone}
              data-drag={dragOver || undefined}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                pickFile(e.dataTransfer.files?.[0])
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="" className={styles.preview} />
              ) : (
                <>
                  <div className={styles.dropText}>Déposer une image, ou parcourir</div>
                  <div className={styles.dropHint}>WebP ou JPG · 780 px de large minimum</div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <div>
            <div className={styles.label}>Titre</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la pièce"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.row}>
            <div>
              <div className={styles.label}>Catégorie</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className={styles.label}>Année</div>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`${styles.input} ${styles.mono}`}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div>
            <div className={styles.label}>Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deux phrases suffisent."
              className={styles.textarea}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.publishRow}>
            <div className={styles.publishText}>
              <div className={styles.publishTitle}>Visible sur le site</div>
              <div className={styles.publishHint}>Décochez pour garder la pièce en brouillon.</div>
            </div>
            <button
              type="button"
              className={styles.switch}
              data-on={published || undefined}
              onClick={() => setPublished((v) => !v)}
            >
              <span className={styles.switchKnob} />
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          <button
            type="submit"
            form="piece-drawer-form"
            className={styles.save}
            disabled={saving}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </>
  )
}
