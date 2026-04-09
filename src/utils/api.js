/**
 * Base URL for the players API. In dev, Vite proxies `/api` to the Node server.
 * In Docker, nginx proxies `/api` to the API container.
 */
export function getApiBase() {
  const v = import.meta.env.VITE_API_URL
  if (v !== undefined && v !== '') {
    return String(v).replace(/\/$/, '')
  }
  return '/api'
}

export function playersUrl(name) {
  const base = getApiBase()
  return `${base}/players/${encodeURIComponent(name)}`
}

export function playersCollectionUrl() {
  const base = getApiBase()
  return `${base}/players`
}
