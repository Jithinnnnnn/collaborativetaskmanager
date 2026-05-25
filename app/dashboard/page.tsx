"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import Navbar from "../components/Navbar";

export default function ManagerDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [manager, setManager] = useState<any>(null);
  
  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Data State
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [fetchError, setFetchError] = useState(""); // Added state to show fetch errors in UI
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Task Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", priority: "medium", deadline: "" });

  useEffect(() => {
    setIsMounted(true);
    const savedManager = localStorage.getItem("managerSession");
    if (savedManager) {
      const parsedManager = JSON.parse(savedManager);
      setManager(parsedManager);
      fetchDashboardData(parsedManager.id);
    }
  }, []);

  // Auto-refresh tasks every 5 seconds when manager is logged in
  useEffect(() => {
    if (!manager) return;

    const intervalId = setInterval(() => {
      fetchDashboardData(manager.id);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [manager]);

  const fetchDashboardData = async (managerId: string, showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    setFetchError("");
    try {
      // NOTE: Ensure your folder is named app/api/tasks/ (plural)
      const [userRes, taskRes] = await Promise.all([
        fetch("/api/users"),
        fetch(`/api/tasks?managerId=${managerId}`)
      ]);
      
      if (!userRes.ok || !taskRes.ok) {
        throw new Error("Failed to connect to the database API routes.");
      }

      const userData = await userRes.json();
      const taskData = await taskRes.json();
      
      if (userData.users) setUsers(userData.users);
      if (taskData.tasks) setTasks(taskData.tasks);
      setLastUpdated(new Date());
      
    } catch (error: any) {
      console.error(error);
      setFetchError("Could not load dashboard data. Please ensure your API folders are named correctly (/api/tasks and /api/users).");
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    if (manager) {
      fetchDashboardData(manager.id, true);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    try {
      const action = isLogin ? "login" : "register";
      const res = await fetch("/api/manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...authForm }),
      });
      
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          setManager(data.manager);
          localStorage.setItem("managerSession", JSON.stringify(data.manager));
          fetchDashboardData(data.manager.id);
        } else {
          setIsLogin(true);
          setAuthError("Registration successful! Please log in.");
        }
      } else {
        setAuthError(data.message);
      }
    } catch (err) {
      setAuthError("Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setManager(null);
    localStorage.removeItem("managerSession");
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo || !newTask.deadline) return;

    const taskPayload = {
      ...newTask,
      createdBy: manager.id,
      updates: ["Task assigned by manager."],
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });

      if (res.ok) {
        fetchDashboardData(manager.id);
        setNewTask({ title: "", description: "", assignedTo: "", priority: "medium", deadline: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to assign task");
    }
  };

  if (!isMounted) return null;

  // ==========================================
  // VIEW 1: MANAGER AUTHENTICATION (Login/Signup)
  // ==========================================
  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 relative">
        <Navbar />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Portal</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{isLogin ? "Sign in to manage your team." : "Register as a new manager."}</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            <button type="button" onClick={() => { setIsLogin(true); setAuthError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md ${isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-gray-400"}`}>Login</button>
            <button type="button" onClick={() => { setIsLogin(false); setAuthError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md ${!isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-gray-400"}`}>Register</button>
          </div>

          {authError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">{authError}</div>}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {!isLogin && (
              <input type="text" placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500" />
            )}
            <input type="email" placeholder="Work Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500" />
            <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE MANAGER DASHBOARD
  // ==========================================
  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const displayedTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 relative">
      <Navbar />
      
      {/* Manager Info Bar with Logout */}
      <div className="fixed top-20 w-full z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {manager.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{manager.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manager Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12 pt-40">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Team Tasks</h2>
            <p className="text-gray-500 mt-2">You have created {tasks.length} tasks total.</p>
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleManualRefresh} 
              disabled={isRefreshing}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg 
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              + Assign New Task
            </button>
          </div>
        </header>

        {/* Display Fetch Errors if they occur */}
        {fetchError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {fetchError}
          </div>
        )}

        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
          <button onClick={() => setActiveTab("pending")} className={`pb-4 text-sm font-bold relative ${activeTab === "pending" ? "text-blue-600" : "text-gray-500"}`}>
            Pending ({pendingTasks.length})
            {activeTab === "pending" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button onClick={() => setActiveTab("completed")} className={`pb-4 text-sm font-bold relative ${activeTab === "completed" ? "text-blue-600" : "text-gray-500"}`}>
            Completed ({completedTasks.length})
            {activeTab === "completed" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedTasks.map(task => (
              <motion.div 
                key={task._id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{task.title}</h3>
                  {task.status === "completed" && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 ml-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{task.description || "No description provided"}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-bold text-blue-600 dark:text-blue-400">👤 {task.assignedTo?.name || "Unknown User"}</span>
                  <span className={`px-3 py-1 rounded-full font-bold capitalize text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">
                      DEADLINE: {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {task.status === "completed" && (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓ COMPLETED</span>
                    )}
                  </div>
                  {task.updates && task.updates.length > 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2">
                      {task.updates[task.updates.length - 1]}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {displayedTasks.length === 0 && !fetchError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12 bg-white/60 dark:bg-gray-900/60 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                {activeTab === "pending" ? "No pending tasks" : "No completed tasks yet"}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl border border-gray-800 z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Assign Task</h2>
              <form onSubmit={handleAssignTask} className="flex flex-col gap-4">
                <input type="text" placeholder="Task Name" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none" />
                
                <select required value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                  <option value="" disabled>Select User from Database...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input type="date" required value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <button type="submit" className="w-full mt-2 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Submit Task</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}