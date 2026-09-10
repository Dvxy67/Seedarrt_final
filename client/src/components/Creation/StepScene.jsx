import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

function StepModel({ modelUrl, scale = 0.42, rotationY = 0, positionY = 0 }) {
  const { scene: source } = useGLTF(modelUrl)
  const scene = useMemo(() => SkeletonUtils.clone(source), [source])
  const groupRef = useRef()
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
    const targetX = -mouse.current.y * 0.4
    const targetY = mouse.current.x * 0.6
    vel.current.x += (targetX - rot.current.x) * 0.08
    vel.current.y += (targetY - rot.current.y) * 0.08
    vel.current.x *= 0.8
    vel.current.y *= 0.8
    rot.current.x += vel.current.x
    rot.current.y += vel.current.y
    groupRef.current.rotation.x = rot.current.x
    groupRef.current.rotation.y = rotationY + rot.current.y
    groupRef.current.position.y = positionY + Math.sin(clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <primitive ref={groupRef} object={scene} scale={scale} position={[0, 0, 0]} />
  )
}

export default function StepScene({ modelUrl, scale, rotationY, positionY, active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 6, 4]} intensity={1.2} color="#f5f0ea" />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#00674f" />
      <Environment preset="night" />
      <StepModel modelUrl={modelUrl} scale={scale} rotationY={rotationY} positionY={positionY} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.9} intensity={0.35} mipmapBlur />
      </EffectComposer>
      <Preload all />
    </Canvas>
  )
}
