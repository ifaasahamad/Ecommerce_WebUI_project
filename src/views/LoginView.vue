<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

// Demo credentials hint
const demoUser = { username: '', password: '' }

async function handleLogin(): Promise<void> {
  const ok = await auth.login(username.value, password.value)
  if (ok) {
    router.push('')
  }
}

function fillDemo(): void {
  username.value = demoUser.username
  password.value = demoUser.password
}

// Clear error when user types
watch([username, password], () => auth.clearError())
</script>

<template>
  <main
    class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
    id="login-view"
  >
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <!-- Header -->
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg"
          >
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in to your ShopVue account</p>
        </div>

        <!-- Demo Banner -->
        <div
          class="mb-6 flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3 dark:bg-primary-950"
        >
          <div>
            
            <p class="text-xs text-primary-600 dark:text-primary-400">
              {{ demoUser.username }} / {{ demoUser.password }}
            </p>
          </div>
          
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5" id="login-form">
          <!-- Username -->
          <div>
            <label for="input-username" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="input-username"
              v-model="username"
              type="text"
              placeholder="emilys"
              required
              autocomplete="username"
              class="input"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="input-password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div class="relative">
              <input
                id="input-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="input pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <div
              v-if="auth.error"
              class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
              id="login-error"
            >
              ⚠️ {{ auth.error }}
            </div>
          </transition>

          <!-- Submit -->
          <button
            id="btn-login-submit"
            type="submit"
            :disabled="auth.isLoading"
            class="btn-primary w-full justify-center py-3 text-base"
          >
            <span v-if="auth.isLoading" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Footer -->
        
      </div>
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
