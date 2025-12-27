'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const holidaySchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['public', 'company', 'optional']),
});

type HolidayFormValues = z.infer<typeof holidaySchema>;

interface AddHolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: HolidayFormValues) => void;
}

export function AddHolidayDialog({ open, onOpenChange, onSubmit }: AddHolidayDialogProps) {
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: '',
      date: '',
      type: 'public',
    },
  });

  const handleSubmit = (data: HolidayFormValues) => {
    onSubmit?.(data);
    toast.success('Holiday added successfully');
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Christmas Day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public Holiday</SelectItem>
                        <SelectItem value="company">Company Holiday</SelectItem>
                        <SelectItem value="optional">Optional Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Holiday</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
