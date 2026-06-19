const BASE = '/qeats/v1'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  getRestaurants: ({ latitude, longitude, searchFor } = {}) => {
    const params = new URLSearchParams({ latitude, longitude })
    if (searchFor) params.set('searchFor', searchFor)
    return request(`/restaurants?${params}`)
  },

  getMenu: (restaurantId) =>
    request(`/menu?restaurantId=${encodeURIComponent(restaurantId)}`),

  getCart: (cartId) =>
    request(`/cart?cartId=${encodeURIComponent(cartId)}`),

  addItemToCart: ({ cartId, itemId, restaurantId, userId }) =>
    request('/cart/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, itemId, restaurantId, userId }),
    }),

  removeItemFromCart: ({ cartId, itemId, restaurantId, userId }) =>
    request('/cart/item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, itemId, restaurantId, userId }),
    }),

  clearCart: (cartId) =>
    request(`/cart/clear?cartId=${encodeURIComponent(cartId)}`, { method: 'DELETE' }),

  postOrder: ({ cartId, userId }) =>
    request('/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, userId }),
    }),

  getOrders: (userId) =>
    request(`/orders?userId=${encodeURIComponent(userId)}`),
}
