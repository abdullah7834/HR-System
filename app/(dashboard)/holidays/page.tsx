'use client';

import { useState } from 'react';
import { Plus, Calendar, Flag, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, DataTable, Column, StatCard } from '@/components/shared';
import { AddHolidayDialog } from '@/components/forms';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'company' | 'optional';
  description?: string;
}

const holidays: Holiday[] = [
  { id: '1', name: "New Year's Day", date: '2025-01-01', type: 'public', description: 'New Year celebration' },
  { id: '2', name: 'Martin Luther King Jr. Day', date: '2025-01-20', type: 'public' },
  { id: '3', name: "Presidents' Day", date: '2025-02-17', type: 'public' },
  { id: '4', name: 'Company Foundation Day', date: '2025-03-15', type: 'company', description: 'Company anniversary' },
  { id: '5', name: 'Memorial Day', date: '2025-05-26', type: 'public' },
  { id: '6', name: 'Independence Day', date: '2025-07-04', type: 'public' },
  { id: '7', name: 'Labor Day', date: '2025-09-01', type: 'public' },
  { id: '8', name: 'Thanksgiving Day', date: '2025-11-27', type: 'public' },
  { id: '9', name: 'Day After Thanksgiving', date: '2025-11-28', type: 'company' },
  { id: '10', name: 'Christmas Eve', date: '2025-12-24', type: 'optional' },
  { id: '11', name: 'Christmas Day', date: '2025-12-25', type: 'public' },
  { id: '12', name: "New Year's Eve", date: '2025-12-31', type: 'optional' },
];

export default function HolidaysPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const columns: Column<Holiday>[] = [
    {
      id: 'name',
      header: 'Holiday',
      cell: (row) => (
        <div>
          <p className="font-medium text-sm">{row.name}</p>
          {row.description && (
            <p className="text-xs text-slate-500">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      cell: (row) => {
        const date = new Date(row.date);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        );
      },
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => (
        <Badge 
          variant="outline"
          className={`text-[10px] h-5 ${
            row.type === 'public' ? 'border-blue-200 text-blue-600 bg-blue-50' :
            row.type === 'company' ? 'border-purple-200 text-purple-600 bg-purple-50' : 
            'border-slate-200 text-slate-600 bg-slate-50'
          }`}
        >
          {row.type}
        </Badge>
      ),
    },
  ];

  const upcomingHolidays = holidays
    .filter(h => new Date(h.date) >= new Date())
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Holidays"
        description="View company holidays and observances"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Holidays' },
        ]}
        actions={
          <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Holiday
          </Button>
        }
      />

      {/* Upcoming Holidays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {upcomingHolidays.map((holiday) => {
          const date = new Date(holiday.date);
          const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={holiday.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-900">{holiday.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] h-5 border-blue-200 text-blue-600 bg-blue-50">
                  {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Public Holidays"
          value={holidays.filter(h => h.type === 'public').length}
          icon={Flag}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Company Holidays"
          value={holidays.filter(h => h.type === 'company').length}
          icon={Building2}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Optional Holidays"
          value={holidays.filter(h => h.type === 'optional').length}
          icon={Star}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* All Holidays Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-sm text-slate-900">2025 Holiday Calendar</h3>
        </div>
        <DataTable
          data={holidays}
          columns={columns}
          searchPlaceholder="Search holidays..."
        />
      </div>

      <AddHolidayDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
