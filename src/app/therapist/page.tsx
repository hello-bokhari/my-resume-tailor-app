'use client';

import { useState } from 'react';

export default function TherapistPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `🧍‍♂️ You: ${userMessage}`]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({ entry: `[THERAPIST MODE]\n${userMessage}` }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, `🧠 Gemini: ${data.reply}`]);
    } catch {
      setMessages((prev) => [...prev, `⚠️ Gemini: Something went wrong.`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-white px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">🧠 Talk to Gemini</h1>
        <p className="text-center text-gray-600 mb-6">This is a private space to express what you are feeling. Gemini will reply like a caring therapist.</p>

        <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="bg-purple-50 p-3 rounded-md text-sm whitespace-pre-wrap">{msg}</div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 input input-bordered border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
            placeholder="Say what’s on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="btn bg-purple-600 hover:bg-purple-700 text-white"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}
