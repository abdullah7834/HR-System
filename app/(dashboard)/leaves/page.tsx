'use client';

import { useState } from 'react';
import { Plus, Palmtree, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader, StatCard, DataTable, Column, StatusBadge } from '@/components/shared';
import { AddLeaveDialog } from '@/components/forms';
import { leaveRequests } from '@/lib/mock-data';

export default function LeavesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns: Column<typeof leaveRequests[0]>[] = [
    {
      id: 'employee',
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={row.employeeAvatar} />
            <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">{row.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-slate-900">{row.employeeName}</span>
        </div>
      ),
    },
    { id: 'type', header: 'Type', cell: (row) => row.type },
    { id: 'dates', header: 'Dates', cell: (row) => `${row.startDate} - ${row.endDate}` },
    { id: 'days', header: 'Days', cell: (row) => row.days },
    { id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Leaves"
        description="Manage leave requests and balances"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Leaves' }]}
        actions={
          <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Apply Leave
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Annual Leave" value="12 days" icon={Palmtree} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Sick Leave" value="5 days" icon={Palmtree} iconColor="text-red-600" iconBgColor="bg-red-50" />
        <StatCard title="Pending" value={leaveRequests.filter(l => l.status === 'pending').length} icon={Clock} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Used" value="8 days" icon={CheckCircle} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs h-6">All Requests</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs h-6">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs h-6">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="bg-white rounded-lg border border-slate-100">
            <DataTable data={leaveRequests} columns={columns} searchPlaceholder="Search requests..." />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="bg-white rounded-lg border border-slate-100">
            <DataTable data={leaveRequests.filter(l => l.status === 'pending')} columns={columns} searchPlaceholder="Search requests..." />
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="bg-white rounded-lg border border-slate-100">
            <DataTable data={leaveRequests.filter(l => l.status === 'approved')} columns={columns} searchPlaceholder="Search requests..." />
          </div>
        </TabsContent>
      </Tabs>

      <AddLeaveDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
