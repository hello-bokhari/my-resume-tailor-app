'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';


export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
  if (!entry.trim()) return;
  setLoading(true);
  setResponse('');

  try {
    // 1. Call Gemini API
    const res = await fetch('/api/gemini', {
      method: 'POST',
      body: JSON.stringify({ entry }),
    });
    const data = await res.json();
    setResponse(data.reply);

    // 2. Get current Supabase user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save entries.");
      return;
    }

    // 3. Insert into Supabase DB
    const { error } = await supabase.from('journal_entries').insert([
      {
        user_id: user.id,
        content: entry,
        ai_response: data.reply,
      },
    ]);

    if (error) {
      console.error('Insert error:', error.message);
    }
  } catch (err) {
    console.error(err);
    setResponse('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-purple-200">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-4">🧠 Daily Journal</h2>
        <p className="text-center text-gray-500 mb-6">
          Write about how you are feeling. Gemini will give helpful insights.
        </p>

        <textarea
          className="w-full h-40 p-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-base resize-none mb-4"
          placeholder="Start writing here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <button
          className={`w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '✨ Get Gemini Insight'}
        </button>

        {response && (
          <div className="mt-8 p-6 bg-purple-50 border-l-4 border-purple-500 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">🔍 Gemini’s Insight</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
