import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'manager';
  token: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  updates: string[];
  assignedTo: string;
  createdBy: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // --- Auth State ---
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, tasks: [] }),

  // --- Task State ---
  tasks: [],
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t)
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
}));