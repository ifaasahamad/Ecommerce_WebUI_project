<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cartStore'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { Product } from '../types'

const props = defineProps<{ id: number }>()

const router = useRouter()
const { fetchProduct } = useProducts()
const cart = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)
const addedToCart = ref(false)

onMounted(async () => {
  const result = await fetchProduct(props.id)
  if (!result) {
    error.value = 'Product not found'
  } else {
    product.value = result
    selectedImage.value = 0
  }
  loading.value = false
})

function handleAddToCart(): void {
  if (!product.value) return
  cart.addToCart(product.value, quantity.value)
  addedToCart.value = true
  setTimeout(() => (addedToCart.value = false), 2000)
}

function starsArray(rating: number): ('full' | 'half' | 'empty')[] {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'full'
    if (i < rating) return 'half'
    return 'empty'
  })
}

const discountedPrice = computed(() => {
  if (!product.value) return '0.00'
  const p = product.value
  return (p.price * (1 - p.discountPercentage / 100)).toFixed(2)
})

const savings = computed(() => {
  if (!product.value) return '0.00'
  return (product.value.price - Number(discountedPrice.value)).toFixed(2)
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Back -->
    <button
      id="btn-back"
      @click="router.back()"
      class="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" size="lg" message="Loading product…" />

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center gap-4 py-20 text-center"
    >
      <span class="text-6xl">😕</span>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ error }}</h1>
      <router-link to="/products" class="btn-primary">Browse Products</router-link>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <!-- Images -->
      <div class="flex flex-col gap-3" id="product-images">
        <!-- Main Image -->
        <div class="overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800">
          <img
            :src="product.images[selectedImage] ?? product.thumbnail"
            :alt="product.title"
            class="aspect-square w-full object-cover transition-all duration-300"
          />
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="(img, i) in product.images"
            :key="i"
            :id="`thumb-${i}`"
            @click="selectedImage = i"
            class="shrink-0 overflow-hidden rounded-lg ring-2 transition-all"
            :class="selectedImage === i ? 'ring-primary-500' : 'ring-transparent hover:ring-gray-300'"
          >
            <img :src="img" :alt="`Image ${i + 1}`" class="h-16 w-16 object-cover" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-5" id="product-info">
        <!-- Category + Brand -->
        <div class="flex items-center gap-2">
          <span class="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            {{ product.category }}
          </span>
          <span v-if="product.brand" class="text-sm text-gray-500 dark:text-gray-400">by {{ product.brand }}</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ product.title }}</h1>

        <!-- Rating -->
        <div class="flex items-center gap-3">
          <div class="flex">
            <svg
              v-for="(star, i) in starsArray(product.rating)"
              :key="i"
              class="h-5 w-5"
              :class="{
                'fill-current text-amber-400': star === 'full',
                'fill-current text-amber-300': star === 'half',
                'fill-current text-gray-200 dark:text-gray-700': star === 'empty',
              }"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span class="font-medium text-gray-900 dark:text-white">{{ product.rating.toFixed(1) }}</span>
          <span class="text-sm text-gray-500">({{ product.reviews.length }} reviews)</span>
        </div>

        <!-- Price -->
        <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
          <div class="flex items-baseline gap-3">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">${{ discountedPrice }}</span>
            <span v-if="product.discountPercentage > 0" class="text-xl text-gray-400 line-through">
              ${{ product.price.toFixed(2) }}
            </span>
          </div>
          <div v-if="product.discountPercentage > 0" class="mt-1 flex items-center gap-2">
            <span class="badge bg-accent-500 text-white">-{{ Math.round(product.discountPercentage) }}% OFF</span>
            <span class="text-sm text-green-600 dark:text-green-400">You save ${{ savings }}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">{{ product.description }}</p>

        <!-- Stock -->
        <div class="flex items-center gap-2">
          <div
            class="h-2.5 w-2.5 rounded-full"
            :class="product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'"
          />
          <span class="text-sm font-medium"
            :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'"
          >
            {{ product.availabilityStatus }}
            <span v-if="product.stock > 0"> — {{ product.stock }} in stock</span>
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Quantity + Add to Cart -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            <button
              id="btn-qty-decrease"
              @click="quantity = Math.max(1, quantity - 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700"
            >−</button>
            <span id="qty-display" class="w-8 text-center font-bold text-gray-900 dark:text-white">{{ quantity }}</span>
            <button
              id="btn-qty-increase"
              @click="quantity = Math.min(product.stock, quantity + 1)"
              :disabled="quantity >= product.stock"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-white disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
            >+</button>
          </div>

          <button
            id="btn-add-to-cart-detail"
            @click="handleAddToCart"
            :disabled="product.stock === 0"
            class="btn-primary flex-1 justify-center"
            :class="addedToCart ? 'bg-green-600 hover:bg-green-700' : ''"
          >
            <svg v-if="!addedToCart" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ addedToCart ? 'Added to Cart!' : 'Add to Cart' }}
          </button>
        </div>

        <!-- Shipping Info -->
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div class="flex items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <span>🚚</span>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ product.shippingInformation }}</p>
          </div>
          <div class="flex items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <span>🔄</span>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ product.returnPolicy }}</p>
          </div>
          <div class="flex items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <span>🛡️</span>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ product.warrantyInformation }}</p>
          </div>
          <div class="flex items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <span>📦</span>
            <p class="text-xs text-gray-600 dark:text-gray-400">Min. order: {{ product.minimumOrderQuantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <section v-if="product?.reviews?.length" class="mt-12" id="reviews-section">
      <h2 class="section-title mb-6">Customer Reviews</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="review in product.reviews"
          :key="review.reviewerEmail"
          class="card p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ review.reviewerName }}</p>
              <p class="text-xs text-gray-400">{{ new Date(review.date).toLocaleDateString() }}</p>
            </div>
            <div class="flex">
              <svg
                v-for="i in 5"
                :key="i"
                class="h-4 w-4"
                :class="i <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current dark:text-gray-700'"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{{ review.comment }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
