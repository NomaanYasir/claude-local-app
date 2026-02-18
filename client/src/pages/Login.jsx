import React, { useState } from 'react'
import { login } from '../api'

export default function Login({ onAuth }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const [loading,setLoading]=useState(false);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await login({ email, password });
      onAuth(res.token, res.user);
    }catch(er){ setErr(er.error || 'Login failed'); }
    finally{ setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="form">
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>Login</button>
      {err && <div className="error">{err}</div>}
    </form>
  )
}
