'use client';

import { useState } from 'react';
import { Plus, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader, DataTable, Column, StatCard } from '@/components/shared';
import { AddDepartmentDialog } from '@/components/forms';
import { departments, employees } from '@/lib/mock-data';
import { Department } from '@/types';

export default function DepartmentsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const getManager = (managerId?: string) => {
    if (!managerId) return null;
    return employees.find(e => e.id === managerId);
  };

  const columns: Column<Department>[] = [
    {
      id: 'name',
      header: 'Department',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium text-sm">{row.name}</span>
        </div>
      ),
    },
    {
      id: 'manager',
      header: 'Manager',
      cell: (row) => {
        const manager = getManager(row.managerId);
        if (!manager) return <span className="text-xs text-gray-400">Not assigned</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={manager.avatar} />
              <AvatarFallback className="text-[10px] bg-gray-100">
                {manager.firstName[0]}{manager.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{manager.firstName} {manager.lastName}</span>
          </div>
        );
      },
    },
    {
      id: 'employees',
      header: 'Employees',
      cell: (row) => (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          {row.employeeCount}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage your organization's departments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Organization' },
          { label: 'Departments' },
        ]}
        actions={
          <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Department
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Employees"
          value={departments.reduce((acc, d) => acc + d.employeeCount, 0)}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Avg. Team Size"
          value={Math.round(departments.reduce((acc, d) => acc + d.employeeCount, 0) / departments.length)}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-sm hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{dept.name}</p>
                <p className="text-xs text-gray-500">{dept.employeeCount} employees</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">All Departments</h3>
        </div>
        <DataTable
          data={departments}
          columns={columns}
          searchPlaceholder="Search departments..."
        />
      </div>

      <AddDepartmentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
