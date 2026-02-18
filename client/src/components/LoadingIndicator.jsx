import React, { useEffect, useState } from 'react'
import { subscribe } from '../lib/loading'

export default function LoadingIndicator(){
  const [count, setCount] = useState(0);
  useEffect(()=>{
    const unsub = subscribe(setCount);
    return unsub;
  },[]);

  if (count <= 0) return null;
  return (
    <div className="global-loading" aria-hidden>
      <div className="spinner" />
    </div>
  );
}
