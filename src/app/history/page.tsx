'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserRedirect } from '@/hooks/useUserRedirect';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  ai_response: string;
}

export default function HistoryPage() {
  useUserRedirect(true);
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch entries
  const fetchHistory = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth'); // 🔐 Redirect
      return;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setEntries(data || []);
    setLoading(false);
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } else {
      alert('Failed to delete entry.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-purple-50 to-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">📜 Your Journal History</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-600">No journal entries found.</p>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border border-purple-200 bg-white p-5 rounded-xl shadow-sm relative"
              >
                <p className="text-sm text-gray-500 mb-2">
                  📅 {new Date(entry.created_at).toLocaleString()}
                </p>
                <p className="mb-2 text-purple-900 whitespace-pre-wrap">
                  <strong>📝 Entry:</strong> {entry.content}
                </p>
                <p className="text-gray-800 bg-purple-50 p-3 rounded-md whitespace-pre-wrap">
                  <strong>🔍 Gemini Insight:</strong> {entry.ai_response}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-3 right-3 text-sm text-red-600 hover:text-red-800"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
