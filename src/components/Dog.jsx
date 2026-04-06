import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Dog = () => {
  gsap.registerPlugin(useGSAP)
  gsap.registerPlugin(ScrollTrigger)

  const model = useGLTF('/models/dog.drc.glb')

  useThree(({ camera, gl }) => {
    camera.position.z = 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const { actions } = useAnimations(model.animations, model.scene)

  useEffect(() => {
    if (actions['Take 001']) actions['Take 001'].play()
  }, [actions])

  const [normalMap] = useTexture(['/dog_normals.jpg']).map((t) => {
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const [branchMap, branchNormalMap] = useTexture([
    '/branches_diffuse.jpeg',
    '/branches_normals.jpeg',
  ]).map((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const matcapPaths = Array.from({ length: 20 }, (_, i) => `/matcap/mat-${i + 1}.png`)
  const matcaps = useTexture(matcapPaths).map((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const material = useRef({
    uMatcap1: { value: matcaps[18] }, // mat-19
    uMatcap2: { value: matcaps[1] },  // mat-2
    uProgress: { value: 1.0 },
  })

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap,
    matcap: matcaps[1],
  })

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap,
  })

  function onBeforeCompile(shader) {
    shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
    shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
    shader.uniforms.uProgress = material.current.uProgress

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `
      uniform sampler2D uMatcapTexture1;
      uniform sampler2D uMatcapTexture2;
      uniform float uProgress;
      void main() {
      `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 matcapColor = texture2D( matcap, uv );',
      `
      vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
      vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
      float transitionFactor = 0.2;
      float progress = smoothstep(uProgress - transitionFactor, uProgress, (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5);
      vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
      `
    )
  }

  dogMaterial.onBeforeCompile = onBeforeCompile

  model.scene.traverse((child) => {
    if (child.name.includes('DOG')) {
      child.material = dogMaterial
    } else {
      child.material = branchMaterial
    }
  })

  const dogModel = useRef(model)

  useGSAP(() => {
    // Scroll-driven model animation — hero through about section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        endTrigger: '#about',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    tl.to(dogModel.current.scene.position, { z: '-=0.75', y: '+=0.1' })
      .to(dogModel.current.scene.rotation, { x: `+=${Math.PI / 15}` })
      .to(dogModel.current.scene.rotation, { y: `-=${Math.PI}` }, 'third')
      .to(dogModel.current.scene.position, { x: '-=0.5', z: '+=0.6', y: '-=0.05' }, 'third')

    // Smoothly fade out canvas as user scrolls into projects section
    gsap.to('#canvas-elem', {
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 65%',
        end: 'top 10%',
        scrub: true,
      },
      opacity: 0,
      ease: 'power2.inOut',
    })

    // Fade canvas back in when scrolling back up through about
    gsap.to('#canvas-elem', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 50%',
        end: 'top 10%',
        scrub: true,
      },
      opacity: 1,
      ease: 'power2.inOut',
    })
  }, [])

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.9, 0]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
    </>
  )
}

export default Dog