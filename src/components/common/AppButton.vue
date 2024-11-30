<template>
  <button :class="['app-button', variant]" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>

<style scoped>
.app-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: background-color 0.3s;
}

.app-button.primary {
  background-color: var(--primary-color);
  color: white;
}

.app-button.secondary {
  background-color: var(--secondary-color);
  color: white;
}
</style> 