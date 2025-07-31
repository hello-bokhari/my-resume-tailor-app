"use client";
import { useState, useEffect } from 'react';

export default function ResumeTailorForm({
  initialResume = '',
  initialJobDescription = '',
  initialTailoredResume = '',
  onSaveSuccess,
}: {
  initialResume?: string;
  initialJobDescription?: string;
  initialTailoredResume?: string;
  onSaveSuccess?: () => void;
}) {
  const [resume, setResume] = useState(initialResume);
  const [jobDesc, setJobDesc] = useState(initialJobDescription);
  const [editorContent, setEditorContent] = useState(initialTailoredResume);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [step, setStep] = useState(initialTailoredResume ? 3 : 1); // New state for multi-step form

  // Effect to update state when initial props change (e.g., when viewing a different saved resume)
  useEffect(() => {
    setResume(initialResume);
    setJobDesc(initialJobDescription);
    setEditorContent(initialTailoredResume);
    setMatchScore(null); // Reset match score and suggestions for new view
    setImprovementSuggestions([]);
    setStep(initialTailoredResume ? 3 : 1);
  }, [initialResume, initialJobDescription, initialTailoredResume]);

  const handleNext = () => {
    if (step === 1 && !resume) {
      alert('Please paste your resume.');
      return;
    }
    if (step === 2 && !jobDesc) {
      alert('Please paste the job description.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tailoredResume: editorContent }),
        credentials: 'include',
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tailored_resume.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download DOCX.');
      }
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      alert('Error downloading DOCX.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch('/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jobDesc, tailoredResume: editorContent }),
        credentials: 'include',
      });
    setIsSaving(false);
    if (res.ok) {
      alert('Resume saved successfully!');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } else {
      alert('Failed to save resume.');
    }
  };

  const handleSubmit = async () => {
    if (!resume || !jobDesc) return alert('Please fill in both fields.');
    setLoading(true);
    const response = await fetch('/api/tailor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume, jobDescription: jobDesc }),
            });
    const data = await response.json();
    setEditorContent(data?.tailoredResume || '');
    setMatchScore(data?.matchScore || null);
    setImprovementSuggestions(data?.improvementSuggestions || []);
    setStep(3); // Move to step 3 to display results
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center text-white">🎯 Resume Tailor</h1>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Step 1: Paste Your Resume or Upload File</h2>
          <textarea
            className="w-full p-4 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition h-96 resize-none text-white"
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
          <input
            type="file"
            accept=".txt,.doc,.docx,.pdf" // Accept common document types
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setResume(event.target?.result as string);
                };
                reader.readAsText(file);
              }
            }}
            className="w-full p-4 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-white"
          />
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Step 2: Paste Job Description</h2>
          <textarea
            className="w-full p-4 bg-white/20 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition h-96 resize-none text-white"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div className="flex space-x-4">
            <button
              onClick={handlePrevious}
              className="flex-1 bg-gray-600 text-white font-bold py-4 rounded-md hover:bg-gray-700 transition-transform transform hover:scale-105"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && editorContent && (
        <div className="bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-8 space-y-4">
          <h2 className="text-3xl font-bold text-center text-white">🔧 Tailored Output</h2>
          {matchScore !== null && (
            <div className="text-center text-2xl font-bold text-white">
              Match Score: <span className="text-purple-400">{matchScore}%</span>
            </div>
          )}
          <div className="whitespace-pre-wrap p-4 bg-white/10 rounded-md max-h-96 overflow-y-auto text-white">
            {editorContent}
          </div>
          {improvementSuggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Suggestions for Improvement:</h3>
              <ul className="list-disc list-inside text-white">
                {improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-md hover:from-green-600 hover:to-teal-600 transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {isSaving ? 'Saving Your Resume...' : 'Save Resume'}
            </button>
            <button
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-md hover:from-blue-600 hover:to-cyan-600 transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {isDownloading ? 'Downloading...' : 'Download DOCX'}
            </button>
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full bg-gray-600 text-white font-bold py-4 rounded-md hover:bg-gray-700 transition-transform transform hover:scale-105 mt-4"
          >
            Start New Analysis
          </button>
        </div>
      )}
    </div>
  );
}
