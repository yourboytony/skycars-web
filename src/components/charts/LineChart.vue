<template>
  <div class="chart-wrapper" ref="chartContainer">
    <canvas ref="canvas"></canvas>
    <div v-if="loading" class="chart-loading">
      <div class="spinner"></div>
      <span>Loading data...</span>
    </div>
    <div v-if="error" class="chart-error">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="retryLoad" class="btn-retry">
        <i class="fas fa-sync"></i>
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  data: any
  options?: ChartOptions
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'chartClick', value: any): void
  (e: 'retryLoad'): void
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const chartContainer = ref<HTMLElement | null>(null)
const chart = ref<Chart | null>(null)
const { theme, isDark } = useTheme()

// Chart configuration with theme-aware defaults
const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        color: isDark.value ? '#e2e8f0' : '#475569'
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
      titleColor: isDark.value ? '#e2e8f0' : '#0f172a',
      bodyColor: isDark.value ? '#cbd5e1' : '#475569',
      borderColor: isDark.value ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      boxPadding: 4
    }
  },
  scales: {
    x: {
      grid: {
        color: isDark.value ? '#334155' : '#e2e8f0',
        drawBorder: false
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b'
      }
    },
    y: {
      grid: {
        color: isDark.value ? '#334155' : '#e2e8f0',
        drawBorder: false
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b'
      }
    }
  }
}

// Initialize chart
function initChart() {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const chartConfig: ChartConfiguration = {
    type: 'line',
    data: props.data,
    options: {
      ...defaultOptions,
      ...props.options
    }
  }

  chart.value = new Chart(ctx, chartConfig)

  // Add click handler
  canvas.value.onclick = (event) => {
    const points = chart.value?.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    )
    
    if (points?.length) {
      const firstPoint = points[0]
      emit('chartClick', {
        datasetIndex: firstPoint.datasetIndex,
        index: firstPoint.index,
        value: props.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]
      })
    }
  }
}

// Update chart when data changes
watch(
  () => props.data,
  (newData) => {
    if (chart.value) {
      chart.value.data = newData
      chart.value.update()
    }
  },
  { deep: true }
)

// Update chart when theme changes
watch(theme, () => {
  if (chart.value) {
    chart.value.destroy()
    initChart()
  }
})

// Handle retry
function retryLoad() {
  emit('retryLoad')
}

// Lifecycle hooks
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
  }
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-loading,
.chart-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.chart-error {
  color: var(--error);
  text-align: center;
  
  i {
    font-size: 2rem;
  }
  
  span {
    color: var(--text-secondary);
  }
}

.btn-retry {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-primary);
    border-color: var(--primary);
    color: var(--primary);
  }
  
  i {
    margin-right: 0.5rem;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 