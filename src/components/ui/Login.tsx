"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for the magic link.")
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Send Magic Link
        </button>
      </form>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  )
}
