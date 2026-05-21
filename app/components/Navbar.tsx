"use client";

import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; // Assuming ThemeToggle is in the same folder

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl text-blue-600 dark:text-blue-500">❖</span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            TaskMaster
          </h1>
        </div>
        
        {/* Desktop Nav Links & Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          <Link 
            href="/user" 
            className="hidden sm:inline-flex px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}