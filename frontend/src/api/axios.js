import axios from 'axios'

let onUnauthorized = null

const normalizeApiBaseUrl = (value) => {
  const fallbackUrl = 'http://localhost:5000/api'

  if (!value) {
    return fallbackUrl
  }

  const trimmed = value.trim().replace(/\/+$/, '')

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  const isLocalHost =
    /^localhost(?::\d+)?(\/|$)/i.test(trimmed) ||
    /^127(?:\.\d{1,3}){3}(?::\d+)?(\/|$)/.test(trimmed)

  return `${isLocalHost ? 'http' : 'https'}://${trimmed}`
}

export const setLogoutHandler = (handler) => {
  onUnauthorized = handler
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (typeof onUnauthorized === 'function') {
        onUnauthorized()
      }
    }

    return Promise.reject(error)
  },
)

export default api