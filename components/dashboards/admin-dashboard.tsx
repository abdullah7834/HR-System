'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
  AreaChart,
  Area,
} from 'recharts';

interface UserRole {
  role_name: string;
  role_description: string | null;
  is_system_role: boolean;
}

interface AdminDashboardProps {
  userRoles: UserRole[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AdminDashboard({ userRoles }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
  });

  const [employeeGrowth, setEmployeeGrowth] = useState<any[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/admin-stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.employeeGrowth) {
          setEmployeeGrowth(data.employeeGrowth);
        }
        if (data.departmentDistribution) {
          setDepartmentDistribution(data.departmentDistribution);
        }
        if (data.revenueData) {
          setRevenueData(data.revenueData);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  // Mock data for charts if API doesn't return
  const defaultEmployeeGrowth = [
    { month: 'Jan', employees: 45 },
    { month: 'Feb', employees: 52 },
    { month: 'Mar', employees: 48 },
    { month: 'Apr', employees: 55 },
    { month: 'May', employees: 58 },
    { month: 'Jun', employees: stats.totalEmployees || 60 },
  ];

  const defaultDepartmentData = [
    { name: 'Engineering', employees: 25, color: '#3b82f6' },
    { name: 'Sales', employees: 15, color: '#22c55e' },
    { name: 'HR', employees: 8, color: '#f59e0b' },
    { name: 'Marketing', employees: 12, color: '#8b5cf6' },
  ];

  const defaultRevenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 142000 },
    { month: 'Apr', revenue: 150000 },
    { month: 'May', revenue: 158000 },
    { month: 'Jun', revenue: stats.monthlyRevenue || 165000 },
  ];

  const chartData = employeeGrowth.length > 0 ? employeeGrowth : defaultEmployeeGrowth;
  const deptData = departmentDistribution.length > 0 ? departmentDistribution : defaultDepartmentData;
  const revData = revenueData.length > 0 ? revenueData : defaultRevenueData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 15, direction: 'up' }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Employee Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Employee Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="employees"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorEmployees)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {deptData.map((entry, index) => (
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
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats.totalEmployees}</div>
            <p className="text-sm text-slate-500 mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Department Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {stats.totalDepartments > 0
                ? Math.round(stats.totalEmployees / stats.totalDepartments)
                : 0}
            </div>
            <p className="text-sm text-slate-500 mt-1">Employees per department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Project Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">78%</div>
            <p className="text-sm text-slate-500 mt-1">Average completion rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
