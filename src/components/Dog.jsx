import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Dog = () => {
  gsap.registerPlugin(useGSAP)
  gsap.registerPlugin(ScrollTrigger)

  const model = useGLTF('/models/dog.drc.glb')
  const groupRef = useRef()      // outer group: mouse parallax + idle float
  const dogModel = useRef(model) // inner scene: GSAP scroll scale

  // Normalised mouse [-1, 1]
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // useFrame: mouse tracking + idle bobbing (on outer group)
  useFrame((state) => {
    if (!groupRef.current) return
    // Smooth mouse follow
    const tX = mouseRef.current.y * -0.06
    const tY = mouseRef.current.x * 0.11
    groupRef.current.rotation.x += (tX - groupRef.current.rotation.x) * 0.04
    groupRef.current.rotation.y += (tY - groupRef.current.rotation.y) * 0.04
    // Idle float — gentle sin-wave Y offset
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.022
  })

  // Transparent WebGL background
  useThree(({ camera, gl }) => {
    camera.position.z = 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.setClearColor(0x000000, 0)
  })

  const { actions } = useAnimations(model.animations, model.scene)
  useEffect(() => {
    if (actions['Take 001']) actions['Take 001'].play()
  }, [actions])

  // Textures
  const [normalMap] = useTexture(['/dog_normals.jpg']).map((t) => {
    t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; return t
  })
  const [branchMap, branchNormalMap] = useTexture([
    '/branches_diffuse.jpeg', '/branches_normals.jpeg',
  ]).map((t) => { t.colorSpace = THREE.SRGBColorSpace; return t })

  const matcapPaths = Array.from({ length: 20 }, (_, i) => `/matcap/mat-${i + 1}.png`)
  const matcaps = useTexture(matcapPaths).map((t) => {
    t.colorSpace = THREE.SRGBColorSpace; return t
  })

  // Matcap blend shader
  const material = useRef({
    uMatcap1: { value: matcaps[18] },
    uMatcap2: { value: matcaps[1] },
    uProgress: { value: 1.0 },
  })
  const dogMaterial = new THREE.MeshMatcapMaterial({ normalMap, matcap: matcaps[1] })
  const branchMaterial = new THREE.MeshMatcapMaterial({ normalMap: branchNormalMap, map: branchMap })

  function onBeforeCompile(shader) {
    shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
    shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
    shader.uniforms.uProgress = material.current.uProgress
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `uniform sampler2D uMatcapTexture1;
      uniform sampler2D uMatcapTexture2;
      uniform float uProgress;
      void main() {`
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 matcapColor = texture2D( matcap, uv );',
      `vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
      vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
      float progress = smoothstep(uProgress - 0.2, uProgress, (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5);
      vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);`
    )
  }
  dogMaterial.onBeforeCompile = onBeforeCompile

  model.scene.traverse((child) => {
    child.material = child.name.includes('DOG') ? dogMaterial : branchMaterial
  })

  // ─── GSAP SCROLL ───────────────────────────────────────────────────────────
  useGSAP(() => {
    dogModel.current.scene.scale.set(0.9, 0.9, 0.9)

    // Smooth scale-down: 0.9 → 0.8 (hero to skills)
    gsap.to(dogModel.current.scene.scale, {
      x: 0.8, y: 0.8, z: 0.8,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#hero',
        endTrigger: '#skills',
        start: 'top top',
        end: 'top top',
        scrub: 1.5,
      },
    })

    // Dim canvas when deep in content
    gsap.to('#canvas-elem', {
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 50%',
        end: 'top 5%',
        scrub: true,
      },
      opacity: 0.22,
    })
    gsap.to('#canvas-elem', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
      },
      opacity: 1,
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* position/rotation set here as initial pose; GSAP animates scale on scene */}
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.9, 0]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
    </group>
  )
}

export default Dog