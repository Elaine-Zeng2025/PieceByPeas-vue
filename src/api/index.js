const API_BASE = import.meta.env.VITE_API_URL || '/api'

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const authApi = {
  login:   (email, password) => request('/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) }),
  register:(username, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  logout:  () => request('/auth/logout',   { method: 'POST' }),
  me:      () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
}

export const mealsApi = {
  getAll:  ()          => request('/meals/'),
  add:     (data)      => request('/meals/',      { method: 'POST',   body: JSON.stringify(data) }),
  update:  (id, data)  => request(`/meals/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  delete:  (id)        => request(`/meals/${id}`, { method: 'DELETE' }),
}