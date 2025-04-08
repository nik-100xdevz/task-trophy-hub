
import AchievementBadge, { BadgeType } from "@/components/achievements/AchievementBadge";
import { useTasks } from "@/contexts/TaskContext";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: BadgeType;
  requirement: number;
  progress: number;
}

const Achievements = () => {
  const { userTasks } = useTasks();
  
  // Calculate task-related statistics
  const completedTasks = userTasks.filter(task => task.status === "completed").length;
  const highPriorityCompleted = userTasks.filter(task => task.status === "completed" && task.priority === "high").length;
  const tasksCompletedOnTime = userTasks.filter(task => {
    if (task.status !== "completed" || !task.completedAt) return false;
    const dueDate = new Date(task.dueDate);
    const completedDate = new Date(task.completedAt);
    return completedDate <= dueDate;
  }).length;
  
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Task Starter",
      description: "Complete your first task",
      type: "bronze",
      requirement: 1,
      progress: completedTasks
    },
    {
      id: "2",
      title: "Task Master",
      description: "Complete 5 tasks",
      type: "silver",
      requirement: 5,
      progress: completedTasks
    },
    {
      id: "3",
      title: "Task Champion",
      description: "Complete 10 tasks",
      type: "gold",
      requirement: 10,
      progress: completedTasks
    },
    {
      id: "4",
      title: "High Performer",
      description: "Complete 3 high-priority tasks",
      type: "silver",
      requirement: 3,
      progress: highPriorityCompleted
    },
    {
      id: "5",
      title: "Deadline Crusher",
      description: "Complete 5 tasks before their due date",
      type: "gold",
      requirement: 5,
      progress: tasksCompletedOnTime
    },
    {
      id: "6",
      title: "Ultimate Task Manager",
      description: "Complete 20 tasks",
      type: "platinum",
      requirement: 20,
      progress: completedTasks
    }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Achievements</h1>
      
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-3xl font-bold mb-1">{completedTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-3xl font-bold mb-1">{highPriorityCompleted}</div>
            <div className="text-sm text-muted-foreground">High Priority Completed</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-3xl font-bold mb-1">{tasksCompletedOnTime}</div>
            <div className="text-sm text-muted-foreground">On-Time Completions</div>
          </div>
        </div>
        
        <div className="h-4 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${Math.min(100, (completedTasks / 20) * 100)}%` }} 
          />
        </div>
        <div className="text-sm text-end mt-1 text-muted-foreground">
          {completedTasks}/20 tasks to Ultimate Task Manager
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            type={achievement.type}
            title={achievement.title}
            description={achievement.description}
            earned={achievement.progress >= achievement.requirement}
            progress={achievement.progress}
            maxProgress={achievement.requirement}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
