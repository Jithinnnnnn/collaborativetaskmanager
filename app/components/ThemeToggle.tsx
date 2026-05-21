"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for next-themes
  useEffect(() => setMounted(true), []);

  // Return a placeholder of the exact same size to prevent layout shift on load
  if (!mounted) {
    return <div className="w-[104px] h-[40px]"></div>; 
  }

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-4 py-2 rounded-xl bg-[#f3f4f6] dark:bg-[#1f2937] text-gray-700 dark:text-gray-300 font-medium shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#0b0f19,-4px_-4px_8px_#334155] hover:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:hover:shadow-[inset_4px_4px_8px_#0b0f19,inset_-4px_-4px_8px_#334155] transition-all duration-300 flex items-center gap-2"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}