"use client";

import { motion } from "framer-motion";

// Update this interface in your useStore.ts as well to match MongoDB schema
export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  updates: string[]; // Array of strings for recent updates
  assignedTo: string;
  createdBy: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const isComplete = task.status === 'completed';
  
  // Helper functions for UI colors based on task data
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'overdue': return 'text-red-600 dark:text-red-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`relative p-6 rounded-3xl transition-all duration-300 ${isComplete ? 'opacity-60 grayscale' : 'opacity-100'} bg-white dark:bg-gray-900 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0b0f19,-8px_-8px_16px_#334155] border border-gray-100 dark:border-gray-800`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        
        {/* Title and Status */}
        <div>
          <h3 className={`text-xl font-bold ${isComplete ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </h3>
          <p className={`text-sm font-bold uppercase tracking-wide mt-1 ${getStatusColor(task.status)}`}>
            • {task.status.replace('-', ' ')}
          </p>
        </div>
        
        {/* Priority Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
      </div>
      
      {/* Deadlines and Updates */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Latest Update</h4>
            {task.updates && task.updates.length > 0 ? (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                {task.updates[task.updates.length - 1]}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-400 italic">No updates yet.</p>
            )}
          </div>

          <div className="sm:text-right flex-shrink-0">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deadline</h4>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}