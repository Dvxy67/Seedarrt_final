import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function Sculpture() {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/Project%205.glb')
  const mouse = useRef({ x: 0, y: 0 })
  const rot = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const targetX = -mouse.current.y * 0.55
    const targetY = mouse.current.x * 0.75

    // spring physics : attraction vers la cible + amortissement
    vel.current.x += (targetX - rot.current.x) * 0.1
    vel.current.y += (targetY - rot.current.y) * 0.1
    vel.current.x *= 0.78
    vel.current.y *= 0.78
    rot.current.x += vel.current.x
    rot.current.y += vel.current.y

    groupRef.current.rotation.x = rot.current.x
    groupRef.current.rotation.y = rot.current.y
    groupRef.current.position.y = -0.5 + Math.sin(clock.elapsedTime * 1.2) * 0.12
  })

  return (
    <primitive ref={groupRef} object={scene} scale={0.48} position={[4.0, -0.5, 0]} />
  )
}

useGLTF.preload('/models/Project%205.glb')

export default function ArtScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 6, 4]} intensity={1.2} color="#f5f0ea" />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#b8975a" />

      <Environment preset="night" />
      <Sculpture />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          intensity={0.35}
          mipmapBlur
        />
      </EffectComposer>

      <Preload all />
    </Canvas>
  )
}
