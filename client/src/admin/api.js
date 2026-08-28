const TOKEN_KEY = 'seedarrt-admin-token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

// `persist: true` (case "Rester connecté") garde le token après fermeture du navigateur ;
// sinon il ne survit que le temps de l'onglet.
function setToken(token, persist = true) {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  if (token) (persist ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
}

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

async function request(path, { method = 'GET', body, isMultipart = false } = {}) {
  const token = getToken()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body && !isMultipart) headers['Content-Type'] = 'application/json'

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? (isMultipart ? body : JSON.stringify(body)) : undefined,
  })

  if (res.status === 401) {
    setToken(null)
    window.dispatchEvent(new Event('seedarrt-admin-logout'))
    throw new Error('Session expirée')
  }

  if (res.status === 204) return null

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    throw new Error((isJson && data.error) || 'Erreur serveur')
  }

  return data
}

export const api = {
  getToken,
  setToken,
  decodeToken,
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password } }),
  get: (path) => request(path),
  post: (path, body, isMultipart = false) => request(path, { method: 'POST', body, isMultipart }),
  patch: (path, body, isMultipart = false) => request(path, { method: 'PATCH', body, isMultipart }),
  del: (path) => request(path, { method: 'DELETE' }),
}
