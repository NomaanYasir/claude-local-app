import { useEffect } from 'react'
import { useError } from '../context/ErrorContext'

export default function GlobalHandlers(){
  const { setError } = useError();
  useEffect(()=>{
    const onRej = (e) => {
      try { setError(e && e.reason && (e.reason.error || e.reason.message) ? (e.reason.error || e.reason.message) : 'An unexpected error occurred'); }
      catch(_) { setError('An unexpected error occurred'); }
    };
    const onErr = (e) => {
      try { setError(e && e.message ? e.message : 'An unexpected error occurred'); }
      catch(_) { setError('An unexpected error occurred'); }
    };
    window.addEventListener('unhandledrejection', onRej);
    window.addEventListener('error', onErr);
    return () => { window.removeEventListener('unhandledrejection', onRej); window.removeEventListener('error', onErr); };
  }, [setError]);
  return null;
}
