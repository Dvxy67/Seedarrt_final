import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshDistortMaterial, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function Sculpture() {
  const meshRef = useRef()
  const wireRef = useRef()

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.12) * 0.15 + pointer.y * 0.08
    meshRef.current.rotation.y = clock.elapsedTime * 0.07 + pointer.x * 0.15
    if (wireRef.current) {
      wireRef.current.rotation.x = meshRef.current.rotation.x
      wireRef.current.rotation.y = meshRef.current.rotation.y
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      {/* Solid inner mesh */}
      <mesh ref={meshRef} position={[2.8, 0, 0]} scale={2.0}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#181818"
          roughness={0.05}
          metalness={0.95}
          distort={0.2}
          speed={1.2}
          envMapIntensity={2}
        />
      </mesh>

      {/* Wireframe overlay — low-poly silhouette */}
      <mesh ref={wireRef} position={[2.8, 0, 0]} scale={2.06}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={new THREE.Color('#b8975a').multiplyScalar(0.4)}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  )
}

export default function ArtScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.08} />
      <directionalLight position={[6, 6, 4]} intensity={0.6} color="#f5f0ea" />
      <pointLight position={[-6, -4, -4]} intensity={0.4} color="#b8975a" />

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
