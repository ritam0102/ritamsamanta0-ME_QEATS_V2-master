import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star } from 'lucide-react'
import styles from './RestaurantCard.module.css'

const PLACEHOLDER_IMAGES = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=600',
]

function getImage(restaurantId) {
  const idx = parseInt(restaurantId, 10) % PLACEHOLDER_IMAGES.length
  return PLACEHOLDER_IMAGES[isNaN(idx) ? 0 : idx]
}

function isCurrentlyOpen(opensAt, closesAt) {
  if (!opensAt || !closesAt) return null
  const now = new Date()
  const [oh, om] = opensAt.split(':').map(Number)
  const [ch, cm] = closesAt.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = oh * 60 + om
  const closeMins = ch * 60 + cm
  return nowMins >= openMins && nowMins < closeMins
}

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()
  const open = isCurrentlyOpen(restaurant.opensAt, restaurant.closesAt)

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/restaurant/${restaurant.restaurantId}`)}
    >
      <div className={styles.imageWrap}>
        <img
          src={getImage(restaurant.restaurantId)}
          alt={restaurant.name}
          className={styles.image}
          loading="lazy"
        />
        {open !== null && (
          <span className={`${styles.statusBadge} ${open ? styles.open : styles.closed}`}>
            {open ? 'Open Now' : 'Closed'}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          <div className={styles.rating}>
            <Star size={13} fill="currentColor" />
            <span>{(3.8 + (parseInt(restaurant.restaurantId, 10) % 12) * 0.1).toFixed(1)}</span>
          </div>
        </div>

        {restaurant.attributes && restaurant.attributes.length > 0 && (
          <p className={styles.cuisine}>{restaurant.attributes.join(' · ')}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={13} />
            {restaurant.city}
          </span>
          {restaurant.opensAt && (
            <span className={styles.metaItem}>
              <Clock size={13} />
              {restaurant.opensAt}–{restaurant.closesAt}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
