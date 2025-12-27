'use client';

import { DollarSign, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';

interface PayrollRun {
  id: string;
  period: string;
  employees: number;
  totalAmount: number;
  status: 'completed' | 'pending' | 'processing';
  processedAt?: string;
}

const payrollRuns: PayrollRun[] = [
  { id: '1', period: 'December 2024', employees: 45, totalAmount: 185000, status: 'completed', processedAt: '2024-12-25' },
  { id: '2', period: 'November 2024', employees: 44, totalAmount: 180000, status: 'completed', processedAt: '2024-11-25' },
  { id: '3', period: 'October 2024', employees: 43, totalAmount: 175000, status: 'completed', processedAt: '2024-10-25' },
  { id: '4', period: 'September 2024', employees: 42, totalAmount: 172000, status: 'completed', processedAt: '2024-09-25' },
];

export default function PayrollPage() {
  const columns: Column<PayrollRun>[] = [
    {
      id: 'period',
      header: 'Period',
      cell: (row) => <span className="font-medium text-slate-900">{row.period}</span>,
    },
    { id: 'employees', header: 'Employees', cell: (row) => row.employees },
    {
      id: 'totalAmount',
      header: 'Total Amount',
      cell: (row) => <span className="font-medium text-green-600">${row.totalAmount.toLocaleString()}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'completed' ? 'bg-green-50 text-green-700' : 
          row.status === 'processing' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
        }`}>{row.status}</span>
      ),
    },
    {
      id: 'processedAt',
      header: 'Processed',
      cell: (row) => row.processedAt ? new Date(row.processedAt).toLocaleDateString() : '-',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Manage payroll runs and salary processing"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Payroll' }]}
        actions={<Button size="sm" className="h-8 text-xs"><DollarSign className="h-3.5 w-3.5 mr-1" /> Run Payroll</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="This Month" value="$185,000" icon={DollarSign} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Employees" value="45" icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Next Run" value="Jan 25" icon={Calendar} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Payslips" value="540" icon={FileText} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-900">Payroll History</h3>
        </div>
        <DataTable data={payrollRuns} columns={columns} searchable={false} />
      </div>
    </div>
  );
}
