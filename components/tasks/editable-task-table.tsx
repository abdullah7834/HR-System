'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Eye, MessageSquare, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface EditableTaskTableProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, field: keyof Task, value: string) => void;
  onTaskClick: (taskId: string) => void;
}

const statusConfig: Record<string, { label: string; icon: typeof Circle; color: string; bg: string }> = {
  todo: { label: 'To Do', icon: Circle, color: 'text-slate-500', bg: 'bg-slate-100' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  review: { label: 'In Review', icon: Eye, color: 'text-violet-600', bg: 'bg-violet-50' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  low: { label: 'Low', color: 'text-slate-600', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'text-amber-600', dot: 'bg-amber-500' },
  high: { label: 'High', color: 'text-rose-600', dot: 'bg-rose-500' },
};

function EditableCell({ 
  value, 
  onChange, 
  className,
  placeholder = 'Empty'
}: { 
  value: string; 
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm border border-blue-400 rounded outline-none bg-white ring-2 ring-blue-100"
      />
    );
  }

  return (
    <div
      className={cn(
        'px-2 py-1 text-sm cursor-text rounded hover:bg-slate-100 transition-colors truncate',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {value || <span className="text-slate-400">{placeholder}</span>}
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const config = statusConfig[value] || statusConfig.todo;
  const Icon = config.icon;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('h-7 border-0 text-xs font-medium gap-1.5 px-2', config.bg, config.color)}>
        <SelectValue>
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            <span>{config.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const ItemIcon = cfg.icon;
          return (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <ItemIcon className={cn('h-4 w-4', cfg.color)} />
                <span>{cfg.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function PrioritySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const config = priorityConfig[value] || priorityConfig.low;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 border-0 bg-transparent text-xs font-medium gap-1.5 px-2">
        <SelectValue>
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', config.dot)} />
            <span className={config.color}>{config.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(priorityConfig).map(([key, cfg]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <span className={cn('w-2.5 h-2.5 rounded-full', cfg.dot)} />
              <span>{cfg.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function EditableTaskTable({ tasks, onTaskUpdate, onTaskClick }: EditableTaskTableProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleAll = () => {
    setSelectedTasks(prev => prev.length === tasks.length ? [] : tasks.map(t => t.id));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="w-10 px-3 py-2.5">
              <Checkbox 
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-[30%]">Task</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-[14%]">Status</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-[12%]">Priority</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-[12%]">Due Date</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-[18%]">Assignee</th>
            <th className="w-[70px]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const isSelected = selectedTasks.includes(task.id);
            const isDone = task.status === 'done';
            
            return (
              <tr 
                key={task.id}
                className={cn(
                  'group transition-colors',
                  isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60',
                  isDone && 'opacity-50'
                )}
              >
                <td className="px-3 py-1.5">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <EditableCell
                    value={task.title}
                    onChange={(value) => onTaskUpdate(task.id, 'title', value)}
                    className={cn('font-medium text-slate-900', isDone && 'line-through')}
                    placeholder="Task name..."
                  />
                </td>
                <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                  <StatusSelect
                    value={task.status}
                    onChange={(value) => onTaskUpdate(task.id, 'status', value)}
                  />
                </td>
                <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                  <PrioritySelect
                    value={task.priority}
                    onChange={(value) => onTaskUpdate(task.id, 'priority', value)}
                  />
                </td>
                <td className="px-3 py-1.5 text-sm text-slate-600">
                  {task.dueDate || <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {task.assigneeName?.split(' ').map((n: string) => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700 truncate">
                      {task.assigneeName || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => onTaskClick(task.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-400 hover:text-slate-600"
                      onClick={() => onTaskClick(task.id)}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Selection Footer */}
      {selectedTasks.length > 0 && (
        <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <span className="text-sm text-blue-700 font-medium">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-100">
              Mark Complete
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
