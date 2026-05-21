"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

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

  const fetchDashboardData = async (managerId: string) => {
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
      
    } catch (error: any) {
      console.error(error);
      setFetchError("Could not load dashboard data. Please ensure your API folders are named correctly (/api/tasks and /api/users).");
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
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl text-blue-600">❖</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskMaster Manager</h1>
          </div>
          <ThemeToggle />
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Portal</h2>
            <p className="text-gray-500 text-sm mt-2">{isLogin ? "Sign in to manage your team." : "Register as a new manager."}</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            <button type="button" onClick={() => { setIsLogin(true); setAuthError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md ${isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow" : "text-gray-500"}`}>Login</button>
            <button type="button" onClick={() => { setIsLogin(false); setAuthError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md ${!isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow" : "text-gray-500"}`}>Register</button>
          </div>

          {authError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{authError}</div>}

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {!isLogin && (
              <input type="text" placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" />
            )}
            <input type="email" placeholder="Work Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" />
            <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" />
            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
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
      <nav className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-blue-600">❖</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manager Workspace</h1>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{manager.name}</p>
            </div>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg">Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Team Tasks</h2>
            <p className="text-gray-500 mt-2">You have created {tasks.length} tasks total.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">
            + Assign New Task
          </button>
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
          {displayedTasks.map(task => (
            <div key={task._id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{task.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-blue-600">👤 {task.assignedTo?.name || "Unknown User"}</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-bold capitalize">{task.priority} Priority</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 font-bold">
                DEADLINE: {new Date(task.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
          {displayedTasks.length === 0 && !fetchError && <p className="text-gray-500">No tasks in this view.</p>}
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