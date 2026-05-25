"use client";

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl text-blue-600 dark:text-blue-500">❖</span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            TaskMaster
          </h1>
        </Link>
        
        {/* Desktop Nav Links & Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="hidden sm:inline-flex px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          
          <ThemeToggle />
          
          <Link 
            href="/dashboard" 
            className="hidden sm:inline-flex px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Manager
          </Link>
          
          <Link 
            href="/user" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            User
          </Link>
        </div>
      </div>
    </nav>
  );
}
