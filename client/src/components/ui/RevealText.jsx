import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function RevealText({ children, delay = 0, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <span ref={ref} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.1em' }}>
      <motion.span
        style={{ display: 'block' }}
        className={className}
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
