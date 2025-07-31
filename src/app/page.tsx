"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [tailored, setTailored] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleTailor = async () => {
    if (!resume || !jobDesc) return;
    setLoading(true);
    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDesc }),
      });

      const data = await response.json();
      setTailored(data.result || "No response received.");
    } catch (err) {
      setTailored("❌ Error tailoring resume.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Layout>
        <h2 className="text-xl text-center">🔒 Please log in to access your dashboard.</h2>
        <Button onClick={() => (window.location.href = "/login")} className="mt-4 w-full">
          Go to Login
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎯 Resume Tailor</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="text-sm font-semibold">Paste your Resume</label>
          <textarea
            rows={6}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Paste your resume text here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Paste Job Description</label>
          <textarea
            rows={6}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        <Button onClick={handleTailor} disabled={loading}>
          {loading ? "Tailoring..." : "Tailor Resume"}
        </Button>

        {tailored && (
          <div>
            <label className="text-sm font-semibold">🎨 Tailored Resume Output</label>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap mt-2 text-sm">
              {tailored}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
