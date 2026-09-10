import { useState, useEffect } from 'react'

// Sait si un élément est visible (ou proche de l'être) à l'écran, pour mettre
// en pause les scènes 3D (WebGL + postprocessing) tournant en continu hors
// champ — sinon leur rendu ne s'arrête jamais tant que le composant est monté.
export function useInView(ref, { rootMargin = '200px' } = {}) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
