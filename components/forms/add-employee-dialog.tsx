// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const employeeSchema = z.object({
//   first_name: z.string().min(1, "First name is required"),
//   last_name: z.string().min(1, "Last name is required"),
//   email: z.string().email("Valid email is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   phone: z.string().optional(),
//   job_title: z.string().optional(),
//   employment_type: z.string().optional(),
//   date_of_joining: z.string().optional(),
//   salary: z.string().optional(),
//   department_id: z.string().optional(),
//   role_id: z.string().min(1, "Role is required"),
//   employee_code: z.string().optional(),
//   gender: z.string().optional(),
//   address: z.string().optional(),
// });

// type EmployeeFormValues = z.infer<typeof employeeSchema>;

// interface Role {
//   id: number;
//   name: string;
// }

// interface Department {
//   id: number;
//   name: string;
// }

// interface AddEmployeeDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit?: () => void;
// }

// const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract"];

// export function AddEmployeeDialog({
//   open,
//   onOpenChange,
//   onSubmit,
// }: AddEmployeeDialogProps) {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loadingData, setLoadingData] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const form = useForm<EmployeeFormValues>({
//     resolver: zodResolver(employeeSchema),
//     defaultValues: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       password: "",
//       phone: "",
//       job_title: "",
//       employment_type: "",
//       date_of_joining: "",
//       salary: "",
//       department_id: "",
//       role_id: "",
//       employee_code: "",
//       gender: "",
//       address: "",
//     },
//   });

//   useEffect(() => {
//     if (open) {
//       fetchDropdownData();
//     }
//   }, [open]);

//   const fetchDropdownData = async () => {
//     setLoadingData(true);
//     try {
//       const [rolesRes, deptsRes] = await Promise.all([
//         fetch("/api/roles"),
//         fetch("/api/departments"),
//       ]);

//       if (rolesRes.ok) {
//         const rolesData = await rolesRes.json();
//         setRoles(rolesData.roles || []);
//       }

//       if (deptsRes.ok) {
//         const deptsData = await deptsRes.json();
//         setDepartments(deptsData.departments || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to load form data");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const handleSubmit = async (data: EmployeeFormValues) => {
//     setSubmitting(true);
//     try {
//       const response = await fetch("/api/employees/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Failed to create employee");
//       }

//       toast.success("Employee created successfully");
//       form.reset();
//       onOpenChange(false);
//       onSubmit?.();
//     } catch (error) {
//       toast.error((error as Error).message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Add New Employee</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             {/* Basic Information */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="first_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter first name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="last_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter last name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Email and Password */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="employee@company.com"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password *</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="••••••••"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Role and Department */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="role_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Role *</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select role" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {loadingData ? (
//                           <div className="flex items-center justify-center py-6">
//                             <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                             Loading...
//                           </div>
//                         ) : roles.length === 0 ? (
//                           <div className="text-center py-6 text-sm text-muted-foreground">
//                             No roles found
//                           </div>
//                         ) : (
//                           roles.map((role) => (
//                             <SelectItem
//                               key={role.id}
//                               value={role.id.toString()}
//                             >
//                               {role.name}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="department_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Department</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select department" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {departments.length === 0 ? (
//                           <div className="text-center py-6 text-sm text-muted-foreground">
//                             No departments found
//                           </div>
//                         ) : (
//                           departments.map((dept) => (
//                             <SelectItem
//                               key={dept.id}
//                               value={dept.id.toString()}
//                             >
//                               {dept.name}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Employment Type */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="employment_type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Employment Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {EMPLOYMENT_TYPES.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="job_title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Job Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g., Senior Developer" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Contact and Personal Info */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone</FormLabel>
//                     <FormControl>
//                       <Input placeholder="+1 (555) 123-4567" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="gender"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Gender</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select gender" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Male">Male</SelectItem>
//                         <SelectItem value="Female">Female</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Additional Info */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="date_of_joining"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Date of Joining</FormLabel>
//                     <FormControl>
//                       <Input type="date" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="salary"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Salary</FormLabel>
//                     <FormControl>
//                       <Input type="number" placeholder="0.00" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="employee_code"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Employee Code</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., EMP001" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter address" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={submitting}>
//                 {submitting && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 Create Employee
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  employment_type: z.string().optional(),
  date_of_joining: z.string().optional(),
  salary: z.string().optional(),
  department_id: z.string().optional(),
  role_id: z.string().min(1, "Role is required"),
  employee_code: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Role {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddEmployeeDialogProps) {
  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      job_title: "",
      employment_type: "",
      date_of_joining: "",
      salary: "",
      department_id: "",
      role_id: "",
      employee_code: "",
      gender: "",
      address: "",
    },
  });

  // Load dropdown data when dialog opens
  useEffect(() => {
    if (open) {
      loadFormData();
    }
  }, [open]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const loadFormData = async () => {
    setIsLoadingData(true);
    try {
      const [rolesResponse, departmentsResponse] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/departments"),
      ]);

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData.roles || []);
      }

      if (departmentsResponse.ok) {
        const departmentsData = await departmentsResponse.json();
        setDepartments(departmentsData.departments || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load form data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/employees/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create employee");
      }

      toast.success("Employee created successfully");
      form.reset();
      onOpenChange(false);
      onSubmit?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Add New Employee
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the employee information below
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6 py-4"
            >
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENDER_OPTIONS.map((gender) => (
                              <SelectItem
                                key={gender}
                                value={gender}
                                className="text-sm"
                              >
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Account Credentials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@company.com"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Employment Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Employment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Role <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingData ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm">
                                  Loading roles...
                                </span>
                              </div>
                            ) : roles.length === 0 ? (
                              <div className="text-center py-6 text-sm text-slate-500">
                                No roles available
                              </div>
                            ) : (
                              roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={role.id.toString()}
                                  className="text-sm"
                                >
                                  {role.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Department
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.length === 0 ? (
                              <div className="text-center py-6 text-sm text-slate-500">
                                No departments available
                              </div>
                            ) : (
                              departments.map((dept) => (
                                <SelectItem
                                  key={dept.id}
                                  value={dept.id.toString()}
                                  className="text-sm"
                                >
                                  {dept.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Developer"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Employment Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EMPLOYMENT_TYPES.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="text-sm"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="employee_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Employee Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="EMP001"
                            className="h-9 text-sm font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_of_joining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Joining Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-600">
                          Salary
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50000"
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address Information
                </h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        Full Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, City, State, ZIP"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="pt-4 border-t mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleFormSubmit)}
            className="h-9 text-sm min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Employee"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
