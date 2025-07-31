
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">AI-Powered Resume Tailor</h1>
      <p className="text-lg mb-8">Tailor your resume to any job description in seconds.</p>
      <div className="space-x-4">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/dashboard" className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
