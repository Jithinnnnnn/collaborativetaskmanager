"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useStore } from "../store/useStore"; 

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Protect the route: Redirect to the user login page if no user is found
    if (!user) {
      router.push("/user");
    } else {
      fetchUserTasks();
    }
  }, [user, router]);

  const fetchUserTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/tasks?userId=${user.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setTasks(data.tasks || []);
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          updates: {
            status: "completed",
            updates: [...(task?.updates || []), `Marked as completed by ${user?.name} on ${new Date().toLocaleDateString()}`]
          }
        })
      });

      if (res.ok) {
        // Refresh tasks after update
        fetchUserTasks();
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (!isMounted || !user) return null;

  // --- Filter Logic for Standard User ---
  // 1. Only grab tasks explicitly assigned to this logged-in user (already filtered by API)
  // 2. Split them into categories for a clean UI
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const completedTasks = tasks.filter(task => task.status === "completed");

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  // Check if task is overdue
  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      
      {/* Navbar Component */}
      <Navbar />

      {/* User Info Bar with Logout */}
      <div className="fixed top-20 w-full z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role} • {user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => { logout(); router.push("/"); }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-40">
        
        {/* Welcome Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium mt-1">
                    {user.email} • <span className="capitalize text-blue-600 dark:text-blue-400">{user.role}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 rounded-2xl border border-blue-200 dark:border-blue-800/30 text-center shadow-sm">
                <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">{pendingTasks.length}</p>
                <p className="text-xs sm:text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mt-1">Active</p>
              </div>
              <div className="flex-1 lg:flex-none bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 rounded-2xl border border-green-200 dark:border-green-800/30 text-center shadow-sm">
                <p className="text-3xl sm:text-4xl font-black text-green-600 dark:text-green-400">{completedTasks.length}</p>
                <p className="text-xs sm:text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mt-1">Done</p>
              </div>
              <div className="flex-1 lg:flex-none bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 rounded-2xl border border-purple-200 dark:border-purple-800/30 text-center shadow-sm">
                <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">{tasks.length}</p>
                <p className="text-xs sm:text-sm font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mt-1">Total</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading your tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-center"
          >
            {error}
          </motion.div>
        )}

        {!isLoading && !error && (
          <>
            {/* Pending Tasks Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Active Tasks</h2>
                <span className="ml-auto text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {pendingTasks.length} {pendingTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {pendingTasks.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-16 bg-white/60 dark:bg-gray-900/60 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700"
                    >
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">All caught up!</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">You have no pending tasks.</p>
                    </motion.div>
                  ) : (
                    pendingTasks.map((task) => (
                      <motion.div 
                        key={task._id} 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {task.description || "No description provided"}
                            </p>
                          </div>
                        </div>

                        {/* Task Meta Info */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()} PRIORITY
                          </span>
                          {isOverdue(task.deadline) && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse">
                              ⚠️ OVERDUE
                            </span>
                          )}
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold">Due:</span>
                          <span className={isOverdue(task.deadline) ? "text-red-600 dark:text-red-400 font-bold" : ""}>
                            {new Date(task.deadline).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => handleMarkComplete(task._id)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Completed Tasks Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Completed Tasks</h2>
                <span className="ml-auto text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {completedTasks.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-16 bg-white/60 dark:bg-gray-900/60 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700"
                    >
                      <div className="text-6xl mb-4">📋</div>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">No completed tasks yet</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Complete your first task to see it here!</p>
                    </motion.div>
                  ) : (
                    completedTasks.map((task) => (
                      <motion.div 
                        key={task._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-through decoration-gray-400">
                                {task.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {task.description || "No description provided"}
                            </p>
                          </div>
                        </div>

                        {/* Task Meta Info */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                            ✓ COMPLETED
                          </span>
                        </div>

                        {/* Completion Info */}
                        <div className="text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800">
                          {task.updates && task.updates.length > 0 && (
                            <p className="italic">{task.updates[task.updates.length - 1]}</p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}