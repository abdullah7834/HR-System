'use client';

import { Plus, Building2, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, DataTable, Column, StatCard } from '@/components/shared';

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  location: string;
  status: 'active' | 'inactive';
}

const companies: Company[] = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology', employees: 250, location: 'San Francisco, CA', status: 'active' },
  { id: '2', name: 'Global Industries', industry: 'Manufacturing', employees: 1200, location: 'Chicago, IL', status: 'active' },
  { id: '3', name: 'Tech Solutions', industry: 'Software', employees: 85, location: 'Austin, TX', status: 'active' },
  { id: '4', name: 'Creative Agency', industry: 'Marketing', employees: 45, location: 'New York, NY', status: 'inactive' },
];

export default function CompaniesPage() {
  const columns: Column<Company>[] = [
    {
      id: 'name',
      header: 'Company',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.industry}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'employees',
      header: 'Employees',
      cell: (row) => <span className="text-slate-600">{row.employees}</span>,
    },
    {
      id: 'location',
      header: 'Location',
      cell: (row) => (
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-3 w-3" /> {row.location}
        </div>
      ),
    },
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
        title="Companies"
        description="Manage registered companies"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Organization' }, { label: 'Companies' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add Company</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Companies" value={companies.length} icon={Building2} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Active" value={companies.filter(c => c.status === 'active').length} icon={Building2} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Total Employees" value={companies.reduce((a, c) => a + c.employees, 0)} icon={Users} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Locations" value={new Set(companies.map(c => c.location.split(',')[1]?.trim())).size} icon={MapPin} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable data={companies} columns={columns} searchPlaceholder="Search companies..." />
      </div>
    </div>
  );
}
