<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12" id="loading-spinner">
    <div
      class="animate-spin rounded-full border-4 border-gray-200 border-t-primary-500"
      :class="{
        'h-8 w-8': size === 'sm',
        'h-12 w-12': !size || size === 'md',
        'h-16 w-16 border-[5px]': size === 'lg',
      }"
    />
    <p v-if="message" class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
  </div>
</template>
