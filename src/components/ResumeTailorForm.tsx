"use client";
import { useState } from 'react';

export default function ResumeTailorForm() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch('/api/save-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDescription: jobDesc, tailoredResume: output }),
    });
    setIsSaving(false);
    if (res.ok) {
      alert('Resume saved successfully!');
    } else {
      alert('Failed to save resume.');
    }
  };

  const handleSubmit = async () => {
    if (!resume || !jobDesc) return alert('Please fill in both fields.');
    setLoading(true);
    setOutput('');
    const res = await fetch('/api/tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDesc }),
    });
    const data = await res.json();
    setOutput(data?.tailoredResume || 'Failed to generate output.');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">🎯 Resume Tailor</h1>
      <textarea
        className="p-4 border rounded h-40"
        placeholder="Paste your resume here..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />
      <textarea
        className="p-4 border rounded h-40"
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Tailoring...' : 'Tailor My Resume'}
      </button>
      {output && (
        <div className="p-4 bg-white dark:bg-gray-900 border rounded whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">🔧 Tailored Output</h2>
          <pre>{output}</pre>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
          >
            {isSaving ? 'Saving...' : 'Save Resume'}
          </button>
        </div>
      )}
    </div>
  );
}