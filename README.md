# NEXUS Store

A futuristic e-commerce web application built with React, TypeScript, and modern web technologies.

![NEXUS Store]

## Features

- **Modern UI/UX**: Cyberpunk-inspired design with glass morphism effects
- **Product Catalog**: Browse products by categories with filtering and search
- **Shopping Cart**: Full cart functionality with persistent storage
- **User Authentication**: Login, register, and profile management
- **Checkout Flow**: Complete order placement with payment integration
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: GSAP-powered scroll and hover effects

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Animations**: GSAP + ScrollTrigger
- **API**: RESTful API with Axios + React Query

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus-store.git
cd nexus-store
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Configuration

The app supports both mock API and real backend API:

### Using Mock API (Default)
No configuration needed. The app will use built-in mock data.

### Using Real API
Edit `.env` file:
```env
VITE_API_URL=https://your-api.com/v1
VITE_USE_MOCK_API=false
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── Navigation.tsx
│   └── CartDrawer.tsx
├── sections/         # Page sections
│   ├── Hero.tsx
│   ├── FeaturedProducts.tsx
│   ├── Categories.tsx
│   ├── SpecialOffers.tsx
│   ├── Testimonials.tsx
│   ├── Newsletter.tsx
│   └── Footer.tsx
├── hooks/            # React Query hooks
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useAuth.ts
├── lib/              # Utilities and API
│   ├── api/         # API services
│   └── utils.ts
├── store/           # Zustand stores
│   └── cartStore.ts
├── data/            # Static data
│   └── products.ts
└── App.tsx          # Main app component
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API Endpoints

### Products
- `GET /products` - List products
- `GET /products/:id` - Get product details
- `GET /products/featured` - Get featured products
- `GET /products/search` - Search products
- `GET /categories` - Get categories

### Cart
- `GET /cart` - Get cart
- `POST /cart/items` - Add item
- `PUT /cart/items/:id` - Update quantity
- `DELETE /cart/items/:id` - Remove item

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/me` - Get current user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Design inspired by cyberpunk aesthetics
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)
