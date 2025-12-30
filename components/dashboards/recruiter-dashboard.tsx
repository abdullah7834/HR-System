'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, TrendingUp, UserCheck, FileText } from 'lucide-react';
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

interface RecruiterDashboardProps {
  userRoles: UserRole[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function RecruiterDashboard({ userRoles }: RecruiterDashboardProps) {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    interviewsScheduled: 0,
    hiredThisMonth: 0,
  });

  const [applicantSourceData, setApplicantSourceData] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [hiringTrend, setHiringTrend] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/recruiter-stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.applicantSourceData) {
          setApplicantSourceData(data.applicantSourceData);
        }
        if (data.pipelineData) {
          setPipelineData(data.pipelineData);
        }
        if (data.hiringTrend) {
          setHiringTrend(data.hiringTrend);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  // Default data
  const defaultSourceData = [
    { name: 'LinkedIn', value: 45, color: '#3b82f6' },
    { name: 'Indeed', value: 28, color: '#22c55e' },
    { name: 'Referral', value: 15, color: '#f59e0b' },
    { name: 'Career Page', value: 12, color: '#8b5cf6' },
  ];

  const defaultPipelineData = [
    { stage: 'Applied', count: stats.totalApplicants || 100 },
    { stage: 'Screening', count: 35 },
    { stage: 'Interview', count: stats.interviewsScheduled || 20 },
    { stage: 'Offer', count: 8 },
    { stage: 'Hired', count: stats.hiredThisMonth || 5 },
  ];

  const defaultHiringTrend = [
    { month: 'Jan', hired: 2, interviews: 15 },
    { month: 'Feb', hired: 3, interviews: 18 },
    { month: 'Mar', hired: 4, interviews: 22 },
    { month: 'Apr', hired: 2, interviews: 16 },
    { month: 'May', hired: 5, interviews: 25 },
    { month: 'Jun', hired: stats.hiredThisMonth || 3, interviews: 20 },
  ];

  const sourceData = applicantSourceData.length > 0 ? applicantSourceData : defaultSourceData;
  const pipelineChartData = pipelineData.length > 0 ? pipelineData : defaultPipelineData;
  const trendData = hiringTrend.length > 0 ? hiringTrend : defaultHiringTrend;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Recruiter Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Recruitment pipeline overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          trend={{ value: 15, direction: 'up' }}
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewsScheduled}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Hired This Month"
          value={stats.hiredThisMonth}
          icon={UserCheck}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          trend={{ value: 25, direction: 'up' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Applicant Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Applicant Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
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

        {/* Recruitment Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recruitment Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Hiring Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                <Line
                  type="monotone"
                  dataKey="hired"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  name="Hired"
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Interviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
