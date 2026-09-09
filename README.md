# ShopVue — Vue 3 + TypeScript + Tailwind CSS E-Commerce SPA

A production-grade Single Page Application built for the Mini Project submission.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173`

## 🔑 Demo Login

Use the pre-filled demo credentials on the Login page, or enter manually:
- **Username:** `emilys`
- **Password:** `emilysspass`

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Vue 3 | ^3.5 | UI Framework (Composition API) |
| TypeScript | ^5.6 | Strict type safety |
| Vite | ^6 | Build tool & dev server |
| Tailwind CSS | ^4 | Utility-first styling |
| Vue Router | ^4 | Dynamic routing |
| Pinia | ^2 | Global state management |
| pinia-plugin-persistedstate | ^4 | Cart & auth persistence |
| Axios | ^1 | HTTP client for API calls |

## ✨ Features

### Core
- 📋 **Product Listing** — Browse 194+ products from DummyJSON
- 🔍 **Search & Filter** — Search by keyword, filter by category, price range, sort
- 📄 **Product Detail** — Full page with image gallery, reviews, shipping info
- 📱 **Responsive** — Mobile, tablet, and desktop layouts

### Bonus (A+ Grade)
- 🔐 **Auth Simulation** — Login/logout using DummyJSON `/auth/login`, JWT stored in localStorage
- 🛒 **Shopping Cart with Pinia** — Add/update/remove items, persists across page reloads
- 🗺️ **Dynamic Routing** — Vue Router with `/products/:id`
- 🌙 **Dark Mode** — Toggle using Tailwind `dark:` classes, preference stored in localStorage

## 🗂️ Component Hierarchy

```
App.vue
├── NavBar.vue           (search, cart, auth, dark toggle)
├── router-view
│   ├── HomeView.vue     (hero, categories, featured products)
│   ├── ProductsView.vue (full grid + FilterBar + pagination)
│   │   ├── FilterBar.vue
│   │   └── ProductCard.vue
│   ├── ProductDetail.vue (image gallery, qty, reviews)
│   ├── CartView.vue     (CartItem list + order summary)
│   └── LoginView.vue    (auth form)
├── LoadingSpinner.vue
└── ToastNotification.vue
```

## 📡 API Endpoints Used

- `GET /products` — All products (paginated)
- `GET /products/categories` — Category list
- `GET /products/:id` — Single product detail
- `POST /auth/login` — User authentication
