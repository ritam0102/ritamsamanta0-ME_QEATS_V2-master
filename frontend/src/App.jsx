import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Discover from './pages/Discover'
import RestaurantMenu from './pages/RestaurantMenu'
import Orders from './pages/Orders'

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
      <CartDrawer />
    </CartProvider>
  )
}
