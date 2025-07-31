// src/components/Layout.tsx
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf0f9] to-[#e3e3f3] dark:from-[#1a1a2e] dark:to-[#202038] text-gray-900 dark:text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-[#111827] shadow-xl rounded-xl p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}
