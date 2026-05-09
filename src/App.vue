<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import ToastNotification from './components/ToastNotification.vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

function removeToast(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
    <NavBar />

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Footer -->
    <footer class="mt-16 border-t border-gray-100 bg-white px-4 py-10 dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="font-bold text-gray-900 dark:text-white">ShopVue</span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Built by IFS · 
        </p>
        <p class="text-xs text-gray-400">© 2026 ShopVue — Mini Project Submission</p>
      </div>
    </footer>

    <!-- Toast Container -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" id="toast-container">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        @dismiss="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
