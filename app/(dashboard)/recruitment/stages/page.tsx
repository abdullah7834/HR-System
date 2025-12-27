'use client';

import { Plus, Layers, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard } from '@/components/shared';

interface Stage {
  id: string;
  name: string;
  color: string;
  candidates: number;
  order: number;
}

const stages: Stage[] = [
  { id: '1', name: 'Applied', color: 'bg-slate-500', candidates: 45, order: 1 },
  { id: '2', name: 'Screening', color: 'bg-blue-500', candidates: 28, order: 2 },
  { id: '3', name: 'Interview', color: 'bg-purple-500', candidates: 15, order: 3 },
  { id: '4', name: 'Assessment', color: 'bg-amber-500', candidates: 8, order: 4 },
  { id: '5', name: 'Offer', color: 'bg-green-500', candidates: 4, order: 5 },
  { id: '6', name: 'Hired', color: 'bg-emerald-500', candidates: 12, order: 6 },
];

export default function StagesPage() {
  return (
    <div>
      <PageHeader
        title="Pipeline Stages"
        description="Configure recruitment pipeline stages"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Recruitment' }, { label: 'Stages' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add Stage</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <StatCard title="Total Stages" value={stages.length} icon={Layers} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Active Candidates" value={stages.reduce((a, s) => a + s.candidates, 0)} icon={Users} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Conversion Rate" value="26%" icon={ArrowRight} iconColor="text-green-600" iconBgColor="bg-green-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-100 p-4">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Pipeline Flow</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex items-center">
              <div className="min-w-[140px] p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium text-slate-900">{stage.name}</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{stage.candidates}</p>
                <p className="text-xs text-slate-500">candidates</p>
              </div>
              {idx < stages.length - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-300 mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-100 mt-4">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-medium text-slate-900">All Stages</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="font-medium text-slate-900">{stage.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">{stage.candidates} candidates</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
