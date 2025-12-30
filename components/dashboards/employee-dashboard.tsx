'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckSquare, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
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

interface EmployeeDashboardProps {
  userRoles: UserRole[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function EmployeeDashboard({ userRoles }: EmployeeDashboardProps) {
  const [stats, setStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    pendingLeaves: 0,
    upcomingHolidays: 0,
  });

  const [taskData, setTaskData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/employee-stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.taskData) {
          setTaskData(data.taskData);
        }
        if (data.attendanceData) {
          setAttendanceData(data.attendanceData);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  // Task status distribution
  const taskStatusData = [
    { name: 'To Do', value: stats.myTasks, color: '#94a3b8' },
    { name: 'In Progress', value: Math.floor(stats.myTasks * 0.3), color: '#3b82f6' },
    { name: 'Review', value: Math.floor(stats.myTasks * 0.2), color: '#f59e0b' },
    { name: 'Done', value: stats.completedTasks, color: '#22c55e' },
  ];

  // Weekly task completion
  const weeklyTaskData = [
    { day: 'Mon', completed: 3, total: 5 },
    { day: 'Tue', completed: 5, total: 7 },
    { day: 'Wed', completed: 4, total: 6 },
    { day: 'Thu', completed: 6, total: 8 },
    { day: 'Fri', completed: 4, total: 6 },
    { day: 'Sat', completed: 2, total: 3 },
    { day: 'Sun', completed: 1, total: 2 },
  ];

  const completionRate = stats.myTasks + stats.completedTasks > 0
    ? Math.round((stats.completedTasks / (stats.myTasks + stats.completedTasks)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Tasks"
          value={stats.myTasks}
          icon={CheckSquare}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckSquare}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Upcoming Holidays"
          value={stats.upcomingHolidays}
          icon={Calendar}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTaskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Overall</span>
                  <span className="text-2xl font-semibold text-slate-900">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">This Week</span>
                  <span className="font-medium text-slate-900">85%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-600">This Month</span>
                  <span className="font-medium text-slate-900">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/tasks">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="h-4 w-4 mr-2" />
                View My Tasks
              </Button>
            </Link>
            <Link href="/attendance">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Clock In/Out
              </Button>
            </Link>
            <Link href="/leaves">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-slate-900">Completed task "Update documentation"</p>
                  <p className="text-slate-500 text-xs mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-slate-900">Leave request approved</p>
                  <p className="text-slate-500 text-xs mt-0.5">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-slate-900">New task assigned</p>
                  <p className="text-slate-500 text-xs mt-0.5">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
