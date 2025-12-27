'use client';

import { useState } from 'react';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, DataTable, Column } from '@/components/shared';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: 'present' | 'late' | 'absent' | 'half_day';
}

const records: AttendanceRecord[] = [
  { id: '1', date: '2024-12-27', clockIn: '09:00 AM', clockOut: '06:00 PM', hours: '9h 0m', status: 'present' },
  { id: '2', date: '2024-12-26', clockIn: '09:15 AM', clockOut: '06:30 PM', hours: '9h 15m', status: 'late' },
  { id: '3', date: '2024-12-25', clockIn: '-', clockOut: '-', hours: '-', status: 'absent' },
  { id: '4', date: '2024-12-24', clockIn: '08:55 AM', clockOut: '06:00 PM', hours: '9h 5m', status: 'present' },
  { id: '5', date: '2024-12-23', clockIn: '09:00 AM', clockOut: '01:00 PM', hours: '4h 0m', status: 'half_day' },
];

export default function AttendancePage() {
  const [clockedIn, setClockedIn] = useState(false);

  const handleClock = () => {
    setClockedIn(!clockedIn);
    toast.success(clockedIn ? 'Clocked out successfully' : 'Clocked in successfully');
  };

  const columns: Column<AttendanceRecord>[] = [
    { id: 'date', header: 'Date', cell: (row) => new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { id: 'clockIn', header: 'Clock In', cell: (row) => row.clockIn },
    { id: 'clockOut', header: 'Clock Out', cell: (row) => row.clockOut },
    { id: 'hours', header: 'Hours', cell: (row) => row.hours },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          row.status === 'present' ? 'bg-green-50 text-green-700' :
          row.status === 'late' ? 'bg-amber-50 text-amber-700' :
          row.status === 'half_day' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
        }`}>{row.status.replace('_', ' ')}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Track your daily attendance"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Attendance' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Present Days" value="22" icon={Calendar} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="Late Days" value="2" icon={Clock} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Absent" value="1" icon={Calendar} iconColor="text-red-600" iconBgColor="bg-red-50" />
        <StatCard title="Avg Hours" value="8.5h" icon={Clock} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-100 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Today's Attendance</h3>
            <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <Button onClick={handleClock} className={clockedIn ? 'bg-red-500 hover:bg-red-600' : ''}>
            {clockedIn ? <><LogOut className="h-4 w-4 mr-2" /> Clock Out</> : <><LogIn className="h-4 w-4 mr-2" /> Clock In</>}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-100">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-medium text-slate-900">Attendance History</h3>
        </div>
        <DataTable data={records} columns={columns} searchable={false} />
      </div>
    </div>
  );
}
