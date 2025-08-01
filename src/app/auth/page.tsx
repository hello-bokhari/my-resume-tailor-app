'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
    else alert('Error sending magic link');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">🔐 Sign In</h1>
        {sent ? (
          <p className="text-green-600">Magic link sent! Check your email.</p>
        ) : (
          <>
            <input
              type="email"
              className="input w-full border-2 border-purple-300 rounded-md px-4 py-2 mb-4 text-purple-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="btn bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              Send Magic Link
            </button>
          </>
        )}
      </div>
    </main>
  );
}
