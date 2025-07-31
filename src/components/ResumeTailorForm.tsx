
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
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center text-white">🎯 Resume Tailor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <textarea
          className="w-full p-4 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition h-64 resize-none"
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <textarea
          className="w-full p-4 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition h-64 resize-none"
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? 'Tailoring Your Resume...' : 'Tailor My Resume'}
      </button>
      {output && (
        <div className="bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-8 space-y-4">
          <h2 className="text-3xl font-bold text-center text-white">🔧 Tailored Output</h2>
          <div className="whitespace-pre-wrap p-4 bg-white/10 rounded-md max-h-96 overflow-y-auto">{output}</div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-md hover:from-green-600 hover:to-teal-600 transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {isSaving ? 'Saving Your Resume...' : 'Save Resume'}
          </button>
        </div>
      )}
    </div>
  );
}
