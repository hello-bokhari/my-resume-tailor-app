
"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
        </button>
      </form>
      {message && <p className="text-center text-sm text-gray-300 mt-4">{message}</p>}
    </div>
  );
}
