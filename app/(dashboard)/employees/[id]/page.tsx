'use client';

import { use } from 'react';
import { Mail, Building2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader, StatusBadge } from '@/components/shared';
import { employees } from '@/lib/mock-data';

export default function EmployeeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const employee = employees.find(e => e.id === id) || employees[0];

  return (
    <div>
      <PageHeader
        title=""
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: `${employee.firstName} ${employee.lastName}` },
        ]}
      />

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                {employee.firstName[0]}{employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-sm text-gray-500">{employee.position}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {employee.email}
                </span>
              </div>
              <div className="mt-2">
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs">Send Message</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">View Documents</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Generate Report</DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-red-600">Deactivate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="personal" className="text-xs h-7">Personal</TabsTrigger>
          <TabsTrigger value="job" className="text-xs h-7">Job</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs h-7">Documents</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs h-7">Attendance</TabsTrigger>
          <TabsTrigger value="leaves" className="text-xs h-7">Leaves</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs h-7">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900">Personal Information</h3>
              </div>
              <div className="p-4 space-y-3">
                <InfoRow label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
                <InfoRow label="Email" value={employee.email} />
                <InfoRow label="Phone" value={employee.phone || '+1 234 567 890'} />
                <InfoRow label="Date of Birth" value="March 15, 1990" />
                <InfoRow label="Gender" value="Female" />
                <InfoRow label="Nationality" value="United States" />
                <InfoRow label="Marital Status" value="Single" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900">Address</h3>
              </div>
              <div className="p-4 space-y-3">
                <InfoRow label="Street" value="123 Main Street" />
                <InfoRow label="City" value="San Francisco" />
                <InfoRow label="State" value="California" />
                <InfoRow label="Zip Code" value="94102" />
                <InfoRow label="Country" value="United States" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900">Emergency Contact</h3>
              </div>
              <div className="p-4 space-y-3">
                <InfoRow label="Name" value="John Miller" />
                <InfoRow label="Relationship" value="Brother" />
                <InfoRow label="Phone" value="+1 234 567 891" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900">Bank Details</h3>
              </div>
              <div className="p-4 space-y-3">
                <InfoRow label="Bank Name" value="Chase Bank" />
                <InfoRow label="Account Number" value="****4521" />
                <InfoRow label="Routing Number" value="****7890" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Job Information</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Employee ID" value={`EMP-${employee.id.padStart(4, '0')}`} />
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Position" value={employee.position} />
                <InfoRow label="Employment Type" value="Full-time" />
                <InfoRow label="Join Date" value={new Date(employee.joinDate).toLocaleDateString()} />
                <InfoRow label="Manager" value="Michael Scott" />
                <InfoRow label="Work Location" value="San Francisco Office" />
                <InfoRow label="Work Email" value={employee.email} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Documents</h3>
            </div>
            <div className="py-12 text-center text-sm text-gray-500">
              No documents uploaded yet
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Attendance History</h3>
            </div>
            <div className="py-12 text-center text-sm text-gray-500">
              Attendance records will appear here
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Leave History</h3>
            </div>
            <div className="py-12 text-center text-sm text-gray-500">
              Leave records will appear here
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Performance Reviews</h3>
            </div>
            <div className="py-12 text-center text-sm text-gray-500">
              Performance reviews will appear here
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
