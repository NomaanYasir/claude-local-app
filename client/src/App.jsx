import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { ErrorProvider } from './context/ErrorContext'
import ErrorBanner from './components/ErrorBanner'
import ErrorBoundary from './components/ErrorBoundary'
import GlobalHandlers from './components/GlobalHandlers'
import LoadingIndicator from './components/LoadingIndicator'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [token, user]);

  if (!token) return (
    <ErrorProvider>
      <ErrorBoundary>
        <GlobalHandlers />
        <LoadingIndicator />
        <div className="auth-container">
          <h2>Study AI</h2>
          <Login onAuth={(t,u)=>{setToken(t);setUser(u)}} />
          <Register onAuth={(t,u)=>{setToken(t);setUser(u)}} />
        </div>
      </ErrorBoundary>
    </ErrorProvider>
  )

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <GlobalHandlers />
        <LoadingIndicator />
        <ErrorBanner />
        <Dashboard token={token} user={user} onLogout={() => { setToken(null); setUser(null); }} />
      </ErrorBoundary>
    </ErrorProvider>
  )
}
