'use client';

import { Plus, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';

interface KPI {
  id: string;
  name: string;
  category: string;
  target: string;
  weight: number;
  status: 'active' | 'inactive';
}

const kpis: KPI[] = [
  { id: '1', name: 'Sales Revenue', category: 'Sales', target: '$500,000', weight: 25, status: 'active' },
  { id: '2', name: 'Customer Satisfaction', category: 'Service', target: '90%', weight: 20, status: 'active' },
  { id: '3', name: 'Project Delivery', category: 'Operations', target: '95%', weight: 20, status: 'active' },
  { id: '4', name: 'Employee Retention', category: 'HR', target: '85%', weight: 15, status: 'active' },
  { id: '5', name: 'Code Quality', category: 'Engineering', target: '80%', weight: 10, status: 'active' },
  { id: '6', name: 'Training Completion', category: 'HR', target: '100%', weight: 10, status: 'inactive' },
];

export default function KPIsPage() {
  const columns: Column<KPI>[] = [
    {
      id: 'name',
      header: 'KPI',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.category}</p>
        </div>
      ),
    },
    { id: 'target', header: 'Target', cell: (row) => <span className="font-medium text-slate-900">{row.target}</span> },
    { id: 'weight', header: 'Weight', cell: (row) => `${row.weight}%` },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
        }`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="KPIs"
        description="Define and manage key performance indicators"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Performance' }, { label: 'KPIs' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add KPI</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <StatCard title="Total KPIs" value={kpis.length} icon={Target} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Active" value={kpis.filter(k => k.status === 'active').length} icon={TrendingUp} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Categories" value={new Set(kpis.map(k => k.category)).size} icon={Users} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable data={kpis} columns={columns} searchPlaceholder="Search KPIs..." />
      </div>
    </div>
  );
}
