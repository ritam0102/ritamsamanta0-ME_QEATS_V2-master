import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, UtensilsCrossed, ClipboardList, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cart, setIsOpen } = useCart()
  const location = useLocation()
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <UtensilsCrossed size={22} />
          <span>QEats</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            <MapPin size={16} />
            <span>Discover</span>
          </Link>
          <Link
            to="/orders"
            className={`${styles.navLink} ${location.pathname === '/orders' ? styles.active : ''}`}
          >
            <ClipboardList size={16} />
            <span>Orders</span>
          </Link>
        </nav>

        <button className={styles.cartBtn} onClick={() => setIsOpen(true)}>
          <ShoppingBag size={20} />
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          <span className={styles.cartLabel}>Cart</span>
        </button>
      </div>
    </header>
  )
}
