<script setup lang="ts">
import type { CartItem } from '../types'
import { useCartStore } from '../stores/cartStore'

defineProps<{ item: CartItem }>()
const cart = useCartStore()

function discountedPrice(price: number, discount: number): string {
  return (price * (1 - discount / 100)).toFixed(2)
}
</script>

<template>
  <div
    class="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all dark:bg-gray-900 dark:ring-gray-800"
    :id="`cart-item-${item.product.id}`"
  >
    <!-- Thumbnail -->
    <router-link :to="`/products/${item.product.id}`" class="shrink-0">
      <img
        :src="item.product.thumbnail"
        :alt="item.product.title"
        class="h-20 w-20 rounded-lg object-cover"
      />
    </router-link>

    <!-- Info -->
    <div class="flex flex-1 flex-col gap-1 min-w-0">
      <router-link
        :to="`/products/${item.product.id}`"
        class="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary-600 dark:text-white"
      >
        {{ item.product.title }}
      </router-link>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.product.brand }}</p>

      <div class="mt-auto flex items-center justify-between gap-4">
        <!-- Price -->
        <div>
          <p class="font-bold text-gray-900 dark:text-white">
            ${{ discountedPrice(item.product.price, item.product.discountPercentage) }}
          </p>
          <p v-if="item.product.discountPercentage > 0" class="text-xs text-gray-400 line-through">
            ${{ item.product.price.toFixed(2) }}
          </p>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-2 rounded-lg bg-gray-50 p-1 dark:bg-gray-800">
          <button
            :id="`btn-decrease-${item.product.id}`"
            @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
            class="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">
            {{ item.quantity }}
          </span>
          <button
            :id="`btn-increase-${item.product.id}`"
            @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
            :disabled="item.quantity >= item.product.stock"
            class="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Remove -->
        <button
          :id="`btn-remove-${item.product.id}`"
          @click="cart.removeFromCart(item.product.id)"
          class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
          aria-label="Remove item"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
