import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '../types'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])
    const isCartOpen = ref(false)

    const totalItems = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => {
        const discounted =
          item.product.price * (1 - item.product.discountPercentage / 100)
        return sum + discounted * item.quantity
      }, 0)
    )

    const originalPrice = computed(() =>
      items.value.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    )

    const savings = computed(() => originalPrice.value - totalPrice.value)

    function addToCart(product: Product, qty = 1): void {
      const existing = items.value.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, product.stock)
      } else {
        items.value.push({ product, quantity: qty })
      }
    }

    function removeFromCart(productId: number): void {
      items.value = items.value.filter((i) => i.product.id !== productId)
    }

    function updateQuantity(productId: number, quantity: number): void {
      const item = items.value.find((i) => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          removeFromCart(productId)
        } else {
          item.quantity = Math.min(quantity, item.product.stock)
        }
      }
    }

    function clearCart(): void {
      items.value = []
    }

    function isInCart(productId: number): boolean {
      return items.value.some((i) => i.product.id === productId)
    }

    function getQuantity(productId: number): number {
      return items.value.find((i) => i.product.id === productId)?.quantity ?? 0
    }

    return {
      items,
      isCartOpen,
      totalItems,
      totalPrice,
      originalPrice,
      savings,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getQuantity,
    }
  },
  {
    persist: {
      key: 'shopvue-cart',
      storage: localStorage,
      pick: ['items'],
    },
  }
)
