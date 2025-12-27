'use client';

import { Plus, Calendar, Clock, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';

interface Interview {
  id: string;
  candidate: string;
  position: string;
  date: string;
  time: string;
  type: 'video' | 'onsite' | 'phone';
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const interviews: Interview[] = [
  { id: '1', candidate: 'John Smith', position: 'Senior Developer', date: '2024-12-28', time: '10:00 AM', type: 'video', interviewer: 'Sarah Miller', status: 'scheduled' },
  { id: '2', candidate: 'Emily Chen', position: 'Product Designer', date: '2024-12-28', time: '2:00 PM', type: 'onsite', interviewer: 'Mike Johnson', status: 'scheduled' },
  { id: '3', candidate: 'Alex Brown', position: 'Marketing Manager', date: '2024-12-29', time: '11:00 AM', type: 'video', interviewer: 'Lisa Wang', status: 'scheduled' },
  { id: '4', candidate: 'Maria Garcia', position: 'HR Specialist', date: '2024-12-27', time: '3:00 PM', type: 'phone', interviewer: 'Tom Davis', status: 'completed' },
];

export default function InterviewsPage() {
  const columns: Column<Interview>[] = [
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{row.candidate.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">{row.candidate}</p>
            <p className="text-xs text-slate-500">{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'datetime',
      header: 'Date & Time',
      cell: (row) => (
        <div className="text-sm">
          <p className="text-slate-900">{new Date(row.date).toLocaleDateString()}</p>
          <p className="text-xs text-slate-500">{row.time}</p>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => (
        <div className="flex items-center gap-1 text-slate-600">
          {row.type === 'video' ? <Video className="h-3 w-3" /> : row.type === 'onsite' ? <MapPin className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          <span className="capitalize">{row.type}</span>
        </div>
      ),
    },
    { id: 'interviewer', header: 'Interviewer', cell: (row) => row.interviewer },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 
          row.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
        }`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Manage interview schedules"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Recruitment' }, { label: 'Interviews' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Schedule Interview</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Today" value={interviews.filter(i => i.date === '2024-12-28').length} icon={Calendar} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="This Week" value={interviews.filter(i => i.status === 'scheduled').length} icon={Clock} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Completed" value={interviews.filter(i => i.status === 'completed').length} icon={Calendar} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Video Calls" value={interviews.filter(i => i.type === 'video').length} icon={Video} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-100">
        <DataTable data={interviews} columns={columns} searchPlaceholder="Search interviews..." />
      </div>
    </div>
  );
}
