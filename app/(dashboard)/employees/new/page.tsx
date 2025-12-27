'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { departments } from '@/lib/mock-data';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  joinDate: z.string().min(1, 'Join date is required'),
  salary: z.string().optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contract']),
  reportingTo: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      joinDate: '',
      salary: '',
      employmentType: 'full_time',
      reportingTo: '',
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    console.log(data);
    toast.success('Employee added successfully');
    router.push('/employees');
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/employees">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Add New Employee</h1>
          <p className="text-sm text-slate-500">Fill in the details to add a new employee</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join Date</FormLabel>
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
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportingTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="1">Sarah Miller</SelectItem>
                          <SelectItem value="2">John Davis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => router.push('/employees')}>
                Cancel
              </Button>
              <Button type="submit">Add Employee</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
