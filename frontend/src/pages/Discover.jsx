import { useState, useCallback } from 'react'
import { Search, Navigation, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react'
import { api } from '../api'
import RestaurantCard from '../components/RestaurantCard'
import styles from './Discover.module.css'

const DEFAULT_LAT = 20.027
const DEFAULT_LNG = 30.0

export default function Discover() {
  const [latitude, setLatitude] = useState(DEFAULT_LAT)
  const [longitude, setLongitude] = useState(DEFAULT_LNG)
  const [searchFor, setSearchFor] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (lat, lng, q) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getRestaurants({ latitude: lat, longitude: lng, searchFor: q })
      setRestaurants(data?.restaurants ?? [])
      setSearched(true)
    } catch (e) {
      setError(e.message || 'Failed to fetch restaurants. Is the backend running?')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    search(latitude, longitude, searchFor)
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(6)))
        setLongitude(parseFloat(pos.coords.longitude.toFixed(6)))
      },
      () => setError('Unable to retrieve your location.')
    )
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Find restaurants <span className={styles.highlight}>near you</span>
          </h1>
          <p className={styles.heroSub}>
            Discover open restaurants within your delivery radius and explore their menus
          </p>

          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <div className={styles.coordRow}>
              <label className={styles.coordGroup}>
                <span className={styles.coordLabel}>Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={e => setLatitude(parseFloat(e.target.value))}
                  className={styles.coordInput}
                  placeholder="-90 to 90"
                  required
                  min={-90}
                  max={90}
                />
              </label>
              <label className={styles.coordGroup}>
                <span className={styles.coordLabel}>Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={e => setLongitude(parseFloat(e.target.value))}
                  className={styles.coordInput}
                  placeholder="-180 to 180"
                  required
                  min={-180}
                  max={180}
                />
              </label>
              <button type="button" className={styles.locateBtn} onClick={useMyLocation} title="Use my location">
                <Navigation size={16} />
              </button>
            </div>

            <div className={styles.searchRow}>
              <div className={styles.searchInput}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchFor}
                  onChange={e => setSearchFor(e.target.value)}
                  placeholder="Search by name or cuisine (optional)…"
                  className={styles.textInput}
                />
              </div>
              <button type="submit" className={styles.searchBtn} disabled={loading}>
                {loading ? <Loader2 size={18} className={styles.spin} /> : <Search size={18} />}
                {loading ? 'Searching…' : 'Find Restaurants'}
              </button>
            </div>
          </form>

          <div className={styles.quickCoords}>
            <span className={styles.quickLabel}>Try sample coordinates:</span>
            <button
              className={styles.quickBtn}
              onClick={() => { setLatitude(20.027); setLongitude(30.0); search(20.027, 30.0, '') }}
            >
              20.027, 30.0
            </button>
            <button
              className={styles.quickBtn}
              onClick={() => { setLatitude(20.5); setLongitude(30.0); search(20.5, 30.0, '') }}
            >
              20.5, 30.0
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={styles.results}>
        <div className={styles.resultsInner}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!loading && searched && !error && (
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                {restaurants.length === 0
                  ? 'No restaurants found'
                  : `${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} found`}
              </h2>
              {restaurants.length === 0 && (
                <p className={styles.noResultsText}>
                  Try adjusting your coordinates or check back during peak hours (8–10am, 1–2pm, 7–9pm) when the radius is 3km, or normal hours for 5km.
                </p>
              )}
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <Loader2 size={40} className={styles.spin} />
              <p>Finding restaurants near you…</p>
            </div>
          )}

          {!loading && restaurants.length > 0 && (
            <div className={styles.grid}>
              {restaurants.map(r => (
                <RestaurantCard key={r.restaurantId} restaurant={r} />
              ))}
            </div>
          )}

          {!searched && !loading && (
            <div className={styles.prompt}>
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Food"
                className={styles.promptImage}
              />
              <h3 className={styles.promptTitle}>Enter your location to explore</h3>
              <p className={styles.promptText}>
                Use the sample coordinates above or enter your own to discover nearby restaurants
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
