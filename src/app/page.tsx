// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-300 to-indigo-400 text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Mental Health Tracker</h1>
      <p className="mb-8 text-lg max-w-xl">
        Track your emotions, journal your thoughts, and receive personalized insights powered by Gemini AI.
      </p>

      <div className="flex gap-4">
        <Link href="/journal">
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow hover:scale-105 transition">
            Start Journaling
          </button>
        </Link>

        <Link href="/auth">
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition">
            Login
          </button>
        </Link>
      </div>
    </main>
  );
}
