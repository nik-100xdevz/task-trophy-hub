
import { Link } from "react-router-dom";
import { Task } from "@/contexts/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Edit, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
}

const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const priorityClasses = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high"
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={`task-card ${priorityClasses[task.priority]} mb-4 animate-fade-in`}>
      <div className="flex justify-between items-start mb-2">
        <Link to={`/tasks/${task.id}`} className="text-lg font-medium hover:text-primary transition-colors">
          {task.title}
        </Link>
        <div className="flex space-x-2">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className={statusColors[task.status]}>
            {task.status.replace("-", " ")}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center text-sm mb-3">
        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-muted-foreground">Due: {task.dueDate}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={task.assignedTo.avatarUrl} alt={task.assignedTo.name} />
            <AvatarFallback>{getInitials(task.assignedTo.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{task.assignedTo.name}</span>
        </div>
        
        <div className="flex space-x-2">
          {task.status !== "completed" && onComplete && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onComplete(task.id)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          
          <Link to={`/tasks/${task.id}`}>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
