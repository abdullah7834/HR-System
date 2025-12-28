"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  employment_type: z.string().optional(),
  date_of_joining: z.string().optional(),
  salary: z.string().optional(),
  department_id: z.string().optional(),
  role_ids: z.array(z.string()).min(1, "At least one role is required"),
  gender: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface Role {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract"];

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string | undefined;

  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      job_title: "",
      employment_type: "",
      date_of_joining: "",
      salary: "",
      department_id: "",
      role_ids: [],
      gender: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!employeeId) return;
    Promise.all([fetchDropdownData(), fetchEmployeeData()]);
  }, [employeeId]);

  const fetchDropdownData = async () => {
    try {
      const [rolesRes, deptsRes] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/departments"),
      ]);

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles || []);
      }

      if (deptsRes.ok) {
        const deptsData = await deptsRes.json();
        setDepartments(deptsData.departments || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load form data");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchEmployeeData = async () => {
    if (!employeeId) return;
    try {
      setLoadingEmployee(true);
      const response = await fetch(`/api/employees/${employeeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch employee");
      }

      const { employee, roles: employeeRoles } = data;

      setEmployeeCode(employee.employee_code);

      const selectedRoleIds = employeeRoles
        .map((er: any) => er.role_id.toString())
        .filter((id: string) => id);

      form.reset({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        phone: employee.phone || "",
        job_title: employee.job_title || "",
        employment_type: employee.employment_type || "",
        date_of_joining: employee.date_of_joining || "",
        salary: employee.salary?.toString() || "",
        department_id: employee.department_id?.toString() || "",
        role_ids: selectedRoleIds,
        gender: employee.gender || "",
        address: employee.address || "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error((error as Error).message);
      router.push("/employees");
    } finally {
      setLoadingEmployee(false);
    }
  };

  const handleSubmit = async (data: EmployeeFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update employee");
      }

      toast.success("Employee updated successfully");
      router.push(`/employees/${employeeId}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEmployee || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span className="text-slate-600">Loading employee data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Edit Employee
            </h1>
            <p className="text-sm text-slate-500 mt-1">Code: {employeeCode}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-slate-200">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 p-6"
            >
              {/* Basic Information */}
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          First Name *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Last Name *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Assignment */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Assignment
                </h2>
                <FormField
                  control={form.control}
                  name="role_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-3 block">
                        Roles *
                      </FormLabel>
                      <div className="space-y-2 border border-slate-200 rounded-md p-3 bg-slate-50 max-h-40 overflow-y-auto">
                        {roles.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No roles found
                          </p>
                        ) : (
                          roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center hover:bg-slate-100 p-1 rounded transition-colors"
                            >
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={field.value?.includes(
                                  role.id.toString()
                                )}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, role.id.toString()]
                                    : field.value.filter(
                                        (v) => v !== role.id.toString()
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                              <label
                                htmlFor={`role-${role.id}`}
                                className="ml-2 text-sm cursor-pointer font-medium"
                              >
                                {role.name}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Department */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Department
                </h2>
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Department
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                              No departments found
                            </div>
                          ) : (
                            departments.map((dept) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                              >
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employment Details */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Employment Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Employment Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EMPLOYMENT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="date_of_joining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Date of Joining
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Salary
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter employee address"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Employee
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
