"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import TaskCard from "../components/TaskCard";
import { useStore } from "../store/useStore"; 

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout, tasks, updateTask } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Protect the route: Redirect to the user login page if no user is found
    if (!user) {
      router.push("/user");
    }
  }, [user, router]);

  if (!isMounted || !user) return null;

  // --- Filter Logic for Standard User ---
  // 1. Only grab tasks explicitly assigned to this logged-in user
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  
  // 2. Split them into categories for a clean UI
  const pendingTasks = myTasks.filter(task => task.status !== "completed");
  const completedTasks = myTasks.filter(task => task.status === "completed");

  // Allow users to mark their own tasks as complete
  const handleMarkComplete = (taskId: string) => {
    updateTask(taskId, { 
      status: "completed", 
      // Safely append to the existing updates array
      updates: [...(tasks.find(t => t.id === taskId)?.updates || []), "Marked as completed by user."] 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 relative">
      
      {/* Top Navbar */}
      <nav className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-blue-600 dark:text-blue-500">❖</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Workspace</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            {/* Logged in User Display */}
            <div className="hidden md:flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">{user.role}</p>
              </div>
              <button 
                onClick={() => { logout(); router.push("/"); }}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Welcome Hero Section */}
        <div className="mb-12 bg-white dark:bg-gray-900 rounded-[32px] p-8 md:p-12 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0b0f19,-8px_-8px_16px_#334155] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Here is your current task overview for today.
            </p>
          </div>
          
          {/* Quick Stats Blocks */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-blue-50 dark:bg-blue-900/20 px-8 py-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center shadow-inner">
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{pendingTasks.length}</p>
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mt-1">Pending</p>
            </div>
            <div className="flex-1 md:flex-none bg-green-50 dark:bg-green-900/20 px-8 py-4 rounded-2xl border border-green-100 dark:border-green-800/30 text-center shadow-inner">
              <p className="text-4xl font-black text-green-600 dark:text-green-400">{completedTasks.length}</p>
              <p className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mt-1">Completed</p>
            </div>
          </div>
        </div>

        {/* Pending Tasks Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Action Required</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {pendingTasks.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">You have no pending tasks. Great job!</p>
                </div>
              ) : (
                pendingTasks.map(task => (
                  <motion.div 
                    key={task.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    <TaskCard task={task} />
                    
                    {/* Quick Action Button overlaying the card slightly */}
                    <button 
                      onClick={() => handleMarkComplete(task.id)}
                      className="absolute bottom-6 right-6 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors shadow-sm"
                    >
                      Mark Complete ✓
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Completed Tasks Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Completed</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {completedTasks.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No completed tasks yet.</p>
                </div>
              ) : (
                completedTasks.map(task => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
}