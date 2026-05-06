<script setup lang="ts">
import type { Product } from '../types'
import { useCartStore } from '../stores/cartStore'
import { ref } from 'vue'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const added = ref(false)

function handleAddToCart(): void {
  cart.addToCart(props.product)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1500)
}

function discountedPrice(price: number, discount: number): string {
  return (price * (1 - discount / 100)).toFixed(2)
}

function starsArray(rating: number): ('full' | 'half' | 'empty')[] {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'full'
    if (i < rating) return 'half'
    return 'empty'
  })
}
</script>

<template>
  <article
    class="card group flex flex-col overflow-hidden"
    :id="`product-card-${product.id}`"
  >
    <!-- Image -->
    <div class="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
      <router-link :to="`/products/${product.id}`" class="block aspect-square">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </router-link>

      <!-- Discount badge -->
      <div
        v-if="product.discountPercentage > 5"
        class="badge absolute left-2 top-2 bg-accent-500 text-white shadow-md"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>

      <!-- Out of stock overlay -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <span class="badge bg-gray-900 px-3 py-1 text-sm text-white">Out of Stock</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col gap-2 p-4">
      <!-- Category -->
      <span class="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
        {{ product.category }}
      </span>

      <!-- Title -->
      <router-link
        :to="`/products/${product.id}`"
        class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
      >
        {{ product.title }}
      </router-link>

      <!-- Brand -->
      <p v-if="product.brand" class="text-xs text-gray-500 dark:text-gray-400">
        {{ product.brand }}
      </p>

      <!-- Rating -->
      <div class="flex items-center gap-1.5">
        <div class="flex">
          <svg
            v-for="(star, i) in starsArray(product.rating)"
            :key="i"
            class="h-3.5 w-3.5"
            :class="{
              'text-amber-400 fill-current': star === 'full',
              'text-amber-300 fill-current': star === 'half',
              'text-gray-200 fill-current dark:text-gray-700': star === 'empty',
            }"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <!-- Price -->
      <div class="mt-auto flex items-baseline gap-2 pt-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          ${{ discountedPrice(product.price, product.discountPercentage) }}
        </span>
        <span
          v-if="product.discountPercentage > 0"
          class="text-sm text-gray-400 line-through"
        >
          ${{ product.price.toFixed(2) }}
        </span>
      </div>

      <!-- Add to Cart -->
      <button
        :id="`btn-add-to-cart-${product.id}`"
        @click="handleAddToCart"
        :disabled="product.stock === 0"
        class="btn-primary mt-1 w-full justify-center text-sm"
        :class="{
          'bg-green-600 hover:bg-green-700': added,
        }"
      >
        <svg v-if="!added" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ added ? 'Added!' : cart.isInCart(product.id) ? 'Add More' : 'Add to Cart' }}
      </button>
    </div>
  </article>
</template>
