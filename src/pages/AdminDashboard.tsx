
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task } from "@/contexts/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "@/components/tasks/TaskForm";
import { Plus, User, CheckCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
  
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateTask = async (formData: TaskFormValues) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    try {
      // Find the assigned user by ID (in a real app, this would be an API call)
      const assignedUser = {
        id: formData.assignedToId,
        name: "Test User",
        email: "user@example.com",
        role: "user",
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${formData.assignedToId}`
      };
      
      addTask({
        title: formData.title,
        description: formData.description,
        assignedTo: assignedUser,
        assignedBy: currentUser,
        priority: formData.priority,
        dueDate: formData.dueDate
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks + inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks} pending, {inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Total tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-lg text-muted-foreground">No tasks created yet</p>
              <Button 
                variant="link" 
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                Create your first task
              </Button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {tasks.filter(t => t.status !== "completed").length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-lg text-muted-foreground">No active tasks</p>
            </div>
          ) : (
            tasks
              .filter(t => t.status !== "completed")
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {tasks.filter(t => t.status === "completed").length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-lg text-muted-foreground">No completed tasks yet</p>
            </div>
          ) : (
            tasks
              .filter(t => t.status === "completed")
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
