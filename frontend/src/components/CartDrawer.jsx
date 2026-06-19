import { useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { cart, addItem, removeItem, clearCart, isOpen, setIsOpen } = useCart()
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <aside className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={20} />
            <h2 className={styles.title}>Your Cart</h2>
            {itemCount > 0 && (
              <span className={styles.count}>{itemCount} item{itemCount > 1 ? 's' : ''}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {cart.items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptyText}>Add items from a restaurant to get started</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {cart.items.map(item => (
                <li key={item.itemId} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemPrice}>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className={styles.qty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => removeItem(item.itemId)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.qtyNum}>{item.qty}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => addItem(item, cart.restaurantId)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.total}>₹{cart.total.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn}>
              Place Order — ₹{cart.total.toFixed(2)}
            </button>
            <button className={styles.clearBtn} onClick={clearCart}>
              <Trash2 size={14} />
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
