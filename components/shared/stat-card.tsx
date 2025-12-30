import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  change?: { value: number; type: 'up' | 'down' };
  trend?: { value: number; direction: 'up' | 'down'; label?: string };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  change,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        {(change || trend) && (
          <span className={cn(
            'text-xs font-medium',
            (change?.type === 'up' || trend?.direction === 'up') ? 'text-green-600' : 'text-red-600'
          )}>
            {(change?.type === 'up' || trend?.direction === 'up') ? '+' : '-'}
            {change?.value ?? trend?.value ?? 0}
            {change ? '%' : ''}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}
