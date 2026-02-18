import React, { useState } from 'react'
import { register } from '../api'

export default function Register({ onAuth }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [err,setErr]=useState(null);
  const [loading,setLoading]=useState(false);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await register({ email, password, name });
      onAuth(res.token, res.user);
    }catch(er){ setErr(er.error || 'Registration failed'); }
    finally{ setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="form">
      <h3>Register</h3>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>Register</button>
      {err && <div className="error">{err}</div>}
    </form>
  )
}
