<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, type ChartConfiguration } from 'chart.js/auto'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  data: number[]
  labels: string[]
  label: string
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
const chart = ref<Chart | null>(null)
const { isDark } = useTheme()

const createChart = () => {
  if (!chartRef.value) return

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        backgroundColor: isDark.value ? '#3b82f6' : '#60a5fa',
        borderColor: isDark.value ? '#2563eb' : '#3b82f6',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDark.value ? '#334155' : '#e2e8f0',
            borderColor: isDark.value ? '#334155' : '#e2e8f0'
          }
        },
        x: {
          grid: {
            color: isDark.value ? '#334155' : '#e2e8f0',
            borderColor: isDark.value ? '#334155' : '#e2e8f0'
          }
        }
      }
    }
  }

  chart.value = new Chart(chartRef.value, config)
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  if (chart.value) {
    chart.value.data.datasets[0].data = props.data
    chart.value.update()
  }
})

watch(isDark, () => {
  if (chart.value) {
    chart.value.destroy()
    createChart()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>