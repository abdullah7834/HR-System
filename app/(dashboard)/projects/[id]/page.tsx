'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, Users, Clock, CheckCircle2, Circle,
  MoreHorizontal, Plus, Settings, MessageSquare, Paperclip,
  TrendingUp, AlertCircle, FolderKanban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects, tasks, employees } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { label: 'Active', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  on_hold: { label: 'On Hold', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' },
};

const taskStatusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-slate-400' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500' },
  review: { label: 'Review', icon: AlertCircle, color: 'text-violet-500' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
};

const activities = [
  { id: '1', user: 'Sarah Miller', action: 'completed task', target: 'Setup CI/CD Pipeline', time: '2 hours ago' },
  { id: '2', user: 'Mike Brown', action: 'added comment on', target: 'Design Homepage', time: '4 hours ago' },
  { id: '3', user: 'Emma Wilson', action: 'uploaded file to', target: 'Design Assets', time: '5 hours ago' },
  { id: '4', user: 'David Chen', action: 'started working on', target: 'Create API Endpoints', time: '1 day ago' },
  { id: '5', user: 'Lisa Johnson', action: 'was assigned to', target: 'Write Unit Tests', time: '2 days ago' },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = projects.find(p => p.id === id) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const teamMembers = project.teamMembers.map(memberId => 
    employees.find(e => e.id === memberId)
  ).filter(Boolean);

  const taskStats = {
    total: projectTasks.length,
    todo: projectTasks.filter(t => t.status === 'todo').length,
    inProgress: projectTasks.filter(t => t.status === 'in_progress').length,
    review: projectTasks.filter(t => t.status === 'review').length,
    done: projectTasks.filter(t => t.status === 'done').length,
  };

  const status = statusConfig[project.status];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
              <Badge variant="outline" className={cn('text-xs', status.color)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Settings className="h-3.5 w-3.5 mr-1.5" /> Settings
          </Button>
          <Button size="sm" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{project.progress}%</p>
              <p className="text-xs text-slate-500">Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FolderKanban className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{taskStats.total}</p>
              <p className="text-xs text-slate-500">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{taskStats.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{taskStats.done}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{teamMembers.length}</p>
              <p className="text-xs text-slate-500">Team Members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList className="h-9">
              <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
              <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-3">
              {/* Progress Bar */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-slate-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    To Do ({taskStats.todo})
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    In Progress ({taskStats.inProgress})
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Done ({taskStats.done})
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Project Tasks</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    View All
                  </Button>
                </div>
                <div className="divide-y divide-slate-100">
                  {projectTasks.map((task) => {
                    const taskStatus = taskStatusConfig[task.status];
                    const StatusIcon = taskStatus.icon;
                    return (
                      <div 
                        key={task.id} 
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <StatusIcon className={cn('h-4 w-4', taskStatus.color)} />
                            <div>
                              <p className={cn(
                                'text-sm font-medium text-slate-900',
                                task.status === 'done' && 'line-through opacity-60'
                              )}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={cn(
                                  'text-[10px] font-medium px-1.5 py-0.5 rounded',
                                  task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 
                                  'bg-slate-100 text-slate-500'
                                )}>
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-[11px] text-slate-400">
                                    Due {task.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.assigneeName && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">
                                  {task.assigneeName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files">
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <Paperclip className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No files uploaded yet</p>
                <Button variant="outline" size="sm" className="mt-3 h-8 text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Upload File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {activities.map((activity) => (
                    <div key={activity.id} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-slate-700">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium text-blue-600">{activity.target}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Project Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Project Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Due Date</p>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {new Date(project.dueDate).toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Status</p>
                <Badge variant="outline" className={cn('text-xs', status.color)}>
                  {status.label}
                </Badge>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1">Priority</p>
                <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-700">
                  Medium
                </Badge>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Team Members</h3>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member?.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member?.avatar} />
                    <AvatarFallback className="text-[11px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {member?.firstName[0]}{member?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {member?.firstName} {member?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500">{member?.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
                <MessageSquare className="h-3.5 w-3.5 mr-2" /> Team Chat
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
                <Paperclip className="h-3.5 w-3.5 mr-2" /> Upload Files
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
                <Calendar className="h-3.5 w-3.5 mr-2" /> Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
