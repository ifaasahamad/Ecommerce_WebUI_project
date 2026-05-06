<script setup lang="ts">
import { useCartStore } from '../stores/cartStore'
import CartItem from '../components/CartItem.vue'

const cart = useCartStore()

function checkoutPlaceholder(): void {
  alert('Checkout flow coming soon!')
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" id="cart-view">
    <h1 class="section-title mb-8">🛍️ Shopping Cart</h1>

    <!-- Empty Cart -->
    <div
      v-if="cart.items.length === 0"
      class="flex flex-col items-center gap-5 rounded-2xl bg-gray-50 py-20 text-center dark:bg-gray-900"
      id="cart-empty"
    >
      <span class="text-7xl">🛒</span>
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300">Your cart is empty</h2>
      <p class="text-sm text-gray-500">Looks like you haven't added anything yet</p>
      <router-link to="/products" class="btn-primary" id="btn-continue-shopping">
        Start Shopping
      </router-link>
    </div>

    <!-- Cart with Items -->
    <div v-else class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- Items List -->
      <div class="flex flex-1 flex-col gap-3" id="cart-items-list">
        <transition-group name="list">
          <CartItem
            v-for="item in cart.items"
            :key="item.product.id"
            :item="item"
          />
        </transition-group>

        <button
          id="btn-clear-cart"
          @click="cart.clearCart"
          class="btn-ghost mt-2 justify-center text-red-500 hover:text-red-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Cart
        </button>
      </div>

      <!-- Order Summary -->
      <div
        class="sticky top-24 w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 lg:w-80"
        id="order-summary"
      >
        <h2 class="mb-5 text-lg font-bold text-gray-900 dark:text-white">Order Summary</h2>

        <div class="flex flex-col gap-3 text-sm">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal ({{ cart.totalItems }} items)</span>
            <span>${{ cart.originalPrice.toFixed(2) }}</span>
          </div>
          <div v-if="cart.savings > 0" class="flex justify-between text-green-600 dark:text-green-400">
            <span>Total Savings</span>
            <span>-${{ cart.savings.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span class="text-green-600 dark:text-green-400">Free</span>
          </div>
          <div class="my-2 border-t border-dashed border-gray-200 dark:border-gray-700" />
          <div class="flex justify-between text-base font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Savings Banner -->
        <div
          v-if="cart.savings > 0"
          class="mt-4 rounded-xl bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
        >
          🎉 You're saving ${{ cart.savings.toFixed(2) }} on this order!
        </div>

        <button
          id="btn-checkout"
          class="btn-primary mt-5 w-full justify-center text-base"
          @click="checkoutPlaceholder"
        >
          Proceed to Checkout
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        <router-link to="/products" class="btn-secondary mt-3 w-full justify-center">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
