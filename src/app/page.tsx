
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-20 px-6">
      <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Your Dream Job Awaits
      </h1>
      <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
        Effortlessly tailor your resume to any job description and land more interviews. Our AI-powered tool helps you stand out from the competition.
      </p>
      <Link href="/dashboard" className="bg-purple-600 text-white font-bold px-8 py-4 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105">
        Get Started Now
      </Link>
    </div>
  );
}
