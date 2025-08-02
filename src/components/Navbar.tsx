'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email ?? '');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/auth';
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-purple-200">
      <Link href="/">
        <h1 className="text-xl font-bold text-purple-700">NeuralNote</h1>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/journal" className="text-purple-600 hover:text-purple-800 font-medium transition">Journal</Link>
        <Link href="/therapist" className="text-purple-600 hover:text-purple-800 font-medium transition">Therapist</Link>
        <Link href="/history" className="text-purple-600 hover:text-purple-800 font-medium transition">History</Link>
        {userEmail && (
          <>
            <span className="text-sm text-gray-500 hidden sm:inline">{userEmail}</span>
            <button onClick={handleLogout} className="text-sm text-purple-600 underline">Logout</button>
          </>
        )}
        {!userEmail && (
          <Link href="/auth" className="text-purple-600 hover:text-purple-800 font-medium transition">
            Login
            </Link>
        )}
      </div>
    </nav>
  );
}
