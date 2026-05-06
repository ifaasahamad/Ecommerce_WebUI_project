<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { useDarkMode } from '../composables/useDarkMode'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()
const { isDark, toggle } = useDarkMode()
const { filters, setFilter } = useProducts()

const mobileMenuOpen = ref(false)
const searchQuery = ref(filters.value.search)

function handleSearch(e: Event): void {
  e.preventDefault()
  setFilter('search', searchQuery.value)
  if (route.name !== 'products') {
    router.push('/products')
  }
}

function closeMobile(): void {
  mobileMenuOpen.value = false
}

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/80"
  >
    <nav class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <!-- Logo -->
      <router-link to="/" class="flex shrink-0 items-center gap-2" id="nav-logo">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg"
        >
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span class="text-lg font-bold text-gray-900 dark:text-white">ShopVue</span>
      </router-link>

      <!-- Desktop Nav Links -->
      <div class="hidden items-center gap-1 sm:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :id="`nav-link-${link.name.toLowerCase()}`"
          class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          active-class="bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400"
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Search Bar -->
      <form @submit="handleSearch" class="hidden flex-1 sm:flex">
        <div class="relative w-full max-w-md">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            id="nav-search"
            type="search"
            placeholder="Search products…"
            class="input pl-10 pr-4"
          />
        </div>
      </form>

      <!-- Right Actions -->
      <div class="ml-auto flex items-center gap-2">
        <!-- Dark Mode Toggle -->
        <button
          id="btn-dark-toggle"
          @click="toggle"
          class="btn-ghost rounded-xl p-2"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Cart -->
        <router-link
          to="/cart"
          id="nav-cart"
          class="btn-ghost relative rounded-xl p-2"
          aria-label="Shopping cart"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <transition name="bounce">
            <span
              v-if="cart.totalItems > 0"
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white"
            >
              {{ cart.totalItems > 99 ? '99+' : cart.totalItems }}
            </span>
          </transition>
        </router-link>

        <!-- Auth -->
        <template v-if="auth.isAuthenticated">
          <div class="hidden items-center gap-2 sm:flex">
            <img
              :src="auth.user?.image"
              :alt="auth.fullName"
              class="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500"
            />
            <button
              id="btn-logout"
              @click="auth.logout"
              class="btn-secondary px-3 py-1.5 text-xs"
            >
              Logout
            </button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" id="nav-login" class="btn-primary hidden sm:inline-flex">
            Login
          </router-link>
        </template>

        <!-- Mobile Menu Toggle -->
        <button
          id="btn-mobile-menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="btn-ghost rounded-xl p-2 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="border-t border-gray-100 bg-white px-4 pb-4 pt-2 dark:border-gray-800 dark:bg-gray-950 sm:hidden"
      >
        <!-- Mobile Search -->
        <form @submit="handleSearch" class="mb-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search products…"
              class="input pl-10"
            />
          </div>
        </form>

        <!-- Mobile Nav Links -->
        <div class="flex flex-col gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="closeMobile"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            active-class="bg-primary-50 text-primary-700"
          >
            {{ link.name }}
          </router-link>
          <template v-if="auth.isAuthenticated">
            <button @click="auth.logout(); closeMobile()" class="btn-secondary mt-1 w-full">
              Logout ({{ auth.user?.firstName }})
            </button>
          </template>
          <template v-else>
            <router-link to="/login" @click="closeMobile" class="btn-primary mt-1 w-full justify-center">
              Login
            </router-link>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}
@keyframes bounce-in {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
