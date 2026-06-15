import { useEffect, useRef } from 'react'

export default function GrainOverlay() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let timer

    // Canvas petit fixe — le CSS l'étire, ~20x moins de calcul qu'en pleine résolution
    canvas.width = 512
    canvas.height = 512

    const draw = () => {
      const imageData = ctx.createImageData(512, 512)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = 15
      }
      ctx.putImageData(imageData, 0, 0)
      timer = setTimeout(draw, 1000 / 15)
    }

    draw()
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  )
}
