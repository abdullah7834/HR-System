import { cn } from '@/lib/utils';

type Status = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'open' | 'closed' | 'paused' | 'completed' | 'in_progress' | 'todo' | 'done' | string;

const statusStyles: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  completed: 'bg-green-50 text-green-700',
  done: 'bg-green-50 text-green-700',
  approved: 'bg-green-50 text-green-700',
  inactive: 'bg-slate-100 text-slate-600',
  closed: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  todo: 'bg-slate-100 text-slate-600',
  open: 'bg-blue-50 text-blue-700',
  paused: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-700',
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || 'bg-slate-100 text-slate-600';
  const label = status.replace(/_/g, ' ');

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize',
      style,
      className
    )}>
      {label}
    </span>
  );
}
