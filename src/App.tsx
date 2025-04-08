
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { ChatProvider } from "@/contexts/ChatContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

// Layout components
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TaskProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks/:taskId" element={<TaskDetails />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/achievements" element={<Achievements />} />
                </Route>
                
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
