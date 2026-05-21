"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar"; // Importing the new Navbar component
import { useStore } from "../store/useStore"; 

export default function UserAuthPage() {
  const router = useRouter();
  const loginAction = useStore((state) => state.login);
  
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN API CALL ---
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields.");
          setIsLoading(false);
          return;
        }
        
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await res.json();

        if (res.ok) {
          loginAction(data.user); 
          router.push("/userdashboard");
        } else {
          setError(data.message || "Login failed.");
        }

      } else {
        // --- REGISTRATION API CALL ---
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError("Please fill in all fields.");
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // Auto-login after successful registration
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });
          const loginData = await loginRes.json();
          
          if (loginRes.ok) {
            loginAction(loginData.user);
            router.push("/userdashboard");
          }
        } else {
          setError(data.message || "Registration failed.");
        }
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500 p-6 relative pt-24">
      
      {/* Extracted Navbar Component */}
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {isLogin ? "Enter your details to access your workspace." : "Join your team and start collaborating today."}
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          <button type="button" onClick={() => { setIsLogin(true); setError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            Sign In
          </button>
          <button type="button" onClick={() => { setIsLogin(false); setError(""); }} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            Sign Up
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div key="name-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50" />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50" />
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div key="confirm-password-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" disabled={isLoading} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50" />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={isLoading} className="w-full mt-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center">
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}