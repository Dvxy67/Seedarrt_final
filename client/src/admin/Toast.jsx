import styles from './Toast.module.css'

export default function Toast({ toast, onUndo }) {
  if (!toast) return null

  return (
    <div className={styles.toast}>
      <div className={styles.msg}>{toast.msg}</div>
      {toast.undo && (
        <button className={styles.undo} onClick={onUndo}>
          Annuler
        </button>
      )}
    </div>
  )
}
