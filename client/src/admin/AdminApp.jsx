import { useEffect, useState } from 'react'
import { api } from './api'
import Login from './Login'
import Dashboard from './Dashboard'
import './admin.css'

export default function AdminApp() {
  const [token, setTokenState] = useState(() => api.getToken())

  useEffect(() => {
    document.body.classList.add('admin-mode')

    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(fontLink)

    const onLogout = () => setTokenState(null)
    window.addEventListener('seedarrt-admin-logout', onLogout)

    return () => {
      document.body.classList.remove('admin-mode')
      document.head.removeChild(fontLink)
      window.removeEventListener('seedarrt-admin-logout', onLogout)
    }
  }, [])

  const handleLogin = (newToken, remember = true) => {
    api.setToken(newToken, remember)
    setTokenState(newToken)
  }

  const handleLogout = () => {
    api.setToken(null)
    setTokenState(null)
  }

  return token ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}
