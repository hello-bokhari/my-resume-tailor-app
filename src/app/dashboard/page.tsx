
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import ResumeTailorForm from '../../components/ResumeTailorForm';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>You must be logged in to view this page.</p>
        <a href="/login" className="text-blue-600">Login</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <ResumeTailorForm />
    </div>
  );
}
