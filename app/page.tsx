"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar'; // Import the new Navbar component

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-500">
      
      {/* Extracted Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow pt-20"> {/* pt-20 offsets the fixed navbar */}
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center">
          
          {/* Background Image (Unblurred) */}
          <div className="absolute inset-0 w-full h-full z-0">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Team working together" 
               className="w-full h-full object-cover"
             />
             {/* A semi-transparent dark overlay is required so white text is readable over the sharp image */}
             <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-4xl px-6"
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight tracking-tight">
              Task Management Built for Modern Teams
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-medium mb-10 leading-relaxed max-w-3xl mx-auto">
              CollaborativeTaskManager is a collaborative web platform that enables teams to create projects, manage tasks, communicate efficiently, and achieve goals together through a simple and intuitive experience.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/user"
                className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Get Started for Free
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Standard Professional Footer */}
      <footer className="w-full bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl text-blue-600 dark:text-blue-500">❖</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">TaskMaster</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Empowering modern teams to achieve their goals through intuitive task management and seamless collaboration.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center md:text-left text-gray-500 dark:text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 CollaborativeTaskManager. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>All systems operational</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse mt-1"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}