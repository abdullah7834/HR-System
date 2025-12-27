'use client';

import { Plus, Star, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';

interface Review {
  id: string;
  employee: string;
  reviewer: string;
  period: string;
  rating: number;
  status: 'completed' | 'pending' | 'in_progress';
  completedAt?: string;
}

const reviews: Review[] = [
  { id: '1', employee: 'Sarah Miller', reviewer: 'John Davis', period: 'Q4 2024', rating: 4.5, status: 'completed', completedAt: '2024-12-20' },
  { id: '2', employee: 'Mike Johnson', reviewer: 'Sarah Miller', period: 'Q4 2024', rating: 4.2, status: 'completed', completedAt: '2024-12-18' },
  { id: '3', employee: 'Emily Chen', reviewer: 'John Davis', period: 'Q4 2024', rating: 0, status: 'pending' },
  { id: '4', employee: 'Alex Brown', reviewer: 'Lisa Wang', period: 'Q4 2024', rating: 0, status: 'in_progress' },
  { id: '5', employee: 'Tom Wilson', reviewer: 'Mike Johnson', period: 'Q4 2024', rating: 4.8, status: 'completed', completedAt: '2024-12-15' },
];

export default function ReviewsPage() {
  const columns: Column<Review>[] = [
    {
      id: 'employee',
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{row.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-slate-900">{row.employee}</span>
        </div>
      ),
    },
    { id: 'reviewer', header: 'Reviewer', cell: (row) => row.reviewer },
    { id: 'period', header: 'Period', cell: (row) => row.period },
    {
      id: 'rating',
      header: 'Rating',
      cell: (row) => row.rating > 0 ? (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          <span className="font-medium">{row.rating}</span>
        </div>
      ) : '-',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'completed' ? 'bg-green-50 text-green-700' : 
          row.status === 'in_progress' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
        }`}>{row.status.replace('_', ' ')}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Performance Reviews"
        description="Manage employee performance reviews"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Performance' }, { label: 'Reviews' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> New Review</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Reviews" value={reviews.length} icon={Star} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Completed" value={reviews.filter(r => r.status === 'completed').length} icon={Star} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Pending" value={reviews.filter(r => r.status === 'pending').length} icon={Calendar} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Avg Rating" value="4.5" icon={Star} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable data={reviews} columns={columns} searchPlaceholder="Search reviews..." />
      </div>
    </div>
  );
}
