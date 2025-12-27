'use client';

import { useState } from 'react';
import { Plus, List, LayoutGrid, Star, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader, KanbanBoard, KanbanColumn, DataTable, Column, StatusBadge } from '@/components/shared';
import { candidates } from '@/lib/mock-data';
import { Candidate } from '@/types';
import { toast } from 'sonner';

export default function ApplicantsPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [candidateData, setCandidateData] = useState(candidates);

  const columns: KanbanColumn<Candidate>[] = [
    { id: 'applied', title: 'Applied', items: candidateData.filter(c => c.stage === 'applied') },
    { id: 'screening', title: 'Screening', items: candidateData.filter(c => c.stage === 'screening') },
    { id: 'interview', title: 'Interview', items: candidateData.filter(c => c.stage === 'interview') },
    { id: 'offer', title: 'Offer', items: candidateData.filter(c => c.stage === 'offer') },
    { id: 'hired', title: 'Hired', items: candidateData.filter(c => c.stage === 'hired') },
  ];

  const handleDragEnd = (itemId: string, sourceColumnId: string, destColumnId: string) => {
    setCandidateData(prev => prev.map(candidate => {
      if (candidate.id === itemId) {
        return { ...candidate, stage: destColumnId as Candidate['stage'] };
      }
      return candidate;
    }));
    toast.success('Candidate moved to ' + destColumnId);
  };

  const renderCandidateCard = (candidate: Candidate) => (
    <div className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-sm transition-shadow">
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-slate-900 truncate">{candidate.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">{candidate.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < candidate.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
          <span>{candidate.source}</span>
          <span>{new Date(candidate.appliedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  const tableColumns: Column<Candidate>[] = [
    {
      id: 'name',
      header: 'Candidate',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'position',
      header: 'Position',
      cell: (row) => <span className="text-sm text-slate-600">{row.position}</span>,
    },
    {
      id: 'stage',
      header: 'Stage',
      cell: (row) => <StatusBadge status={row.stage} />,
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: (row) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < row.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      cell: (row) => <span className="text-sm text-slate-500">{row.source}</span>,
    },
    {
      id: 'applied',
      header: 'Applied',
      cell: (row) => <span className="text-sm text-slate-500">{new Date(row.appliedAt).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Applicants"
        description="Track and manage job applicants through the hiring pipeline"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Recruitment' },
          { label: 'Applicants' },
        ]}
        actions={
          <>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <Button
                variant={view === 'board' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setView('board')}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setView('list')}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button size="sm" className="h-8 text-xs bg-blue-500 hover:bg-blue-600">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Candidate
            </Button>
          </>
        }
      />

      {view === 'board' ? (
        <KanbanBoard
          columns={columns}
          onDragEnd={handleDragEnd}
          renderCard={renderCandidateCard}
        />
      ) : (
        <DataTable
          data={candidateData}
          columns={tableColumns}
          searchPlaceholder="Search candidates..."
          selectable
        />
      )}
    </div>
  );
}
