'use client';

import { Plus, GraduationCap, Users, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';

interface Program {
  id: string;
  name: string;
  category: string;
  duration: string;
  participants: number;
  status: 'active' | 'upcoming' | 'completed';
}

const programs: Program[] = [
  { id: '1', name: 'Leadership Development', category: 'Management', duration: '8 weeks', participants: 25, status: 'active' },
  { id: '2', name: 'Technical Skills Bootcamp', category: 'Technical', duration: '4 weeks', participants: 40, status: 'active' },
  { id: '3', name: 'Communication Skills', category: 'Soft Skills', duration: '2 weeks', participants: 60, status: 'completed' },
  { id: '4', name: 'Project Management', category: 'Management', duration: '6 weeks', participants: 30, status: 'upcoming' },
  { id: '5', name: 'Data Analytics', category: 'Technical', duration: '5 weeks', participants: 20, status: 'active' },
];

export default function ProgramsPage() {
  const columns: Column<Program>[] = [
    {
      id: 'name',
      header: 'Program',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    { id: 'duration', header: 'Duration', cell: (row) => row.duration },
    { id: 'participants', header: 'Participants', cell: (row) => row.participants },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'active' ? 'bg-green-50 text-green-700' : 
          row.status === 'upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
        }`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Training Programs"
        description="Manage training and development programs"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Training' }, { label: 'Programs' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add Program</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Programs" value={programs.length} icon={BookOpen} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Active" value={programs.filter(p => p.status === 'active').length} icon={GraduationCap} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Participants" value={programs.reduce((a, p) => a + p.participants, 0)} icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Upcoming" value={programs.filter(p => p.status === 'upcoming').length} icon={Clock} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable data={programs} columns={columns} searchPlaceholder="Search programs..." />
      </div>
    </div>
  );
}
