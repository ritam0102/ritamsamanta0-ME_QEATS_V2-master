import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Loader as Loader2, CircleAlert as AlertCircle, UtensilsCrossed, Tag } from 'lucide-react'
import { api } from '../api'
import { useCart } from '../context/CartContext'
import styles from './RestaurantMenu.module.css'

const FOOD_IMAGES = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=400',
]

function getFoodImage(itemId) {
  const idx = parseInt(itemId, 10) % FOOD_IMAGES.length
  return FOOD_IMAGES[isNaN(idx) ? 0 : idx]
}

export default function RestaurantMenu() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { cart, addItem, removeItem } = useCart()
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.getMenu(restaurantId)
      .then(data => { setMenu(data); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [restaurantId])

  const getQty = (itemId) => {
    const found = cart.items.find(i => i.itemId === itemId)
    return found ? found.qty : 0
  }

  const restaurantHeader = (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className={styles.restaurantMeta}>
          <div className={styles.restaurantIcon}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <h1 className={styles.restaurantName}>Restaurant #{restaurantId}</h1>
            <p className={styles.restaurantSub}>Menu</p>
          </div>
        </div>
      </div>
    </header>
  )

  if (loading) {
    return (
      <div className={styles.page}>
        {restaurantHeader}
        <div className={styles.center}>
          <Loader2 size={40} className={styles.spin} />
          <p>Loading menu…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        {restaurantHeader}
        <div className={styles.center}>
          <div className={styles.errorBox}>
            <AlertCircle size={24} />
            <p>{error}</p>
            <p className={styles.errorHint}>
              Make sure the backend is running and the menu endpoint is implemented.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const items = menu?.items ?? []

  return (
    <div className={styles.page}>
      {restaurantHeader}

      <div className={styles.body}>
        <div className={styles.inner}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <UtensilsCrossed size={48} className={styles.emptyIcon} />
              <h3>Menu not available</h3>
              <p>This restaurant has no items yet</p>
            </div>
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>All Items</h2>
                <span className={styles.sectionCount}>{items.length} items</span>
              </div>
              <div className={styles.grid}>
                {items.map(item => {
                  const qty = getQty(item.itemId)
                  return (
                    <article key={item.itemId} className={styles.item}>
                      <div className={styles.itemImageWrap}>
                        <img
                          src={getFoodImage(item.itemId)}
                          alt={item.name}
                          className={styles.itemImage}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.itemBody}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        {item.attributes && item.attributes.length > 0 && (
                          <div className={styles.tags}>
                            {item.attributes.map(a => (
                              <span key={a} className={styles.tag}>
                                <Tag size={10} />{a}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className={styles.itemFooter}>
                          <span className={styles.price}>₹{parseFloat(item.price).toFixed(2)}</span>
                          {qty === 0 ? (
                            <button
                              className={styles.addBtn}
                              onClick={() => addItem({
                                itemId: item.itemId,
                                name: item.name,
                                price: parseFloat(item.price),
                                imageUrl: item.imageUrl,
                              }, restaurantId)}
                            >
                              <Plus size={16} />
                              Add
                            </button>
                          ) : (
                            <div className={styles.qtyControl}>
                              <button
                                className={styles.qtyBtn}
                                onClick={() => removeItem(item.itemId)}
                              >
                                <Minus size={14} />
                              </button>
                              <span className={styles.qty}>{qty}</span>
                              <button
                                className={styles.qtyBtn}
                                onClick={() => addItem({
                                  itemId: item.itemId,
                                  name: item.name,
                                  price: parseFloat(item.price),
                                  imageUrl: item.imageUrl,
                                }, restaurantId)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
