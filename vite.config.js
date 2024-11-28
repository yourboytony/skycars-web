import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['gsap', 'three', 'particles.js', '@vueuse/motion']
  },
  build: {
    rollupOptions: {
      external: [
        'three/examples/jsm/postprocessing/EffectComposer',
        'three/examples/jsm/postprocessing/RenderPass',
        'three/examples/jsm/postprocessing/UnrealBloomPass'
      ]
    }
  }
}) 