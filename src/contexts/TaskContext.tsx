
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth, User } from "./AuthContext";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: User;
  assignedBy: User;
  priority: TaskPriority;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Generate a random date within the next 14 days
const getRandomFutureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
  return date.toISOString().split('T')[0];
};

const admin = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin" as const,
  avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=admin"
};

const user = {
  id: "2",
  name: "Test User",
  email: "user@example.com",
  role: "user" as const,
  avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=user"
};

// Mock initial tasks
const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Implement Login Page",
    description: "Create a user-friendly login page with email and password authentication.",
    assignedTo: user,
    assignedBy: admin,
    priority: "high",
    status: "completed",
    dueDate: getRandomFutureDate(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    title: "Design Dashboard UI",
    description: "Create wireframes and design mockups for the admin dashboard.",
    assignedTo: user,
    assignedBy: admin,
    priority: "medium",
    status: "in-progress",
    dueDate: getRandomFutureDate(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    title: "Implement Task Assignment",
    description: "Build functionality for admins to assign tasks to users with priorities.",
    assignedTo: user,
    assignedBy: admin,
    priority: "low",
    status: "pending",
    dueDate: getRandomFutureDate(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  useEffect(() => {
    // In a real app, we would fetch tasks from an API
    // For now, we'll use our mock data
    const savedTasks = localStorage.getItem("taskTrophyTasks");
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Failed to parse saved tasks:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("taskTrophyTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks for the current user
  const userTasks = tasks.filter(task => {
    if (!currentUser) return false;
    return currentUser.role === "admin" || task.assignedTo.id === currentUser.id;
  });

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    if (!currentUser) return;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
    toast.success("Task updated successfully");
  };

  const completeTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              status: "completed",
              completedAt: new Date().toISOString()
            } 
          : task
      )
    );
    toast.success("Task completed! Achievement unlocked!");
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userTasks,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        getTaskById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
