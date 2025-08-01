'use client';
import { useState } from 'react';

export default function EntryForm() {
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      body: JSON.stringify({ entry }),
    });
    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full h-40 p-2 border"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="How are you feeling today?"
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white" onClick={handleSubmit}>
        Get Insight
      </button>
      {response && <div className="mt-4 p-2 border bg-gray-100">{response}</div>}
    </div>
  );
}
