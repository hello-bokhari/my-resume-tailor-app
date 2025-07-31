
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="bg-white/10 backdrop-blur-md shadow-lg fixed w-full top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-white">
              Resume Tailor
            </Link>
            <div className="space-x-6">
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <Link href="/login" className="hover:text-gray-300 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto pt-24 p-6">
        {children}
      </main>
      <footer className="bg-white/5 backdrop-blur-md text-center py-4 mt-12">
        <p>&copy; 2025 Resume Tailor. All rights reserved.</p>
      </footer>
    </div>
  );
}
