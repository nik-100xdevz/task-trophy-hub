import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTasks, Task } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm, { TaskFormValues } from "@/components/tasks/TaskForm";
import { Calendar, Edit, ArrowLeft, Check, XCircle } from "lucide-react";
import { format } from "date-fns";

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskById, updateTask, completeTask, deleteTask } = useTasks();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const task = getTaskById(taskId || "");
  
  if (!task) {
    return (
      <div className="container mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <p className="mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const handleUpdateTask = async (formData: TaskFormValues) => {
    if (!currentUser || !task) return;
    setIsSubmitting(true);
    
    try {
      const assignedUser = {
        id: formData.assignedToId,
        name: "Test User",
        email: "user@example.com",
        role: "user" as const,
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${formData.assignedToId}`
      };
      
      updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        assignedTo: assignedUser,
        priority: formData.priority,
        dueDate: formData.dueDate
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = () => {
    completeTask(task.id);
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    navigate("/dashboard");
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-red-100 text-red-800 border-red-300"
  };

  const statusColors = {
    "pending": "bg-slate-100 text-slate-800 border-slate-300",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
    "completed": "bg-emerald-100 text-emerald-800 border-emerald-300",
    "cancelled": "bg-gray-100 text-gray-800 border-gray-300"
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  const initialFormValues = {
    title: task.title,
    description: task.description,
    assignedToId: task.assignedTo.id,
    priority: task.priority,
    dueDate: task.dueDate
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority} priority
              </Badge>
              <Badge variant="outline" className={statusColors[task.status]}>
                {task.status.replace("-", " ")}
              </Badge>
            </div>
          </div>
          
          {(isAdmin || task.assignedTo.id === currentUser?.id) && task.status !== "completed" && (
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm 
                    onSubmit={handleUpdateTask} 
                    initialData={initialFormValues}
                    isSubmitting={isSubmitting} 
                  />
                </DialogContent>
              </Dialog>
              
              {task.status !== "completed" && (
                <Button variant="default" size="sm" onClick={handleCompleteTask}>
                  <Check className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
              
              {isAdmin && (
                <Button variant="destructive" size="sm" onClick={handleDeleteTask}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="bg-secondary p-4 rounded-md whitespace-pre-line">
              {task.description}
            </div>
            
            {task.completedAt && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
                <h3 className="text-sm font-semibold text-emerald-800 mb-1">Completed</h3>
                <p className="text-emerald-600">{formatDate(task.completedAt)}</p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Assigned To</h3>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={task.assignedTo.avatarUrl} alt={task.assignedTo.name} />
                    <AvatarFallback>{getInitials(task.assignedTo.name)}</AvatarFallback>
                  </Avatar>
                  <span>{task.assignedTo.name}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-1">Assigned By</h3>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={task.assignedBy.avatarUrl} alt={task.assignedBy.name} />
                    <AvatarFallback>{getInitials(task.assignedBy.name)}</AvatarFallback>
                  </Avatar>
                  <span>{task.assignedBy.name}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-1">Due Date</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-1">Created</h3>
                <span className="text-muted-foreground">{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
