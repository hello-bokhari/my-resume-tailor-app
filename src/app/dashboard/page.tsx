
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import ResumeTailorForm from '../../components/ResumeTailorForm';
import { User } from '@supabase/supabase-js';

interface ResumeEntry {
  _id: string;
  resume: string;
  jobDescription: string;
  tailoredResume: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedResume, setSelectedResume] = useState<ResumeEntry | null>(null);

  const fetchResumes = async (userId: string) => {
    setLoadingResumes(true);
    console.log('Fetching resumes for user:', userId);
    try {
      const res = await fetch('/api/get-resumes', { credentials: 'include' });
      if (res.ok) {
        const fetchedResumes: ResumeEntry[] = await res.json();
        setResumes(fetchedResumes);
      } else {
        console.error('Failed to fetch resumes:', await res.text());
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchResumes(session.user.id);
      } else {
        setResumes([]); // Clear resumes if user logs out
      }
    });

    // Initial check for user session on component mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchResumes(session.user.id);
      }
    };
    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const res = await fetch(`/api/delete-resume?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Resume deleted successfully!');
        fetchResumes(); // Refresh the list
      } else {
        alert('Failed to delete resume.');
        console.error('Failed to delete resume:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Error deleting resume.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center text-white">
        <p>You must be logged in to view this page.</p>
        <a href="/login" className="text-blue-400 hover:underline">Login</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome, {user.email}</h1>

      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Tailor a New Resume</h2>
        <ResumeTailorForm />
      </div>

      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Your Saved Resumes</h2>
        {loadingResumes ? (
          <p className="text-white">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-white">No resumes saved yet.</p>
        ) : (
          <div className="space-y-4">
            {resumes.map((resumeEntry) => (
              <div key={resumeEntry._id} className="bg-white/20 p-4 rounded-md flex justify-between items-center">
                <span className="text-white">Saved on: {new Date(resumeEntry.createdAt).toLocaleDateString()}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedResume(resumeEntry)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(resumeEntry._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedResume(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">View/Edit Resume</h2>
            <ResumeTailorForm
              initialResume={selectedResume.resume}
              initialJobDescription={selectedResume.jobDescription}
              initialTailoredResume={selectedResume.tailoredResume}
              onSaveSuccess={fetchResumes} // Callback to refresh list after save
            />
          </div>
        </div>
      )}
    </div>
  );
}

