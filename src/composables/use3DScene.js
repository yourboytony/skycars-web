import * as THREE from 'three'
import { ref, onMounted, onUnmounted } from 'vue'

export function use3DScene() {
  const container = ref(null)
  let scene, camera, renderer, model
  let animationFrameId = null

  const init = (containerEl) => {
    // Scene setup
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      75,
      containerEl.clientWidth / containerEl.clientHeight,
      0.1,
      1000
    )
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerEl.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00ff9d, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Add a simple plane for testing
    const geometry = new THREE.PlaneGeometry(5, 5)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff9d,
      side: THREE.DoubleSide
    })
    model = new THREE.Mesh(geometry, material)
    scene.add(model)

    camera.position.z = 5

    // Handle resize
    window.addEventListener('resize', onResize)
  }

  const onResize = () => {
    if (container.value && camera && renderer) {
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    if (model) {
      model.rotation.x += 0.01
      model.rotation.y += 0.01
    }

    renderer?.render(scene, camera)
  }

  const cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    window.removeEventListener('resize', onResize)
    scene?.clear()
    renderer?.dispose()
  }

  return {
    container,
    init,
    cleanup
  }
} 