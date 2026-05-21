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
  // For testing the dashboard, we will temporarily set a default logged-in manager.
  // Change 'user' to null when you are ready to test the login screen again.
  user: {
    id: 'user_123',
    name: 'Demo Manager',
    email: 'admin@taskmaster.com',
    role: 'manager',
    token: 'mock-token'
  },
  isAuthenticated: true,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // --- Task State (with mock initial data matching your new design) ---
  tasks: [
    { 
      id: 't1', 
      title: 'Design MongoDB Schema', 
      status: 'completed', 
      priority: 'high',
      deadline: '2026-05-15T00:00:00.000Z',
      updates: ['Created initial schema draft', 'Approved by lead developer'],
      assignedTo: 'user_123', 
      createdBy: 'user_123' 
    },
    { 
      id: 't2', 
      title: 'Implement Express API endpoints', 
      status: 'in-progress', 
      priority: 'high',
      deadline: '2026-05-25T00:00:00.000Z',
      updates: ['Started working on /auth routes'],
      assignedTo: 'user_123', 
      createdBy: 'user_123' 
    },
    { 
      id: 't3', 
      title: 'Update Zustand Store', 
      status: 'pending', 
      priority: 'medium',
      deadline: '2026-05-30T00:00:00.000Z',
      updates: [],
      assignedTo: 'user_123', 
      createdBy: 'user_123' 
    }
  ],
  
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