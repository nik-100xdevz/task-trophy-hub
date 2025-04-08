
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const { userTasks } = useTasks();
  
  if (!currentUser) return null;
  
  // Calculate task-related statistics
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(task => task.status === "completed").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-xl">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <CardDescription className="flex justify-center mt-2">
                <Badge variant="outline" className="capitalize">
                  {currentUser.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">{currentUser.email}</p>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your task management statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">{completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">{completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Task Completion</h3>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${completionRate}%` }} 
                  />
                </div>
                <div className="text-xs text-end text-muted-foreground">
                  {completedTasks} out of {totalTasks} tasks completed
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Account Type</h3>
                <p className="capitalize">{currentUser.role} Account</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.role === "admin" ? (
                    <>
                      <Badge className="bg-primary text-primary-foreground">Assign Tasks</Badge>
                      <Badge className="bg-primary text-primary-foreground">Manage Users</Badge>
                      <Badge className="bg-primary text-primary-foreground">View Reports</Badge>
                      <Badge className="bg-primary text-primary-foreground">Admin Dashboard</Badge>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-primary text-primary-foreground">Manage Assigned Tasks</Badge>
                      <Badge className="bg-primary text-primary-foreground">Team Chat</Badge>
                      <Badge className="bg-primary text-primary-foreground">Earn Achievements</Badge>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
