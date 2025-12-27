'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Users, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader, StatCard, DataTable, Column, StatusBadge } from '@/components/shared';
import { employees } from '@/lib/mock-data';
import { Employee } from '@/types';

export default function EmployeesPage() {
  const router = useRouter();

  const columns: Column<Employee>[] = [
    {
      id: 'name',
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={row.avatar} />
            <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{row.firstName[0]}{row.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { id: 'department', header: 'Department', cell: (row) => row.department },
    { id: 'position', header: 'Position', cell: (row) => row.position },
    { id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      id: 'joinDate',
      header: 'Joined',
      cell: (row) => new Date(row.joinDate).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Employees' }]}
        actions={
          <Link href="/employees/new">
            <Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add Employee</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Employees" value={employees.length} icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Active" value={employees.filter(e => e.status === 'active').length} icon={UserCheck} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="On Leave" value={employees.filter(e => e.status === 'on_leave').length} icon={Users} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Inactive" value={employees.filter(e => e.status === 'inactive').length} icon={UserX} iconColor="text-slate-600" iconBgColor="bg-slate-100" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={employees}
          columns={columns}
          searchPlaceholder="Search employees..."
          onRowClick={(row) => router.push(`/employees/${row.id}`)}
        />
      </div>
    </div>
  );
}
