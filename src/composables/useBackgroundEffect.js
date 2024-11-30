import * as THREE from 'three'

export function useBackgroundEffect(container) {
  let scene, camera, renderer, earth, aircrafts = []
  let animationPhase = 'appearing'
  const textureLoader = new THREE.TextureLoader()

  const init = async () => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z = 200

    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Create stylized Earth
    const earthGeometry = new THREE.SphereGeometry(80, 64, 64)
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    })
    earth = new THREE.Mesh(earthGeometry, earthMaterial)
    
    // Add subtle glow to Earth
    const glowGeometry = new THREE.SphereGeometry(81, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF2E63,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    
    scene.add(earth)
    scene.add(glow)

    // Define SKYCARS points in front of camera
    const letterPoints = generateSkycarPoints()
    createAircraftFleet(letterPoints)

    animate()
    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onWindowResize)
  }

  const generateSkycarPoints = () => {
    // Position "SKYCARS" in clear view
    const points = []
    const word = 'SKYCARS'
    const letterSpacing = 20
    const startX = -(word.length * letterSpacing) / 2
    
    word.split('').forEach((letter, i) => {
      const x = startX + (i * letterSpacing)
      switch(letter) {
        case 'S':
          points.push(...generateLetterS(x, 0))
          break
        case 'K':
          points.push(...generateLetterK(x, 0))
          break
        // ... similar for other letters
      }
    })
    
    return points
  }

  const generateLetterS = (x, y) => {
    return [
      new THREE.Vector3(x - 5, y + 10, 50),
      new THREE.Vector3(x + 5, y + 10, 50),
      new THREE.Vector3(x + 5, y, 50),
      new THREE.Vector3(x - 5, y, 50),
      new THREE.Vector3(x - 5, y - 10, 50)
    ]
  }

  // Similar functions for other letters...

  const createAircraft = () => {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 2,    // nose
      -1, 0, -1,  // left wing
      1, 0, -1    // right wing
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0
    })
    
    return new THREE.Mesh(geometry, material)
  }

  const createTrail = () => {
    return new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0xFF2E63,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
    )
  }

  // Slow down the animation
  const FADE_SPEED = 0.003
  const MOVEMENT_SPEED = 0.005
  const HOLD_DURATION = 5000 // 5 seconds

  const animate = () => {
    requestAnimationFrame(animate)

    earth.rotation.y += 0.0005 // Slower rotation

    aircrafts.forEach(aircraft => {
      switch(animationPhase) {
        case 'appearing':
          aircraft.opacity = Math.min(1, aircraft.opacity + FADE_SPEED)
          break
        case 'forming':
          aircraft.currentPoint.lerp(aircraft.targetPoint, MOVEMENT_SPEED)
          break
        case 'holding':
          // Keep position
          break
        case 'fading':
          aircraft.opacity = Math.max(0, aircraft.opacity - FADE_SPEED)
          break
      }

      // Update visuals
      aircraft.mesh.material.opacity = aircraft.opacity
      aircraft.trail.material.opacity = aircraft.opacity * 0.5
      
      aircraft.mesh.position.copy(aircraft.currentPoint)
      aircraft.mesh.lookAt(aircraft.targetPoint)
      updateTrail(aircraft)
    })

    // Phase transitions
    if (animationPhase === 'appearing' && checkPhaseComplete('appearing')) {
      animationPhase = 'forming'
    } else if (animationPhase === 'forming' && checkPhaseComplete('forming')) {
      animationPhase = 'holding'
      setTimeout(() => {
        animationPhase = 'fading'
      }, HOLD_DURATION)
    } else if (animationPhase === 'fading' && checkPhaseComplete('fading')) {
      resetAnimation()
    }

    renderer.render(scene, camera)
  }

  const checkPhaseComplete = (phase) => {
    return aircrafts.every(aircraft => 
      aircraft.phase === phase
    )
  }

  const resetAnimation = () => {
    animationPhase = 'appearing'
    aircrafts.forEach(aircraft => {
      aircraft.currentPoint.set(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        Math.random() * 200 - 100
      )
      aircraft.opacity = 0
    })
  }

  const onMouseMove = (event) => {
    const mouseX = (event.clientX - window.innerWidth / 2) * 0.05
    const mouseY = (event.clientY - window.innerHeight / 2) * 0.05

    // Smooth camera movement for parallax
    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (-mouseY - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    earth.rotation.y += mouseX * 0.001
    earth.rotation.x += mouseY * 0.001
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const cleanup = () => {
    document.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onWindowResize)
    if (container && renderer) {
      container.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }

  return {
    init,
    cleanup
  }
} 