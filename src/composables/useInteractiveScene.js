import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ref } from 'vue'

export function useInteractiveScene() {
  const sceneReady = ref(false)
  let composer, bloomPass

  function createEnhancedScene(canvas) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    
    // Post-processing setup
    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // intensity
      0.4, // radius
      0.85 // threshold
    )
    
    composer.addPass(renderPass)
    composer.addPass(bloomPass)
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    const pointLight = new THREE.PointLight(0x00ff9d, 2, 100)
    const pointLight2 = new THREE.PointLight(0x0066ff, 2, 100)
    
    pointLight.position.set(5, 5, 5)
    pointLight2.position.set(-5, -5, -5)
    
    scene.add(ambientLight, pointLight, pointLight2)
    
    return {
      scene,
      camera,
      renderer,
      composer
    }
  }

  return {
    createEnhancedScene,
    sceneReady
  }
} 