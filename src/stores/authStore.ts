import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginResponse } from '../types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<LoginResponse | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)
    const fullName = computed(() =>
      user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    )

    async function login(username: string, password: string): Promise<boolean> {
      isLoading.value = true
      error.value = null
      try {
        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, expiresInMins: 60 }),
        })

        if (!response.ok) {
          const data = await response.json() as { message: string }
          throw new Error(data.message || 'Invalid credentials')
        }

        const data = await response.json() as LoginResponse
        user.value = data
        token.value = data.token
        localStorage.setItem('auth_token', data.token)
        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Login failed'
        return false
      } finally {
        isLoading.value = false
      }
    }

    function logout(): void {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
    }

    function clearError(): void {
      error.value = null
    }

    return {
      user,
      token,
      isLoading,
      error,
      isAuthenticated,
      fullName,
      login,
      logout,
      clearError,
    }
  },
  {
    persist: {
      key: 'shopvue-auth',
      storage: localStorage,
      pick: ['user', 'token'],
    },
  }
)
