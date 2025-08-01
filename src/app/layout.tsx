// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mental Health Tracker",
  description: "Journaling and AI-powered therapy support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-purple-100 to-white min-h-screen text-gray-900`}
      >
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-purple-200">
          <Link href="/..">
          <h1 className="text-xl font-bold text-purple-700">NeuralNote</h1>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/journal"
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              Journal
            </Link>
            <Link
              href="/therapist"
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              Therapist
            </Link>
            <Link
              href="/history"
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              History
            </Link>
          </div>
        </nav>
        <main className="w-full min-h-screen px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
