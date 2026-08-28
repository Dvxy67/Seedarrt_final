import { useMemo, useState } from 'react'
import styles from './Gallery.module.css'

const CATEGORIES = ['Tous', 'Peinture', '3D', 'Graphisme']

export default function Gallery({ works, onOpenNew, onEdit, onTogglePublish, onDelete, onMove }) {
  const [filter, setFilter] = useState('Tous')
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState('grid')
  const [confirmId, setConfirmId] = useState(null)
  const [reorder, setReorder] = useState(false)

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return works.filter((w) => {
      const okCat = filter === 'Tous' || w.category === filter
      const okQ =
        !q ||
        w.title.toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q)
      return okCat && okQ
    })
  }, [works, filter, search])

  const drafts = works.filter((w) => !w.published).length

  const handleDelete = (work) => {
    setConfirmId(null)
    onDelete(work)
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Galerie</h1>
            <p className={styles.meta}>
              {works.length} pièce{works.length !== 1 ? 's' : ''}, dont {drafts} en brouillon.
              L'ordre ci-dessous est celui du site.
            </p>
          </div>
          <button className={styles.addButton} onClick={onOpenNew}>
            <span className={styles.addPlus}>+</span>
            <span>Ajouter une pièce</span>
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.filters}>
            {CATEGORIES.map((c) => {
              const count =
                c === 'Tous' ? works.length : works.filter((w) => w.category === c).length
              const active = filter === c
              return (
                <button
                  key={c}
                  className={active ? styles.filterActive : styles.filter}
                  onClick={() => setFilter(c)}
                >
                  <span>{c}</span>
                  <span className={active ? styles.filterCountActive : styles.filterCount}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className={styles.rightControls}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une pièce"
              className={styles.search}
            />
            <div className={styles.modeToggle}>
              <button
                className={mode === 'grid' ? styles.modeActive : styles.mode}
                onClick={() => setMode('grid')}
              >
                Grille
              </button>
              <button
                className={mode === 'list' ? styles.modeActiveBordered : styles.modeBordered}
                onClick={() => setMode('list')}
              >
                Liste
              </button>
            </div>
          </div>
        </div>

        <div className={styles.mobileMetaRow}>
          <div className={styles.mobileMeta}>
            {works.length} pièce{works.length !== 1 ? 's' : ''}, {drafts} en brouillon
          </div>
          <button
            className={reorder ? styles.reorderBtnActive : styles.reorderBtn}
            onClick={() => setReorder((v) => !v)}
          >
            {reorder ? 'Terminer' : 'Réordonner'}
          </button>
        </div>
      </header>

      <section className={styles.section}>
        {shown.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Aucune pièce ici</div>
            <p className={styles.emptyText}>
              Aucun résultat pour cette recherche ou ce filtre. Essayez un autre terme, ou ajoutez
              une nouvelle pièce.
            </p>
            <button
              className={styles.emptyButton}
              onClick={() => {
                setFilter('Tous')
                setSearch('')
              }}
            >
              Tout afficher
            </button>
          </div>
        ) : (
          <>
          {mode === 'grid' ? (
          <div className={styles.grid}>
            {shown.map((p) => (
              <div key={p.id} className={styles.card}>
                <div className={styles.thumb}>
                  <img src={p.imageUrl} alt={p.title} className={styles.thumbImg} />
                  {!p.published && <div className={styles.draftBadge}>Brouillon</div>}
                </div>
                <div className={styles.cardTitleRow}>
                  <div className={styles.cardTitle}>{p.title}</div>
                  <div className={styles.cardYear}>{p.year}</div>
                </div>
                <div className={styles.cardCat}>{p.category}</div>

                {confirmId === p.id ? (
                  <div className={styles.confirmRow}>
                    <div className={styles.confirmLabel}>Supprimer&nbsp;?</div>
                    <button className={styles.confirmYes} onClick={() => handleDelete(p)}>
                      Oui
                    </button>
                    <button className={styles.confirmNo} onClick={() => setConfirmId(null)}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className={styles.actionsRow}>
                    <button className={styles.actionEdit} onClick={() => onEdit(p)}>
                      Modifier
                    </button>
                    <button className={styles.actionToggle} onClick={() => onTogglePublish(p)}>
                      {p.published ? 'Masquer' : 'Publier'}
                    </button>
                    <button
                      className={styles.actionDelete}
                      onClick={() => setConfirmId(p.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.rowHead}`}>
              <div>Ordre</div>
              <div>Visuel</div>
              <div>Titre</div>
              <div>Catégorie</div>
              <div>Année</div>
              <div>Statut</div>
              <div></div>
            </div>
            {shown.map((p) => (
              <div key={p.id} className={styles.row}>
                <div className={styles.orderCol}>
                  <button className={styles.orderBtn} onClick={() => onMove(p.id, -1)}>
                    ▲
                  </button>
                  <button className={styles.orderBtn} onClick={() => onMove(p.id, 1)}>
                    ▼
                  </button>
                </div>
                <div className={styles.listThumb}>
                  <img src={p.imageUrl} alt={p.title} className={styles.listThumbImg} />
                </div>
                <div className={styles.listTitleCol}>
                  <div className={styles.listTitle}>{p.title}</div>
                  <div className={styles.listDesc}>{p.description}</div>
                </div>
                <div className={styles.listCat}>{p.category}</div>
                <div className={styles.listYear}>{p.year}</div>
                <div>
                  {p.published ? (
                    <div className={styles.statusPub}>
                      <span className={styles.dotPub} />
                      Publié
                    </div>
                  ) : (
                    <div className={styles.statusDraft}>
                      <span className={styles.dotDraft} />
                      Brouillon
                    </div>
                  )}
                </div>
                <div>
                  {confirmId === p.id ? (
                    <div className={styles.confirmRowList}>
                      <div className={styles.confirmLabel}>Supprimer&nbsp;?</div>
                      <button className={styles.confirmYes} onClick={() => handleDelete(p)}>
                        Oui
                      </button>
                      <button className={styles.confirmNo} onClick={() => setConfirmId(null)}>
                        Non
                      </button>
                    </div>
                  ) : (
                    <div className={styles.actionsRowList}>
                      <button className={styles.actionToggle} onClick={() => onTogglePublish(p)}>
                        {p.published ? 'Masquer' : 'Publier'}
                      </button>
                      <button className={styles.actionEdit} onClick={() => onEdit(p)}>
                        Modifier
                      </button>
                      <button
                        className={styles.actionDelete}
                        onClick={() => setConfirmId(p.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}

          <div className={styles.mobileList}>
            {shown.map((p) => (
              <div key={p.id} className={styles.mobileCard}>
                <div className={styles.mobileThumb}>
                  <img src={p.imageUrl} alt={p.title} className={styles.mobileThumbImg} />
                </div>
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardTop}>
                    <div className={styles.mobileCardTitle}>{p.title}</div>
                    <div className={styles.cardYear}>{p.year}</div>
                  </div>
                  <div className={styles.mobileCardMeta}>
                    <span className={styles.cardCat}>{p.category}</span>
                    <span className={styles.mobileCardDivider} />
                    {p.published ? (
                      <span className={styles.statusPub}>
                        <span className={styles.dotPub} />
                        Publié
                      </span>
                    ) : (
                      <span className={styles.statusDraft}>
                        <span className={styles.dotDraft} />
                        Brouillon
                      </span>
                    )}
                  </div>

                  {reorder ? (
                    <div className={styles.mobileReorderRow}>
                      <button className={styles.mobileReorderBtn} onClick={() => onMove(p.id, -1)}>
                        ▲ Monter
                      </button>
                      <button className={styles.mobileReorderBtn} onClick={() => onMove(p.id, 1)}>
                        ▼ Descendre
                      </button>
                    </div>
                  ) : (
                    <div className={styles.mobileActionsRow}>
                      <button className={styles.mobileActionEdit} onClick={() => onEdit(p)}>
                        Modifier
                      </button>
                      <button className={styles.mobileActionToggle} onClick={() => onTogglePublish(p)}>
                        {p.published ? 'Masquer' : 'Publier'}
                      </button>
                      <button className={styles.mobileActionDelete} onClick={() => onDelete(p)}>
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </section>
    </div>
  )
}
