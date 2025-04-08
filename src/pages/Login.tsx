
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Error toast is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    
    try {
      await login("admin@example.com", "admin123");
      toast.success("Logged in as admin");
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-primary rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4">
              TT
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Log in to Task Trophy</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Please enter your details</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            Demo Login (Admin)
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
