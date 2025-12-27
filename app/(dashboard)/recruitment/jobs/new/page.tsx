'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full_time', 'part_time', 'contract', 'remote']),
  experience: z.string().min(1, 'Experience level is required'),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      type: 'full_time',
      experience: '',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: '',
    },
  });

  const onSubmit = (data: JobFormValues) => {
    console.log(data);
    toast.success('Job opening created successfully');
    router.push('/recruitment/jobs');
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/recruitment/jobs">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Create Job Opening</h1>
          <p className="text-sm text-slate-500">Post a new job opening for recruitment</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
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
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="lead">Lead / Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4">Salary Range (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-4">Job Details</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the required skills, qualifications, and experience..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => router.push('/recruitment/jobs')}>
                Cancel
              </Button>
              <Button type="submit">Create Job Opening</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
