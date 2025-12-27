'use client';

import { Plus, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, DataTable, Column, StatCard } from '@/components/shared';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: number;
}

const roles: Role[] = [
  { id: '1', name: 'Super Admin', description: 'Full system access', users: 2, permissions: 45 },
  { id: '2', name: 'Company Admin', description: 'Company-wide management', users: 5, permissions: 38 },
  { id: '3', name: 'HR Manager', description: 'HR operations management', users: 8, permissions: 28 },
  { id: '4', name: 'Recruiter', description: 'Recruitment management', users: 12, permissions: 15 },
  { id: '5', name: 'Project Manager', description: 'Project and task management', users: 15, permissions: 18 },
  { id: '6', name: 'Employee', description: 'Basic employee access', users: 180, permissions: 8 },
];

export default function RolesPage() {
  const columns: Column<Role>[] = [
    {
      id: 'name',
      header: 'Role',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.description}</p>
          </div>
        </div>
      ),
    },
    { id: 'users', header: 'Users', cell: (row) => row.users },
    { id: 'permissions', header: 'Permissions', cell: (row) => row.permissions },
  ];

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and access levels"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Organization' }, { label: 'Roles' }]}
        actions={<Button size="sm" className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1" /> Add Role</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <StatCard title="Total Roles" value={roles.length} icon={Shield} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatCard title="Total Users" value={roles.reduce((a, r) => a + r.users, 0)} icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="Permissions" value={45} icon={Shield} iconColor="text-green-600" iconBgColor="bg-green-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-100">
        <DataTable data={roles} columns={columns} searchPlaceholder="Search roles..." />
      </div>
    </div>
  );
}
