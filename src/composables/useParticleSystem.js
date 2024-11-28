export function useParticleSystem() {
  function createAdvancedParticles(containerId) {
    particlesJS(containerId, {
      particles: {
        number: {
          value: 100,
          density: { enable: true, value_area: 800 }
        },
        color: { value: ['#00ff9d', '#0066ff', '#ff00ff'] },
        shape: {
          type: ['circle', 'triangle'],
          stroke: { width: 0, color: '#000000' },
          polygon: { nb_sides: 5 }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#00ff9d',
          opacity: 0.4,
          width: 1,
          shadow: { enable: true, blur: 5, color: '#00ff9d' }
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: ['repulse', 'grab'] },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.8 } },
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    })
  }

  return {
    createAdvancedParticles
  }
} 