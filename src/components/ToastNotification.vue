<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('dismiss'), 300)
  }, props.duration ?? 3000)
})
</script>

<template>
  <transition name="toast">
    <div
      v-if="visible"
      class="flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl"
      :class="{
        'bg-green-600 text-white': type === 'success' || !type,
        'bg-red-600 text-white': type === 'error',
        'bg-primary-600 text-white': type === 'info',
      }"
    >
      <svg v-if="type === 'error'" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="text-sm font-medium">{{ message }}</span>
      <button @click="visible = false" class="ml-auto rounded-lg p-0.5 transition-colors hover:bg-white/20">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
