
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task } from "@/contexts/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "@/components/tasks/TaskForm";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { userTasks, addTask, completeTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const pendingTasks = userTasks.filter(task => task.status === "pending" || task.status === "in-progress");
  const completedTasks = userTasks.filter(task => task.status === "completed");

  const handleCreateTask = async (formData: TaskFormValues) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    try {
      // Find the assigned user by ID (in a real app, this would be an API call)
      const assignedUser = {
        id: formData.assignedToId,
        name: "Test User",
        email: "user@example.com",
        role: "user" as const, // Fixed: explicitly typed as UserRole
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

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pending">
            Active ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-lg text-muted-foreground">No active tasks</p>
              <Button 
                variant="link" 
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                Create your first task
              </Button>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleCompleteTask} 
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-lg text-muted-foreground">No completed tasks yet</p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
