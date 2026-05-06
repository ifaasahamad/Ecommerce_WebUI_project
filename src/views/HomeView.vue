<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const { fetchAllProducts, fetchCategories, allProducts, state, categories, setFilter } = useProducts()
const cart = useCartStore()

onMounted(async () => {
  await Promise.all([fetchAllProducts(), fetchCategories()])
})

const featuredProducts = computed(() =>
  allProducts.value
    .filter((p) => p.rating >= 4.5)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
)

const heroBanners = [
  {
    title: 'Summer Collection',
    subtitle: 'Discover top-rated products at unbeatable prices',
    gradient: 'from-primary-600 to-accent-500',
    emoji: '🛍️',
  },
  {
    title: 'Flash Deals',
    subtitle: 'Limited time offers — up to 40% off',
    gradient: 'from-purple-600 to-primary-500',
    emoji: '⚡',
  },
]

const currentBanner = ref(0)

setInterval(() => {
  currentBanner.value = (currentBanner.value + 1) % heroBanners.length
}, 5000)

function navigateToCategory(cat: string): void {
  setFilter('category', cat)
  router.push('/products')
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      :class="`bg-gradient-to-br ${heroBanners[currentBanner].gradient}`"
      id="hero-section"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl text-center">
        <transition name="fade-up" mode="out-in">
          <div :key="currentBanner">
            <div class="mb-4 text-6xl">{{ heroBanners[currentBanner].emoji }}</div>
            <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {{ heroBanners[currentBanner].title }}
            </h1>
            <p class="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {{ heroBanners[currentBanner].subtitle }}
            </p>
          </div>
        </transition>

        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <router-link
            to="/products"
            id="hero-shop-now"
            class="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Shop Now
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link
            to="/login"
            id="hero-login"
            class="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Sign In
          </router-link>
        </div>

        <!-- Banner dots -->
        <div class="mt-8 flex justify-center gap-2">
          <button
            v-for="(_, i) in heroBanners"
            :key="i"
            @click="currentBanner = i"
            :id="`hero-dot-${i}`"
            class="h-2 rounded-full transition-all"
            :class="currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/40'"
          />
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-0 divide-x divide-gray-100 dark:divide-gray-800 sm:grid-cols-4">
        <div v-for="stat in [
          { icon: '📦', label: 'Products', value: `${allProducts.length}+` },
          { icon: '🏷️', label: 'Categories', value: `${categories.length}+` },
          { icon: '⭐', label: 'Avg Rating', value: '4.3/5' },
          { icon: '🚀', label: 'In your Cart', value: cart.totalItems },
        ]" :key="stat.label" class="flex flex-col items-center gap-1 py-6 text-center">
          <span class="text-2xl">{{ stat.icon }}</span>
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.value }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Category Quick Access -->
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="categories-section">
      <h2 class="section-title mb-6">Shop by Category</h2>

      <div v-if="state.loading" class="flex justify-center py-8">
        <LoadingSpinner message="Loading categories…" />
      </div>

      <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <button
          v-for="cat in categories.slice(0, 12)"
          :key="cat"
          :id="`home-category-${cat}`"
          @click="navigateToCategory(cat)"
          class="group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100 transition-all
            hover:-translate-y-1 hover:shadow-md hover:ring-primary-200 dark:bg-gray-900 dark:ring-gray-800 dark:hover:ring-primary-800"
        >
          <span class="text-3xl">🛒</span>
          <span class="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
            {{ cat.replace(/-/g, ' ') }}
          </span>
        </button>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" id="featured-section">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="section-title">⭐ Top Rated Products</h2>
        <router-link to="/products" class="btn-ghost text-sm text-primary-600 dark:text-primary-400">
          View all →
        </router-link>
      </div>

      <div v-if="state.loading">
        <LoadingSpinner size="lg" message="Loading products…" />
      </div>
      <div v-else-if="state.error" class="rounded-2xl bg-red-50 p-8 text-center text-red-600 dark:bg-red-950">
        {{ state.error }}
      </div>
      <div
        v-else
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
