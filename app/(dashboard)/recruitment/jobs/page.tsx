'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, MapPin, Users, Briefcase, PauseCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, StatusBadge, DataTable, Column, StatCard } from '@/components/shared';
import { jobOpenings } from '@/lib/mock-data';
import { JobOpening } from '@/types';

export default function JobOpeningsPage() {
  const router = useRouter();

  const columns: Column<JobOpening>[] = [
    {
      id: 'title',
      header: 'Position',
      cell: (row) => (
        <div>
          <p className="font-medium text-sm">{row.title}</p>
          <p className="text-xs text-slate-500">{row.department}</p>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3 w-3" />
          {row.location}
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => (
        <Badge variant="outline" className="text-[10px] h-5">
          {row.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      id: 'applicants',
      header: 'Applicants',
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-slate-400" />
          {row.applicantCount}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'posted',
      header: 'Posted',
      cell: (row) => <span className="text-xs text-slate-500">{new Date(row.postedAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Job Openings"
        description="Manage your job postings and track applicants"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Recruitment' },
          { label: 'Job Openings' },
        ]}
        actions={
          <Link href="/recruitment/jobs/new">
            <Button size="sm" className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create Job
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Open Positions"
          value={jobOpenings.filter(j => j.status === 'open').length}
          icon={Briefcase}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Applicants"
          value={jobOpenings.reduce((acc, j) => acc + j.applicantCount, 0)}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Paused"
          value={jobOpenings.filter(j => j.status === 'paused').length}
          icon={PauseCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
        <StatCard
          title="Closed"
          value={jobOpenings.filter(j => j.status === 'closed').length}
          icon={XCircle}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={jobOpenings}
          columns={columns}
          searchPlaceholder="Search jobs..."
          onRowClick={(row) => router.push(`/recruitment/jobs/${row.id}`)}
        />
      </div>
    </div>
  );
}
