<script setup lang="ts">
import { computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import type { ProductFilters } from '../types'

const { filters, categories, setFilter, resetFilters, filteredProducts } = useProducts()

const sortOptions: { label: string; value: ProductFilters['sortBy'] }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
]

function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const hasActiveFilters = computed(
  () =>
    filters.value.category !== '' ||
    filters.value.sortBy !== 'default' ||
    filters.value.minPrice !== 0 ||
    filters.value.maxPrice !== 10000
)
</script>

<template>
  <div class="flex flex-col gap-4" id="filter-bar">
    <!-- Top Row: Sort + Result Count -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Showing <span class="font-semibold text-gray-900 dark:text-white">{{ filteredProducts.length }}</span> products
      </p>

      <div class="flex items-center gap-3">
        <!-- Sort -->
        <select
          id="filter-sort"
          :value="filters.sortBy"
          @change="setFilter('sortBy', ($event.target as HTMLSelectElement).value as ProductFilters['sortBy'])"
          class="input w-auto cursor-pointer pr-8"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <!-- Reset -->
        <button
          v-if="hasActiveFilters"
          id="btn-reset-filters"
          @click="resetFilters"
          class="btn-ghost text-xs text-accent-500 hover:text-accent-600"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div class="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Price range:</span>
      <div class="flex items-center gap-2">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
          <input
            id="filter-min-price"
            type="number"
            :value="filters.minPrice"
            @change="setFilter('minPrice', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="10000"
            placeholder="0"
            class="input w-24 pl-6"
          />
        </div>
        <span class="text-gray-400">—</span>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
          <input
            id="filter-max-price"
            type="number"
            :value="filters.maxPrice"
            @change="setFilter('maxPrice', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="10000"
            placeholder="10000"
            class="input w-24 pl-6"
          />
        </div>
      </div>
    </div>

    <!-- Category Pills -->
    <div class="flex flex-wrap gap-2" id="category-pills">
      <button
        id="category-pill-all"
        @click="setFilter('category', '')"
        class="badge cursor-pointer px-3 py-1.5 text-sm font-medium transition-all"
        :class="
          filters.category === ''
            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        "
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        :id="`category-pill-${cat}`"
        @click="setFilter('category', cat)"
        class="badge cursor-pointer px-3 py-1.5 text-sm font-medium transition-all"
        :class="
          filters.category === cat
            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        "
      >
        {{ formatCategory(cat) }}
      </button>
    </div>
  </div>
</template>
