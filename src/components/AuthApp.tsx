'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const AuthApp = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      setMessage('Check your email for the login link!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="card w-full max-w-md bg-white shadow-xl rounded-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Welcome!</h1>
          <p className="text-lg text-center text-gray-600">Logged in as {session.user.email}</p>
          <Button onClick={handleLogout} disabled={loading} className="w-full" variant="destructive">
            {loading ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="card w-full max-w-md bg-white shadow-xl rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered input-primary w-full shadow-sm rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </Button>
        </form>
        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default AuthApp;
