'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, CheckSquare, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface UserRole {
  role_name: string;
  role_description: string | null;
  is_system_role: boolean;
}

interface ProjectManagerDashboardProps {
  userRoles: UserRole[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ProjectManagerDashboard({ userRoles }: ProjectManagerDashboardProps) {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalTasks: 0,
    teamMembers: 0,
    completionRate: 0,
  });

  const [projectStatusData, setProjectStatusData] = useState<any[]>([]);
  const [taskProgressData, setTaskProgressData] = useState<any[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/pm-stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.projectStatusData) {
          setProjectStatusData(data.projectStatusData);
        }
        if (data.taskProgressData) {
          setTaskProgressData(data.taskProgressData);
        }
        if (data.teamPerformance) {
          setTeamPerformance(data.teamPerformance);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  // Default data
  const defaultProjectStatus = [
    { name: 'In Progress', value: stats.activeProjects || 5, color: '#3b82f6' },
    { name: 'Planning', value: 2, color: '#f59e0b' },
    { name: 'Completed', value: 8, color: '#22c55e' },
    { name: 'On Hold', value: 1, color: '#ef4444' },
  ];

  const defaultTaskProgress = [
    { project: 'Project A', completed: 45, total: 60 },
    { project: 'Project B', completed: 30, total: 40 },
    { project: 'Project C', completed: 20, total: 25 },
    { project: 'Project D', completed: 15, total: 20 },
  ];

  const defaultTeamPerf = [
    { name: 'John Doe', tasks: 12, completed: 10 },
    { name: 'Jane Smith', tasks: 15, completed: 14 },
    { name: 'Mike Johnson', tasks: 10, completed: 9 },
    { name: 'Sarah Williams', tasks: 8, completed: 7 },
  ];

  const projectData = projectStatusData.length > 0 ? projectStatusData : defaultProjectStatus;
  const taskData = taskProgressData.length > 0 ? taskProgressData : defaultTaskProgress;
  const teamData = teamPerformance.length > 0 ? teamPerformance : defaultTeamPerf;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Project Manager Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Project and team overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 5, direction: 'up' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Progress by Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Task Progress by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="project" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.map((member, index) => {
              const completionRate = member.total > 0
                ? Math.round((member.completed / member.total) * 100)
                : 0;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{member.name}</span>
                    <span className="text-sm text-slate-600">
                      {member.completed}/{member.total} tasks
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{completionRate}% completed</span>
                    <span className={completionRate >= 80 ? 'text-green-600' : 'text-orange-600'}>
                      {completionRate >= 80 ? 'On Track' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
