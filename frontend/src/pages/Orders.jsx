import { useState } from 'react'
import { ClipboardList, Search, Loader as Loader2, CircleAlert as AlertCircle, Package, Clock } from 'lucide-react'
import { api } from '../api'
import styles from './Orders.module.css'

export default function Orders() {
  const [userId, setUserId] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!userId.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getOrders(userId.trim())
      setOrders(data?.orders ?? [])
      setSearched(true)
    } catch (e) {
      setError(e.message || 'Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHeader}>
          <div className={styles.iconWrap}>
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className={styles.title}>Order History</h1>
            <p className={styles.subtitle}>Look up past orders by user ID</p>
          </div>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.inputWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Enter user ID (e.g. Bunny)…"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading || !userId.trim()}>
            {loading ? <Loader2 size={16} className={styles.spin} /> : <Search size={16} />}
            {loading ? 'Loading…' : 'Find Orders'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!loading && searched && !error && orders.length === 0 && (
          <div className={styles.empty}>
            <Package size={48} className={styles.emptyIcon} />
            <h3>No orders found</h3>
            <p>No order history for this user ID</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className={styles.orders}>
            {orders.map((order, i) => (
              <article key={order.id ?? i} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <Package size={16} />
                    <span className={styles.orderId}>Order #{order.id}</span>
                  </div>
                  <span className={styles.orderStatus}>Placed</span>
                </div>
                <div className={styles.orderBody}>
                  <p className={styles.restaurantLabel}>
                    Restaurant: <strong>{order.restaurantId}</strong>
                  </p>
                  {order.items && order.items.length > 0 && (
                    <ul className={styles.itemList}>
                      {order.items.map((item, j) => (
                        <li key={j} className={styles.orderItem}>
                          <span>{item.name}</span>
                          <span className={styles.itemPrice}>₹{parseFloat(item.price).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {order.total && (
                    <div className={styles.orderTotal}>
                      <span>Total</span>
                      <span className={styles.totalAmt}>₹{parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className={styles.placeholder}>
            <ClipboardList size={64} className={styles.placeholderIcon} />
            <h3 className={styles.placeholderTitle}>Track your orders</h3>
            <p className={styles.placeholderText}>
              Enter a user ID above to view their order history
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
