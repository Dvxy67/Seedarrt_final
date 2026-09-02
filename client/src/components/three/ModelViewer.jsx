import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center, Bounds } from '@react-three/drei'

function Model({ src }) {
  const { scene } = useGLTF(src)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

// Visualiseur volontairement sobre : pas de post-processing (bloom, flou…),
// pas d'environnement HDRI à charger — pour rester léger sur mobile.
//
// interactive=false : rendu une seule image fixe (frameloop "demand"), sans
// contrôles — utilisé comme vignette dans la grille du portfolio.
// interactive=true : rendu continu avec rotation à la souris/au doigt —
// utilisé dans la lightbox, au clic.
export default function ModelViewer({ src, interactive = true }) {
  return (
    <Canvas
      camera={{ fov: 40 }}
      dpr={[1, 1.5]}
      frameloop={interactive ? 'always' : 'demand'}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-3, -2, -4]} intensity={0.35} />
      <Suspense fallback={null}>
        {/* Bounds cadre et recule la caméra automatiquement selon la taille
            réelle du modèle, avec une marge — pas de distance fixée à l'oeil,
            donc pas besoin de la retoucher pièce par pièce. */}
        <Bounds fit clip observe margin={interactive ? 1.25 : 1.6}>
          <Model src={src} />
        </Bounds>
      </Suspense>
      {interactive && (
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} makeDefault />
      )}
    </Canvas>
  )
}
