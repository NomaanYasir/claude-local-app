import React, { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }){
  useEffect(()=>{
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  },[onClose]);

  return (
    <div className={`toast ${type}`} onClick={() => onClose && onClose()}>
      <div className="toast-message">{message}</div>
      <button className="toast-close">✕</button>
    </div>
  )
}
