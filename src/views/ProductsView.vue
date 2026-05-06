<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import FilterBar from '../components/FilterBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { fetchAllProducts, fetchCategories, filteredProducts, state } = useProducts()

onMounted(async () => {
  await Promise.all([fetchAllProducts(), fetchCategories()])
})

// Pagination
const PAGE_SIZE = 20
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / PAGE_SIZE))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page: number): void {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="section-title">All Products</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Browse our full catalogue and find exactly what you need
      </p>
    </div>

    <!-- Filter Bar -->
    <div class="mb-8">
      <FilterBar />
    </div>

    <!-- Loading -->
    <div v-if="state.loading">
      <LoadingSpinner size="lg" message="Loading products…" />
    </div>

    <!-- Error -->
    <div
      v-else-if="state.error"
      class="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-12 text-center dark:bg-red-950"
    >
      <span class="text-5xl">⚠️</span>
      <p class="text-red-600 dark:text-red-400">{{ state.error }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredProducts.length === 0"
      class="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 py-16 text-center dark:bg-gray-900"
      id="empty-state"
    >
      <span class="text-6xl">🔍</span>
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">No products found</h2>
      <p class="text-sm text-gray-500">Try adjusting your filters or search term</p>
    </div>

    <!-- Product Grid -->
    <div v-else>
      <div
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        id="products-grid"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-10 flex items-center justify-center gap-2"
        id="pagination"
      >
        <button
          id="btn-prev-page"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn-secondary px-3 py-2 disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          v-if="currentPage > 3"
          @click="goToPage(1)"
          class="btn-ghost px-3 py-2"
        >1</button>
        <span v-if="currentPage > 4" class="text-gray-400">…</span>

        <button
          v-for="page in pageNumbers"
          :key="page"
          :id="`btn-page-${page}`"
          @click="goToPage(page)"
          class="rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
          :class="
            page === currentPage
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          "
        >
          {{ page }}
        </button>

        <span v-if="currentPage < totalPages - 3" class="text-gray-400">…</span>
        <button
          v-if="currentPage < totalPages - 2"
          @click="goToPage(totalPages)"
          class="btn-ghost px-3 py-2"
        >{{ totalPages }}</button>

        <button
          id="btn-next-page"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn-secondary px-3 py-2 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  </main>
</template>
