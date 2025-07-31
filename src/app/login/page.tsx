"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("✅ Check your email for the magic link.");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center">Resume Tailor</h1>
      {session ? (
        <>
          <p className="text-center">You are logged in as {session.user.email}</p>
          <Button onClick={() => supabase.auth.signOut()} className="w-full" variant="destructive">
            Log out
          </Button>
        </>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered input-primary w-full mt-1"
              placeholder="you@example.com"
            />
          </label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
          {message && <p className="text-sm text-center text-green-600">{message}</p>}
        </form>
      )}
    </Layout>
  );
}
