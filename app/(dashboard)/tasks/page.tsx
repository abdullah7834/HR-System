'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckSquare, Clock, AlertCircle, LayoutGrid, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, KanbanBoard } from '@/components/shared';
import { EditableTaskTable } from '@/components/tasks/editable-task-table';
import { AddTaskDialog } from '@/components/forms';
import { tasks as initialTasks } from '@/lib/mock-data';
import { Task } from '@/types';

export default function TasksPage() {
  const router = useRouter();
  const [view, setView] = useState<'board' | 'table'>('table');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns = [
    { id: 'todo', title: 'To Do', items: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', items: tasks.filter(t => t.status === 'in_progress') },
    { id: 'review', title: 'In Review', items: tasks.filter(t => t.status === 'review') },
    { id: 'done', title: 'Done', items: tasks.filter(t => t.status === 'done') },
  ];

  const handleTaskUpdate = (taskId: string, field: keyof Task, value: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const handleDragEnd = (itemId: string, _sourceColumnId: string, destColumnId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === itemId ? { ...t, status: destColumnId as Task['status'] } : t
    ));
  };

  const handleAddTask = (data: { title: string; priority: string; status: string; dueDate?: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      priority: data.priority as Task['priority'],
      status: data.status as Task['status'],
      dueDate: data.dueDate,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Manage your tasks and to-dos"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tasks' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setView('table')}
              >
                <Table2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === 'board' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setView('board')}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Tasks" value={tasks.length} icon={CheckSquare} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatCard title="In Progress" value={tasks.filter(t => t.status === 'in_progress').length} icon={Clock} iconColor="text-amber-600" iconBgColor="bg-amber-50" />
        <StatCard title="Completed" value={tasks.filter(t => t.status === 'done').length} icon={CheckSquare} iconColor="text-green-600" iconBgColor="bg-green-50" />
        <StatCard title="High Priority" value={tasks.filter(t => t.priority === 'high').length} icon={AlertCircle} iconColor="text-red-600" iconBgColor="bg-red-50" />
      </div>

      {view === 'table' ? (
        <EditableTaskTable 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate}
          onTaskClick={(taskId) => router.push(`/tasks/${taskId}`)}
        />
      ) : (
        <KanbanBoard
          columns={columns}
          onDragEnd={handleDragEnd}
          renderCard={(task) => (
            <div 
              className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-sm"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <p className="text-sm font-medium text-slate-900 mb-1">{task.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{task.dueDate}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  task.priority === 'high' ? 'bg-red-50 text-red-600' :
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>{task.priority}</span>
              </div>
            </div>
          )}
        />
      )}

      <AddTaskDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
