import { ref, computed } from 'vue'
import type { Product, ProductsResponse, ProductFilters, AsyncState } from '../types'
import axios from 'axios'

const BASE = 'https://dummyjson.com'

// ─── Shared reactive state (module-level singleton) ───────────────────────────
const allProducts = ref<Product[]>([])
const categories = ref<string[]>([])
const totalProducts = ref(0)
const state = ref<AsyncState<Product[]>>({
  data: null,
  loading: false,
  error: null,
})

const filters = ref<ProductFilters>({
  search: '',
  category: '',
  sortBy: 'default',
  minPrice: 0,
  maxPrice: 10000,
})

let initialized = false

export function useProducts() {
  // ─── Fetch all products (paginated) ─────────────────────────────────────────
  async function fetchAllProducts(): Promise<void> {
    if (initialized) return
    state.value.loading = true
    state.value.error = null
    try {
      const limit = 100
      let skip = 0
      let fetched: Product[] = []
      let total = 0

      // DummyJSON limits to 100/page so we fetch until we have all
      do {
        const res = await axios.get<ProductsResponse>(`${BASE}/products`, {
          params: { limit, skip, select: 'id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,images,tags,availabilityStatus,minimumOrderQuantity' },
        })
        fetched = [...fetched, ...res.data.products]
        total = res.data.total
        skip += limit
      } while (fetched.length < total && fetched.length < 200)

      allProducts.value = fetched
      totalProducts.value = total
      state.value.data = fetched
      initialized = true
    } catch (err) {
      state.value.error =
        err instanceof Error ? err.message : 'Failed to fetch products'
    } finally {
      state.value.loading = false
    }
  }

  // ─── Fetch categories ────────────────────────────────────────────────────────
  async function fetchCategories(): Promise<void> {
    if (categories.value.length > 0) return
    try {
      const res = await axios.get<{ slug: string; name: string; url: string }[]>(
        `${BASE}/products/categories`
      )
      categories.value = res.data.map((c) => c.slug)
    } catch (_) {
      // silently fail — categories just won't populate
    }
  }

  // ─── Fetch single product ────────────────────────────────────────────────────
  async function fetchProduct(id: number): Promise<Product | null> {
    try {
      const res = await axios.get<Product>(`${BASE}/products/${id}`)
      return res.data
    } catch (_) {
      return null
    }
  }

  // ─── Computed filtered/sorted list ──────────────────────────────────────────
  const filteredProducts = computed<Product[]>(() => {
    let list = [...allProducts.value]

    // Category filter
    if (filters.value.category) {
      list = list.filter((p) => p.category === filters.value.category)
    }

    // Search filter (title, brand, description)
    if (filters.value.search.trim()) {
      const q = filters.value.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // Price range
    list = list.filter(
      (p) =>
        p.price >= filters.value.minPrice && p.price <= filters.value.maxPrice
    )

    // Sorting
    switch (filters.value.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
    }

    return list
  })

  function setFilter<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ): void {
    filters.value[key] = value
  }

  function resetFilters(): void {
    filters.value = {
      search: '',
      category: '',
      sortBy: 'default',
      minPrice: 0,
      maxPrice: 10000,
    }
  }

  return {
    state,
    allProducts,
    filteredProducts,
    categories,
    totalProducts,
    filters,
    fetchAllProducts,
    fetchCategories,
    fetchProduct,
    setFilter,
    resetFilters,
  }
}
