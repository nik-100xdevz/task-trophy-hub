
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, User, UserRole } from "@/contexts/AuthContext";
import { TaskPriority } from "@/contexts/TaskContext";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock users for assignment
const mockUsers = [
  {
    id: "2",
    name: "Test User",
    email: "user@example.com",
    role: "user" as UserRole,
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=user"
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user" as UserRole,
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=jane"
  },
  {
    id: "4",
    name: "John Smith",
    email: "john@example.com",
    role: "user" as UserRole,
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=john"
  }
];

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  initialData?: Partial<TaskFormValues>;
  isSubmitting?: boolean;
}

const taskFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assignedToId: z.string().min(1, "Please select a user"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Please select a due date"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

const TaskForm = ({ onSubmit, initialData, isSubmitting }: TaskFormProps) => {
  const { currentUser } = useAuth();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      assignedToId: initialData?.assignedToId || "",
      priority: initialData?.priority || "medium",
      dueDate: initialData?.dueDate || new Date().toISOString().split("T")[0],
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    if (!currentUser) return;
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter detailed task description" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : initialData ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
