'use client';

import { GraduationCap, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageHeader, StatCard } from '@/components/shared';

interface Training {
  id: string;
  name: string;
  category: string;
  progress: number;
  dueDate: string;
  status: 'in_progress' | 'completed' | 'not_started';
}

const myTrainings: Training[] = [
  { id: '1', name: 'Leadership Development', category: 'Management', progress: 65, dueDate: '2025-01-15', status: 'in_progress' },
  { id: '2', name: 'Communication Skills', category: 'Soft Skills', progress: 100, dueDate: '2024-12-01', status: 'completed' },
  { id: '3', name: 'Data Analytics Basics', category: 'Technical', progress: 30, dueDate: '2025-02-01', status: 'in_progress' },
  { id: '4', name: 'Project Management', category: 'Management', progress: 0, dueDate: '2025-03-01', status: 'not_started' },
];

export default function MyTrainingPage() {
  return (
    <div>
      <PageHeader
        title="My Training"
        description="Track your learning progress"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Training' }, { label: 'My Training' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Enrolled" value={myTrainings.length} icon={GraduationCap} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="In Progress" value={myTrainings.filter(t => t.status === 'in_progress').length} icon={PlayCircle} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Completed" value={myTrainings.filter(t => t.status === 'completed').length} icon={CheckCircle} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Hours Spent" value="24" icon={Clock} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {myTrainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg border border-slate-100 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-slate-900">{training.name}</h3>
                <p className="text-xs text-slate-500">{training.category}</p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                training.status === 'completed' ? 'bg-green-50 text-green-700' : 
                training.status === 'in_progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>{training.status.replace('_', ' ')}</span>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">Progress</span>
                <span className="font-medium text-slate-700">{training.progress}%</span>
              </div>
              <Progress value={training.progress} className="h-1.5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Due: {new Date(training.dueDate).toLocaleDateString()}</span>
              {training.status !== 'completed' && (
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  {training.status === 'not_started' ? 'Start' : 'Continue'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
