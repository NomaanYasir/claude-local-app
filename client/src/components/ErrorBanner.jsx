import React from 'react'
import { useError } from '../context/ErrorContext'

export default function ErrorBanner(){
  const { error, setError } = useError();
  if (!error) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-content">{error}</div>
      <button className="error-close" onClick={() => setError(null)}>Dismiss</button>
    </div>
  )
}
