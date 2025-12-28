"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  manager_id: z.string().optional(),
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  role: {
    name: string;
  };
}

interface AddDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: DepartmentFormValues) => void;
}

export function AddDepartmentDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddDepartmentDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      manager_id: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employees");
      }

      setEmployees(data.employees || []);
    } catch (error) {
      toast.error("Failed to load employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async (data: DepartmentFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          manager_id: data.manager_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create department");
      }

      toast.success("Department created successfully");
      form.reset();
      onOpenChange(false);
      onSubmit?.(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Manager</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            loadingEmployees
                              ? "Loading managers..."
                              : "Select manager"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingEmployees ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading managers...
                        </div>
                      ) : employees.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                          No eligible managers found
                        </div>
                      ) : (
                        employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.first_name} {emp.last_name} - {emp.job_title} (
                            {emp.role.name})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                      placeholder="Brief description of the department"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Department
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
