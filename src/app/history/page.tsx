'use client';

import { useEffect, useState } from 'react';

interface JournalEntry {
  date: string;
  entry: string;
  response: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem('journalHistory');
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Your Journal History</h1>
      {history.length === 0 ? (
        <p className="text-gray-600">No journal entries yet.</p>
      ) : (
        <div className="space-y-6">
          {history.map((item, i) => (
            <div key={i} className="border rounded p-4 shadow-sm bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">📅 {item.date}</p>
              <p className="mb-2"><strong>📝 Entry:</strong> {item.entry}</p>
              <p><strong>🔍 Gemini Insight:</strong> {item.response}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
