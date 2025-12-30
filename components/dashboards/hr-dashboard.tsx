'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, Calendar, TrendingUp, UserPlus, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface HRDashboardProps {
  userRoles: UserRole[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function HRDashboard({ userRoles }: HRDashboardProps) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    activeRecruitments: 0,
    newHires: 0,
  });

  const [leaveStatusData, setLeaveStatusData] = useState<any[]>([]);
  const [hiringData, setHiringData] = useState<any[]>([]);
  const [departmentHeadcount, setDepartmentHeadcount] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/hr-stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.leaveStatusData) {
          setLeaveStatusData(data.leaveStatusData);
        }
        if (data.hiringData) {
          setHiringData(data.hiringData);
        }
        if (data.departmentHeadcount) {
          setDepartmentHeadcount(data.departmentHeadcount);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  // Default data
  const defaultLeaveStatus = [
    { name: 'Pending', value: stats.pendingLeaves || 12, color: '#f59e0b' },
    { name: 'Approved', value: 45, color: '#22c55e' },
    { name: 'Rejected', value: 3, color: '#ef4444' },
  ];

  const defaultHiringData = [
    { month: 'Jan', hired: 2, applied: 15 },
    { month: 'Feb', hired: 3, applied: 18 },
    { month: 'Mar', hired: 4, applied: 22 },
    { month: 'Apr', hired: 2, applied: 16 },
    { month: 'May', hired: 5, applied: 25 },
    { month: 'Jun', hired: stats.newHires || 3, applied: 20 },
  ];

  const defaultDeptHeadcount = [
    { name: 'Engineering', count: 25 },
    { name: 'Sales', count: 15 },
    { name: 'HR', count: 8 },
    { name: 'Marketing', count: 12 },
  ];

  const leaveData = leaveStatusData.length > 0 ? leaveStatusData : defaultLeaveStatus;
  const hiringChartData = hiringData.length > 0 ? hiringData : defaultHiringData;
  const deptData = departmentHeadcount.length > 0 ? departmentHeadcount : defaultDeptHeadcount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">HR Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Human Resources overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Active Recruitments"
          value={stats.activeRecruitments}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="New Hires (This Month)"
          value={stats.newHires}
          icon={UserPlus}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 25, direction: 'up' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leave Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Leave Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveData.map((entry, index) => (
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

        {/* Hiring Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Hiring Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="hired" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="applied" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Headcount */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Department Headcount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
