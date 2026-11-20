import { lazy } from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Layout } from './components/PageTransition'
import { LandingPage } from './pages/LandingPage'

// A página inicial carrega junto; as demais só quando forem abertas.
const MenuPage = lazy(() => import('./pages/MenuPage').then((m) => ({ default: m.MenuPage })))
const ProductDetailRoute = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailRoute })),
)
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderSentPage = lazy(() => import('./pages/OrderSentPage').then((m) => ({ default: m.OrderSentPage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export default function App() {
  return (
    // reducedMotion="user": respeita a opção "reduzir movimento" do sistema.
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/cardapio" element={<MenuPage />} />
              <Route path="/produto/:id" element={<ProductDetailRoute />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/finalizar" element={<CheckoutPage />} />
              <Route path="/pedido-enviado" element={<OrderSentPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </MotionConfig>
  )
}
