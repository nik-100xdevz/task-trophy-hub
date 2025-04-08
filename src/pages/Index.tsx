
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="bg-primary rounded-xl w-20 h-20 mx-auto flex items-center justify-center text-primary-foreground font-bold text-3xl mb-4">
            TT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-4">
            Task Trophy Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage tasks, collaborate with your team, and earn achievements for your accomplishments
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="font-semibold">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-muted-foreground">Easily create, assign, and track tasks with priority levels</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Chat</h3>
            <p className="text-muted-foreground">Collaborate with your team in real-time group chat</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Achievement Badges</h3>
            <p className="text-muted-foreground">Earn badges and recognition for completing tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
